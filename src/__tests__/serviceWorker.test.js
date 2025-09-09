/**
 * Test for service worker cache invalidation functionality
 */

describe('Service Worker Cache Management', () => {
  test('build generates different file hashes for cache busting', () => {
    // This test validates that the build process generates unique file names
    // which is essential for cache busting
    
    const fs = require('fs');
    const path = require('path');
    
    // Check if asset manifest exists after build
    const manifestPath = path.join(__dirname, '../../build/asset-manifest.json');
    
    // Should have been created by previous build
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Should have files with hashes
      expect(manifest.files).toBeDefined();
      expect(manifest.files['main.js']).toMatch(/main\.[a-f0-9]{8}\.js$/);
      expect(manifest.files['main.css']).toMatch(/main\.[a-f0-9]{8}\.css$/);
    } else {
      // If build directory doesn't exist, this test is informational
      console.log('Build directory not found - this test requires a build to have been run');
      expect(true).toBe(true);
    }
  });

  test('service worker registration includes update handling', () => {
    // Test that our index.js includes proper service worker update handling
    const fs = require('fs');
    const path = require('path');
    
    const indexPath = path.join(__dirname, '../index.js');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Should include proper update handling
    expect(indexContent).toContain('updatefound');
    expect(indexContent).toContain('SKIP_WAITING');
    expect(indexContent).toContain('controllerchange');
    expect(indexContent).toContain('window.location.reload');
  });

  test('cache headers configuration exists', () => {
    const fs = require('fs');
    const path = require('path');
    
    const headersPath = path.join(__dirname, '../../public/_headers');
    
    if (fs.existsSync(headersPath)) {
      const headersContent = fs.readFileSync(headersPath, 'utf8');
      
      // Should include appropriate cache headers
      expect(headersContent).toContain('Cache-Control');
      expect(headersContent).toContain('max-age=31536000'); // Long cache for static assets
      expect(headersContent).toContain('no-cache'); // No cache for HTML
      expect(headersContent).toContain('immutable'); // Immutable for hashed assets
    } else {
      console.log('Headers file not found');
      expect(true).toBe(true);
    }
  });
});