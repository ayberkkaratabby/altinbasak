# Admin Authentication Security Checklist

## ✅ Security Features Implemented

### 1. Required Environment Variables
- ✅ `ADMIN_USERNAME` - **REQUIRED**, no default fallback
- ✅ `ADMIN_PASSWORD` - **REQUIRED**, no default fallback
- ✅ App will **fail to start** if either is missing
- ✅ Validation happens at startup (middleware.ts)

### 2. Rate Limiting
- ✅ Maximum 5 login attempts per IP
- ✅ 15-minute rolling window
- ✅ 30-minute lockout after max attempts
- ✅ In-memory storage (resets on server restart)
- ⚠️  For production, consider Redis-based rate limiting

### 3. Session Cookie Security
- ✅ `httpOnly: true` - Prevents XSS attacks
- ✅ `secure: true` in production - HTTPS only
- ✅ `sameSite: 'lax'` - CSRF protection
- ✅ 7-day expiration
- ✅ Scoped to current domain (no cross-domain issues)

### 4. Authentication
- ✅ Constant-time comparison (prevents timing attacks)
- ✅ Server-side only (credentials never exposed to client)
- ✅ Generic error messages (don't reveal which field failed)

## 🔒 Production Checklist

Before deploying to production:

- [ ] Set strong `ADMIN_USERNAME` (not "admin")
- [ ] Set strong `ADMIN_PASSWORD` (minimum 12 characters, use password manager)
- [ ] Ensure HTTPS is enabled
- [ ] Verify cookies are `secure: true` in production
- [ ] Consider implementing Redis-based rate limiting
- [ ] Set up monitoring/alerts for failed login attempts
- [ ] Regularly rotate admin credentials
- [ ] Consider adding 2FA/MFA for additional security
- [ ] Review and update session duration if needed
- [ ] Ensure environment variables are stored securely (not in code)

## 🧪 Testing

### Test Required Env Vars
```bash
# Should fail to start
unset ADMIN_USERNAME
pnpm --filter admin dev

# Should fail to start
unset ADMIN_PASSWORD
pnpm --filter admin dev
```

### Test Rate Limiting
1. Try 5 failed login attempts
2. 6th attempt should return 429 (Too Many Requests)
3. Wait 30 minutes or restart server to reset

### Test Cookie Security
1. Login successfully
2. Check browser DevTools → Application → Cookies
3. Verify:
   - `httpOnly` flag is set
   - `secure` flag is set (in production)
   - `sameSite` is "Lax"

## 📝 Environment Variables

Create `apps/admin/.env.local`:

```env
ADMIN_USERNAME=your-strong-username
ADMIN_PASSWORD=your-strong-password-min-12-chars
DATABASE_URL=file:./prisma/dev.db
```

**Never commit `.env.local` to version control!**

