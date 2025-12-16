'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SEOAssistant } from './SEOAssistant';
import { RichTextEditorWrapper } from '@/components/admin/rich-text/RichTextEditorWrapper';
import { Icon } from '@/components/admin/Icon';
import { ContentPreview } from './ContentPreview';
import { AutoSaveIndicator } from '@/components/admin/AutoSaveIndicator';
import { RevisionHistory } from '@/components/admin/RevisionHistory';
import { ContentScheduler } from '@/components/admin/ContentScheduler';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useKeyboardShortcuts, createShortcut } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';

export interface TranslationFormData {
  locale: 'tr' | 'en';
  title: string;
  description?: string;
  excerpt?: string;
  content?: string;
  seoTitle?: string;
  seoDesc?: string;
  canonical?: string;
}

export interface ContentFormProps {
  entityType: 'page' | 'project' | 'blog' | 'service';
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function EnhancedContentForm({ entityType, initialData, onSubmit, onCancel }: ContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'content', 'seo']));
  const [activeAdvancedTab, setActiveAdvancedTab] = useState<'scheduler' | 'revisions' | 'analytics'>('scheduler');
  
  const getDefaultTranslation = (locale: 'tr' | 'en') => ({
    locale,
    title: '',
    description: '',
    excerpt: '',
    content: '',
    challenge: '',
    insight: '',
    idea: '',
    execution: '',
    impact: '',
    behindScenes: '',
    seoTitle: '',
    seoDesc: '',
    canonical: '',
  });

  const getInitialTranslations = () => {
    if (!initialData?.translations || initialData.translations.length === 0) {
      return [getDefaultTranslation('tr'), getDefaultTranslation('en')];
    }

    const tr = initialData.translations.find((t: any) => t.locale === 'tr') || getDefaultTranslation('tr');
    const en = initialData.translations.find((t: any) => t.locale === 'en') || getDefaultTranslation('en');

    return [tr, en];
  };

  const initialFormData = {
    slug: initialData?.slug || '',
    status: initialData?.status || 'DRAFT',
    featured: initialData?.featured || false,
    publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : '',
    scheduledAt: initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().split('T')[0] : '',
    focusKeyword: initialData?.focusKeyword || '',
    translations: getInitialTranslations(),
  };

  // Undo/Redo system
  const {
    state: formData,
    setState: setFormData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo({
    initialValue: initialFormData,
    maxHistory: 50,
  });

  const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr');

  // Auto-save with real API integration
  const { status: autoSaveStatus, lastSaved, hasUnsavedChanges, save: manualSave } = useAutoSave({
    data: formData,
    onSave: async (data) => {
      // Save draft to localStorage
      const draftKey = `draft-${entityType}-${initialData?.id || 'new'}`;
      localStorage.setItem(draftKey, JSON.stringify(data));
      
      // If it's an existing item, also save to API as draft
      if (initialData?.id) {
        try {
          const response = await fetch(`/api/admin/${entityType === 'page' ? 'pages' : entityType === 'blog' ? 'blog' : entityType + 's'}/${initialData.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, status: 'DRAFT' }),
          });
          if (!response.ok) throw new Error('Auto-save failed');
        } catch (err) {
          // Silent fail for auto-save
          console.error('Auto-save error:', err);
        }
      }
    },
    debounceMs: 2000,
    enabled: true,
  });

  // Load draft on mount
  useEffect(() => {
    if (initialData?.id) return; // Don't load draft for existing items
    
    const draftKey = `draft-${entityType}-new`;
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
      } catch (e) {
        // Invalid draft, ignore
      }
    }
  }, [entityType, initialData?.id, setFormData]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      createShortcut('s', () => {
        if (!loading) {
          manualSave();
        }
      }, { ctrl: true, meta: true, description: 'Kaydet' }),
      createShortcut('z', () => {
        if (canUndo) undo();
      }, { ctrl: true, meta: true, description: 'Geri al' }),
      createShortcut('z', () => {
        if (canRedo) redo();
      }, { ctrl: true, meta: true, shift: true, description: 'İleri al' }),
    ],
    enabled: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTranslationChange = (locale: 'tr' | 'en', field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      translations: prev.translations.map((t: TranslationFormData) =>
        t.locale === locale ? { ...t, [field]: value } : t
      ),
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validation
      if (!formData.slug) {
        throw new Error('URL adresi (slug) gereklidir');
      }

      const trTranslation = formData.translations.find((t: TranslationFormData) => t.locale === 'tr');
      if (!trTranslation?.title) {
        throw new Error('Türkçe başlık gereklidir');
      }

      const submitData = {
        ...formData,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null,
      };

      await onSubmit(submitData);

      // Create revision after successful save
      if (initialData?.id) {
        try {
          await fetch('/api/admin/revisions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              entityType: entityType.charAt(0).toUpperCase() + entityType.slice(1),
              entityId: initialData.id,
              data: submitData,
            }),
          });
        } catch (err) {
          // Silent fail for revision creation
          console.error('Revision creation failed:', err);
        }
      }
      
      // Clear draft
      const draftKey = `draft-${entityType}-${initialData?.id || 'new'}`;
      localStorage.removeItem(draftKey);
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/${entityType === 'page' ? 'pages' : entityType === 'blog' ? 'blog' : entityType + 's'}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const currentTranslation = formData.translations.find((t: TranslationFormData) => t.locale === activeLocale) || formData.translations[0];

  const SectionHeader = ({ id, title, icon }: { id: string; title: string; icon: string }) => {
    const isExpanded = expandedSections.has(id);
    return (
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Icon name={icon as any} size={20} className="text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <Icon
          name={isExpanded ? 'chevronUp' : 'chevronDown'}
          size={20}
          className="text-gray-400 transition-transform"
        />
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auto-save indicator - Premium positioning */}
      <div className="fixed top-20 right-6 z-50">
        <AutoSaveIndicator 
          status={autoSaveStatus} 
          lastSaved={lastSaved}
        />
      </div>

      {/* Undo/Redo buttons - Floating */}
      {(canUndo || canRedo) && (
        <div className="fixed bottom-6 right-6 z-50 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="shadow-lg"
            title="Geri al (Cmd/Ctrl+Z)"
          >
            <Icon name="chevronUp" size={16} className="rotate-90" />
            Geri Al
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="shadow-lg"
            title="İleri al (Cmd/Ctrl+Shift+Z)"
          >
            İleri Al
            <Icon name="chevronDown" size={16} className="rotate-90" />
          </Button>
        </div>
      )}

      {/* Basic Info - Collapsible */}
      <Card className="border-0 shadow-lg">
        <SectionHeader id="basic" title="Temel Bilgiler" icon="pages" />
        <AnimatePresence>
          {expandedSections.has('basic') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 space-y-4">
                <Input
                  label="URL Adresi (Slug)"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  required
                  helperText="URL&apos;de kullanılacak adres (örn: hakkimizda)"
                  error={!formData.slug && formData.slug.length === 0 ? 'URL adresi gereklidir' : undefined}
                />
                
                <Select
                  label="Durum"
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  options={[
                    { value: 'DRAFT', label: 'Taslak' },
                    { value: 'IN_REVIEW', label: 'İncelemede' },
                    { value: 'PUBLISHED', label: 'Yayınlandı' },
                    { value: 'SCHEDULED', label: 'Zamanlanmış' },
                  ]}
                />

                {(entityType === 'project' || entityType === 'blog') && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleChange('featured', e.target.checked)}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black/20"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Öne Çıkan Olarak İşaretle
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Yayınlanma Tarihi"
                    type="date"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={(e) => handleChange('publishedAt', e.target.value)}
                  />

                  {formData.status === "SCHEDULED" && (
                    <Input
                      label="Zamanlanmış Tarih"
                      type="datetime-local"
                      name="scheduledAt"
                      value={formData.scheduledAt}
                      onChange={(e) => handleChange('scheduledAt', e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Content - Collapsible */}
      <Card className="border-0 shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader id="content" title="İçerik" icon="edit" />
            <div className="flex gap-2">
              <Button
                type="button"
                variant={activeLocale === 'tr' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveLocale('tr')}
              >
                TR
              </Button>
              <Button
                type="button"
                variant={activeLocale === 'en' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveLocale('en')}
              >
                EN
              </Button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {expandedSections.has('content') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 space-y-4">
                <Input
                  label="Başlık"
                  name="title"
                  value={currentTranslation.title}
                  onChange={(e) => handleTranslationChange(activeLocale, 'title', e.target.value)}
                  required={activeLocale === 'tr'}
                  error={activeLocale === 'tr' && !currentTranslation.title ? 'Türkçe başlık gereklidir' : undefined}
                />

                {(entityType === 'service' || entityType === 'blog') && (
                  <Textarea
                    label={entityType === 'blog' ? 'Özet' : 'Açıklama'}
                    name={entityType === 'blog' ? 'excerpt' : 'description'}
                    value={entityType === 'blog' ? currentTranslation.excerpt : currentTranslation.description}
                    onChange={(e) => handleTranslationChange(activeLocale, entityType === 'blog' ? 'excerpt' : 'description', e.target.value)}
                    rows={3}
                  />
                )}

                {(entityType === 'service' || entityType === 'blog') && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      İçerik
                    </label>
                    <RichTextEditorWrapper
                      content={currentTranslation.content || null}
                      onChange={(content) => handleTranslationChange(activeLocale, 'content', content)}
                      placeholder="İçeriğinizi yazmaya başlayın..."
                      locale={activeLocale}
                    />
                  </div>
                )}

                {entityType === 'project' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Zorluk
                      </label>
                      <RichTextEditorWrapper
                        content={currentTranslation.challenge || null}
                        onChange={(content) => handleTranslationChange(activeLocale, 'challenge', content)}
                        placeholder="Zorluğu açıklayın..."
                        locale={activeLocale}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        İçgörü
                      </label>
                      <RichTextEditorWrapper
                        content={currentTranslation.insight || null}
                        onChange={(content) => handleTranslationChange(activeLocale, 'insight', content)}
                        placeholder="İçgörülerinizi paylaşın..."
                        locale={activeLocale}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Fikir
                      </label>
                      <RichTextEditorWrapper
                        content={currentTranslation.idea || null}
                        onChange={(content) => handleTranslationChange(activeLocale, 'idea', content)}
                        placeholder="Fikri açıklayın..."
                        locale={activeLocale}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Uygulama
                      </label>
                      <RichTextEditorWrapper
                        content={currentTranslation.execution || null}
                        onChange={(content) => handleTranslationChange(activeLocale, 'execution', content)}
                        placeholder="Uygulamayı açıklayın..."
                        locale={activeLocale}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Etki
                      </label>
                      <RichTextEditorWrapper
                        content={currentTranslation.impact || null}
                        onChange={(content) => handleTranslationChange(activeLocale, 'impact', content)}
                        placeholder="Etkiyi açıklayın..."
                        locale={activeLocale}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Perde Arkası
                      </label>
                      <RichTextEditorWrapper
                        content={currentTranslation.behindScenes || null}
                        onChange={(content) => handleTranslationChange(activeLocale, 'behindScenes', content)}
                        placeholder="Perde arkasını açıklayın..."
                        locale={activeLocale}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* SEO Settings - Collapsible */}
      <Card className="border-0 shadow-lg">
        <SectionHeader id="seo" title="SEO Ayarları" icon="search" />
        <AnimatePresence>
          {expandedSections.has('seo') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 space-y-4">
                <Input
                  label="Odak Anahtar Kelime"
                  name="focusKeyword"
                  value={formData.focusKeyword}
                  onChange={(e) => handleChange('focusKeyword', e.target.value)}
                  helperText="Bu içerik için hedeflediğiniz ana anahtar kelime (örn: dijital pazarlama)"
                />
                <Input
                  label="SEO Başlığı"
                  name="seoTitle"
                  value={currentTranslation.seoTitle}
                  onChange={(e) => handleTranslationChange(activeLocale, 'seoTitle', e.target.value)}
                  helperText="Boş bırakılırsa başlık kullanılır"
                />
                <Textarea
                  label="SEO Açıklaması"
                  name="seoDesc"
                  value={currentTranslation.seoDesc}
                  onChange={(e) => handleTranslationChange(activeLocale, 'seoDesc', e.target.value)}
                  rows={3}
                  helperText="Önerilen: 120-160 karakter"
                />
                <Input
                  label="Canonical URL"
                  name="canonical"
                  value={currentTranslation.canonical}
                  onChange={(e) => handleTranslationChange(activeLocale, 'canonical', e.target.value)}
                />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* SEO Assistant */}
      <SEOAssistant
        locale={activeLocale}
        title={currentTranslation.title}
        seoTitle={currentTranslation.seoTitle}
        seoDesc={currentTranslation.seoDesc}
        slug={formData.slug}
        content={currentTranslation.content}
        focusKeyword={formData.focusKeyword}
      />

      {/* Advanced Features - Scheduler, Revisions, Analytics */}
      {initialData?.id && (
        <Card className="border-0 shadow-lg">
          <SectionHeader id="advanced" title="Gelişmiş Özellikler" icon="settings" />
          <AnimatePresence>
            {expandedSections.has('advanced') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                  {[
                    { id: 'scheduler' as const, label: 'Zamanlama', icon: 'calendar' },
                    { id: 'revisions' as const, label: 'Revizyonlar', icon: 'clock' },
                    { id: 'analytics' as const, label: 'Analitik', icon: 'dashboard' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAdvancedTab(tab.id)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        activeAdvancedTab === tab.id
                          ? "text-black"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name={tab.icon as any} size={18} />
                        <span>{tab.label}</span>
                      </div>
                      {activeAdvancedTab === tab.id && (
                        <motion.div
                          layoutId="advancedTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeAdvancedTab === 'scheduler' && (
                    <motion.div
                      key="scheduler"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <ContentScheduler
                        scheduledAt={formData.scheduledAt}
                        publishedAt={formData.publishedAt}
                        status={formData.status}
                        onSchedule={async (date) => {
                          handleChange('scheduledAt', date);
                          handleChange('status', 'SCHEDULED');
                        }}
                        onPublish={async () => {
                          handleChange('status', 'PUBLISHED');
                          handleChange('publishedAt', new Date().toISOString().split('T')[0]);
                        }}
                        onUnschedule={async () => {
                          handleChange('scheduledAt', '');
                          handleChange('status', 'DRAFT');
                        }}
                      />
                    </motion.div>
                  )}

                  {activeAdvancedTab === 'revisions' && initialData?.id && (
                    <motion.div
                      key="revisions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <RevisionHistory
                        entityType={entityType.charAt(0).toUpperCase() + entityType.slice(1) as any}
                        entityId={initialData.id}
                        onRestore={async (revision) => {
                          const revisionData = typeof revision.data === 'string'
                            ? JSON.parse(revision.data)
                            : revision.data;
                          // Restore form data from revision
                          setFormData(revisionData);
                        }}
                      />
                    </motion.div>
                  )}

                  {activeAdvancedTab === 'analytics' && initialData?.id && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AnalyticsDashboard
                        entityType={entityType.charAt(0).toUpperCase() + entityType.slice(1) as any}
                        entityId={initialData.id}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </motion.div>
          )}
          </AnimatePresence>
        </Card>
      )}

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Icon name="alert" size={20} />
            <p className="font-medium">{error}</p>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Icon name="check" size={20} />
            <p className="font-medium">Başarıyla kaydedildi! Yönlendiriliyor...</p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div>
          {formData.slug && currentTranslation.title && (
            <ContentPreview
              entityType={entityType}
              slug={formData.slug}
              locale={activeLocale}
              title={currentTranslation.title}
              content={currentTranslation.content}
            />
          )}
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            İptal
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>
    </form>
  );
}

