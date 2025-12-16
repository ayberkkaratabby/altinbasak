# 🧪 KAPSAMLI TEST PLANI - Admin Panel & Web Sitesi

## 📋 TEST SENARYOLARI

### 1. AUTHENTICATION & SESSION YÖNETİMİ

#### 1.1 Login Testleri
- [ ] **TC-AUTH-001**: Geçerli kullanıcı adı ve şifre ile giriş
- [ ] **TC-AUTH-002**: Geçersiz kullanıcı adı
- [ ] **TC-AUTH-003**: Geçersiz şifre
- [ ] **TC-AUTH-004**: Boş kullanıcı adı/şifre
- [ ] **TC-AUTH-005**: Rate Limiting Testi
- [ ] **TC-AUTH-006**: Session Timeout
- [ ] **TC-AUTH-007**: Logout Testi
- [ ] **TC-AUTH-008**: Protected Route Erişimi

### 2. SAYFA YÖNETİMİ (Pages)

#### 2.1 Liste Görüntüleme
- [ ] **TC-PAGE-001**: Sayfa listesi yükleme
- [ ] **TC-PAGE-002**: Sayfa arama
- [ ] **TC-PAGE-003**: Sayfa filtreleme (Durum)
- [ ] **TC-PAGE-004**: Sayfa sıralama

#### 2.2 Yeni Sayfa Oluşturma
- [ ] **TC-PAGE-005**: Geçerli verilerle sayfa oluşturma
- [ ] **TC-PAGE-006**: Boş URL ile sayfa oluşturma
- [ ] **TC-PAGE-007**: Geçersiz karakterlerle URL
- [ ] **TC-PAGE-008**: Duplicate URL
- [ ] **TC-PAGE-009**: Çok uzun URL
- [ ] **TC-PAGE-010**: Özel karakterlerle URL
- [ ] **TC-PAGE-011**: XSS Injection Testi
- [ ] **TC-PAGE-012**: SQL Injection Testi

#### 2.3 Sayfa Düzenleme
- [ ] **TC-PAGE-013**: Mevcut sayfayı düzenleme
- [ ] **TC-PAGE-014**: Sayfa güncelleme
- [ ] **TC-PAGE-015**: Durum değiştirme
- [ ] **TC-PAGE-016**: Olmayan sayfa düzenleme

#### 2.4 Sayfa Silme
- [ ] **TC-PAGE-017**: Sayfa silme (onay ile)
- [ ] **TC-PAGE-018**: Sayfa silme (iptal)
- [ ] **TC-PAGE-019**: Yayında olan sayfayı silme

#### 2.5 Web Sitesi Entegrasyonu
- [ ] **TC-PAGE-020**: Yayınlanmış sayfa web sitesinde görünme
- [ ] **TC-PAGE-021**: Taslak sayfa web sitesinde görünmeme
- [ ] **TC-PAGE-022**: Sayfa içeriği doğru görüntüleme
- [ ] **TC-PAGE-023**: SEO metadata kontrolü

### 3. API ENDPOINT TESTLERİ

#### 3.1 Authentication Kontrolü
- [ ] **TC-API-001**: Login olmadan API erişimi
- [ ] **TC-API-002**: Geçerli session ile API erişimi

#### 3.2 CRUD API Testleri
- [ ] **TC-API-003**: GET /api/admin/pages
- [ ] **TC-API-004**: POST /api/admin/pages
- [ ] **TC-API-005**: PATCH /api/admin/pages/[id]
- [ ] **TC-API-006**: DELETE /api/admin/pages/[id]
- [ ] **TC-API-007**: GET /api/admin/pages/[id] (olmayan ID)
- [ ] **TC-API-008**: POST /api/admin/pages (eksik veri)

#### 3.3 Web Sitesi API Testleri
- [ ] **TC-API-009**: GET /api/pages
- [ ] **TC-API-010**: GET /api/pages/[slug]
- [ ] **TC-API-011**: GET /api/pages/[slug] (olmayan slug)

### 4. TEMA YÖNETİMİ

- [ ] **TC-THEME-001**: Renk değiştirme
- [ ] **TC-THEME-002**: Tema kaydetme
- [ ] **TC-THEME-003**: Hazır tema seçme
- [ ] **TC-THEME-004**: Varsayılana dönme
- [ ] **TC-THEME-005**: Web sitesi senkronizasyonu

### 5. UI/UX TESTLERİ

- [ ] **TC-UI-001**: Sidebar menü geçişleri
- [ ] **TC-UI-002**: Breadcrumb navigasyonu
- [ ] **TC-UI-003**: "Siteyi Görüntüle" butonu
- [ ] **TC-UI-004**: Responsive tasarım
- [ ] **TC-UI-005**: Loading states
- [ ] **TC-UI-006**: Toast bildirimleri

---

## 📊 TEST SONUÇLARI

Test sonuçları `TEST_RESULTS.md` dosyasında saklanacak.

