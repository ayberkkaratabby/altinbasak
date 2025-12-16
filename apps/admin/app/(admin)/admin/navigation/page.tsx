'use client';

import { useState } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/admin/Icon';

export default function NavigationPage() {
  const [menuItems, setMenuItems] = useState([
    { id: '1', label: 'Ana Sayfa', href: '/', order: 1 },
    { id: '2', label: 'Hakkımızda', href: '/hikayemiz', order: 2 },
    { id: '3', label: 'Ürünler', href: '/urunler', order: 3 },
    { id: '4', label: 'Şubeler', href: '/subeler', order: 4 },
    { id: '5', label: 'İletişim', href: '/iletisim', order: 5 },
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Navigasyon"
        description="Ana menü ve navigasyon ayarlarını yönetin"
      />

      <Card>
        <CardHeader>
          <CardTitle>Menü Öğeleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <Icon name="drag" size={20} className="text-gray-400 cursor-move" />
                <Input
                  value={item.label}
                  onChange={(e) => {
                    const newItems = [...menuItems];
                    newItems[index].label = e.target.value;
                    setMenuItems(newItems);
                  }}
                  className="flex-1"
                />
                <Input
                  value={item.href}
                  onChange={(e) => {
                    const newItems = [...menuItems];
                    newItems[index].href = e.target.value;
                    setMenuItems(newItems);
                  }}
                  className="flex-1"
                  placeholder="/url"
                />
                <Button variant="ghost" size="sm">Sil</Button>
              </div>
            ))}
            <Button variant="secondary" className="w-full">Yeni Menü Öğesi Ekle</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

