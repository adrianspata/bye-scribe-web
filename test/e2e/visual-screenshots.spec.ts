import { test } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = '/Users/adrianspata/.gemini/antigravity-ide/brain/08ee15e0-4d20-4db2-ae87-5e4ac4b760b3/screenshots';

test.describe('Visual Screenshots for Calibration Report', () => {
  test('Capture all required viewports and theme combinations', async ({ page }) => {
    // 1. Light Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-light-1440.png'), fullPage: true });

    // 2. Dark Desktop 1440px
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-dark-1440.png'), fullPage: true });

    // 3. Light Tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tablet-light-768.png'), fullPage: true });

    // 4. Dark Tablet 768px
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'tablet-dark-768.png'), fullPage: true });

    // 5. Light Mobile 375px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-light-375.png'), fullPage: true });

    // 6. Dark Mobile 375px
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-dark-375.png'), fullPage: true });

    // 7. Small Mobile 320px
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-light-320.png'), fullPage: true });

    // 8. Core Routes in Light & Dark
    const routes = [
      { name: 'search-results', url: '/sv/sok?q=Nordic' },
      { name: 'service-detail', url: '/sv/tjanster/nordicplay-demo' },
      { name: 'calculator', url: '/sv/verktyg/besparingskalkylator' },
      { name: 'message-generator', url: '/sv/verktyg/uppsagningsmeddelande' },
    ];

    await page.setViewportSize({ width: 1440, height: 900 });
    for (const r of routes) {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(r.url);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${r.name}-light.png`), fullPage: false });

      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(r.url);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${r.name}-dark.png`), fullPage: false });
    }
  });
});
