# Admin Panel Production Routing Guide

This document explains how to route `/admin` requests to the admin app in production environments.

## Architecture

- **Web App**: Serves public site at root (`/`)
- **Admin App**: Serves admin panel at `/admin/*` (no basePath configured)
  - Login: `/admin/login`
  - Dashboard: `/admin`
  - All admin routes: `/admin/*`
- **Routing Strategy**: Reverse proxy / platform rewrites route `/admin/*` to admin app

## URL Truth Table

| Environment | URL | Served By | Notes |
|------------|-----|-----------|-------|
| Local Dev (Direct) | `http://localhost:3001/admin` | Admin app | Direct access to admin app |
| Local Dev (Proxied) | `http://localhost:3000/admin` | Web app → Admin app | Dev-only rewrite in web app |
| Production | `https://yourdomain.com/admin` | Web app → Admin app | Via reverse proxy/rewrites |

## Platform-Specific Configurations

### ✅ Vercel (Recommended)

**Recommended approach for easiest deployment and best performance.**

Create `vercel.json` at the **root** of the monorepo:

**Option 1: Monorepo Deployment (Recommended)**

Deploy both apps in a single Vercel project using monorepo support:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "apps/admin/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/apps/admin/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/apps/web/$1"
    }
  ]
}
```

**Option 2: Separate Deployments with Rewrites**

Deploy web and admin as separate Vercel projects, then use rewrites:

1. Deploy admin app to Vercel (e.g., `admin-app.vercel.app`)
2. Deploy web app to main domain
3. Create `vercel.json` in web app root:

```json
{
  "rewrites": [
    {
      "source": "/admin/:path*",
      "destination": "https://admin-app.vercel.app/admin/:path*"
    }
  ]
}
```

**Note**: Admin app serves routes at `/admin/*` (no basePath), so the rewrite destination must include `/admin/` path.

### Nginx (Alternative)

**Important**: Admin app serves routes at `/admin/*`, so proxy_pass must preserve the path.

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Admin app (running on port 3001)
    # Note: Admin app expects /admin/* paths, so we proxy with path preserved
    location /admin {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Preserve original path
        proxy_redirect off;
    }

    # Web app (running on port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Cloudflare Workers / Pages (Alternative)

For Cloudflare Pages, use `_redirects` file in web app's `public` folder:

```
/admin/*  https://admin-app.pages.dev/admin/:splat  200
```

**Note**: The destination must include `/admin/` because the admin app serves routes at that path.

Or use Cloudflare Workers for more control:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  if (url.pathname.startsWith('/admin')) {
    // Route to admin app
    return fetch(`https://admin-app.pages.dev${url.pathname}${url.search}`, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
  }
  
  // Route to web app
  return fetch(`https://web-app.pages.dev${url.pathname}${url.search}`, {
    method: request.method,
    headers: request.headers,
    body: request.body
  })
}
```

### Docker Compose

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web
      - admin

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"

  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - ADMIN_USERNAME=${ADMIN_USERNAME}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - DATABASE_URL=${DATABASE_URL}
```

## Important Notes

1. **Session Cookies**: Ensure admin app sets cookies with `domain` attribute matching the main domain
2. **CORS**: Admin app may need CORS headers if served from different origin
3. **Environment Variables**: Admin app needs `ADMIN_USERNAME` and `ADMIN_PASSWORD` set
4. **HTTPS**: Always use HTTPS in production for secure cookie transmission

## Testing Production Routing

1. Deploy both apps separately
2. Test `/admin` route from main domain
3. Verify cookies are set correctly
4. Test authentication flow
5. Verify session persistence across requests

