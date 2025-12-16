'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { Icon } from '@/components/admin/Icon';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: number;
  uploadedAt: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('/api/admin/media', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setMedia(data);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to fetch media:', errorData);
        }
      } catch (error: any) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Medya Kütüphanesi"
        description="Görsel, video ve dosyalarınızı yönetin"
        action={{
          label: 'Yeni Yükle',
          href: '/admin/media/upload',
        }}
      />

      {media.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icon name="media" size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz medya yüklenmemiş</h3>
            <p className="text-gray-500 mb-6">İlk medya dosyanızı yükleyerek başlayın</p>
            <Link href="/admin/media/upload">
              <Button>Dosya Yükle</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <Card key={item.id} hover className="overflow-hidden">
              <CardContent className="p-0">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <Icon name={item.type === 'video' ? 'media' : 'file'} size={32} className="text-gray-400" />
                  </div>
                )}
                <div className="p-3">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatFileSize(item.size)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

