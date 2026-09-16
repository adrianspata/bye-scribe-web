import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubscriptionMindmap } from './subscription-mindmap';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      mindmapBadge: 'Cost Accumulation',
      mindmapHeading: 'See how subscriptions quietly pile up',
      mindmapSubheading: 'Streaming, storage, software, and memberships. When recurring charges run in the background, small monthly fees compound into a massive yearly total.',
      mindmapLiveCounterLabel: 'Total recurring expense accumulation',
      mindmapMonthlyBaseline: 'Monthly baseline',
      mindmapMonthlyPerYear: 'per year',
      mindmapCta: 'Calculate your exact savings',
      mindmapActiveServices: '8 active subscriptions',
    };
    return translations[key] || key;
  },
}));

describe('SubscriptionMindmap Component', () => {
  it('renders section heading and description correctly', () => {
    render(<SubscriptionMindmap />);

    expect(screen.getByRole('heading', { level: 2, name: /See how subscriptions quietly pile up/i })).toBeInTheDocument();
    expect(screen.getByText(/Streaming, storage, software, and memberships/i)).toBeInTheDocument();
  });

  it('renders all key subscription brands', () => {
    render(<SubscriptionMindmap />);

    const netflixElements = screen.getAllByText('Netflix');
    expect(netflixElements.length).toBeGreaterThanOrEqual(1);

    const spotifyElements = screen.getAllByText('Spotify');
    expect(spotifyElements.length).toBeGreaterThanOrEqual(1);

    const chatGptElements = screen.getAllByText('ChatGPT Plus');
    expect(chatGptElements.length).toBeGreaterThanOrEqual(1);

    const adobeElements = screen.getAllByText('Adobe Creative');
    expect(adobeElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders accumulator ticker with link to savings calculator', () => {
    render(<SubscriptionMindmap />);

    const ctaLinks = screen.getAllByRole('link', { name: /Calculate your exact savings/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
    expect(ctaLinks[0].getAttribute('href')).toBe('/verktyg/besparingskalkylator');
  });
});
