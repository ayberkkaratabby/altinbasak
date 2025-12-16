# 404 Hatası Çözüm Rehberi

## 🔍 Hızlı Kontrol

404 hatası alıyorsanız, aşağıdakileri kontrol edin:

### 1. Environment Variables (EN ÖNEMLİSİ)

Vercel Dashboard → Web App Projesi → Settings → Environment Variables

**MUTLAKA OLMASI GEREKENLER:**

1. **NEXT_PUBLIC_ADMIN_API_URL**
   - Value: Admin app'in tam URL'i
   - Format: `https://[admin-project-name].vercel.app`
   - Örnek: `https://altinbasak-admin.vercel.app`
   - ⚠️ **HTTPS ile başlamalı, sonunda `/` olmamalı**

2. **NEXT_PUBLIC_SITE_URL**
   - Value: Web app'in kendi URL'i
   - Format: `https://[web-project-name].vercel.app`
   - Örnek: `https://altinbasak.vercel.app`
   - ⚠️ **HTTPS ile başlamalı, sonunda `/` olmamalı**

### 2. Admin App Kontrolü

Admin app'in çalıştığını doğrulayın:

1. Admin app URL'ini tarayıcıda açın
2. `/api/public/pages` endpoint'ini test edin:
   ```
   https://[admin-url]/api/public/pages
   ```
3. JSON response almalısınız (boş array bile olsa)

### 3. Build Log Kontrolü

Vercel Dashboard → Deployments → Son deployment → Build Logs

**Aranacaklar:**
- `[FATAL] NEXT_PUBLIC_ADMIN_API_URL is missing` → Environment variable eksik
- `[ADMIN API ERROR]` → Admin API'ye erişilemiyor
- `Failed to fetch` → Network hatası

### 4. Browser Console Kontrolü

Web app'i açın ve Browser Console'u açın (F12):

**Aranacaklar:**
- `NEXT_PUBLIC_ADMIN_API_URL is missing` → Environment variable eksik
- `Failed to fetch` → API çağrısı başarısız
- CORS hatası → Olmamalı (server-to-server)

## 🔧 Adım Adım Çözüm

### Adım 1: Environment Variables'ı Kontrol Et

```bash
# Vercel Dashboard'da kontrol et:
# Settings → Environment Variables

# Olması gerekenler:
NEXT_PUBLIC_ADMIN_API_URL=https://[admin-url].vercel.app
NEXT_PUBLIC_SITE_URL=https://[web-url].vercel.app
```

### Adım 2: Admin API'yi Test Et

Tarayıcıda şu URL'leri aç:

1. **Public Pages Endpoint:**
   ```
   https://[admin-url]/api/public/pages
   ```
   → JSON response almalısınız

2. **Public Services Endpoint:**
   ```
   https://[admin-url]/api/public/services
   ```
   → JSON response almalısınız

### Adım 3: Web App API'yi Test Et

Web app deploy edildikten sonra:

1. **Homepage API:**
   ```
   https://[web-url]/api/homepage
   ```
   → JSON response almalısınız (null değerler olabilir)

2. **Services API:**
   ```
   https://[web-url]/api/services
   ```
   → JSON array almalısınız

### Adım 4: Redeploy

Environment variable'ları ekledikten/güncelledikten sonra:

1. Vercel Dashboard → Deployments
2. Son deployment'a tıkla
3. "Redeploy" butonuna bas
4. "Use existing Build Cache" seçeneğini **KAPAT**
5. Redeploy et

## 🐛 Yaygın Hatalar

### Hata 1: "Server misconfigured: ADMIN API URL missing"

**Çözüm:**
- `NEXT_PUBLIC_ADMIN_API_URL` environment variable'ı eksik
- Vercel Dashboard'da ekleyin ve redeploy edin

### Hata 2: "Failed to fetch homepage content from admin API"

**Çözüm:**
- Admin app çalışmıyor olabilir
- `NEXT_PUBLIC_ADMIN_API_URL` yanlış olabilir
- Admin app'in public API endpoint'leri çalışmıyor olabilir

### Hata 3: Ana sayfa boş görünüyor

**Çözüm:**
- Admin panelinde `home-hero`, `home-featured-products`, `home-story` sayfaları oluşturulmuş ve `published` durumda olmalı
- Seed script'i çalıştırın: `cd apps/admin && npx tsx prisma/seed.ts`

### Hata 4: 404 NOT_FOUND (Vercel)

**Çözüm:**
- Build başarısız olmuş olabilir
- Build log'ları kontrol edin
- Environment variable'ları kontrol edin
- Root Directory `.` olmalı

## ✅ Doğrulama Checklist

- [ ] `NEXT_PUBLIC_ADMIN_API_URL` environment variable var ve doğru
- [ ] `NEXT_PUBLIC_SITE_URL` environment variable var ve doğru
- [ ] Admin app deploy edildi ve çalışıyor
- [ ] Admin app'in `/api/public/pages` endpoint'i çalışıyor
- [ ] Web app build başarılı
- [ ] Web app'in `/api/homepage` endpoint'i çalışıyor
- [ ] Ana sayfa (`/`) açılıyor
- [ ] Browser console'da hata yok

## 📞 Hala Çalışmıyorsa

1. Vercel Dashboard → Deployments → Son deployment → Build Logs
2. Tüm log'ları kopyala
3. Browser Console'daki hataları kopyala
4. Bu bilgilerle tekrar kontrol edin

