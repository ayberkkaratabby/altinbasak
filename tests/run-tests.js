#!/usr/bin/env node

/**
 * Test Runner
 * Checks if servers are running and executes tests
 */

const { spawn } = require('child_process');
const http = require('http');

const ADMIN_URL = 'http://localhost:3001';
const WEB_URL = 'http://localhost:3000';

function checkServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 404);
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await checkServer(url)) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.stdout.write('.');
  }
  return false;
}

async function main() {
  console.log('🔍 Server kontrolü yapılıyor...\n');
  
  const adminRunning = await checkServer(ADMIN_URL);
  const webRunning = await checkServer(WEB_URL);
  
  if (!adminRunning) {
    console.log('⚠️  Admin server çalışmıyor. Başlatılıyor...');
    console.log('   Lütfen manuel olarak başlatın: cd apps/admin && pnpm dev');
    console.log('   Veya otomatik başlatma için: pnpm dev\n');
  } else {
    console.log('✅ Admin server çalışıyor');
  }
  
  if (!webRunning) {
    console.log('⚠️  Web server çalışmıyor. Başlatılıyor...');
    console.log('   Lütfen manuel olarak başlatın: cd apps/web && pnpm dev');
    console.log('   Veya otomatik başlatma için: pnpm dev\n');
  } else {
    console.log('✅ Web server çalışıyor');
  }
  
  if (!adminRunning || !webRunning) {
    console.log('\n⏳ Server\'ların başlamasını bekliyorum...');
    console.log('   (Maksimum 30 saniye)\n');
    
    const adminReady = adminRunning || await waitForServer(ADMIN_URL);
    const webReady = webRunning || await waitForServer(WEB_URL);
    
    if (!adminReady || !webReady) {
      console.log('\n❌ Server\'lar başlatılamadı. Lütfen manuel olarak başlatın.');
      process.exit(1);
    }
    
    console.log('\n✅ Server\'lar hazır!\n');
  }
  
  // Run tests
  console.log('🧪 Testler başlatılıyor...\n');
  const { runTests } = require('./api-tests');
  await runTests();
}

main().catch(console.error);

