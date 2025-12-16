# Kurulum Rehberi

Bu rehber, Premium Admin Panel Template'ini projenize entegre etmek için adım adım talimatlar içerir.

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Next.js 14+ projesi
- Prisma (database ORM)

## 🚀 Adım Adım Kurulum

### 1. Template Dosyalarını Kopyalayın

Template klasöründeki dosyaları projenize kopyalayın:

```bash
# Windows (PowerShell)
Copy-Item -Path "premium-admin-template\*" -Destination "your-project\" -Recurse -Force

# Mac/Linux
cp -r premium-admin-template/* your-project/
```

### 2. Bağımlılıkları Yükleyin

Proje klasöründe:

```bash
npm install
```

Gerekli paketler:
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-*`
- `framer-motion`
- `lucide-react`
- `bcryptjs`
- `date-fns`
- `clsx`, `tailwind-merge`
- `react-hook-form`, `@hookform/resolvers`, `zod`

### 3. Environment Variables

`.env.local` dosyası oluşturun:

```env
# Database
DATABASE_URL="file:./dev.db"

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# Optional: Production database
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### 4. Database Schema'yı Güncelleyin

`prisma/schema.prisma` dosyasını projenize uygun şekilde güncelleyin:

```prisma
// Template'teki admin modellerini ekleyin:
// - User
// - Media
// - Revision
// - Settings

// Kendi modellerinizi de ekleyin:
model Product {
  id        String   @id @default(cuid())
  name      String
  // ... diğer alanlar
}
```

### 5. Database'i Hazırlayın

```bash
# Prisma client generate
npm run db:generate

# Database push (development)
npm run db:push

# Veya migration oluştur (production)
npm run db:migrate
```

### 6. Admin Panel Konfigürasyonu

`admin.config.ts` dosyasını düzenleyin:

```typescript
export const adminConfig = {
  title: 'My Admin Panel',
  
  menuItems: [
    // Kendi menü öğelerinizi ekleyin
  ],
  
  dashboardStats: [
    // Dashboard istatistiklerinizi ekleyin
  ],
  
  entityTypes: [
    // Entity tiplerinizi ekleyin
  ],
};
```

### 7. Login Sayfasını Oluşturun

`app/admin/login/page.tsx` dosyası oluşturun (template'te örnek var):

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Kullanıcı adı veya şifre hatalı');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <Input
          label="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">Giriş Yap</Button>
      </form>
    </div>
  );
}
```

### 8. API Route'larını Oluşturun

Login API route'u oluşturun: `app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { createAdminSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  
  const isValid = await authenticate(username, password);
  
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  await createAdminSession(username);
  
  return NextResponse.json({ success: true });
}
```

Logout API route'u: `app/api/auth/logout/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/session';

export async function POST() {
  await deleteAdminSession();
  return NextResponse.json({ success: true });
}
```

### 9. Development Server'ı Başlatın

```bash
npm run dev
```

Admin panel'e erişin: `http://localhost:3000/admin`

## ✅ Kontrol Listesi

- [ ] Template dosyaları kopyalandı
- [ ] Bağımlılıklar yüklendi
- [ ] Environment variables ayarlandı
- [ ] Database schema güncellendi
- [ ] Database hazırlandı
- [ ] Admin config düzenlendi
- [ ] Login sayfası oluşturuldu
- [ ] API route'ları oluşturuldu
- [ ] Development server çalışıyor

## 🔧 Sorun Giderme

### Database bağlantı hatası
- `DATABASE_URL` environment variable'ının doğru olduğundan emin olun
- `npm run db:generate` komutunu çalıştırın

### Import hatası
- `tsconfig.json` dosyasında `paths` ayarını kontrol edin:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Authentication hatası
- `.env.local` dosyasında `ADMIN_USERNAME` ve `ADMIN_PASSWORD` ayarlandığından emin olun
- Login API route'unun doğru çalıştığından emin olun

## 📚 Sonraki Adımlar

- [TEMPLATE_CONFIG.md](./TEMPLATE_CONFIG.md) - Konfigürasyon detayları
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Özelleştirme rehberi

