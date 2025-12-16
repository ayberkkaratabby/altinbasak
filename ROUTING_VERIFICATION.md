# Admin Routing Verification

## Production-Safe Rewrites Evidence

### Code Location: `apps/web/next.config.ts`

```typescript
async rewrites() {
  // Explicitly check for development mode
  // In production builds, NODE_ENV will be 'production' and this returns []
  if (process.env.NODE_ENV !== 'development') {
    return [];  // ✅ PRODUCTION: Returns empty array, no rewrites applied
  }
  
  // Only in development: proxy /admin/* to admin app
  return [
    {
      source: '/admin/:path*',
      destination: 'http://localhost:3001/admin/:path*',
    },
  ];
}
```

### Verification

**Production Build:**
- `NODE_ENV === 'production'` → `rewrites()` returns `[]`
- No rewrites are applied in production builds
- `/admin` routes will 404 in production (as intended - must use reverse proxy)

**Development:**
- `NODE_ENV === 'development'` → `rewrites()` returns proxy config
- `/admin/*` is proxied to `http://localhost:3001/admin/*`

## Admin App Base Path Confirmation

### Evidence from Code:

1. **No basePath in `apps/admin/next.config.js`:**
   ```javascript
   // No basePath configured - serves at root
   ```

2. **Route Structure:**
   - `apps/admin/app/(admin)/admin/login/page.tsx` → `/admin/login`
   - `apps/admin/app/(admin)/admin/page.tsx` → `/admin`
   - All routes are under `/admin/*`

3. **Login Redirect:**
   - Login page redirects to `/admin` on success (line 28 in login/page.tsx)
   - Layout redirects to `/admin/login` if not authenticated (line 18 in layout.tsx)

**Conclusion**: Admin app serves all routes at `/admin/*` with no basePath configuration.

## Robots.txt Verification

### Admin App: `apps/admin/app/robots.ts`

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',  // ✅ Disallows ALL routes
    },
  };
}
```

### Metadata Robots Directive: `apps/admin/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  robots: {
    index: false,      // ✅ No indexing
    follow: false,     // ✅ No following
    noarchive: true,   // ✅ No archiving
    nosnippet: true,   // ✅ No snippets
  },
};
```

**Result**: Admin pages are completely excluded from search engines via both robots.txt and meta tags.

