# Web App Deployment Checklist

## ✅ Code Status
- [x] API routes have `export const dynamic = 'force-dynamic'`
- [x] Environment variable checks in place
- [x] Components properly configured
- [x] TypeScript dependency fixed
- [x] No package-lock.json files

## 🔧 Vercel Dashboard Settings

### 1. Install Command
```
node -v && npx -y pnpm@9.15.5 -v && npx -y pnpm@9.15.5 install
```

### 2. Build Command
```
pnpm --filter "./apps/web" build
```

### 3. Root Directory
```
.
```
(Repo root - monorepo)

### 4. Framework Preset
```
Next.js
```
(Vercel otomatik algılamalı)

## 🔑 Environment Variables (CRITICAL)

### Required Variables:
1. **NEXT_PUBLIC_ADMIN_API_URL**
   - Value: Admin app'in Vercel URL'i
   - Example: `https://altinbasak-admin.vercel.app`
   - ⚠️ **MUTLAKA AYARLA** - Yoksa web app çalışmaz!

2. **NEXT_PUBLIC_SITE_URL**
   - Value: Web app'in kendi Vercel URL'i
   - Example: `https://altinbasak.vercel.app`
   - ⚠️ **MUTLAKA AYARLA** - SEO ve metadata için gerekli

### Optional (but recommended):
- `NEXT_PUBLIC_VERCEL_URL` - Vercel otomatik set eder, gerekmez

## 📋 Pre-Deploy Checklist

1. ✅ Admin app deploy edildi ve çalışıyor mu?
   - Admin app'in URL'ini al: `https://[admin-project].vercel.app`
   
2. ✅ Environment variables hazır mı?
   - `NEXT_PUBLIC_ADMIN_API_URL` = Admin app URL'i
   - `NEXT_PUBLIC_SITE_URL` = Web app URL'i (deploy sonrası güncellenebilir)

3. ✅ Build settings doğru mu?
   - Install Command: pnpm 9.15.5
   - Build Command: `pnpm --filter "./apps/web" build`
   - Root Directory: `.`

## 🚀 Deploy Order

1. **Önce Admin App'i deploy et**
   - Admin app'in URL'ini not al
   
2. **Sonra Web App'i deploy et**
   - `NEXT_PUBLIC_ADMIN_API_URL` = Admin app URL'i
   - `NEXT_PUBLIC_SITE_URL` = Web app URL'i (ilk deploy sonrası güncelle)

## ✅ Post-Deploy Verification

1. Web app açılıyor mu?
   - Ana sayfa yükleniyor mu?
   
2. Admin API'ye bağlanıyor mu?
   - Browser console'da hata var mı?
   - Network tab'de `/api/homepage` çağrısı başarılı mı?

3. İçerik görünüyor mu?
   - Hero section görünüyor mu?
   - Featured products görünüyor mu?
   - Story section görünüyor mu?

## 🐛 Troubleshooting

### Web app boş görünüyorsa:
- `NEXT_PUBLIC_ADMIN_API_URL` doğru mu?
- Admin app çalışıyor mu?
- Browser console'da hata var mı?

### Build hatası:
- Install Command doğru mu? (pnpm 9.15.5)
- Root Directory `.` mi?
- `package-lock.json` dosyaları silindi mi?

### API hatası:
- Admin app'in public API endpoint'leri çalışıyor mu?
- `https://[admin-url]/api/public/pages` açılıyor mu?
- CORS hatası var mı? (olmamalı, server-to-server)

## 📝 Notes

- Web app, admin app'in public API'lerini kullanır
- Tüm veriler admin panelinden yönetilir
- Web app sadece okuyucu (read-only) bir uygulamadır
- Environment variables'ları deploy öncesi ayarla!

