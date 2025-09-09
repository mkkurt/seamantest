#!/usr/bin/env node

/**
 * Verification script to test cache invalidation after deployment
 * Run this script to verify that the cache busting is working correctly
 */

const fs = require('fs');
const path = require('path');

function verifyBuild() {
  console.log('🔍 Verifying cache invalidation setup...\n');

  const buildDir = path.join(__dirname, '../build');
  
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // 1. Check asset manifest
  const manifestPath = path.join(buildDir, 'asset-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Asset manifest not found');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log('✅ Asset manifest found');
  
  // 2. Check for hashed filenames
  const mainJs = manifest.files['main.js'];
  const mainCss = manifest.files['main.css'];
  
  if (!mainJs || !mainJs.match(/main\.[a-f0-9]{8}\.js$/)) {
    console.error('❌ Main JS file does not have proper hash');
    process.exit(1);
  }
  
  if (!mainCss || !mainCss.match(/main\.[a-f0-9]{8}\.css$/)) {
    console.error('❌ Main CSS file does not have proper hash');
    process.exit(1);
  }
  
  console.log('✅ Asset files have proper hashes for cache busting');
  console.log(`   JS: ${mainJs}`);
  console.log(`   CSS: ${mainCss}`);

  // 3. Check service worker
  const swPath = path.join(buildDir, 'sw.js');
  if (!fs.existsSync(swPath)) {
    console.error('❌ Service worker not found');
    process.exit(1);
  }

  const swContent = fs.readFileSync(swPath, 'utf8');
  const cacheMatch = swContent.match(/const CACHE_NAME = '([^']+)'/);
  if (!cacheMatch || !cacheMatch[1].startsWith('seamantest-v')) {
    console.error('❌ Service worker does not have proper cache name');
    process.exit(1);
  }

  console.log('✅ Service worker has unique cache name:', cacheMatch[1]);

  // 4. Check that service worker references actual asset paths
  if (!swContent.includes(mainJs) || !swContent.includes(mainCss)) {
    console.error('❌ Service worker does not reference actual asset paths');
    process.exit(1);
  }

  console.log('✅ Service worker references correct asset paths');

  // 5. Check cache headers
  const headersPath = path.join(buildDir, '_headers');
  if (fs.existsSync(headersPath)) {
    const headersContent = fs.readFileSync(headersPath, 'utf8');
    if (headersContent.includes('max-age=31536000') && headersContent.includes('no-cache')) {
      console.log('✅ Cache headers configuration present');
    } else {
      console.warn('⚠️  Cache headers may need review');
    }
  } else {
    console.warn('⚠️  Cache headers file not found');
  }

  console.log('\n🎉 Cache invalidation setup verification completed successfully!');
  console.log('\n📋 Summary of implemented solutions:');
  console.log('   • Unique cache names based on build timestamp');
  console.log('   • Hashed asset filenames for browser cache busting');
  console.log('   • Service worker with dynamic asset path resolution');
  console.log('   • Automatic service worker updates and client reload');
  console.log('   • Cache headers for optimal caching strategy');
  console.log('\n💡 This should resolve the issue where users need hard refresh after deployment.');
  
  return true;
}

if (require.main === module) {
  verifyBuild();
}

module.exports = verifyBuild;