import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchResultItem } from './search-result-item';
import { SearchEmptyState } from './search-empty-state';
import { SearchResult } from '../types';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/sok',
}));

describe('Search Components', () => {
  describe('SearchResultItem', () => {
    const mockResult: SearchResult = {
      serviceId: 'srv-1',
      slug: 'netflix-demo',
      name: 'Netflix Demo',
      nameNormalized: 'netflix demo',
      summary: 'Movies and shows.',
      categoryName: 'Streaming',
      matchType: 'exact_name',
      score: 100,
    };

    it('renders service name, category and summary correctly', () => {
      render(<SearchResultItem result={mockResult} />);
      expect(screen.getByText('Netflix Demo')).toBeInTheDocument();
      expect(screen.getByText('Streaming')).toBeInTheDocument();
      expect(screen.getByText('Movies and shows.')).toBeInTheDocument();
      expect(screen.getByText('View guide')).toBeInTheDocument();
      // Ranking score should NOT be displayed
      expect(screen.queryByText(/100/)).not.toBeInTheDocument();
    });

    it('renders matchedAlias only when explicitly present in the result', () => {
      const { rerender } = render(<SearchResultItem result={mockResult} />);
      expect(screen.queryByText(/Matched alias:/)).not.toBeInTheDocument();

      const resultWithAlias: SearchResult = {
        ...mockResult,
        matchedAlias: 'Nflx',
      };
      rerender(<SearchResultItem result={resultWithAlias} />);
      expect(screen.getByText(/Matched alias:/)).toBeInTheDocument();
      expect(screen.getByText('Nflx')).toBeInTheDocument();
    });
  });

  describe('SearchEmptyState', () => {
    it('renders empty prompt when type is empty', () => {
      render(<SearchEmptyState type="empty" />);
      expect(
        screen.getByText('Type the name of the service you want to cancel in the search box above.')
      ).toBeInTheDocument();
    });

    it('renders no_results with tool links when type is no_results', () => {
      render(<SearchEmptyState type="no_results" query="UnknownService" />);
      expect(
        screen.getByText(/No guides found for “UnknownService”/)
      ).toBeInTheDocument();
      expect(screen.getByText('Create own message')).toBeInTheDocument();
      expect(screen.getByText('Calculate savings')).toBeInTheDocument();
    });

    it('renders invalid_query message when type is invalid_query', () => {
      render(<SearchEmptyState type="invalid_query" />);
      expect(screen.getByText('Invalid search query')).toBeInTheDocument();
    });
  });
});
