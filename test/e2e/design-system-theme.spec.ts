import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Design System: Pure System Theme, Navigation & Accessibility', () => {
  test('1. System theme activates light tokens by default under prefers-color-scheme: light', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');

    // Verify no theme selector is present in DOM
    const themeSelector = page.locator('div[role="radiogroup"][aria-label="Välj färgtema"]');
    await expect(themeSelector).toHaveCount(0);

    // Verify background color is light (#f8fafc -> rgb(248, 250, 252))
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(248, 250, 252)');

    // Verify nothing is written to localStorage
    const storageKeys = await page.evaluate(() => Object.keys(localStorage));
    expect(storageKeys).not.toContain('byescribe-theme');
    expect(storageKeys).not.toContain('cancelpath-theme');
  });

  test('2. System theme activates dark tokens under prefers-color-scheme: dark', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/sv');

    // Verify background color is dark (#090d16 -> rgb(9, 13, 22))
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(9, 13, 22)');

    // Verify nothing is written to localStorage
    const storageKeys = await page.evaluate(() => Object.keys(localStorage));
    expect(storageKeys).not.toContain('byescribe-theme');
    expect(storageKeys).not.toContain('cancelpath-theme');
  });

  test('3. Dynamic OS theme change takes effect immediately without reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/sv');

    let bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(248, 250, 252)');

    // Dynamically switch OS scheme to dark
    await page.emulateMedia({ colorScheme: 'dark' });
    bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(9, 13, 22)');

    // Dynamically switch back to light
    await page.emulateMedia({ colorScheme: 'light' });
    bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(248, 250, 252)');
  });

  test('4. Mobile navigation: Hamburger opens, traps/manages focus, closes on ESC, closes on link click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/sv');

    const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Open mobile menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const mobileNav = page.locator('#mobile-navigation');
    await expect(mobileNav).toBeVisible();

    // Verify first link receives focus
    const startLink = mobileNav.locator('a:has-text("Start")');
    await expect(startLink).toBeFocused();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(mobileNav).not.toBeVisible();
    await expect(menuButton).toBeFocused();

    // Open again and click a link
    await menuButton.click();
    await expect(mobileNav).toBeVisible();

    const calcLink = mobileNav.locator('a:has-text("Besparingskalkylator")');
    await calcLink.click();

    await expect(page).toHaveURL(/\/sv\/verktyg\/besparingskalkylator/);
    await expect(mobileNav).not.toBeVisible();
  });

  test('5. Automated Axe Accessibility Audit in both Light and Dark themes', async ({ page }) => {
    const pagesToAudit = [
      '/sv',
      '/sv/sok?q=Nordic',
      '/sv/tjanster/nordicplay-demo',
      '/sv/verktyg/besparingskalkylator',
      '/sv/verktyg/uppsagningsmeddelande',
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
      await page.goto('/sv');

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `Horizontal scroll overflow detected at ${vp.name}`).toBeLessThanOrEqual(clientWidth + 1);
    }
  });
});
