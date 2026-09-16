import { describe, it, expect } from 'vitest';
import { BRAND } from './brand';
import fs from 'node:fs';
import path from 'node:path';

describe('Brand Configuration & Integrity', () => {
  it('defines the canonical ByeScribe brand name, description and tagline', () => {
    expect(BRAND.name).toBe('ByeScribe');
    expect(BRAND.tagline).toBe('The easier way to cancel your payments & subscriptions.');
    expect(BRAND.disclaimer).toContain('ByeScribe helps consumers');
  });

  it('defines future product family architecture without creating premature features', () => {
    expect(BRAND.futureArchitecture).toEqual([
      'ByeScribe Guides',
      'ByeScribe Assistant',
      'ByeScribe for Business',
      'ByeScribe × Summa',
    ]);
  });

  it('ensures user-facing localization copy does not contain legacy name "CancelPath"', () => {
    const enPath = path.resolve(__dirname, '../messages/en.json');
    const enContent = fs.readFileSync(enPath, 'utf-8');
    const parsed = JSON.parse(enContent);

    expect(parsed.common.brand).toBe('ByeScribe');
    expect(parsed.common.tagline).toBe('The easier way to cancel your payments & subscriptions.');
    expect(parsed.common.disclaimer).toContain('ByeScribe helps consumers');
    expect(enContent).not.toContain('CancelPath');
    expect(enContent).not.toContain('cancelpath');
  });

  it('ensures layout and page metadata files do not hardcode legacy product name in visible titles', () => {
    const layoutPath = path.resolve(__dirname, '../app/[locale]/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    expect(layoutContent).not.toContain('CancelPath');

    const homePath = path.resolve(__dirname, '../app/[locale]/page.tsx');
    const homeContent = fs.readFileSync(homePath, 'utf-8');
    expect(homeContent).not.toContain('CancelPath');
  });

  it('verifies that no source files in src/ contain "CancelPath"', () => {
    const srcDir = path.resolve(__dirname, '..');
    const allowedExceptions = [
      'brand.test.ts',
    ];

    function checkDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.json'))) {
          if (allowedExceptions.includes(entry.name)) {
            continue;
          }
          const content = fs.readFileSync(fullPath, 'utf-8');
          expect(
            content.toLowerCase().includes('cancelpath'),
            `Forbidden legacy reference found in ${path.relative(srcDir, fullPath)}`
          ).toBe(false);
        }
      }
    }

    checkDir(srcDir);
  });
});
