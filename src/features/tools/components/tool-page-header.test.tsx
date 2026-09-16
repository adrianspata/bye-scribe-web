import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolPageHeader } from './tool-page-header';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('ToolPageHeader Component', () => {
  it('renders category, single H1, and description correctly', () => {
    render(
      <ToolPageHeader
        category="Verktyg & kalkylatorer"
        title="Besparingskalkylator för abonnemang"
        description="Fyll i dina uppgifter."
      />
    );

    expect(screen.getByText('Verktyg & kalkylatorer')).toBeInTheDocument();
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);
    expect(h1Elements[0]).toHaveTextContent('Besparingskalkylator för abonnemang');
    expect(screen.getByText('Fyll i dina uppgifter.')).toBeInTheDocument();
    expect(screen.getByText('Back to home')).toBeInTheDocument();
  });
});
