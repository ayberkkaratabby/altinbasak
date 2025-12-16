# Altınbaşak Web - Monorepo

Monorepo structure for Altınbaşak patisserie website and admin panel.

## Structure

```
altinbasakweb/
├── apps/
│   ├── web/          # Public website (Next.js 16)
│   └── admin/         # Admin panel (Next.js 14)
├── archive/           # Archived templates
├── docs/              # Documentation
└── package.json       # Root workspace config
```

## Prerequisites

- Node.js 20+
- pnpm 9+ (recommended) or npm

## Installation

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

## Development

### Run Both Apps

```bash
pnpm dev
```

This will start:
- Web app on `http://localhost:3000`
- Admin app on `http://localhost:3001`
- Web app rewrites `/admin/*` to admin app (dev-only)

### Run Individual Apps

```bash
# Web app only
pnpm dev:web

# Admin app only
pnpm dev:admin
```

## Environment Variables

### Web App (`apps/web`)

No environment variables required for basic functionality.

Optional:
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata

### Admin App (`apps/admin`)

**REQUIRED** - Create `apps/admin/.env.local`:

```env
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-password-min-12-chars
DATABASE_URL=file:./prisma/dev.db
```

⚠️ **The admin app will NOT start without `ADMIN_USERNAME` and `ADMIN_PASSWORD` set.**

See `apps/admin/AUTH_SECURITY.md` for security details.

## Production Routing

The `/admin` route is served by the admin app via reverse proxy / platform rewrites.

See `docs/admin-routing.md` for platform-specific configuration:
- Vercel
- Nginx
- Cloudflare
- Docker Compose

## Build

```bash
# Build all apps
pnpm build

# Build individual apps
pnpm build:web
pnpm build:admin
```

## Security

- Admin authentication is required
- Rate limiting: 5 attempts per 15 minutes, 30-minute lockout
- Secure cookies: HttpOnly, Secure (prod), SameSite=Lax
- No default credentials - must set environment variables

See `apps/admin/AUTH_SECURITY.md` for complete security checklist.

## License

Private project

