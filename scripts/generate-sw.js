const fs = require('fs');
const path = require('path');

// Generate service worker with dynamic cache name and asset paths
function generateServiceWorker() {
  const buildDir = path.join(__dirname, '../build');
  const assetManifestPath = path.join(buildDir, 'asset-manifest.json');
  const swTemplatePath = path.join(__dirname, '../public/sw-template.js');
  const swOutputPath = path.join(buildDir, 'sw.js');

  // Read asset manifest
  let assetManifest = {};
  try {
    const manifestData = fs.readFileSync(assetManifestPath, 'utf8');
    assetManifest = JSON.parse(manifestData);
  } catch (error) {
    console.error('Could not read asset manifest:', error);
    return;
  }

  // Generate cache name with timestamp
  const cacheVersion = Date.now();
  const cacheName = `seamantest-v${cacheVersion}`;

  // Extract assets to cache
  const assetsToCache = [
    '/',
    '/manifest.json'
  ];

  if (assetManifest.files) {
    if (assetManifest.files['main.js']) {
      assetsToCache.push(assetManifest.files['main.js']);
    }
    if (assetManifest.files['main.css']) {
      assetsToCache.push(assetManifest.files['main.css']);
    }
  }

  // Read service worker template
  let swTemplate;
  try {
    swTemplate = fs.readFileSync(swTemplatePath, 'utf8');
  } catch (error) {
    console.error('Could not read service worker template:', error);
    return;
  }

  // Replace placeholders in template
  const swContent = swTemplate
    .replace('__CACHE_NAME__', cacheName)
    .replace('__ASSETS_TO_CACHE__', JSON.stringify(assetsToCache, null, 2));

  // Write generated service worker
  try {
    fs.writeFileSync(swOutputPath, swContent);
    console.log(`✅ Service worker generated successfully:`);
    console.log(`   Cache name: ${cacheName}`);
    console.log(`   Assets to cache: ${assetsToCache.join(', ')}`);
  } catch (error) {
    console.error('Could not write service worker:', error);
  }
}

// Run if called directly
if (require.main === module) {
  generateServiceWorker();
}

module.exports = generateServiceWorker;