import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TypingSectionHeading } from './typing-section-heading';

describe('TypingSectionHeading', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders heading with aria-label containing full text', () => {
    render(<TypingSectionHeading text="See how subscriptions quietly pile up" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('aria-label', 'See how subscriptions quietly pile up');
  });

  it('renders custom tag component when specified', () => {
    render(<TypingSectionHeading as="h3" text="Quick Tools" />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it('splits words correctly and types target characters', async () => {
    // Mock IntersectionObserver
    let observerCallback: IntersectionObserverCallback = () => {};
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
    }
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof window.IntersectionObserver;

    render(<TypingSectionHeading text="Available Cancellation Guides" />);

    // Trigger intersection
    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Advance past full typing duration
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Available Cancellation Guides');
  });
});
