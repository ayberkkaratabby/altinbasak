'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}

