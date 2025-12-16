# Vercel Build Fix - Engine Check Issue

## Problem

Vercel is using pnpm 6.35.1 by default, but the lockfile requires pnpm 9.0.0+ (lockfileVersion: '9.0').

## Solution Applied

1. **Corepack Configuration** - `vercel.json`:
   ```json
   "installCommand": "corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install"
   ```

2. **.npmrc Configuration**:
   ```
   auto-install-peers=true
   strict-peer-dependencies=false
   shamefully-hoist=false
   ```

## If Still Failing

### Option 1: Set Node.js Version in Vercel Dashboard
1. Go to Project Settings → General
2. Set Node.js Version to **20.x** (better corepack support)

### Option 2: Use Environment Variable
In Vercel Dashboard → Environment Variables, add:
```
NODE_VERSION=20
```

### Option 3: Regenerate Lockfile (Last Resort)
If corepack still doesn't work, we may need to regenerate the lockfile with pnpm 6.x compatibility, but this is not recommended as it may cause dependency issues.

## Current Status

- ✅ Corepack enabled in install command
- ✅ pnpm 9.0.0 prepared and activated
- ✅ .npmrc configured for monorepo
- ⚠️ May need Node.js 20+ in Vercel settings

