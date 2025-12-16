/**
 * Simple HTTP Test using Node.js built-in http module
 */

const http = require('http');

const BASE_URL = 'localhost';
const BASE_PORT = 3001;
const WEB_URL = 'localhost';
const WEB_PORT = 3000;

function makeRequest(host, path, options = {}) {
  return new Promise((resolve) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const hostParts = host.split(':');
    const hostname = hostParts[0];
    const port = hostParts[1] || (hostname === 'localhost' ? 80 : 80);
    
    const req = http.request({
      hostname: hostname,
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
  console.log('🧪 BASIT TEST SUITE\n');
  console.log(`Admin: http://${BASE_URL}:${BASE_PORT}`);
  console.log(`Web: http://${WEB_URL}:${WEB_PORT}\n`);
  
  // Test 1: Login
  console.log('1. Login testi...');
  const login = await makeRequest(`${BASE_URL}:${BASE_PORT}`, '/api/auth/login', {
    method: 'POST',
    body: { username: 'admin', password: 'admin123' }
  });
  
  if (login.ok && login.data.success) {
    console.log('   ✅ Login başarılı');
  } else {
    console.log(`   ❌ Login başarısız: ${login.data?.error || login.status}`);
  }
  
  // Test 2: Pages API (without auth - should fail)
  console.log('\n2. Pages API (auth olmadan)...');
  const pagesNoAuth = await makeRequest(`${BASE_URL}:${BASE_PORT}`, '/api/admin/pages');
  if (pagesNoAuth.status === 401) {
    console.log('   ✅ 401 Unauthorized (beklenen)');
  } else {
    console.log(`   ❌ Beklenmeyen durum: ${pagesNoAuth.status}`);
  }
  
  // Test 3: Public Pages API (no auth required)
  console.log('\n3. Public Pages API (auth gerektirmez)...');
  const publicPages = await makeRequest(`${BASE_URL}:${BASE_PORT}`, '/api/public/pages');
  if (publicPages.ok) {
    console.log(`   ✅ Public pages API çalışıyor (${Array.isArray(publicPages.data) ? publicPages.data.length : 0} sayfa)`);
  } else {
    console.log(`   ❌ Public pages API hatası: ${publicPages.status} - ${publicPages.data?.error || publicPages.error || 'Unknown'}`);
  }
  
  // Test 4: Web Pages API
  console.log('\n4. Web Pages API...');
  const webPages = await makeRequest(`${WEB_URL}:${WEB_PORT}`, '/api/pages');
  if (webPages.ok) {
    console.log(`   ✅ Web pages API çalışıyor (${Array.isArray(webPages.data) ? webPages.data.length : 0} sayfa)`);
  } else {
    console.log(`   ❌ Web pages API hatası: ${webPages.status} - ${webPages.data?.error || 'Unknown'}`);
  }
  
  // Test 5: Health check
  console.log('\n5. Health check...');
  const adminHealth = await makeRequest(`${BASE_URL}:${BASE_PORT}`, '/');
  const webHealth = await makeRequest(`${WEB_URL}:${WEB_PORT}`, '/');
  
  console.log(`   Admin: ${adminHealth.status === 200 || adminHealth.status === 404 ? '✅' : '❌'} (${adminHealth.status})`);
  console.log(`   Web: ${webHealth.status === 200 || webHealth.status === 404 ? '✅' : '❌'} (${webHealth.status})`);
  
  console.log('\n✅ Testler tamamlandı!');
}

runTests().catch(console.error);

