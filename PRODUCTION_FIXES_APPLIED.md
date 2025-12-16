# Production Fixes Applied - Same-Day Rescue

## A) Files Changed (Full List)

1. `apps/web/app/api/pages/route.ts`
2. `apps/web/app/api/pages/[slug]/route.ts`
3. `apps/web/app/api/homepage/route.ts`
4. `apps/web/app/api/services/route.ts`
5. `apps/web/app/api/services/[slug]/route.ts`
6. `apps/web/app/sitemap.ts`

**Total: 6 files modified**

---

## B) Diff-Style Code Snippets (Only Modified Sections)

### Pattern 1: Fail-Fast Admin URL Check (All API Routes)

**Before:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
```

**After:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
if (!ADMIN_API_URL) {
  console.error('[FATAL] NEXT_PUBLIC_ADMIN_API_URL is missing');
  return NextResponse.json(
    { error: 'Server misconfigured: ADMIN API URL missing' },
    { status: 500 }
  );
}
```

**Applied to:**
- `apps/web/app/api/pages/route.ts` (line 3-10)
- `apps/web/app/api/pages/[slug]/route.ts` (line 3-10)
- `apps/web/app/api/homepage/route.ts` (line 3-10)
- `apps/web/app/api/services/route.ts` (line 3-10)
- `apps/web/app/api/services/[slug]/route.ts` (line 3-10)

---

### Pattern 2: Production Diagnostics (All API Routes)

**Before:**
```typescript
const response = await fetch(fetchUrl, {
  cache: 'no-store',
});
```

**After:**
```typescript
const fetchUrl = `${ADMIN_API_URL}/api/public/pages`;
console.log('[PROD-DIAG] Web → Admin fetch:', fetchUrl);

const response = await fetch(fetchUrl, {
  cache: 'no-store',
});
```

**Applied to:** All 5 API route files

---

### Pattern 3: Enhanced Error Handling (All API Routes)

**Before:**
```typescript
if (!response.ok) {
  throw new Error(`Admin API returned ${response.status}`);
}
```

**After:**
```typescript
if (!response.ok) {
  const errorText = await response.text();
  console.error('[ADMIN API ERROR]', response.status, errorText);
  return NextResponse.json(
    { error: 'Failed to fetch [resource] from admin API' },
    { status: 500 }
  );
}
```

**Applied to:** All 5 API route files

---

### Pattern 4: Remove Silent Failures (All API Routes)

**Before:**
```typescript
} catch (error) {
  console.error('Error fetching [resource] from admin API:', error);
  return NextResponse.json([]); // or { hero: null, ... }
}
```

**After:**
```typescript
} catch (error) {
  console.error('Error fetching [resource] from admin API:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

**Applied to:** All 5 API route files

---

### Pattern 5: Sitemap Special Handling

**Before:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
```

**After:**
```typescript
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
if (!ADMIN_API_URL) {
  console.error('[FATAL] NEXT_PUBLIC_ADMIN_API_URL is missing - sitemap will only include static routes');
}
```

**Note:** Sitemap does NOT crash build - continues with static routes only.

**Applied to:** `apps/web/app/sitemap.ts` (line 3-8)

---

## C) FINAL Production Checklist

### Admin Project (Vercel) - Required Environment Variables

**MUST BE SET:**

1. **`DATABASE_URL`**
   - Format: `postgresql://user:password@host:5432/dbname`
   - Where used: `apps/admin/lib/prisma.ts`, `apps/admin/prisma/schema.prisma`
   - Enforced: `apps/admin/app/api/admin/pages/[id]/route.ts:104-110` (returns 500 if missing)
   - **CRITICAL:** Without this, admin cannot write to database

2. **`ADMIN_USERNAME`**
   - Format: Any string (username for admin login)
   - Where used: `apps/admin/lib/auth.ts:15,49`
   - Enforced: `apps/admin/lib/auth.ts:14-20` (throws error if missing)
   - **CRITICAL:** Without this, admin login fails

3. **`ADMIN_PASSWORD`**
   - Format: Minimum 12 characters (strong password recommended)
   - Where used: `apps/admin/lib/auth.ts:22,50`
   - Enforced: `apps/admin/lib/auth.ts:22-27` (throws error if missing)
   - **CRITICAL:** Without this, admin login fails

**Verification:**
- All three are checked in `apps/admin/lib/auth.ts:validateAuthConfig()` (called on every login)
- `DATABASE_URL` is explicitly checked in all admin API routes
- No dev fallbacks exist - operations fail if missing

---

### Web Project (Vercel) - Required Environment Variables

**MUST BE SET:**

1. **`NEXT_PUBLIC_ADMIN_API_URL`**
   - Format: `https://your-admin-deployment-url.vercel.app` (full URL, no trailing slash)
   - Where used: All 6 files in `apps/web/app/api/*` and `sitemap.ts`
   - Enforced: All API routes return 500 if missing (fail-fast)
   - **CRITICAL:** Without this, web app cannot read admin data
   - **Example:** `https://altinbasakweb-admin.vercel.app`

**Optional (but recommended):**

2. **`NEXT_PUBLIC_SITE_URL`**
   - Format: `https://your-web-domain.vercel.app`
   - Where used: Metadata, sitemap, JSON-LD
   - Default: `https://patisserie.com` (fallback exists)
   - **Not critical:** Has fallback, won't break functionality

---

### Deployment Order

**STEP 1: Deploy Admin App FIRST**

1. Create Vercel project for `apps/admin`
2. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `ADMIN_USERNAME` (your admin username)
   - `ADMIN_PASSWORD` (your strong password, min 12 chars)
3. Deploy admin app
4. **Copy the deployment URL** (e.g., `https://altinbasakweb-admin.vercel.app`)

**STEP 2: Deploy Web App SECOND**

1. Create Vercel project for `apps/web`
2. Set environment variable:
   - `NEXT_PUBLIC_ADMIN_API_URL` = `https://[admin-deployment-url-from-step-1]`
3. Deploy web app

**Why this order:**
- Web app needs admin URL to function
- Admin app can be deployed independently
- If web deploys first without admin URL, it will fail-fast with clear error (good!)

---

### Verification Steps After Deployment

1. **Check Admin App:**
   - Visit admin login page
   - Login with `ADMIN_USERNAME` / `ADMIN_PASSWORD`
   - Create a test page
   - Verify page saves successfully

2. **Check Web App:**
   - Visit web app homepage
   - Check Vercel function logs for `[PROD-DIAG]` messages
   - Verify correct admin URL is being used
   - Verify pages/services appear on website

3. **Check Logs:**
   - Look for `[PROD-DIAG] Web → Admin fetch:` messages
   - Should show: `https://[admin-url]/api/public/pages`
   - If you see `localhost:3001` → env var not set correctly

4. **Remove Diagnostic Logs (After Verification):**
   - Search for `[PROD-DIAG]` in codebase
   - Remove those `console.log` statements
   - Keep `[FATAL]` and `[ADMIN API ERROR]` logs (they're useful)

---

## Summary

- **6 files modified** - All web app API routes
- **No admin changes** - Admin write path untouched
- **Fail-fast behavior** - No silent localhost fallbacks
- **Enhanced error handling** - Returns 500 instead of empty arrays
- **Production diagnostics** - Temporary logging for verification

**Critical:** Set `NEXT_PUBLIC_ADMIN_API_URL` in web app Vercel project or web app will return 500 errors.

