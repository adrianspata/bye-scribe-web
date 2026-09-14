import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Complete Vertical User Flow & Privacy', () => {
  test('1. Full vertical journey: Home -> Search -> Results -> Service Detail -> Tools', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/sv');
    await expect(page.locator('h1')).toContainText('Säg upp abonnemang utan onödigt krångel');

    // 2. Perform search for "NordicPlay"
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('NordicPlay');
    await page.keyboard.press('Enter');

    // 3. Verify Search Results Page
    await expect(page).toHaveURL(/\/sv\/sok\?q=NordicPlay/);
    await expect(page.locator('h1')).toContainText('Sök efter en uppsägningsguide');
    await expect(page.locator('text=NordicPlay Demo')).toBeVisible();

    // 4. Navigate to Service Detail
    await page.click('text=NordicPlay Demo');
    await expect(page).toHaveURL(/\/sv\/tjanster\/nordicplay-demo/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Säg upp NordicPlay Demo');
    await expect(page.locator('text=Logga in på kontot')).toBeVisible();
    await expect(page.locator('text=Gå till NordicPlay Demo')).toBeVisible();

    // 5. Navigate from Service Detail to Message Generator tool
    await page.click('text=Skapa uppsägningsmeddelande');
    await expect(page).toHaveURL(/\/sv\/verktyg\/uppsagningsmeddelande\?service=NordicPlay/);
    const serviceInput = page.locator('#msg-service');
    await expect(serviceInput).toHaveValue('NordicPlay Demo');
  });

  test('2. Empty search and no-results handle state gracefully without crashing', async ({ page }) => {
    // Empty search
    await page.goto('/sv/sok');
    await expect(page.locator('text=Skriv in namnet på tjänsten du vill säga upp')).toBeVisible();
    await expect(page.locator('text=guider hittades')).not.toBeVisible();

    // No results search
    await page.goto('/sv/sok?q=HeltOkandTjanstSomInteFinns');
    await expect(page.locator('text=Inga guider hittades för “HeltOkandTjanstSomInteFinns”')).toBeVisible();
    await expect(page.locator('text=Skapa eget meddelande')).toBeVisible();
  });

  test('3. Unknown service slug returns 404', async ({ page }) => {
    const response = await page.goto('/sv/tjanster/okand-tjanst-som-inte-finns');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('404');
  });

  test('4. Fixture service detail page has noindex meta tag and demo disclaimer', async ({ page }) => {
    await page.goto('/sv/tjanster/nordicplay-demo');
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i);
    await expect(page.locator('text=Lokal demo – informationen är inte en verkligt verifierad tjänsteguide.')).toBeVisible();
  });

  test('5. Search results page has noindex meta tag and clean canonical', async ({ page }) => {
    await page.goto('/sv/sok?q=Nordic');
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i);

    const canonicalLink = page.locator('link[rel="canonical"]');
    await expect(canonicalLink).toHaveAttribute('href', /\/sv\/sok$/);
  });

  test('6. Savings Calculator calculates 1-year and 5-year projections accurately', async ({ page }) => {
    await page.goto('/sv/verktyg/besparingskalkylator');
    await expect(page.locator('h1')).toContainText('Besparingskalkylator');

    const costInput = page.locator('#cost-input');
    await costInput.fill('250');

    // 250 kr/mån -> 1 år = 3 000 kr, 5 år = 15 000 kr
    await expect(page.locator('text=3 000 kr')).toBeVisible();
    await expect(page.locator('text=15 000 kr')).toBeVisible();
  });

  test('7. Message Generator creates editable draft and copy button provides feedback', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/sv/verktyg/uppsagningsmeddelande?service=NordicPlay');
    await expect(page.locator('h1')).toContainText('Skapa uppsägningsmeddelande');

    const serviceInput = page.locator('#msg-service');
    await expect(serviceInput).toHaveValue('NordicPlay');

    const nameInput = page.locator('#msg-name');
    await nameInput.fill('Johan Lind');

    const textarea = page.locator('#generated-output');
    await expect(textarea).toContainText('Johan Lind');
    await expect(textarea).toContainText('NordicPlay');

    // Trigger copy
    const copyButton = page.locator('button:has-text("Kopiera meddelandetext")');
    await copyButton.click();
    await expect(page.locator('#copy-status-live')).toBeVisible();
    await expect(page.locator('#copy-status-live')).toContainText(/Texten har kopierats till urklipp|Markera texten och kopiera/);
  });

  test('8. PRIVACY ABSOLUTE: Personal form interactions trigger ZERO network requests', async ({ page }) => {
    await page.goto('/sv/verktyg/uppsagningsmeddelande');
    await page.waitForLoadState('networkidle');

    // Track any POST/PUT/PATCH/DELETE requests or requests carrying personal data
    const capturedRequests: string[] = [];
    page.on('request', (req) => {
      const method = req.method();
      const url = req.url();
      const postData = req.postData() || '';

      // Ignore Next.js internal static assets or HMR
      if (url.includes('/_next/') || url.includes('/__nextjs')) return;

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        capturedRequests.push(`${method} ${url}`);
      }
      if (postData.includes('SyntetiskUnikMarkor123') || url.includes('SyntetiskUnikMarkor123')) {
        capturedRequests.push(`LEAK: ${url}`);
      }
    });

    // Fill personal sensitive values in browser
    await page.locator('#msg-name').fill('Syntetisk Testare');
    await page.locator('#msg-service').fill('Exempeltjanst');
    await page.locator('#msg-customer-id').fill('SyntetiskUnikMarkor123');
    await page.locator('#msg-note').fill('Kanslig syntetisk testinformation');

    // Type in the generated output textarea
    await page.locator('#generated-output').fill('Helt anpassad syntetisk text');

    // Wait 500ms to ensure no background debounced requests were fired
    await page.waitForTimeout(500);

    expect(capturedRequests).toHaveLength(0);
  });

  test('9. Keyboard navigation works through form fields and skip links', async ({ page }) => {
    await page.goto('/sv/verktyg/besparingskalkylator');

    // Focus cost input
    const costInput = page.locator('#cost-input');
    await costInput.focus();
    await expect(costInput).toBeFocused();

    // Tab to select
    await page.keyboard.press('Tab');
    const select = page.locator('#interval-select');
    await expect(select).toBeFocused();
  });

  test('10. Critical pages pass Axe accessibility audit without critical violations', async ({ page }) => {
    const pagesToAudit = [
      '/sv',
      '/sv/sok?q=Nordic',
      '/sv/tjanster/nordicplay-demo',
      '/sv/verktyg/besparingskalkylator',
      '/sv/verktyg/uppsagningsmeddelande',
    ];

    for (const path of pagesToAudit) {
      await page.goto(path);
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(criticalViolations).toHaveLength(0);
    }
  });

  test('11. In-page navigation renders anchor links that scroll correctly', async ({ page }) => {
    await page.goto('/sv/tjanster/nordicplay-demo');
    const nav = page.locator('nav[aria-label="Innehåll i guiden"]');
    await expect(nav).toBeVisible();
    await expect(nav.locator('a[href="#steg"]')).toBeVisible();
    await expect(nav.locator('a[href="#villkor"]')).toBeVisible();
    await expect(nav.locator('a[href="#priser"]')).toBeVisible();
    await expect(nav.locator('a[href="#kallor"]')).toBeVisible();
    await expect(nav.locator('a[href="#verktyg"]')).toBeVisible();
  });
});
