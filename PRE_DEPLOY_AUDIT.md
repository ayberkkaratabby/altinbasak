# Pre-Deploy Audit - Production Breakers Only

## A) ADMIN APP AUDIT

### 1. Auth Safety ✅

**Status:** GOOD

- ✅ `ADMIN_USERNAME` and `ADMIN_PASSWORD` are required (`lib/auth.ts:14-27`)
- ✅ No bypass exists - `validateAuthConfig()` throws if missing
- ✅ Brute-force protection EXISTS (`lib/rate-limit.ts`)
  - 5 attempts per 15 minutes
  - 30 minute lockout after max attempts
  - In-memory (best-effort, resets on server restart)
- ✅ Rate limiting is used in login route (`app/api/auth/login/route.ts:9`)

**No changes needed.**

---

### 2. Session Cookie Correctness ⚠️

**Status:** NEEDS FIX

**File:** `apps/admin/lib/session.ts:35`

**Issue:**
```typescript
secure: process.env.NODE_ENV === 'production',
```

**Problem:** On Vercel, `NODE_ENV` may not be reliably set to `production` during build. Should also check `VERCEL` env var.

**Severity:** HIGH (security - cookies may be sent over HTTP)

**Fix:**
```typescript
secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
```

**Other cookie flags:** ✅ CORRECT
- `httpOnly: true` ✅
- `sameSite: 'lax'` ✅
- `path: '/'` ✅ (correct for admin routes)

---

### 3. DB Safety ✅

**Status:** GOOD

- ✅ `DATABASE_URL` is checked in all admin API routes (`app/api/admin/pages/[id]/route.ts:104-110`)
- ✅ Prisma uses singleton pattern (`lib/prisma.ts:9-15`)
  - Uses `global.prisma` in development
  - Single instance in production (serverless-safe)
  - Connection pooling handled by Prisma

**No changes needed.**

---

### 4. Admin Write Endpoints ✅

**Status:** GOOD

- ✅ PATCH/POST return meaningful errors (`app/api/admin/pages/[id]/route.ts:175-210`)
- ✅ Error codes: P2002 (duplicate), P2025 (not found), P1001 (connection failed)
- ✅ No silent success - all errors are returned
- ✅ Single-tenant (no companyId needed - confirmed by schema)

**No changes needed.**

---

### 5. Public API Exposure ✅

**Status:** GOOD

- ✅ `/api/public/pages` - READ-ONLY (GET only)
- ✅ `/api/public/services` - READ-ONLY (GET only)
- ✅ Only returns `status: 'published'` items (`app/api/public/pages/route.ts:15-17`)
- ✅ No drafts or private fields exposed
- ✅ Uses Prisma `where` clause to filter published only

**No changes needed.**

---

## B) WEB APP AUDIT

### 1. Environment Hard Requirements ✅

**Status:** GOOD

- ✅ `NEXT_PUBLIC_ADMIN_API_URL` is required (fail-fast in all API routes)
- ✅ No localhost fallbacks in API routes (already fixed)
- ⚠️ **Localhost fallbacks in page components** (for self-fetching - acceptable but should handle errors)

**Files with localhost fallback (for self-fetching):**
- `app/page.tsx:18` - Falls back to `http://localhost:3000` (self-fetch)
- `app/urunler/page.tsx:9` - Falls back to `http://localhost:3000` (self-fetch)
- `app/[slug]/page.tsx:17,50` - Falls back to `http://localhost:3000` (self-fetch)

**Severity:** LOW (only affects self-fetching, has VERCEL_URL fallback)

**Note:** These are for server-side self-fetching. The fallback is acceptable but should handle errors gracefully.

---

### 2. SSR/SEO Sanity ✅

**Status:** GOOD

- ✅ Metadata generation handles errors (`app/[slug]/page.tsx:34-38` - returns `{}` on error)
- ✅ Sitemap is graceful (`app/sitemap.ts` - continues with static routes on error)
- ✅ No build crashes from metadata

**No changes needed.**

---

### 3. Error UX ⚠️

**Status:** NEEDS FIX

**Issue:** Components assume API returns arrays, but API now returns `{error: ...}` on failure.

**Files at risk:**
- `app/urunler/ProductsPageClient.tsx:45` - `products.map()` will crash if `products` is `{error: ...}`
- `app/page.tsx:40-46` - Components receive `null` on error (safe)
- `app/[slug]/page.tsx:60` - Uses `notFound()` on error (safe)

**Severity:** MEDIUM (white-screen risk on products page)

**Fix needed:** Add defensive check in `ProductsPageClient.tsx`

---

### 4. Security ✅

**Status:** GOOD

- ✅ No admin endpoints exposed from web app
- ✅ `next.config.ts:20-22` - Rewrites only in development
- ✅ Admin routes are separate deployment

**No changes needed.**

---

## C) CRITICAL CROSS-APP CHECKS

### 1. Deployment Configuration ✅

**Status:** GOOD

- ✅ Root `package.json` has correct build commands
- ✅ `pnpm workspace` configured correctly
- ✅ Build commands use `--filter` for monorepo

**Vercel Settings Required:**
- Admin: Root Directory `apps/admin`, Build Command `cd ../.. && pnpm run build --filter admin`
- Web: Root Directory `apps/web`, Build Command `cd ../.. && pnpm run build --filter web`

**No changes needed.**

---

### 2. Version Mismatch Risk ⚠️

**Status:** LOW RISK (but monitor)

- Admin: Next.js 14.2.5, React 18.3.1
- Web: Next.js 16.0.10, React 19.2.1

**Risk:** Different Next.js versions in monorepo. However:
- ✅ Separate deployments (no runtime conflicts)
- ✅ Separate `node_modules` (pnpm workspace isolation)
- ✅ Build commands are separate

**Severity:** LOW (separate builds, no shared code)

**No changes needed** (monitor for issues, but safe to ship).

---

## D) MINIMAL PATCHES REQUIRED

### Patch 1: Fix Cookie Secure Flag (CRITICAL)

**File:** `apps/admin/lib/session.ts`

**Change:**
```typescript
// Before:
secure: process.env.NODE_ENV === 'production',

// After:
secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
```

**Reason:** Ensures cookies are secure on Vercel even if NODE_ENV is not set correctly.

---

### Patch 2: Defensive Error Handling in ProductsPageClient (MEDIUM)

**File:** `apps/web/app/urunler/ProductsPageClient.tsx`

**Change:**
```typescript
// Before:
export function ProductsPageClient({ products }: ProductsPageClientProps) {
  return (
    // ... uses products.map() directly
  );
}

// After:
export function ProductsPageClient({ products }: ProductsPageClientProps) {
  // Defensive: Ensure products is an array
  const safeProducts = Array.isArray(products) ? products : [];
  
  return (
    <div className="min-h-screen">
      {/* ... existing code ... */}
      {safeProducts.length === 0 ? (
        // ... existing empty state ...
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {safeProducts.map((product, index) => (
            // ... existing code ...
          ))}
        </div>
      )}
    </div>
  );
}
```

**Reason:** Prevents white-screen if API returns `{error: ...}` instead of array.

---

## E) FINAL DECISION

### GO / NO-GO: ✅ **GO** (with 2 minimal patches)

**Reasoning:**
- ✅ Auth is secure (rate limiting exists)
- ✅ DB connection is safe (singleton pattern)
- ✅ Public API is read-only
- ✅ Admin write endpoints return proper errors
- ⚠️ Cookie secure flag needs fix (1 line change)
- ⚠️ Products page needs defensive check (prevents white-screen)

**Blocking Issues:** NONE
**Non-blocking Issues:** 2 (both fixable in <5 minutes)

---

## "Ship in 1 Hour" Checklist

### Step 1: Apply Patches (5 minutes)

1. **Fix cookie secure flag:**
   - Edit `apps/admin/lib/session.ts:35`
   - Change to: `secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',`

2. **Fix ProductsPageClient:**
   - Edit `apps/web/app/urunler/ProductsPageClient.tsx:20`
   - Add: `const safeProducts = Array.isArray(products) ? products : [];`
   - Replace all `products` with `safeProducts` in the component

### Step 2: Verify Builds (10 minutes)

3. **Test admin build:**
   ```bash
   cd apps/admin
   pnpm run build
   ```

4. **Test web build:**
   ```bash
   cd apps/web
   pnpm run build
   ```

### Step 3: Deploy Admin App (15 minutes)

5. **Create Vercel project for admin:**
   - Root Directory: `apps/admin`
   - Build Command: `cd ../.. && pnpm run build --filter admin`
   - Output Directory: `apps/admin/.next`
   - Install Command: `pnpm install`

6. **Set environment variables:**
   - `DATABASE_URL` (PostgreSQL connection string)
   - `ADMIN_USERNAME` (your admin username)
   - `ADMIN_PASSWORD` (strong password, min 12 chars)

7. **Deploy and verify:**
   - Check deployment URL
   - Test login
   - Create test page

### Step 4: Deploy Web App (15 minutes)

8. **Create Vercel project for web:**
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm run build --filter web`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install`

9. **Set environment variable:**
   - `NEXT_PUBLIC_ADMIN_API_URL` = `https://[admin-deployment-url]`

10. **Deploy and verify:**
    - Check homepage loads
    - Check products page loads (even if empty)
    - Check Vercel logs for `[PROD-DIAG]` messages

### Step 5: Final Verification (10 minutes)

11. **Test admin write:**
    - Login to admin
    - Create a page
    - Verify it saves

12. **Test web read:**
    - Visit web app
    - Verify page appears
    - Check browser console for errors

13. **Check logs:**
    - Vercel function logs should show `[PROD-DIAG]` messages
    - Should NOT see `localhost:3001` in logs

**Total Time:** ~55 minutes

---

## Summary

**Critical Issues:** 0  
**High Priority:** 1 (cookie secure flag)  
**Medium Priority:** 1 (products page error handling)  
**Low Priority:** 0

**Status:** ✅ **READY TO SHIP** (after 2 minimal patches)

