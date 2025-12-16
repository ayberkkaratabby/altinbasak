# Production Deployment Checklist

## ✅ All Fixes Applied

**6 files modified** - All web app API routes now fail-fast instead of silently falling back to localhost.

---

## A) Files Changed

1. `apps/web/app/api/pages/route.ts`
2. `apps/web/app/api/pages/[slug]/route.ts`
3. `apps/web/app/api/homepage/route.ts`
4. `apps/web/app/api/services/route.ts`
5. `apps/web/app/api/services/[slug]/route.ts`
6. `apps/web/app/sitemap.ts`

---

## B) Key Changes Applied

### 1. Removed Localhost Fallback
- ❌ **Before:** `const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';`
- ✅ **After:** Fail-fast with 500 error if env var missing

### 2. Added Production Diagnostics
- Added `console.log('[PROD-DIAG] Web → Admin fetch:', fetchUrl);` before each admin API call

### 3. Enhanced Error Handling
- Logs admin API errors: `console.error('[ADMIN API ERROR]', response.status, errorText);`
- Returns 500 instead of empty arrays/null

### 4. Admin Write Path - Verified (No Changes)
- ✅ `DATABASE_URL` - Required, enforced in API routes
- ✅ `ADMIN_USERNAME` - Required, enforced in `lib/auth.ts`
- ✅ `ADMIN_PASSWORD` - Required, enforced in `lib/auth.ts`

---

## C) FINAL Production Checklist

### Admin Project (Vercel) - Environment Variables

**MUST SET (3 variables):**

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-password-minimum-12-characters
```

**Where enforced:**
- `DATABASE_URL`: Checked in all admin API routes (returns 500 if missing)
- `ADMIN_USERNAME`: Checked in `apps/admin/lib/auth.ts:14-20` (throws if missing)
- `ADMIN_PASSWORD`: Checked in `apps/admin/lib/auth.ts:22-27` (throws if missing)

**No dev fallbacks exist** - operations fail if missing.

---

### Web Project (Vercel) - Environment Variables

**MUST SET (1 variable):**

```
NEXT_PUBLIC_ADMIN_API_URL=https://your-admin-deployment-url.vercel.app
```

**Example:**
```
NEXT_PUBLIC_ADMIN_API_URL=https://altinbasakweb-admin.vercel.app
```

**Where enforced:**
- All 5 API routes return 500 if missing
- Sitemap logs error but continues (doesn't crash build)

**Optional (has fallback):**
```
NEXT_PUBLIC_SITE_URL=https://your-web-domain.vercel.app
```

---

### Deployment Order

**STEP 1: Deploy Admin App FIRST**

1. Create Vercel project for `apps/admin`
2. Set Root Directory: `apps/admin`
3. Set Build Command: `cd ../.. && pnpm run build --filter admin`
4. Set Output Directory: `apps/admin/.next`
5. Set Install Command: `pnpm install`
6. **Set Environment Variables:**
   - `DATABASE_URL` (PostgreSQL connection string)
   - `ADMIN_USERNAME` (your admin username)
   - `ADMIN_PASSWORD` (your strong password, min 12 chars)
7. Deploy
8. **Copy the deployment URL** (e.g., `https://altinbasakweb-admin.vercel.app`)

**STEP 2: Deploy Web App SECOND**

1. Create Vercel project for `apps/web`
2. Set Root Directory: `apps/web`
3. Set Build Command: `cd ../.. && pnpm run build --filter web`
4. Set Output Directory: `apps/web/.next`
5. Set Install Command: `pnpm install`
6. **Set Environment Variable:**
   - `NEXT_PUBLIC_ADMIN_API_URL` = `https://[admin-deployment-url-from-step-1]`
7. Deploy

**Why this order:**
- Web app needs admin URL to function
- If web deploys first without admin URL, it will fail-fast with clear error (good for debugging)

---

### Post-Deployment Verification

1. **Admin App:**
   - ✅ Visit admin login page
   - ✅ Login with `ADMIN_USERNAME` / `ADMIN_PASSWORD`
   - ✅ Create a test page
   - ✅ Verify page saves successfully

2. **Web App:**
   - ✅ Visit web app homepage
   - ✅ Check Vercel function logs for `[PROD-DIAG]` messages
   - ✅ Verify correct admin URL is being used (should NOT see `localhost:3001`)
   - ✅ Verify pages/services appear on website

3. **Check Logs:**
   - Look for `[PROD-DIAG] Web → Admin fetch:` in Vercel function logs
   - Should show: `https://[admin-url]/api/public/pages`
   - If you see `localhost:3001` → env var not set correctly

4. **Remove Diagnostic Logs (After Verification):**
   - Search for `[PROD-DIAG]` in codebase
   - Remove those `console.log` statements
   - Keep `[FATAL]` and `[ADMIN API ERROR]` logs (they're useful for production)

---

## Summary

✅ **Localhost fallbacks eliminated** - All routes fail-fast  
✅ **Production diagnostics added** - Temporary logging for verification  
✅ **Error handling enhanced** - Returns 500 instead of silent failures  
✅ **Admin write path verified** - No changes needed, already enforced  

**CRITICAL:** Set `NEXT_PUBLIC_ADMIN_API_URL` in web app Vercel project or web app will return 500 errors.

