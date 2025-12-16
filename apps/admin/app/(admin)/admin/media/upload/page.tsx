'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '../../../components/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToastContext } from '../../../components/ToastProvider';
import { BreadcrumbNav } from '../../../components/BreadcrumbNav';
import { Icon } from '@/components/admin/Icon';
import { motion } from 'framer-motion';

export default function MediaUploadPage() {
  const router = useRouter();
  const { toast } = useToastContext();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [folder, setFolder] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Lütfen bir dosya seçin');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (alt) formData.append('alt', alt);
      if (caption) formData.append('caption', caption);
      if (tags) formData.append('tags', tags);
      if (folder) formData.append('folder', folder);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Medya başarıyla yüklendi!');
        router.push('/admin/media');
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.details || error.error || 'Yükleme başarısız');
      }
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast.error('Medya yüklenirken bir hata oluştu', { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNav
        items={[
          { label: 'Medya Kütüphanesi', href: '/admin/media' },
          { label: 'Yeni Yükle' },
        ]}
      />
      
      <AdminPageHeader
        title="Medya Yükle"
        description="Yeni görsel, video veya dosya yükleyin"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Dosya Seç</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosya
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {preview ? (
                      <motion.img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 rounded-lg mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    ) : (
                      <>
                        <Icon name="media" size={48} className="text-gray-400 mb-4" />
                        <span className="text-sm text-gray-600 mb-2">
                          Dosyayı buraya sürükleyin veya tıklayın
                        </span>
                      </>
                    )}
                    <Button type="button" variant="secondary" asChild>
                      <span>Dosya Seç</span>
                    </Button>
                  </label>
                </div>
                {file && (
                  <p className="text-sm text-gray-500 mt-2">
                    Seçilen: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Metin (SEO)
                </label>
                <Input
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Görsel için açıklayıcı metin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Görsel başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiketler (virgülle ayırın)
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="örnek, etiket, listesi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Klasör
                </label>
                <Input
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  placeholder="Klasör adı (opsiyonel)"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/media')}
          >
            İptal
          </Button>
          <Button type="submit" disabled={!file || uploading}>
            {uploading ? 'Yükleniyor...' : 'Yükle'}
          </Button>
        </div>
      </form>
    </div>
  );
}

