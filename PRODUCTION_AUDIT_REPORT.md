# Production Failure Mode Analysis - Evidence-Based Report

## Executive Summary

**Root Cause: (A) Admin writes succeed but Web cannot read**

The web app silently falls back to `http://localhost:3001` when `NEXT_PUBLIC_ADMIN_API_URL` is missing, causing all API calls to fail in production.

**CORS Required: NO** - All web app data fetching goes through server-side proxy routes. Browser never directly calls admin API.

---

## 1. Web UI Data-Fetch Entrypoints

### Client-Side Fetches (Browser)

**File:** `apps/web/components/ThemeProvider.tsx:12`
```typescript
const response = await fetch('/api/theme');
```
- **Location:** Client component (`'use client'`)
- **Target:** Relative URL `/api/theme` (web app's own API)
- **Admin API:** ❌ NO - Does not call admin API
- **Status:** ✅ SAFE - Calls web app's own server route

**No other client-side fetches found** that call admin API directly.

### Server-Side Fetches (Next.js App Router)

All data fetching from admin happens in server-side API routes:

1. **File:** `apps/web/app/api/pages/route.ts:11`
   - **Execution:** Server-side (Next.js API route)
   - **Fetch:** `${ADMIN_API_URL}/api/public/pages`
   - **Headers:** `cache: 'no-store'`

2. **File:** `apps/web/app/api/pages/[slug]/route.ts:16`
   - **Execution:** Server-side (Next.js API route)
   - **Fetch:** `${ADMIN_API_URL}/api/public/pages/${slug}`
   - **Headers:** `cache: 'no-store'`

3. **File:** `apps/web/app/api/homepage/route.ts:11`
   - **Execution:** Server-side (Next.js API route)
   - **Fetch:** `${ADMIN_API_URL}/api/public/pages`
   - **Headers:** `cache: 'no-store'`

4. **File:** `apps/web/app/api/services/route.ts:11`
   - **Execution:** Server-side (Next.js API route)
   - **Fetch:** `${ADMIN_API_URL}/api/public/services`
   - **Headers:** `cache: 'no-store'`

5. **File:** `apps/web/app/api/services/[slug]/route.ts:16`
   - **Execution:** Server-side (Next.js API route)
   - **Fetch:** `${ADMIN_API_URL}/api/public/services/${slug}`
   - **Headers:** `cache: 'no-store'`

6. **File:** `apps/web/app/sitemap.ts:30`
   - **Execution:** Server-side (Next.js route handler)
   - **Fetch:** `${ADMIN_API_URL}/api/public/pages`
   - **Headers:** `cache: 'no-store'`

**Conclusion:** All admin API calls are server-to-server. Browser never directly calls admin API.

---

## 2. Server-Side Proxy Routes Confirmation

### Route: `/api/pages`

**File:** `apps/web/app/api/pages/route.ts`

**Admin Fetch URL Construction:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
const response = await fetch(`${ADMIN_API_URL}/api/public/pages`, {
  cache: 'no-store',
});
```

**Headers/Options:**
- `cache: 'no-store'` (disables Next.js fetch cache)
- No custom headers
- No credentials (server-to-server)

**Execution:** ✅ Server-side (Next.js API route handler)

### Route: `/api/pages/[slug]`

**File:** `apps/web/app/api/pages/[slug]/route.ts`

**Admin Fetch URL Construction:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
const response = await fetch(`${ADMIN_API_URL}/api/public/pages/${slug}`, {
  cache: 'no-store',
});
```

**Headers/Options:**
- `cache: 'no-store'`
- No custom headers
- No credentials

**Execution:** ✅ Server-side

### Route: `/api/homepage`

**File:** `apps/web/app/api/homepage/route.ts`

**Admin Fetch URL Construction:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
const response = await fetch(`${ADMIN_API_URL}/api/public/pages`, {
  cache: 'no-store',
});
```

**Headers/Options:**
- `cache: 'no-store'`
- No custom headers
- No credentials

**Execution:** ✅ Server-side

### Route: `/api/services`

**File:** `apps/web/app/api/services/route.ts`

**Admin Fetch URL Construction:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
const response = await fetch(`${ADMIN_API_URL}/api/public/services`, {
  cache: 'no-store',
});
```

**Headers/Options:**
- `cache: 'no-store'`
- No custom headers
- No credentials

**Execution:** ✅ Server-side

### Route: `/api/services/[slug]`

**File:** `apps/web/app/api/services/[slug]/route.ts`

**Admin Fetch URL Construction:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
const response = await fetch(`${ADMIN_API_URL}/api/public/services/${slug}`, {
  cache: 'no-store',
});
```

**Headers/Options:**
- `cache: 'no-store'`
- No custom headers
- No credentials

**Execution:** ✅ Server-side

**Conclusion:** All routes are server-side proxy routes. No browser involvement.

---

## 3. Localhost Fallback Elimination

### Files Modified (6 files):

1. `apps/web/app/api/pages/route.ts`
2. `apps/web/app/api/pages/[slug]/route.ts`
3. `apps/web/app/api/homepage/route.ts`
4. `apps/web/app/api/services/route.ts`
5. `apps/web/app/api/services/[slug]/route.ts`
6. `apps/web/app/sitemap.ts` (graceful degradation - logs error but continues)

### Change Pattern:

**Before:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
```

**After:**
```typescript
// CRITICAL: Fail fast if admin API URL is not configured
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
if (!ADMIN_API_URL) {
  throw new Error('NEXT_PUBLIC_ADMIN_API_URL environment variable is required. Please set it in Vercel environment variables.');
}
```

**Exception:** `sitemap.ts` uses graceful degradation (logs error, continues with static routes only).

### Diagnostic Logging Added:

Each route now logs:
```typescript
console.log('[DIAGNOSTIC] Web API /api/[route]: Fetching from admin API:', fetchUrl);
```

**To Remove Later:** Search for `[DIAGNOSTIC]` and remove those console.log statements.

---

## 4. Admin Write Path Verification

### Write Path: Admin UI → API Route → Database

**File:** `apps/admin/app/api/admin/pages/[id]/route.ts:139-174`

**Database Write:**
```typescript
const page = await prisma.page.update({
  where: { id },
  data: pageData,
  include: { translations: true },
});

// Update or create translations
for (const translation of cleanTranslations) {
  await prisma.pageTranslation.upsert({
    where: { pageId_locale: { pageId: id, locale: translation.locale } },
    update: translation,
    create: { ...translation, pageId: id },
  });
}
```

**Prisma Client:**
- **File:** `apps/admin/lib/prisma.ts:9-11`
- **Connection:** `new PrismaClient()` uses `process.env.DATABASE_URL`
- **No dev fallback:** Prisma schema requires PostgreSQL (line 9 in `schema.prisma`)

**Authentication:**
- **File:** `apps/admin/lib/session.ts:85-93`
- **Function:** `requireAdminSession()` validates cookie
- **File:** `apps/admin/lib/auth.ts:45-56`
- **Function:** `authenticate()` validates credentials from env vars

### Required Environment Variables:

| Variable | Where Used | Required | Dev Fallback |
|----------|------------|----------|--------------|
| `DATABASE_URL` | `lib/prisma.ts`, `prisma/schema.prisma` | ✅ YES | ❌ NO (PostgreSQL required) |
| `ADMIN_USERNAME` | `lib/auth.ts:15,49` | ✅ YES | ❌ NO (throws error if missing) |
| `ADMIN_PASSWORD` | `lib/auth.ts:22,50` | ✅ YES | ❌ NO (throws error if missing) |

**Verification:**
- `lib/auth.ts:14-27` - `validateAuthConfig()` throws error if missing
- `lib/auth.ts:45-47` - `authenticate()` calls `validateAuthConfig()` (throws if missing)
- `app/api/admin/pages/[id]/route.ts:104-110` - Explicitly checks `DATABASE_URL` and returns 500 if missing

**Conclusion:** ✅ No dev fallbacks. All required env vars must be set or operations fail.

---

## 5. CORS Requirement Decision

### Evidence:

1. **All web app data fetching goes through server-side routes:**
   - `/app/api/pages/*` → Server-side
   - `/app/api/services/*` → Server-side
   - `/app/api/homepage` → Server-side
   - `/app/sitemap.ts` → Server-side

2. **No client-side code fetches admin API directly:**
   - Only `ThemeProvider` fetches `/api/theme` (web app's own API)
   - No `fetch()` calls to `NEXT_PUBLIC_ADMIN_API_URL` in client components
   - No absolute URLs to admin domain in client code

3. **Browser → Web App → Admin App:**
   - Browser calls: `https://web-domain.vercel.app/api/pages`
   - Web server calls: `https://admin-domain.vercel.app/api/public/pages`
   - This is server-to-server (no CORS needed)

### Final Conclusion:

**CORS NEEDED: NO**

**Why:** All admin API calls are made server-to-server from Next.js API routes. The browser never directly calls the admin API. CORS is only required for browser-initiated cross-origin requests.

---

## 6. Root Cause Ranking

### Primary Root Cause: **(A) Admin writes succeed but Web cannot read**

**Evidence:**
1. Admin write path is complete and functional (if env vars set)
2. Web app has silent fallback to `localhost:3001` when `NEXT_PUBLIC_ADMIN_API_URL` is missing
3. In production, `localhost:3001` is unreachable → all web API routes fail silently
4. Web app returns empty arrays/null on error (graceful degradation) → appears to work but shows no content

**Secondary Issues:**
- **(B) Admin writes fail** - Only if `DATABASE_URL`, `ADMIN_USERNAME`, or `ADMIN_PASSWORD` are missing
- **(C) CORS** - NOT APPLICABLE (server-to-server communication)

---

## 7. Minimal Patches Applied

### Patch 1: Remove Localhost Fallbacks

**Files Changed:**
- `apps/web/app/api/pages/route.ts`
- `apps/web/app/api/pages/[slug]/route.ts`
- `apps/web/app/api/homepage/route.ts`
- `apps/web/app/api/services/route.ts`
- `apps/web/app/api/services/[slug]/route.ts`
- `apps/web/app/sitemap.ts` (graceful degradation)

**Change:** Throw error if `NEXT_PUBLIC_ADMIN_API_URL` is missing instead of falling back to localhost.

### Patch 2: Add Diagnostic Logging

**Files Changed:** Same 6 files as above

**Change:** Add `console.log('[DIAGNOSTIC] ...')` before each admin API fetch.

**To Remove:** Search for `[DIAGNOSTIC]` and remove after verification.

---

## 8. Environment Variable Checklist for Vercel

### Admin App Project (`apps/admin`)

**Required:**
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-password-min-12-chars
```

**Optional:**
```
NODE_ENV=production
```

### Web App Project (`apps/web`)

**Required:**
```
NEXT_PUBLIC_ADMIN_API_URL=https://your-admin-deployment-url.vercel.app
```

**Optional:**
```
NEXT_PUBLIC_SITE_URL=https://your-web-domain.vercel.app
```

**Note:** `VERCEL_URL` is automatically set by Vercel (no need to set manually).

---

## 9. Deployment Verification Steps

1. **Set environment variables** in both Vercel projects (see section 8)
2. **Deploy admin app first** - Verify it connects to database
3. **Copy admin deployment URL** - Use this for `NEXT_PUBLIC_ADMIN_API_URL` in web app
4. **Deploy web app** - Should fail fast with clear error if `NEXT_PUBLIC_ADMIN_API_URL` is missing
5. **Check Vercel function logs** - Look for `[DIAGNOSTIC]` messages to verify correct URLs
6. **Test admin write** - Create a page in admin panel
7. **Test web read** - Verify page appears on website
8. **Remove diagnostic logs** - After verification, remove `[DIAGNOSTIC]` console.log statements

---

## Summary

- **Root Cause:** Missing `NEXT_PUBLIC_ADMIN_API_URL` causes web app to call `localhost:3001` (unreachable in production)
- **CORS:** Not required (server-to-server communication)
- **Fixes Applied:** Removed localhost fallbacks, added diagnostic logging
- **Next Steps:** Set environment variables in Vercel and deploy

