'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { 
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}

