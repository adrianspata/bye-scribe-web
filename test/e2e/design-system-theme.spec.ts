import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Design System: Pure System Theme, Navigation & Accessibility', () => {
  test('1. System theme activates light tokens by default under prefers-color-scheme: light', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/en');

    // Verify no theme selector is present in DOM
    const themeSelector = page.locator('div[role="radiogroup"][aria-label="Välj färgtema"]');
    await expect(themeSelector).toHaveCount(0);

    // Verify background color is warm light (#fafaf9 -> rgb(250, 250, 249))
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(250, 250, 249)');

    // Verify nothing is written to localStorage
    const storageKeys = await page.evaluate(() => Object.keys(localStorage));
    expect(storageKeys).not.toContain('byescribe-theme');
    expect(storageKeys).not.toContain('cancelpath-theme');
  });

  test('2. System theme activates dark tokens under prefers-color-scheme: dark', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/en');

    // Verify background color is midnight dark (#0b0f17 -> rgb(11, 15, 23))
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(11, 15, 23)');

    // Verify nothing is written to localStorage
    const storageKeys = await page.evaluate(() => Object.keys(localStorage));
    expect(storageKeys).not.toContain('byescribe-theme');
    expect(storageKeys).not.toContain('cancelpath-theme');
  });

  test('3. Dynamic OS theme change takes effect immediately without reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/en');

    let bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(250, 250, 249)');

    // Dynamically switch OS scheme to dark
    await page.emulateMedia({ colorScheme: 'dark' });
    bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(11, 15, 23)');

    // Dynamically switch back to light
    await page.emulateMedia({ colorScheme: 'light' });
    bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(250, 250, 249)');
  });

  test('4. Mobile navigation: Hamburger opens, traps/manages focus, closes on ESC, closes on link click', async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');

    // 1. Verify brand wordmark navigates to home
    const brandLink = page.locator('header a[aria-label="ByeScribe"]');
    await expect(brandLink).toBeVisible();
    await expect(brandLink).toHaveAttribute('href', '/en');

    const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Open mobile menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const mobileNav = page.locator('#mobile-navigation');
    await expect(mobileNav).toBeVisible();

    // Verify first link ("Guides") receives focus
    const guidesLink = mobileNav.locator('a[href*="/sok"]');
    await expect(guidesLink).toBeVisible();
    await expect(guidesLink).toBeFocused();

    // Verify message generator link exists
    const msgLink = mobileNav.locator('a[href*="/verktyg/uppsagningsmeddelande"]');
    await expect(msgLink).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(mobileNav).not.toBeVisible();
    await expect(menuButton).toBeFocused();

    // Open again and click "Savings Calculator"
    await menuButton.click();
    await expect(mobileNav).toBeVisible();

    const calcLink = mobileNav.locator('a[href*="/verktyg/besparingskalkylator"]');
    await expect(calcLink).toBeVisible();
    await calcLink.click();

    await expect(page).toHaveURL(/\/en\/verktyg\/besparingskalkylator/);
    await expect(mobileNav).not.toBeVisible();
  });

  test('5. Automated Axe Accessibility Audit in both Light and Dark themes', async ({ page }) => {
    test.setTimeout(60000);
    const pagesToAudit = [
      '/en',
      '/en/sok?q=Nordic',
      '/en/tjanster/nordicplay-demo',
      '/en/verktyg/besparingskalkylator',
      '/en/verktyg/uppsagningsmeddelande',
    ];

    for (const path of pagesToAudit) {
      // 1. Audit in Light Mode
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(path);

      const lightScan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const lightCritical = lightScan.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(lightCritical, `Axe violations in Light on ${path}`).toHaveLength(0);

      // 2. Audit in Dark Mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(path);

      const darkScan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const darkCritical = darkScan.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(darkCritical, `Axe violations in Dark on ${path}`).toHaveLength(0);
    }
  });

  test('6. Responsive Layouts render without horizontal overflow across all key viewports', async ({ page }) => {
    test.setTimeout(60000);
    const viewports = [
      { width: 320, height: 568, name: '320px Small Mobile' },
      { width: 375, height: 667, name: '375px Standard Mobile' },
      { width: 430, height: 932, name: '430px Large Mobile' },
      { width: 768, height: 1024, name: '768px Tablet' },
      { width: 1024, height: 768, name: '1024px Small Desktop' },
      { width: 1280, height: 800, name: '1280px Medium Desktop' },
      { width: 1440, height: 900, name: '1440px Large Desktop' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/en');

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `Horizontal scroll overflow detected at ${vp.name}`).toBeLessThanOrEqual(clientWidth + 1);
    }
  });

  test('7. SignalField and SVG Grain are decorative, local, and respect reduced-motion', async ({ page }) => {
    await page.goto('/en');

    // Verify SignalField elements are present
    const signalFields = page.locator('[data-testid="signal-field"]');
    const count = await signalFields.count();
    expect(count).toBeGreaterThan(0);

    // Verify decorative layers inside SignalField are aria-hidden="true"
    const decorativeLayers = page.locator('[data-testid="signal-field"] [aria-hidden="true"]');
    expect(await decorativeLayers.count()).toBeGreaterThan(0);

    // Verify local SVG noise asset is loaded without 404 or external requests
    const noiseRes = await page.request.get('/textures/signal-noise.svg');
    expect(noiseRes.status()).toBe(200);
    const contentType = noiseRes.headers()['content-type'] || '';
    expect(contentType).toContain('image/svg+xml');

    // Verify reduced motion halts animation
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en');
    const animatedLayers = page.locator('.animate-ambient-signal');
    if (await animatedLayers.count() > 0) {
      const animationName = await animatedLayers.first().evaluate((el) => getComputedStyle(el).animationName);
      expect(animationName).toBe('none');
    }
  });

  test('8. Primary actions and search buttons render with high-contrast semantic tokens', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/en');

    const searchBtn = page.locator('button[type="submit"]:has-text("Find guide")');
    await expect(searchBtn).toBeVisible();
    const btnBg = await searchBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #0c1117 -> rgb(12, 17, 23)
    expect(btnBg).toBe('rgb(12, 17, 23)');

    const btnColor = await searchBtn.evaluate((el) => getComputedStyle(el).color);
    // #ffffff -> rgb(255, 255, 255)
    expect(btnColor).toBe('rgb(255, 255, 255)');
  });
});
