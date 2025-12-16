/**
 * Wait for servers to be ready and run tests
 */

const http = require('http');

const ADMIN_URL = 'localhost';
const ADMIN_PORT = 3001;
const WEB_URL = 'localhost';
const WEB_PORT = 3000;

function checkServer(host, port) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: host,
      port: port,
      path: '/',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(true);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

async function waitForServer(name, host, port, maxWait = 60000) {
  console.log(`⏳ ${name} server bekleniyor (${host}:${port})...`);
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    if (await checkServer(host, port)) {
      console.log(`✅ ${name} server hazır!\n`);
      return true;
    }
    process.stdout.write('.');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n❌ ${name} server ${maxWait/1000} saniye içinde başlamadı`);
  return false;
}

function makeRequest(host, port, path, options = {}) {
  return new Promise((resolve) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const req = http.request({
      hostname: host,
      port: port,
      path: path,
      method: options.method || 'GET',
      headers: headers,
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        let jsonData;
        try {
          jsonData = JSON.parse(data);
        } catch {
          jsonData = data;
        }
        
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          data: jsonData,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        ok: false,
        status: 0,
        error: error.message,
        data: null
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        ok: false,
        status: 0,
        error: 'Request timeout',
        data: null
      });
    });
    
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 TEST SUITE - Server Bekleme Modu\n');
  
  // Wait for servers
  const adminReady = await waitForServer('Admin', ADMIN_URL, ADMIN_PORT);
  const webReady = await waitForServer('Web', WEB_URL, WEB_PORT);
  
  if (!adminReady || !webReady) {
    console.log('\n❌ Server\'lar hazır değil. Lütfen server\'ları başlatın:');
    console.log('   pnpm dev');
    console.log('\nVeya ayrı ayrı:');
    console.log('   pnpm dev:admin  (Admin panel)');
    console.log('   pnpm dev:web    (Web sitesi)');
    process.exit(1);
  }
  
  console.log('🚀 Testler başlatılıyor...\n');
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Login
  console.log('\n1️⃣  Login Testi');
  console.log('   Test: Geçerli kullanıcı adı/şifre ile login');
  const login = await makeRequest(ADMIN_URL, ADMIN_PORT, '/api/auth/login', {
    method: 'POST',
    body: { username: 'admin', password: 'admin123' }
  });
  
  if (login.ok && login.data && login.data.success) {
    console.log('   ✅ BAŞARILI: Login başarılı');
    passed++;
  } else {
    console.log(`   ❌ BAŞARISIZ: ${login.data?.error || login.error || `Status: ${login.status}`}`);
    failed++;
  }
  
  // Test 2: Protected API (should fail without auth)
  console.log('\n2️⃣  Protected API Testi');
  console.log('   Test: Auth olmadan admin API erişimi (401 bekleniyor)');
  const pagesNoAuth = await makeRequest(ADMIN_URL, ADMIN_PORT, '/api/admin/pages');
  if (pagesNoAuth.status === 401) {
    console.log('   ✅ BAŞARILI: 401 Unauthorized (beklenen)');
    passed++;
  } else {
    console.log(`   ❌ BAŞARISIZ: Beklenen 401, alınan ${pagesNoAuth.status}`);
    failed++;
  }
  
  // Test 3: Public API (no auth required)
  console.log('\n3️⃣  Public API Testi');
  console.log('   Test: Public pages API (auth gerektirmez)');
  const publicPages = await makeRequest(ADMIN_URL, ADMIN_PORT, '/api/public/pages');
  if (publicPages.ok && Array.isArray(publicPages.data)) {
    console.log(`   ✅ BAŞARILI: ${publicPages.data.length} sayfa bulundu`);
    passed++;
  } else {
    console.log(`   ❌ BAŞARISIZ: ${publicPages.status} - ${publicPages.data?.error || publicPages.error || 'Unknown'}`);
    failed++;
  }
  
  // Test 4: Web Pages API
  console.log('\n4️⃣  Web Pages API Testi');
  console.log('   Test: Web sitesi pages API');
  const webPages = await makeRequest(WEB_URL, WEB_PORT, '/api/pages');
  if (webPages.ok && Array.isArray(webPages.data)) {
    console.log(`   ✅ BAŞARILI: ${webPages.data.length} sayfa bulundu`);
    passed++;
  } else {
    console.log(`   ❌ BAŞARISIZ: ${webPages.status} - ${webPages.data?.error || webPages.error || 'Unknown'}`);
    failed++;
  }
  
  // Test 5: Health Check
  console.log('\n5️⃣  Health Check');
  console.log('   Test: Server durumu kontrolü');
  const adminHealth = await makeRequest(ADMIN_URL, ADMIN_PORT, '/');
  const webHealth = await makeRequest(WEB_URL, WEB_PORT, '/');
  
  const adminOk = adminHealth.status === 200 || adminHealth.status === 404;
  const webOk = webHealth.status === 200 || webHealth.status === 404;
  
  if (adminOk && webOk) {
    console.log(`   ✅ BAŞARILI: Her iki server çalışıyor`);
    passed++;
  } else {
    console.log(`   ❌ BAŞARISIZ: Admin: ${adminHealth.status}, Web: ${webHealth.status}`);
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SONUÇLARI');
  console.log('='.repeat(50));
  console.log(`✅ Başarılı: ${passed}`);
  console.log(`❌ Başarısız: ${failed}`);
  console.log(`📈 Toplam: ${passed + failed}`);
  console.log(`📊 Başarı Oranı: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));
  
  if (failed === 0) {
    console.log('\n🎉 TÜM TESTLER BAŞARILI!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Bazı testler başarısız. Lütfen yukarıdaki hataları kontrol edin.');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('\n❌ Test suite hatası:', error);
  process.exit(1);
});

