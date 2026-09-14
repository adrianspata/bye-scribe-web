import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = '/Users/adrianspata/.gemini/antigravity-ide/brain/e7ddfbe6-e0dc-4fbd-afcc-47b35fdc5251/screenshots';

test.describe('Visual Screenshots for Design Phase 3 Calibration Report', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('Capture search and service guide variations across viewports and themes', async ({ page }) => {
    // 0. Homepage: Light & Dark
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-light-desktop.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-dark-desktop.png'), fullPage: true });

    // 1. Search: Empty query (Light / Dark)
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/sok');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-empty-light-desktop.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/sok');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-empty-dark-desktop.png'), fullPage: true });

    // 2. Search: No results (Light / Dark)
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/sok?q=HeltOkandTjanst');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-noresults-light.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/sok?q=HeltOkandTjanst');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-noresults-dark.png'), fullPage: true });

    // 3. Search: One result & Multiple results
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/sok?q=NordicPlay');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-single-hit-light.png'), fullPage: true });

    await page.goto('/sv/sok?q=demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-multiple-hits-light.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/sok?q=demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-multiple-hits-dark.png'), fullPage: true });

    // 4. Search: Mobile (375px light & dark)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/sok?q=Nordic');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-mobile-light-375.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/sok?q=Nordic');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'search-mobile-dark-375.png'), fullPage: true });

    // 5. Service Guide: Desktop Light & Dark (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-guide-light-desktop.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-guide-dark-desktop.png'), fullPage: true });

    // 6. Service Guide: Tablet (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-guide-tablet-light-768.png'), fullPage: true });

    // 7. Service Guide: Mobile 375px (Light & Dark) & 320px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-guide-mobile-light-375.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-guide-mobile-dark-375.png'), fullPage: true });

    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/nordicplay-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-guide-mobile-light-320.png'), fullPage: true });

    // 8. Service Guide: Long title / Fjällgym
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/tjanster/fjallgym-demo');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-guide-fjallgym-light.png'), fullPage: true });

    // 9. Service Guide: Official CTA Focus
    await page.goto('/sv/tjanster/nordicplay-demo');
    const ctaBtn = page.locator('a:has-text("Gå till NordicPlay Demo")');
    await ctaBtn.focus();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'service-guide-cta-focus.png'), fullPage: false });

    // 10. Savings Calculator: Desktop Light & Dark
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-light-desktop.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-dark-desktop.png'), fullPage: true });

    // 11. Savings Calculator: Mobile 375px & 320px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-mobile-light-375.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-mobile-dark-375.png'), fullPage: true });

    await page.setViewportSize({ width: 320, height: 568 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-mobile-light-320.png'), fullPage: true });

    // 12. Savings Calculator: Validation Error & Focus
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/besparingskalkylator');
    const costInput = page.locator('#cost-input');
    await costInput.fill('-99');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calc-error-light.png'), fullPage: true });

    // 13. Cancellation Message Generator: Desktop Light & Dark (Empty)
    await page.goto('/sv/verktyg/uppsagningsmeddelande');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-empty-light-desktop.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv/verktyg/uppsagningsmeddelande');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-empty-dark-desktop.png'), fullPage: true });

    // 14. Cancellation Message Generator: With Prefilled & Synthetic Test Data
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv/verktyg/uppsagningsmeddelande?service=Exempeltj%C3%A4nst+AB');
    await page.locator('#msg-name').fill('Test Testsson');
    await page.locator('#msg-customer-id').fill('TEST-12345');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-filled-light-desktop.png'), fullPage: true });

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-filled-dark-desktop.png'), fullPage: true });

    // 15. Cancellation Message Generator: Mobile 375px & 320px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-mobile-light-375.png'), fullPage: true });

    await page.setViewportSize({ width: 320, height: 568 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'msg-mobile-light-320.png'), fullPage: true });
  });
});
