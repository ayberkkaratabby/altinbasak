# Vercel Install Command - Global pnpm Setup

## ⚠️ ÖNEMLİ: Vercel Dashboard'da Ayarlanacak

`vercel.json`'dan `installCommand` kaldırıldı. **Her iki projede de (Admin + Web) Vercel Dashboard'da manuel olarak ayarlanmalı:**

### Vercel Dashboard Ayarları

**Her iki proje için (Admin ve Web):**

1. Vercel Dashboard → Project Settings → Build & Development Settings
2. **Install Command** alanına şunu yazın:
   ```
   npm i -g pnpm@9.15.5 && pnpm -v && pnpm install
   ```

### Neden?

- Corepack Vercel'de güvenilir çalışmıyor
- Global pnpm kurulumu daha garantili
- `pnpm -v` ile versiyon kontrolü yapılıyor
- Lockfile uyumsuzluğu çözüldü (pnpm 9.15.5 ile regenerate edildi)

### Kontrol

Build log'da şunları görmelisiniz:
- ✅ `node v20.x` (veya v24.x - uyumlu)
- ✅ `pnpm 9.15.5`
- ✅ Lockfile ignore uyarısı OLMAMALI

### Yapılan Değişiklikler

1. ✅ `package.json`: `packageManager: "pnpm@9.15.5"`
2. ✅ `package.json`: `engines.node: "20.x"`
3. ✅ `vercel.json`: `installCommand` kaldırıldı (dashboard'da ayarlanacak)
4. ✅ `pnpm-lock.yaml`: pnpm 9.15.5 ile regenerate edildi

