import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContextualSummaCta } from './contextual-summa-cta';
import { clientEnv } from '@/lib/env';

describe('ContextualSummaCta Component', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders correctly with safe external link when HTTPS URL is configured', () => {
    clientEnv.NEXT_PUBLIC_SUMMA_APP_STORE_URL = 'https://apps.apple.com/app/summa/id123';

    render(<ContextualSummaCta context="service_detail" />);

    expect(screen.getByRole('heading', { name: /Keep track of your remaining subscriptions with Summa/i })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Track with Summa' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.getAttribute('href')).toContain('utm_campaign=service_detail');
  });

  it('renders clean fallback without broken link when URL is not configured', () => {
    clientEnv.NEXT_PUBLIC_SUMMA_APP_STORE_URL = '';

    render(<ContextualSummaCta context="savings_calculator" />);

    expect(screen.getByRole('heading', { name: /Track your saved money and recurring costs/i })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(/Summa is available on the App Store/i)).toBeInTheDocument();
  });
});
