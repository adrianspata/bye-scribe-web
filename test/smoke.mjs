import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = 3055;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchUrl(path, options = {}, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      return reject(new Error('Too many redirects'));
    }
    const url = new URL(path, BASE_URL);
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (
            options.followRedirects &&
            (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) &&
            res.headers.location
          ) {
            const redirectUrl = new URL(res.headers.location, url).pathname;
            return resolve(fetchUrl(redirectUrl, options, redirectCount + 1));
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runSmokeTests() {
  console.log('🚀 Starting Next.js production server for smoke testing on port', PORT);
  const server = spawn('pnpm', ['next', 'start', '-p', String(PORT)], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(PORT),
    },
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => process.stdout.write(d));
  server.stderr.on('data', (d) => process.stderr.write(d));

  let isReady = false;
  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetchUrl('/sv');
      if (res.status === 200) {
        isReady = true;
        break;
      }
    } catch {
      // Waiting for server to bind
    }
  }

  if (!isReady) {
    server.kill('SIGTERM');
    console.error('❌ Server failed to start within 15 seconds');
    process.exit(1);
  }

  console.log('✅ Server is ready. Running smoke assertions...\n');
  const errors = [];

  try {
    // 1. Root redirect
    const rootRes = await fetchUrl('/');
    if (rootRes.status !== 307 && rootRes.status !== 308) {
      errors.push(`Expected root / to redirect with 307/308, got ${rootRes.status}`);
    } else {
      console.log('✓ 1. / redirects to /sv successfully');
    }

    // 2. /sv homepage & security headers
    const homeRes = await fetchUrl('/sv');
    if (homeRes.status !== 200) {
      errors.push(`Expected /sv to return 200, got ${homeRes.status}`);
    } else {
      console.log('✓ 2. /sv returns 200');
    }
    if (homeRes.headers['x-content-type-options'] !== 'nosniff') {
      errors.push('Missing X-Content-Type-Options: nosniff header');
    } else {
      console.log('✓ 3. Security header X-Content-Type-Options is present');
    }
    if (!homeRes.body.includes('ByeScribe') || !homeRes.body.includes('The easier way to unsubscribe.')) {
      errors.push('Expected /sv HTML to contain brand name "ByeScribe" and tagline');
    } else {
      console.log('✓ 4. /sv HTML contains canonical ByeScribe brand name and tagline');
    }

    // 3. /robots.txt
    const robotsRes = await fetchUrl('/robots.txt');
    if (robotsRes.status !== 200) {
      errors.push(`Expected /robots.txt to return 200, got ${robotsRes.status}`);
    } else {
      console.log('✓ 5. /robots.txt returns 200');
    }
    if (robotsRes.body.includes('Disallow: /sv/sok')) {
      errors.push('robots.txt should NOT disallow /sv/sok');
    } else {
      console.log('✓ 6. /robots.txt allows crawling of /sv/sok for noindex discovery');
    }

    // 4. /sitemap.xml
    const sitemapRes = await fetchUrl('/sitemap.xml');
    if (sitemapRes.status !== 200) {
      errors.push(`Expected /sitemap.xml to return 200, got ${sitemapRes.status}`);
    } else {
      console.log('✓ 7. /sitemap.xml returns 200');
    }
    if (sitemapRes.body.includes('/sok') || sitemapRes.body.includes('demo')) {
      errors.push('sitemap.xml contains search results or demo fixtures');
    } else {
      console.log('✓ 8. /sitemap.xml contains clean static routes without search or fixtures');
    }

    // 5. Unknown locale /de (following redirect)
    const unknownLocaleRes = await fetchUrl('/de', { followRedirects: true });
    if (unknownLocaleRes.status !== 404) {
      errors.push(`Expected /de (after redirect) to return 404, got ${unknownLocaleRes.status}`);
    } else {
      console.log('✓ 9. /de resolves to 404');
    }

    // 6. Tools routes
    const calcRes = await fetchUrl('/sv/verktyg/besparingskalkylator');
    if (calcRes.status !== 200) {
      errors.push(`Expected calculator to return 200, got ${calcRes.status}`);
    } else {
      console.log('✓ 10. /sv/verktyg/besparingskalkylator returns 200');
    }

    const msgRes = await fetchUrl('/sv/verktyg/uppsagningsmeddelande');
    if (msgRes.status !== 200) {
      errors.push(`Expected message generator to return 200, got ${msgRes.status}`);
    } else {
      console.log('✓ 11. /sv/verktyg/uppsagningsmeddelande returns 200');
    }
  } catch (err) {
    errors.push(`Unexpected smoke test error: ${err.message}`);
  } finally {
    console.log('\n🛑 Shutting down smoke test server...');
    server.kill('SIGTERM');
    await sleep(1000);
  }

  if (errors.length > 0) {
    console.error('\n❌ Smoke tests failed with errors:\n' + errors.join('\n'));
    process.exit(1);
  }

  console.log('\n🎉 All production smoke test assertions passed successfully!');
}

runSmokeTests();
