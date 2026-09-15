import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = '/Users/adrianspata/.gemini/antigravity-ide/brain/a9581e29-a464-4b8d-be88-fd9b37209705/screenshots';

test.describe('Visual Screenshots for Design Phase 4.1 Calibration Report', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('Capture all key views across viewports and themes', async ({ page }) => {
    // ==========================================
    // 1. HOMEPAGE
    // ==========================================
    // Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-light-desktop-1440.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-dark-desktop-1440.png'), fullPage: true });

    // Tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-light-tablet-768.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-dark-tablet-768.png'), fullPage: true });

    // Mobile 375px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-light-mobile-375.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-dark-mobile-375.png'), fullPage: true });

    // Mobile 320px
    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-light-mobile-320.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-dark-mobile-320.png'), fullPage: true });

    // ==========================================
    // 2. SEARCH & RESULTS
    // ==========================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/sok');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-empty-light-desktop.png'), fullPage: true });

    await page.goto('/sv/sok?q=NordicPlay');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-results-light-desktop.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/sok?q=NordicPlay');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-results-dark-desktop.png'), fullPage: true });

    // ==========================================
    // 3. SERVICE DETAIL
    // ==========================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-detail-light-desktop-1440.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-detail-dark-desktop-1440.png'), fullPage: true });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-detail-light-tablet-768.png'), fullPage: true });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-detail-light-mobile-375.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-detail-dark-mobile-375.png'), fullPage: true });

    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-detail-light-mobile-320.png'), fullPage: true });

    // ==========================================
    // 4. SAVINGS CALCULATOR
    // ==========================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-light-desktop-1440.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-dark-desktop-1440.png'), fullPage: true });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-light-mobile-375.png'), fullPage: true });

    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-light-mobile-320.png'), fullPage: true });

    // ==========================================
    // 5. CANCELLATION MESSAGE GENERATOR
    // ==========================================
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/uppsagningsmeddelande?service=NordicPlay');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-light-desktop-1440.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/verktyg/uppsagningsmeddelande?service=NordicPlay');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-dark-desktop-1440.png'), fullPage: true });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/uppsagningsmeddelande?service=NordicPlay');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-light-mobile-375.png'), fullPage: true });

    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/uppsagningsmeddelande?service=NordicPlay');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-light-mobile-320.png'), fullPage: true });
  });
});
