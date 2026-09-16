import { test, expect } from '@playwright/test';

test.describe('Locale Routing and Navigation', () => {
  test('redirects root "/" to "/en"', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    expect(page.url()).toMatch(/\/en$/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('serves "/en" successfully with 200 status and brand heading', async ({ page }) => {
    const response = await page.goto('/en');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Unsubscribe. Easier.');
  });

  test('unknown locale "/de" returns 404 without redirect loop', async ({ page }) => {
    const response = await page.goto('/de');
    expect(response?.status()).toBe(404);
  });

  test('nested unknown locale route "/de/test" returns 404', async ({ page }) => {
    const response = await page.goto('/de/test');
    expect(response?.status()).toBe(404);
  });

  test('unknown page under valid locale "/en/okand-sida" returns 404', async ({ page }) => {
    const response = await page.goto('/en/okand-sida');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('404');
  });

  test('skip-link is keyboard focusable and targets #main-content', async ({ page }) => {
    await page.goto('/en');

    // Tab into the page to focus the skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    // Trigger skip link
    await page.keyboard.press('Enter');

    // Verify target element #main-content exists
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });
});
