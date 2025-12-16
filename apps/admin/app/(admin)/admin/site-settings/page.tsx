'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useToastContext } from '../../components/ToastProvider';

export default function SiteSettingsPage() {
  const { toast } = useToastContext();
  const [settings, setSettings] = useState({
    siteName: 'Altınbaşak Pastanesi',
    siteDescription: 'Tekirdağ merkezli lüks patisserie',
    siteUrl: 'https://altinbasak.com',
    contactEmail: 'info@altinbasak.com',
    contactPhone: '+90 282 123 45 67',
    address: 'Tekirdağ Merkez',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.site) {
            setSettings(data.site);
          }
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to load settings:', errorData);
          toast.error('Ayarlar yüklenemedi', { 
            description: errorData.details || errorData.error || 'Bilinmeyen hata' 
          });
        }
      } catch (error: any) {
        console.error('Error loading settings:', error);
        toast.error('Ayarlar yüklenirken bir hata oluştu', { 
          description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: settings }),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Ayarlar başarıyla kaydedildi!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.details || errorData.error || 'Ayarlar kaydedilemedi');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Ayarlar kaydedilemedi', { 
        description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Site Ayarları"
        description="Genel site ayarlarını yönetin"
      />

      <Card>
        <CardHeader>
          <CardTitle>Genel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
            <Input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
            <Textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
            <Input
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              type="url"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İletişim Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <Input
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <Input
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
            <Textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </Button>
      </div>
    </div>
  );
}

