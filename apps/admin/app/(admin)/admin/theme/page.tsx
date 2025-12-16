'use client';

import { useState, useEffect } from 'react';
import { AdminPageHeader } from '../../components/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToastContext } from '../../components/ToastProvider';
import { Icon } from '@/components/admin/Icon';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textMuted: string;
}

export default function ThemePage() {
  const { toast } = useToastContext();
  const [colors, setColors] = useState<ThemeColors>({
    primary: '#000000',
    secondary: '#1a1a1a',
    accent: '#D4AF37',
    background: '#ffffff',
    text: '#000000',
    textMuted: '#666666',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load theme from API
    const loadTheme = async () => {
      try {
        const response = await fetch('/api/admin/theme', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setColors(data.colors || colors);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to load theme:', errorData);
          toast.error('Tema yüklenemedi', { 
            description: errorData.details || errorData.error || 'Bilinmeyen hata' 
          });
        }
      } catch (error: any) {
        console.error('Error loading theme:', error);
        toast.error('Tema yüklenirken bir hata oluştu', { 
          description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
    // Apply preview immediately
    applyPreview({ ...colors, [key]: value });
  };

  const applyPreview = (newColors: ThemeColors) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', newColors.primary);
    root.style.setProperty('--color-secondary', newColors.secondary);
    root.style.setProperty('--color-accent', newColors.accent);
    root.style.setProperty('--color-background', newColors.background);
    root.style.setProperty('--color-text', newColors.text);
    root.style.setProperty('--color-text-muted', newColors.textMuted);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors }),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Tema ayarları kaydedildi!', {
          description: 'Değişiklikler canlı sitede görünecek.',
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.details || errorData.error || 'Kayıt başarısız');
      }
    } catch (error: any) {
      toast.error('Tema ayarları kaydedilemedi', {
        description: error.message || 'Network hatası veya sunucuya ulaşılamıyor.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultColors: ThemeColors = {
      primary: '#000000',
      secondary: '#1a1a1a',
      accent: '#D4AF37',
      background: '#ffffff',
      text: '#000000',
      textMuted: '#666666',
    };
    setColors(defaultColors);
    applyPreview(defaultColors);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Tema & Renkler" description="Site renk paletini yönetin" />
        <div className="text-center py-12">Yükleniyor...</div>
      </div>
    );
  }

  const colorFields: Array<{ key: keyof ThemeColors; label: string; description: string }> = [
    { key: 'primary', label: 'Ana Renk', description: 'Butonlar, linkler ve vurgular için' },
    { key: 'secondary', label: 'İkincil Renk', description: 'Arka planlar ve ikincil elementler için' },
    { key: 'accent', label: 'Vurgu Rengi', description: 'Özel vurgular ve highlight için' },
    { key: 'background', label: 'Arka Plan', description: 'Sayfa arka plan rengi' },
    { key: 'text', label: 'Metin Rengi', description: 'Ana metin rengi' },
    { key: 'textMuted', label: 'Soluk Metin', description: 'İkincil metin rengi' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tema & Renkler"
        description="Site renk paletini yönetin ve canlı önizleme yapın"
      />

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Canlı Önizleme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="p-6 rounded-lg border-2 border-dashed"
              style={{ backgroundColor: colors.background }}
            >
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                Örnek Başlık
              </h3>
              <p
                className="mb-4"
                style={{ color: colors.textMuted }}
              >
                Bu bir örnek metin paragrafıdır. Renk değişikliklerini burada görebilirsiniz.
              </p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded font-medium transition-colors"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  Ana Buton
                </button>
                <button
                  className="px-4 py-2 rounded font-medium border-2 transition-colors"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    backgroundColor: 'transparent',
                  }}
                >
                  İkincil Buton
                </button>
                <div
                  className="px-4 py-2 rounded font-medium"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.background,
                  }}
                >
                  Vurgu
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Picker */}
      <Card>
        <CardHeader>
          <CardTitle>Renk Paleti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {colorFields.map((field) => (
            <div key={field.key}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: colors[field.key] }}
                  />
                  <Input
                    type="color"
                    value={colors[field.key]}
                    onChange={(e) => handleColorChange(field.key, e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={colors[field.key]}
                    onChange={(e) => handleColorChange(field.key, e.target.value)}
                    className="w-32 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preset Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Hazır Temalar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Klasik Siyah',
                colors: {
                  primary: '#000000',
                  secondary: '#1a1a1a',
                  accent: '#D4AF37',
                  background: '#ffffff',
                  text: '#000000',
                  textMuted: '#666666',
                },
              },
              {
                name: 'Sıcak Kahve',
                colors: {
                  primary: '#8B4513',
                  secondary: '#A0522D',
                  accent: '#D2691E',
                  background: '#FFF8DC',
                  text: '#3E2723',
                  textMuted: '#6D4C41',
                },
              },
              {
                name: 'Elegant Gold',
                colors: {
                  primary: '#1a1a1a',
                  secondary: '#2d2d2d',
                  accent: '#D4AF37',
                  background: '#fafafa',
                  text: '#1a1a1a',
                  textMuted: '#666666',
                },
              },
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setColors(preset.colors);
                  applyPreview(preset.colors);
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
              >
                <div className="flex gap-2 mb-2">
                  {Object.values(preset.colors).slice(0, 4).map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="font-medium text-sm">{preset.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={handleReset}>
          <Icon name="refresh" size={16} className="mr-2" />
          Varsayılana Dön
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
    </div>
  );
}

