# Ship Today Checklist - Final Go/No-Go

## ✅ FINAL DECISION: **GO** (2 patches applied)

---

## Findings Summary

### Critical Issues: 0
### High Priority: 1 (FIXED - cookie secure flag)
### Medium Priority: 1 (FIXED - products page error handling)
### Low Priority: 0

---

## Patches Applied

### ✅ Patch 1: Cookie Secure Flag (CRITICAL)
**File:** `apps/admin/lib/session.ts:35`
**Status:** APPLIED
**Change:** Added `|| process.env.VERCEL === '1'` to secure flag

### ✅ Patch 2: Products Page Error Handling (MEDIUM)
**File:** `apps/web/app/urunler/ProductsPageClient.tsx:20`
**Status:** APPLIED
**Change:** Added `const safeProducts = Array.isArray(products) ? products : [];`

---

## Pre-Deploy Verification

### Admin App ✅
- ✅ Auth required (ADMIN_USERNAME, ADMIN_PASSWORD)
- ✅ Rate limiting exists (5 attempts, 30min lockout)
- ✅ Cookie secure flag fixed
- ✅ DATABASE_URL required
- ✅ Prisma singleton pattern (serverless-safe)
- ✅ Public API read-only
- ✅ Write endpoints return proper errors

### Web App ✅
- ✅ NEXT_PUBLIC_ADMIN_API_URL required (fail-fast)
- ✅ Products page error handling fixed
- ✅ Metadata generation safe (returns {} on error)
- ✅ Sitemap graceful (continues on error)
- ✅ No admin endpoints exposed

### Cross-App ✅
- ✅ Build commands correct for monorepo
- ✅ Version mismatch low risk (separate deployments)
- ✅ pnpm workspace configured correctly

---

## Deployment Steps (55 minutes)

### Step 1: Deploy Admin App (15 min)

1. Create Vercel project: `altinbasakweb-admin`
2. Settings:
   - Root Directory: `apps/admin`
   - Build Command: `cd ../.. && pnpm run build --filter admin`
   - Output Directory: `apps/admin/.next`
   - Install Command: `pnpm install`
3. Environment Variables:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-strong-password-min-12-chars
   ```
4. Deploy
5. Copy deployment URL: `https://[admin-url].vercel.app`

### Step 2: Deploy Web App (15 min)

1. Create Vercel project: `altinbasakweb-web`
2. Settings:
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm run build --filter web`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install`
3. Environment Variables:
   ```
   NEXT_PUBLIC_ADMIN_API_URL=https://[admin-url].vercel.app
   ```
4. Deploy

### Step 3: Verify (10 min)

1. Admin: Login, create test page
2. Web: Visit homepage, check products page
3. Logs: Check for `[PROD-DIAG]` messages (should NOT see localhost)

---

## Post-Deploy Monitoring

### Check Vercel Logs For:
- ✅ `[PROD-DIAG] Web → Admin fetch:` (should show admin URL)
- ❌ `localhost:3001` (should NOT appear)
- ❌ `[ADMIN API ERROR]` (investigate if seen)
- ❌ `[FATAL]` messages (indicates missing env vars)

### Test Scenarios:
1. ✅ Admin login works
2. ✅ Admin can create/edit pages
3. ✅ Web homepage loads
4. ✅ Web products page loads (even if empty)
5. ✅ Web shows content from admin

---

## Rollback Plan

If issues occur:
1. Check Vercel function logs
2. Verify environment variables are set
3. Check admin API is accessible from web app
4. Verify database connection in admin app

---

## Status: ✅ READY TO SHIP

**All critical issues fixed. Proceed with deployment.**

