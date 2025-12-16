# Production Failure Mode - Evidence-Based Findings

## Root Cause: **(A) Admin writes succeed but Web cannot read**

### Evidence Chain:

1. **Web app silently falls back to `localhost:3001`**
   - Found in 6 files: `apps/web/app/api/*/route.ts` and `sitemap.ts`
   - Pattern: `const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';`
   - In production: `localhost:3001` is unreachable → all fetches fail

2. **Web app uses graceful degradation**
   - Returns empty arrays/null on error
   - Appears to work but shows no content
   - No visible error to user

3. **Admin write path is complete**
   - All required env vars checked
   - Database writes succeed if `DATABASE_URL` is set
   - Auth works if `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set

---

## 1. Web UI Data-Fetch Entrypoints

### Client-Side (Browser):
- **File:** `apps/web/components/ThemeProvider.tsx:12`
  - Fetches: `/api/theme` (relative URL - web app's own API)
  - Does NOT call admin API
  - ✅ SAFE

### Server-Side (Next.js API Routes):
All admin API calls happen server-side:

1. `apps/web/app/api/pages/route.ts` → `${ADMIN_API_URL}/api/public/pages`
2. `apps/web/app/api/pages/[slug]/route.ts` → `${ADMIN_API_URL}/api/public/pages/${slug}`
3. `apps/web/app/api/homepage/route.ts` → `${ADMIN_API_URL}/api/public/pages`
4. `apps/web/app/api/services/route.ts` → `${ADMIN_API_URL}/api/public/services`
5. `apps/web/app/api/services/[slug]/route.ts` → `${ADMIN_API_URL}/api/public/services/${slug}`
6. `apps/web/app/sitemap.ts` → `${ADMIN_API_URL}/api/public/pages`

**Conclusion:** All admin API calls are server-to-server. Browser never directly calls admin API.

---

## 2. Server-Side Proxy Routes

All routes in `apps/web/app/api/*` are Next.js API route handlers (server-side).

**Fetch Pattern:**
```typescript
const response = await fetch(`${ADMIN_API_URL}/api/public/pages`, {
  cache: 'no-store',
});
```

**Headers:** Only `cache: 'no-store'` (no credentials, no custom headers)

**Execution:** ✅ Server-side only

---

## 3. Localhost Fallback Elimination

### Files Modified (6):
1. `apps/web/app/api/pages/route.ts`
2. `apps/web/app/api/pages/[slug]/route.ts`
3. `apps/web/app/api/homepage/route.ts`
4. `apps/web/app/api/services/route.ts`
5. `apps/web/app/api/services/[slug]/route.ts`
6. `apps/web/app/sitemap.ts` (graceful degradation)

### Change:
**Before:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
```

**After:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
if (!ADMIN_API_URL) {
  throw new Error('NEXT_PUBLIC_ADMIN_API_URL environment variable is required...');
}
```

### Diagnostic Logging Added:
```typescript
console.log('[DIAGNOSTIC] Web API /api/[route]: Fetching from admin API:', fetchUrl);
```

**To Remove:** Search for `[DIAGNOSTIC]` after verification.

---

## 4. Admin Write Path Verification

### Required Env Vars:

| Variable | Where Used | Dev Fallback |
|----------|------------|--------------|
| `DATABASE_URL` | `lib/prisma.ts`, API routes | ❌ NO |
| `ADMIN_USERNAME` | `lib/auth.ts:15,49` | ❌ NO (throws) |
| `ADMIN_PASSWORD` | `lib/auth.ts:22,50` | ❌ NO (throws) |

**Verification:**
- `lib/auth.ts:14-27` - Throws if missing
- `app/api/admin/pages/[id]/route.ts:104-110` - Returns 500 if `DATABASE_URL` missing

**Conclusion:** ✅ No dev fallbacks. Must be set or operations fail.

---

## 5. CORS Requirement

**CORS NEEDED: NO**

**Why:**
- All web app → admin API calls are server-to-server
- Browser never directly calls admin API
- CORS only needed for browser-initiated cross-origin requests

**Evidence:**
- No `fetch()` calls to admin API in client components
- All admin API calls in `/app/api/*` (server-side routes)
- Browser calls web app's API, web server calls admin API

---

## 6. Environment Variables Checklist

### Admin App (Vercel):
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-password-min-12-chars
```

### Web App (Vercel):
```
NEXT_PUBLIC_ADMIN_API_URL=https://your-admin-deployment-url.vercel.app
```

**Optional:**
```
NEXT_PUBLIC_SITE_URL=https://your-web-domain.vercel.app
```

---

## Summary

- **Root Cause:** (A) - Missing `NEXT_PUBLIC_ADMIN_API_URL` → falls back to unreachable localhost
- **CORS:** Not required (server-to-server)
- **Fixes:** Removed localhost fallbacks, added diagnostic logging
- **Action:** Set `NEXT_PUBLIC_ADMIN_API_URL` in web app Vercel project

