'use client';

import { useState } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';

export default function FooterPage() {
  const [footerText, setFooterText] = useState('© 2024 Altınbaşak Pastanesi. Tüm hakları saklıdır.');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Footer Ayarları"
        description="Footer içeriği ve sosyal medya bağlantılarını yönetin"
      />

      <Card>
        <CardHeader>
          <CardTitle>Footer Metni</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Footer metnini girin"
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sosyal Medya Bağlantıları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input
              type="url"
              value={socialLinks.facebook}
              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="url"
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input
              type="url"
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://twitter.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="url"
              value={socialLinks.linkedin}
              onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://linkedin.com/..."
            />
          </div>
          <Button>Kaydet</Button>
        </CardContent>
      </Card>
    </div>
  );
}

