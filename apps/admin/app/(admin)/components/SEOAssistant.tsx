'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SEOAssistantProps {
  locale: 'tr' | 'en';
  title: string;
  seoTitle?: string;
  seoDesc?: string;
  slug: string;
  content?: string;
  focusKeyword?: string;
}

interface HeadingNode {
  level: number;
  text: string;
  position: number;
}

interface SEOAnalysis {
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  issues: Array<{ type: 'error' | 'warning' | 'info'; message: string; priority: 'high' | 'medium' | 'low' }>;
  suggestions: Array<{ type: 'tip' | 'best-practice'; message: string }>;
  headingStats: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    hierarchy: HeadingNode[];
    hierarchyValid: boolean;
    hierarchyIssues: string[];
  };
  keywordAnalysis: {
    density: number;
    inTitle: boolean;
    inMetaDesc: boolean;
    inSlug: boolean;
    inContent: boolean;
    inFirstParagraph: boolean;
    occurrences: number;
  };
  contentAnalysis: {
    wordCount: number;
    readingTime: number;
    readabilityScore: number;
    paragraphCount: number;
    linkCount: number;
    internalLinks: number;
    externalLinks: number;
  };
  imageAnalysis: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    optimized: number;
    issues: string[];
  };
  technicalSEO: {
    titleLength: number;
    titleOptimal: boolean;
    metaDescLength: number;
    metaDescOptimal: boolean;
    slugLength: number;
    slugOptimal: boolean;
    urlStructure: 'good' | 'needs-improvement';
  };
}

export function SEOAssistant({
  locale,
  title,
  seoTitle,
  seoDesc,
  slug,
  content,
  focusKeyword,
}: SEOAssistantProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'headings']));

  const analysis = useMemo((): SEOAnalysis => {
    const issues: Array<{ type: 'error' | 'warning' | 'info'; message: string; priority: 'high' | 'medium' | 'low' }> = [];
    const suggestions: Array<{ type: 'tip' | 'best-practice'; message: string }> = [];
    let score = 100;

    const keyword = focusKeyword?.toLowerCase().trim() || '';
    const titleText = (seoTitle || title).toLowerCase();
    const descText = (seoDesc || '').toLowerCase();
    const slugText = slug.toLowerCase();
    const contentText = (content || '').toLowerCase();

    // ============================================
    // 1. HEADING ANALYSIS (Gelişmiş)
    // ============================================
    let h1Count = 0, h2Count = 0, h3Count = 0, h4Count = 0, h5Count = 0, h6Count = 0;
    const headingHierarchy: HeadingNode[] = [];
    const hierarchyIssues: string[] = [];

    if (content) {
      try {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        
        if (parsedContent && parsedContent.type === 'doc' && parsedContent.content) {
          let position = 0;
          const extractHeadings = (nodes: any[], parentLevel: number = 0) => {
            nodes.forEach((node: any) => {
              if (node.type === 'heading') {
                const level = node.attrs?.level || 1;
                const text = extractTextFromNode(node);
                position++;

                // Count headings
                if (level === 1) h1Count++;
                else if (level === 2) h2Count++;
                else if (level === 3) h3Count++;
                else if (level === 4) h4Count++;
                else if (level === 5) h5Count++;
                else if (level === 6) h6Count++;

                headingHierarchy.push({ level, text, position });

                // Hierarchy validation
                if (parentLevel > 0 && level > parentLevel + 1) {
                  hierarchyIssues.push(
                    locale === 'tr' 
                      ? `H${parentLevel}'den sonra H${level} kullanılmış. H${parentLevel + 1} kullanılmalı.`
                      : `H${level} used after H${parentLevel}. Should use H${parentLevel + 1}.`
                  );
                }
              }
              if (node.content && Array.isArray(node.content)) {
                const currentLevel = node.type === 'heading' ? (node.attrs?.level || 1) : parentLevel;
                extractHeadings(node.content, currentLevel);
              }
            });
          };
          extractHeadings(parsedContent.content);
        } else {
          // HTML veya plain text fallback
          const htmlContent = typeof content === 'string' ? content : '';
          h1Count = (htmlContent.match(/<h1[^>]*>/gi) || []).length;
          h2Count = (htmlContent.match(/<h2[^>]*>/gi) || []).length;
          h3Count = (htmlContent.match(/<h3[^>]*>/gi) || []).length;
        }
      } catch (e) {
        // Parse hatası
        const htmlContent = typeof content === 'string' ? content : '';
        h1Count = (htmlContent.match(/<h1[^>]*>/gi) || []).length;
        h2Count = (htmlContent.match(/<h2[^>]*>/gi) || []).length;
        h3Count = (htmlContent.match(/<h3[^>]*>/gi) || []).length;
      }

      // H1 kontrolü
      if (h1Count === 0) {
        issues.push({
          type: 'error',
          message: locale === 'tr' ? 'En az bir H1 başlığı ekleyin. SEO için kritik!' : 'Add at least one H1 heading. Critical for SEO!',
          priority: 'high',
        });
        score -= 15;
      } else if (h1Count > 1) {
        issues.push({
          type: 'error',
          message: locale === 'tr' 
            ? `Çok fazla H1 başlığı var (${h1Count}). SEO için sadece 1 H1 kullanılmalı.` 
            : `Too many H1 headings (${h1Count}). Only 1 H1 should be used for SEO.`,
          priority: 'high',
        });
        score -= 15;
      } else {
        suggestions.push({
          type: 'best-practice',
          message: locale === 'tr' ? '✓ Mükemmel! Sayfada tam olarak 1 H1 başlığı var.' : '✓ Perfect! Page has exactly 1 H1 heading.',
        });
      }

      // H2/H3 kontrolü
      if (h2Count === 0 && h3Count === 0) {
        issues.push({
          type: 'warning',
          message: locale === 'tr' ? 'H2 veya H3 başlıkları ekleyin. İçeriği yapılandırmak için önemli.' : 'Add H2 or H3 headings. Important for content structure.',
          priority: 'medium',
        });
        score -= 5;
      }

      // Hiyerarşi kontrolü
      if (hierarchyIssues.length > 0) {
        hierarchyIssues.forEach(issue => {
          issues.push({
            type: 'warning',
            message: issue,
            priority: 'medium',
          });
          score -= 5;
        });
      }

      // Hiyerarşi önerileri
      if (h1Count === 1 && h2Count > 0 && hierarchyIssues.length === 0) {
        suggestions.push({
          type: 'best-practice',
          message: locale === 'tr' ? '✓ H etiketleri hiyerarşisi doğru (H1 → H2 → H3)' : '✓ Heading hierarchy is correct (H1 → H2 → H3)',
        });
      }
    }

    // ============================================
    // 2. KEYWORD ANALYSIS (Gelişmiş)
    // ============================================
    let keywordDensity = 0;
    let keywordOccurrences = 0;
    let keywordInFirstParagraph = false;

    if (keyword) {
      // Keyword occurrences in content
      const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      keywordOccurrences = (contentText.match(keywordRegex) || []).length;

      // Keyword density (percentage)
      const wordCount = contentText.split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount > 0) {
        keywordDensity = (keywordOccurrences / wordCount) * 100;
      }

      // Check first paragraph
      try {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        if (parsedContent && parsedContent.type === 'doc' && parsedContent.content) {
          const firstParagraph = findFirstParagraph(parsedContent.content);
          if (firstParagraph) {
            const firstParagraphText = extractTextFromNode(firstParagraph).toLowerCase();
            keywordInFirstParagraph = firstParagraphText.includes(keyword);
          }
        }
      } catch (e) {
        // Fallback
        const firstParagraphMatch = contentText.match(/<p[^>]*>([^<]+)/i);
        if (firstParagraphMatch) {
          keywordInFirstParagraph = firstParagraphMatch[1].toLowerCase().includes(keyword);
        }
      }

      // Title check
      if (!titleText.includes(keyword)) {
        issues.push({
          type: 'error',
          message: locale === 'tr' ? 'Odak anahtar kelime başlıkta yok. SEO için kritik!' : 'Focus keyword not in title. Critical for SEO!',
          priority: 'high',
        });
        score -= 15;
      } else {
        suggestions.push({
          type: 'best-practice',
          message: locale === 'tr' ? '✓ Odak anahtar kelime başlıkta var' : '✓ Focus keyword is in title',
        });
      }

      // Meta description check
      if (!descText.includes(keyword)) {
        issues.push({
          type: 'warning',
          message: locale === 'tr' ? 'Odak anahtar kelime meta açıklamasında yok' : 'Focus keyword not in meta description',
          priority: 'medium',
        });
        score -= 10;
      }

      // Slug check
      const keywordSlug = keyword.replace(/\s+/g, '-');
      if (!slugText.includes(keywordSlug)) {
        suggestions.push({
          type: 'tip',
          message: locale === 'tr' ? 'Odak anahtar kelimeyi URL adresine eklemeyi düşünün' : 'Consider including focus keyword in slug',
        });
        score -= 5;
      }

      // Content check
      if (keywordOccurrences === 0) {
        issues.push({
          type: 'error',
          message: locale === 'tr' ? 'Odak anahtar kelime içerikte hiç geçmiyor' : 'Focus keyword not found in content',
          priority: 'high',
        });
        score -= 20;
      } else if (keywordOccurrences < 3) {
        issues.push({
          type: 'warning',
          message: locale === 'tr' ? `Odak anahtar kelime içerikte sadece ${keywordOccurrences} kez geçiyor. Daha fazla kullanmayı düşünün.` : `Focus keyword appears only ${keywordOccurrences} times in content. Consider using it more.`,
          priority: 'medium',
        });
        score -= 5;
      }

      // Keyword density check
      if (keywordDensity < 0.5) {
        suggestions.push({
          type: 'tip',
          message: locale === 'tr' ? `Anahtar kelime yoğunluğu düşük (${keywordDensity.toFixed(2)}%). 0.5-2% arası ideal.` : `Keyword density is low (${keywordDensity.toFixed(2)}%). Ideal is 0.5-2%.`,
        });
      } else if (keywordDensity > 3) {
        issues.push({
          type: 'warning',
          message: locale === 'tr' ? `Anahtar kelime yoğunluğu çok yüksek (${keywordDensity.toFixed(2)}%). Keyword stuffing olabilir.` : `Keyword density is too high (${keywordDensity.toFixed(2)}%). May be keyword stuffing.`,
          priority: 'medium',
        });
        score -= 10;
      }

      // First paragraph check
      if (!keywordInFirstParagraph) {
        suggestions.push({
          type: 'tip',
          message: locale === 'tr' ? 'Odak anahtar kelimeyi ilk paragrafta kullanmayı düşünün' : 'Consider using focus keyword in first paragraph',
        });
      }
    }

    // ============================================
    // 3. CONTENT ANALYSIS
    // ============================================
    let wordCount = 0;
    let paragraphCount = 0;
    let linkCount = 0;
    let internalLinks = 0;
    let externalLinks = 0;

    if (content) {
      try {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        if (parsedContent && parsedContent.type === 'doc' && parsedContent.content) {
          const extractContent = (nodes: any[]) => {
            nodes.forEach((node: any) => {
              if (node.type === 'paragraph') {
                paragraphCount++;
                const text = extractTextFromNode(node);
                wordCount += text.split(/\s+/).filter(w => w.length > 0).length;
              }
              if (node.type === 'link') {
                linkCount++;
                const href = node.attrs?.href || '';
                // Check if external link (starts with http/https and doesn't include current domain)
                if (href.startsWith('http://') || href.startsWith('https://')) {
                  // Try to detect if it's external (simplified check)
                  if (typeof window !== 'undefined' && window.location) {
                    const currentHost = window.location.hostname;
                    if (!href.includes(currentHost)) {
                      externalLinks++;
                    } else {
                      internalLinks++;
                    }
                  } else {
                    // Server-side: assume external if starts with http
                    externalLinks++;
                  }
                } else {
                  // Relative link - internal
                  internalLinks++;
                }
              }
              if (node.content && Array.isArray(node.content)) {
                extractContent(node.content);
              }
            });
          };
          extractContent(parsedContent.content);
        } else {
          // HTML fallback
          const htmlContent = typeof content === 'string' ? content : '';
          wordCount = htmlContent.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
          paragraphCount = (htmlContent.match(/<p[^>]*>/gi) || []).length;
          linkCount = (htmlContent.match(/<a[^>]*>/gi) || []).length;
        }
      } catch (e) {
        const htmlContent = typeof content === 'string' ? content : '';
        wordCount = htmlContent.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
        paragraphCount = (htmlContent.match(/<p[^>]*>/gi) || []).length;
        linkCount = (htmlContent.match(/<a[^>]*>/gi) || []).length;
      }

      // Word count recommendations
      if (wordCount < 300) {
        issues.push({
          type: 'warning',
          message: locale === 'tr' ? `İçerik çok kısa (${wordCount} kelime). En az 300 kelime önerilir.` : `Content is too short (${wordCount} words). At least 300 words recommended.`,
          priority: 'medium',
        });
        score -= 10;
      } else if (wordCount >= 300 && wordCount < 1000) {
        suggestions.push({
          type: 'tip',
          message: locale === 'tr' ? `İçerik uzunluğu iyi (${wordCount} kelime). 1000+ kelime daha iyi olabilir.` : `Content length is good (${wordCount} words). 1000+ words would be better.`,
        });
      } else {
        suggestions.push({
          type: 'best-practice',
          message: locale === 'tr' ? `✓ Mükemmel içerik uzunluğu (${wordCount} kelime)` : `✓ Excellent content length (${wordCount} words)`,
        });
      }

      // Reading time
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

      // Readability (basit hesaplama)
      const avgWordsPerSentence = wordCount / Math.max(paragraphCount, 1);
      const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));

      // Link recommendations
      if (internalLinks === 0 && wordCount > 500) {
        suggestions.push({
          type: 'tip',
          message: locale === 'tr' ? 'İç linkler ekleyin. SEO için önemli.' : 'Add internal links. Important for SEO.',
        });
      }

      if (externalLinks > 0 && !externalLinks.toString().includes('rel="nofollow"')) {
        suggestions.push({
          type: 'tip',
          message: locale === 'tr' ? 'Dış linklere rel="nofollow" eklemeyi düşünün' : 'Consider adding rel="nofollow" to external links',
        });
      }
    }

    // ============================================
    // 4. IMAGE ANALYSIS
    // ============================================
    let imageCount = 0;
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;
    let optimizedImages = 0;
    const imageIssues: string[] = [];

    if (content) {
      try {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        if (parsedContent && parsedContent.type === 'doc' && parsedContent.content) {
          const extractImages = (nodes: any[]) => {
            nodes.forEach((node: any) => {
              if (node.type === 'image') {
                imageCount++;
                const alt = node.attrs?.alt || '';
                if (alt && alt.trim() !== '') {
                  imagesWithAlt++;
                  // Check if alt text is descriptive (more than 3 words)
                  if (alt.split(/\s+/).length >= 3) {
                    optimizedImages++;
                  } else {
                    imageIssues.push(
                      locale === 'tr' 
                        ? `Görsel alt metni çok kısa: "${alt.substring(0, 30)}..."` 
                        : `Image alt text too short: "${alt.substring(0, 30)}..."`
                    );
                  }
                } else {
                  imagesWithoutAlt++;
                }

                // Image optimization check
                const src = node.attrs?.src || '';
                if (src.includes('unsplash') && !src.includes('w=') && !src.includes('q=')) {
                  imageIssues.push(
                    locale === 'tr' 
                      ? 'Unsplash görseli optimize edilmemiş. Boyut parametreleri ekleyin (örn: ?w=1200&q=80)' 
                      : 'Unsplash image not optimized. Add size parameters (e.g., ?w=1200&q=80)'
                  );
                }
              }
              if (node.content && Array.isArray(node.content)) {
                extractImages(node.content);
              }
            });
          };
          extractImages(parsedContent.content);
        } else {
          // HTML fallback
          const htmlContent = typeof content === 'string' ? content : '';
          const imgMatches = htmlContent.match(/<img[^>]*>/gi) || [];
          imageCount = imgMatches.length;
          imgMatches.forEach((imgTag: string) => {
            const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
            if (altMatch && altMatch[1].trim() !== '') {
              imagesWithAlt++;
            } else {
              imagesWithoutAlt++;
            }
          });
        }

        if (imageCount > 0) {
          if (imagesWithoutAlt === imageCount) {
            issues.push({
              type: 'error',
              message: locale === 'tr' ? `Tüm görsellerde alt metin eksik (${imageCount} görsel). SEO için kritik!` : `All images missing alt text (${imageCount} images). Critical for SEO!`,
              priority: 'high',
            });
            score -= 15;
          } else if (imagesWithoutAlt > 0) {
            issues.push({
              type: 'warning',
              message: locale === 'tr' ? `${imagesWithoutAlt} görselde alt metin eksik` : `${imagesWithoutAlt} images missing alt text`,
              priority: 'medium',
            });
            score -= 10;
          } else {
            suggestions.push({
              type: 'best-practice',
              message: locale === 'tr' ? `✓ Tüm görsellerde alt metin var (${imageCount} görsel)` : `✓ All images have alt text (${imageCount} images)`,
            });
          }

          if (imageIssues.length > 0) {
            imageIssues.forEach(issue => {
              issues.push({
                type: 'info',
                message: issue,
                priority: 'low',
              });
            });
            score -= 5;
          }
        }
      } catch (e) {
        // Error handling
      }
    }

    // ============================================
    // 5. TECHNICAL SEO
    // ============================================
    const seoTitleLength = (seoTitle || title).length;
    const metaDescLength = seoDesc?.length || 0;
    const slugLength = slug.length;

    // Title length
    if (seoTitleLength < 30) {
      issues.push({
        type: 'error',
        message: locale === 'tr' ? `SEO başlığı çok kısa (${seoTitleLength} karakter). Önerilen: 50-60 karakter.` : `SEO title is too short (${seoTitleLength} characters). Recommended: 50-60 characters.`,
        priority: 'high',
      });
      score -= 10;
    } else if (seoTitleLength > 70) {
      issues.push({
        type: 'warning',
        message: locale === 'tr' ? `SEO başlığı çok uzun (${seoTitleLength} karakter). Önerilen: 50-60 karakter.` : `SEO title is too long (${seoTitleLength} characters). Recommended: 50-60 characters.`,
        priority: 'medium',
      });
      score -= 5;
    } else {
      suggestions.push({
        type: 'best-practice',
        message: locale === 'tr' ? `✓ SEO başlığı uzunluğu optimal (${seoTitleLength} karakter)` : `✓ SEO title length is optimal (${seoTitleLength} characters)`,
      });
    }

    // Meta description length
    if (metaDescLength === 0) {
      issues.push({
        type: 'error',
        message: locale === 'tr' ? 'Meta açıklaması eksik. SEO için kritik!' : 'Meta description is missing. Critical for SEO!',
        priority: 'high',
      });
      score -= 15;
    } else if (metaDescLength < 120) {
      issues.push({
        type: 'warning',
        message: locale === 'tr' ? `Meta açıklaması çok kısa (${metaDescLength} karakter). Önerilen: 120-160 karakter.` : `Meta description is too short (${metaDescLength} characters). Recommended: 120-160 characters.`,
        priority: 'medium',
      });
      score -= 5;
    } else if (metaDescLength > 160) {
      issues.push({
        type: 'warning',
        message: locale === 'tr' ? `Meta açıklaması çok uzun (${metaDescLength} karakter). Önerilen: 120-160 karakter.` : `Meta description is too long (${metaDescLength} characters). Recommended: 120-160 characters.`,
        priority: 'medium',
      });
      score -= 5;
    } else {
      suggestions.push({
        type: 'best-practice',
        message: locale === 'tr' ? `✓ Meta açıklaması uzunluğu optimal (${metaDescLength} karakter)` : `✓ Meta description length is optimal (${metaDescLength} characters)`,
      });
    }

    // Slug length
    if (slugLength > 50) {
      issues.push({
        type: 'warning',
        message: locale === 'tr' ? `URL adresi çok uzun (${slugLength} karakter). Kısa ve açıklayıcı tutun.` : `URL is too long (${slugLength} characters). Keep it short and descriptive.`,
        priority: 'low',
      });
      score -= 3;
    }

    // URL structure
    const urlStructure = slug.includes('_') || slug.includes('%') ? 'needs-improvement' : 'good';
    if (urlStructure === 'needs-improvement') {
      suggestions.push({
        type: 'tip',
        message: locale === 'tr' ? 'URL adresinde alt çizgi veya özel karakterler yerine tire (-) kullanın' : 'Use hyphens (-) instead of underscores or special characters in URL',
      });
    }

    // ============================================
    // FINAL SCORE CALCULATION
    // ============================================
    score = Math.max(0, Math.min(100, score));

    let status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    if (score >= 90) {
      status = 'excellent';
    } else if (score >= 75) {
      status = 'good';
    } else if (score >= 60) {
      status = 'needs-improvement';
    } else {
      status = 'poor';
    }

    return {
      score,
      status,
      issues,
      suggestions,
      headingStats: {
        h1: h1Count,
        h2: h2Count,
        h3: h3Count,
        h4: h4Count,
        h5: h5Count,
        h6: h6Count,
        hierarchy: headingHierarchy,
        hierarchyValid: hierarchyIssues.length === 0,
        hierarchyIssues,
      },
      keywordAnalysis: {
        density: keywordDensity,
        inTitle: keyword ? titleText.includes(keyword) : false,
        inMetaDesc: keyword ? descText.includes(keyword) : false,
        inSlug: keyword ? slugText.includes(keyword.replace(/\s+/g, '-')) : false,
        inContent: keywordOccurrences > 0,
        inFirstParagraph: keywordInFirstParagraph,
        occurrences: keywordOccurrences,
      },
      contentAnalysis: {
        wordCount,
        readingTime: Math.ceil(wordCount / 200),
        readabilityScore: Math.max(0, Math.min(100, 100 - (wordCount / Math.max(paragraphCount, 1) - 15) * 2)),
        paragraphCount,
        linkCount,
        internalLinks,
        externalLinks,
      },
      imageAnalysis: {
        total: imageCount,
        withAlt: imagesWithAlt,
        withoutAlt: imagesWithoutAlt,
        optimized: optimizedImages,
        issues: imageIssues,
      },
      technicalSEO: {
        titleLength: seoTitleLength,
        titleOptimal: seoTitleLength >= 50 && seoTitleLength <= 60,
        metaDescLength,
        metaDescOptimal: metaDescLength >= 120 && metaDescLength <= 160,
        slugLength,
        slugOptimal: slugLength <= 50,
        urlStructure,
      },
    };
  }, [locale, title, seoTitle, seoDesc, slug, content, focusKeyword]);

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

  const statusConfig = {
    excellent: { color: 'bg-green-100 text-green-800 border-green-200', label: locale === 'tr' ? 'MÜKEMMEL' : 'EXCELLENT', icon: '🌟' },
    good: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: locale === 'tr' ? 'İYİ' : 'GOOD', icon: '✓' },
    'needs-improvement': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: locale === 'tr' ? 'İYİLEŞTİRİLEBİLİR' : 'NEEDS IMPROVEMENT', icon: '⚠️' },
    poor: { color: 'bg-red-100 text-red-800 border-red-200', label: locale === 'tr' ? 'KÖTÜ' : 'POOR', icon: '❌' },
  };

  const config = statusConfig[analysis.status];

  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            {locale === 'tr' ? 'SEO Asistanı' : 'SEO Assistant'}
          </CardTitle>
          <div className={`px-4 py-2 rounded-lg border-2 font-bold text-sm ${config.color}`}>
            {analysis.score}/100 - {config.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Overview Section */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('overview')}
            className="w-full flex items-center justify-between text-left font-semibold text-lg mb-2 hover:text-accent transition-colors"
          >
            <span>{locale === 'tr' ? '📊 Genel Bakış' : '📊 Overview'}</span>
            <span>{expandedSections.has('overview') ? '▼' : '▶'}</span>
          </button>
          {expandedSections.has('overview') && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Kelime Sayısı' : 'Word Count'}</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.contentAnalysis.wordCount}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Okuma Süresi' : 'Reading Time'}</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.contentAnalysis.readingTime} {locale === 'tr' ? 'dk' : 'min'}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Görsel Sayısı' : 'Images'}</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.imageAnalysis.total}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Link Sayısı' : 'Links'}</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.contentAnalysis.linkCount}</div>
              </div>
            </div>
          )}
        </div>

        {/* Heading Analysis Section */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('headings')}
            className="w-full flex items-center justify-between text-left font-semibold text-lg mb-2 hover:text-accent transition-colors"
          >
            <span>{locale === 'tr' ? '📝 H Etiketleri Analizi' : '📝 Heading Analysis'}</span>
            <span>{expandedSections.has('headings') ? '▼' : '▶'}</span>
          </button>
          {expandedSections.has('headings') && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                <div className={`p-3 rounded-lg text-center ${analysis.headingStats.h1 === 1 ? 'bg-green-50 border-2 border-green-200' : analysis.headingStats.h1 === 0 ? 'bg-red-50 border-2 border-red-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                  <div className="text-xs font-medium text-gray-600 mb-1">H1</div>
                  <div className="text-2xl font-bold">{analysis.headingStats.h1}</div>
                </div>
                <div className={`p-3 rounded-lg text-center ${analysis.headingStats.h2 > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                  <div className="text-xs font-medium text-gray-600 mb-1">H2</div>
                  <div className="text-2xl font-bold">{analysis.headingStats.h2}</div>
                </div>
                <div className={`p-3 rounded-lg text-center ${analysis.headingStats.h3 > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                  <div className="text-xs font-medium text-gray-600 mb-1">H3</div>
                  <div className="text-2xl font-bold">{analysis.headingStats.h3}</div>
                </div>
                <div className="p-3 rounded-lg text-center bg-gray-50">
                  <div className="text-xs font-medium text-gray-600 mb-1">H4</div>
                  <div className="text-2xl font-bold">{analysis.headingStats.h4}</div>
                </div>
                <div className="p-3 rounded-lg text-center bg-gray-50">
                  <div className="text-xs font-medium text-gray-600 mb-1">H5</div>
                  <div className="text-2xl font-bold">{analysis.headingStats.h5}</div>
                </div>
                <div className="p-3 rounded-lg text-center bg-gray-50">
                  <div className="text-xs font-medium text-gray-600 mb-1">H6</div>
                  <div className="text-2xl font-bold">{analysis.headingStats.h6}</div>
                </div>
              </div>

              {analysis.headingStats.hierarchy.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-semibold text-gray-700 mb-2">{locale === 'tr' ? 'H Etiketleri Hiyerarşisi:' : 'Heading Hierarchy:'}</div>
                  <div className="space-y-1">
                    {analysis.headingStats.hierarchy.map((heading, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${heading.level === 1 ? 'bg-blue-100 text-blue-800' : heading.level === 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          H{heading.level}
                        </span>
                        <span className="text-gray-700 truncate">{heading.text.substring(0, 60)}{heading.text.length > 60 ? '...' : ''}</span>
                      </div>
                    ))}
                  </div>
                  {analysis.headingStats.hierarchyValid && (
                    <div className="mt-3 text-green-700 text-sm font-medium flex items-center gap-2">
                      <span>✓</span>
                      <span>{locale === 'tr' ? 'H etiketleri hiyerarşisi doğru' : 'Heading hierarchy is correct'}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keyword Analysis Section */}
        {focusKeyword && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('keyword')}
              className="w-full flex items-center justify-between text-left font-semibold text-lg mb-2 hover:text-accent transition-colors"
            >
              <span>{locale === 'tr' ? '🔑 Anahtar Kelime Analizi' : '🔑 Keyword Analysis'}</span>
              <span>{expandedSections.has('keyword') ? '▼' : '▶'}</span>
            </button>
            {expandedSections.has('keyword') && (
              <div className="mt-4 space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="text-sm font-semibold text-blue-900 mb-2">{locale === 'tr' ? 'Odak Anahtar Kelime:' : 'Focus Keyword:'}</div>
                  <div className="text-lg font-bold text-blue-800">{focusKeyword}</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg ${analysis.keywordAnalysis.inTitle ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Başlıkta' : 'In Title'}</div>
                    <div className="text-xl font-bold">{analysis.keywordAnalysis.inTitle ? '✓' : '✗'}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${analysis.keywordAnalysis.inMetaDesc ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Meta Açıklamada' : 'In Meta Desc'}</div>
                    <div className="text-xl font-bold">{analysis.keywordAnalysis.inMetaDesc ? '✓' : '✗'}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${analysis.keywordAnalysis.inSlug ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'URL\'de' : 'In URL'}</div>
                    <div className="text-xl font-bold">{analysis.keywordAnalysis.inSlug ? '✓' : '?'}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${analysis.keywordAnalysis.inContent ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'İçerikte' : 'In Content'}</div>
                    <div className="text-xl font-bold">{analysis.keywordAnalysis.occurrences}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Yoğunluk' : 'Density'}</div>
                    <div className="text-xl font-bold">{analysis.keywordAnalysis.density.toFixed(2)}%</div>
                  </div>
                  <div className={`p-3 rounded-lg ${analysis.keywordAnalysis.inFirstParagraph ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'İlk Paragrafta' : 'First Para'}</div>
                    <div className="text-xl font-bold">{analysis.keywordAnalysis.inFirstParagraph ? '✓' : '?'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical SEO Section */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('technical')}
            className="w-full flex items-center justify-between text-left font-semibold text-lg mb-2 hover:text-accent transition-colors"
          >
            <span>{locale === 'tr' ? '⚙️ Teknik SEO' : '⚙️ Technical SEO'}</span>
            <span>{expandedSections.has('technical') ? '▼' : '▶'}</span>
          </button>
          {expandedSections.has('technical') && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-4 rounded-lg border-2 ${analysis.technicalSEO.titleOptimal ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{locale === 'tr' ? 'SEO Başlığı' : 'SEO Title'}</div>
                  <div className="text-2xl font-bold text-gray-900">{analysis.technicalSEO.titleLength}</div>
                  <div className="text-xs text-gray-600 mt-1">{locale === 'tr' ? 'Önerilen: 50-60' : 'Recommended: 50-60'}</div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${analysis.technicalSEO.metaDescOptimal ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{locale === 'tr' ? 'Meta Açıklama' : 'Meta Description'}</div>
                  <div className="text-2xl font-bold text-gray-900">{analysis.technicalSEO.metaDescLength}</div>
                  <div className="text-xs text-gray-600 mt-1">{locale === 'tr' ? 'Önerilen: 120-160' : 'Recommended: 120-160'}</div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${analysis.technicalSEO.slugOptimal ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{locale === 'tr' ? 'URL Uzunluğu' : 'URL Length'}</div>
                  <div className="text-2xl font-bold text-gray-900">{analysis.technicalSEO.slugLength}</div>
                  <div className="text-xs text-gray-600 mt-1">{locale === 'tr' ? 'Önerilen: <50' : 'Recommended: <50'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Analysis Section */}
        {analysis.imageAnalysis.total > 0 && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('images')}
              className="w-full flex items-center justify-between text-left font-semibold text-lg mb-2 hover:text-accent transition-colors"
            >
              <span>{locale === 'tr' ? '🖼️ Görsel Analizi' : '🖼️ Image Analysis'}</span>
              <span>{expandedSections.has('images') ? '▼' : '▶'}</span>
            </button>
            {expandedSections.has('images') && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Toplam' : 'Total'}</div>
                    <div className="text-2xl font-bold text-gray-900">{analysis.imageAnalysis.total}</div>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${analysis.imageAnalysis.withAlt === analysis.imageAnalysis.total ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Alt Metin Var' : 'With Alt'}</div>
                    <div className="text-2xl font-bold">{analysis.imageAnalysis.withAlt}</div>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${analysis.imageAnalysis.withoutAlt === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Alt Metin Yok' : 'Without Alt'}</div>
                    <div className="text-2xl font-bold">{analysis.imageAnalysis.withoutAlt}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">{locale === 'tr' ? 'Optimize Edilmiş' : 'Optimized'}</div>
                    <div className="text-2xl font-bold">{analysis.imageAnalysis.optimized}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Issues Section */}
        {analysis.issues.length > 0 && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('issues')}
              className="w-full flex items-center justify-between text-left font-semibold text-lg mb-2 hover:text-accent transition-colors"
            >
              <span>{locale === 'tr' ? '⚠️ Sorunlar' : '⚠️ Issues'}</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
                {analysis.issues.length}
              </span>
            </button>
            {expandedSections.has('issues') && (
              <div className="mt-4 space-y-2">
                {analysis.issues
                  .sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                  })
                  .map((issue, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border-l-4 ${
                        issue.type === 'error'
                          ? 'bg-red-50 border-red-500 text-red-800'
                          : issue.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                          : 'bg-blue-50 border-blue-500 text-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold">
                          {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">
                            {issue.priority === 'high' ? '🔴 Yüksek Öncelik' : issue.priority === 'medium' ? '🟡 Orta Öncelik' : '🔵 Düşük Öncelik'}
                          </div>
                          <div className="text-sm">{issue.message}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Suggestions Section */}
        {analysis.suggestions.length > 0 && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('suggestions')}
              className="w-full flex items-center justify-between text-left font-semibold text-lg mb-2 hover:text-accent transition-colors"
            >
              <span>{locale === 'tr' ? '💡 Öneriler' : '💡 Suggestions'}</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold">
                {analysis.suggestions.length}
              </span>
            </button>
            {expandedSections.has('suggestions') && (
              <div className="mt-4 space-y-2">
                {analysis.suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border-l-4 ${
                      suggestion.type === 'best-practice'
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : 'bg-blue-50 border-blue-500 text-blue-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold">{suggestion.type === 'best-practice' ? '✓' : '💡'}</span>
                      <div className="text-sm">{suggestion.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEO Checklist */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>{locale === 'tr' ? 'SEO Kontrol Listesi' : 'SEO Checklist'}</span>
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className={analysis.headingStats.h1 === 1 ? 'text-green-600 font-bold' : 'text-red-600'}>
                {analysis.headingStats.h1 === 1 ? '✓' : '✗'}
              </span>
              <span>{locale === 'tr' ? 'Sayfada tam olarak 1 H1 başlığı var' : 'Page has exactly 1 H1 heading'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={analysis.headingStats.h2 > 0 ? 'text-green-600 font-bold' : 'text-yellow-600'}>
                {analysis.headingStats.h2 > 0 ? '✓' : '?'}
              </span>
              <span>{locale === 'tr' ? 'H2 başlıkları var' : 'Has H2 headings'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={analysis.technicalSEO.titleOptimal ? 'text-green-600 font-bold' : 'text-yellow-600'}>
                {analysis.technicalSEO.titleOptimal ? '✓' : '?'}
              </span>
              <span>{locale === 'tr' ? 'SEO başlığı optimal uzunlukta (50-60 karakter)' : 'SEO title is optimal length (50-60 characters)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={analysis.technicalSEO.metaDescOptimal ? 'text-green-600 font-bold' : 'text-yellow-600'}>
                {analysis.technicalSEO.metaDescOptimal ? '✓' : '?'}
              </span>
              <span>{locale === 'tr' ? 'Meta açıklama optimal uzunlukta (120-160 karakter)' : 'Meta description is optimal length (120-160 characters)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={analysis.imageAnalysis.withoutAlt === 0 ? 'text-green-600 font-bold' : 'text-red-600'}>
                {analysis.imageAnalysis.withoutAlt === 0 ? '✓' : '✗'}
              </span>
              <span>{locale === 'tr' ? 'Tüm görsellerde alt metin var' : 'All images have alt text'}</span>
            </div>
            {focusKeyword && (
              <>
                <div className="flex items-center gap-2">
                  <span className={analysis.keywordAnalysis.inTitle ? 'text-green-600 font-bold' : 'text-red-600'}>
                    {analysis.keywordAnalysis.inTitle ? '✓' : '✗'}
                  </span>
                  <span>{locale === 'tr' ? 'Odak anahtar kelime başlıkta' : 'Focus keyword in title'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={analysis.keywordAnalysis.inContent ? 'text-green-600 font-bold' : 'text-red-600'}>
                    {analysis.keywordAnalysis.inContent ? '✓' : '✗'}
                  </span>
                  <span>{locale === 'tr' ? 'Odak anahtar kelime içerikte' : 'Focus keyword in content'}</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <span className={analysis.contentAnalysis.wordCount >= 300 ? 'text-green-600 font-bold' : 'text-yellow-600'}>
                {analysis.contentAnalysis.wordCount >= 300 ? '✓' : '?'}
              </span>
              <span>{locale === 'tr' ? 'İçerik yeterince uzun (300+ kelime)' : 'Content is long enough (300+ words)'}</span>
            </div>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>{locale === 'tr' ? 'SEO İpuçları' : 'SEO Tips'}</span>
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{locale === 'tr' ? 'Başlıkta odak anahtar kelimeyi kullanın ve 50-60 karakter arasında tutun' : 'Use focus keyword in title and keep it 50-60 characters'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{locale === 'tr' ? 'Meta açıklaması 120-160 karakter arasında olmalı ve odak anahtar kelimeyi içermeli' : 'Meta description should be 120-160 characters and include focus keyword'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{locale === 'tr' ? 'Sayfada sadece 1 H1 başlığı kullanın, H2 ve H3 ile içeriği yapılandırın' : 'Use only 1 H1 heading per page, structure content with H2 and H3'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{locale === 'tr' ? 'Tüm görsellere açıklayıcı alt metin ekleyin (3+ kelime)' : 'Add descriptive alt text to all images (3+ words)'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{locale === 'tr' ? 'İçerik en az 300 kelime olmalı, 1000+ kelime daha iyi' : 'Content should be at least 300 words, 1000+ words is better'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{locale === 'tr' ? 'H etiketleri hiyerarşisini koruyun (H1 → H2 → H3)' : 'Maintain heading hierarchy (H1 → H2 → H3)'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{locale === 'tr' ? 'URL adresini kısa, açıklayıcı ve odak anahtar kelime içerecek şekilde tutun' : 'Keep URL short, descriptive, and include focus keyword'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{locale === 'tr' ? 'Anahtar kelime yoğunluğu 0.5-2% arasında olmalı (keyword stuffing yapmayın)' : 'Keyword density should be 0.5-2% (avoid keyword stuffing)'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
function extractTextFromNode(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child: any) => extractTextFromNode(child)).join('');
  }
  return '';
}

function findFirstParagraph(nodes: any[]): any {
  for (const node of nodes) {
    if (node.type === 'paragraph') {
      return node;
    }
    if (node.content && Array.isArray(node.content)) {
      const found = findFirstParagraph(node.content);
      if (found) return found;
    }
  }
  return null;
}
