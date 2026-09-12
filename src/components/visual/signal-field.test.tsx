import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SignalField } from './signal-field';

describe('SignalField component', () => {
  it('renders as decorative element with aria-hidden="true" when standalone', () => {
    const { container } = render(<SignalField variant="path" />);
    const root = container.querySelector('[data-testid="signal-field"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-variant', 'path');
  });

  it('keeps children accessible when wrapping foreground content while hiding decorative layers', () => {
    const { container } = render(<SignalField variant="path"><span>Accessible text</span></SignalField>);
    const root = container.querySelector('[data-testid="signal-field"]');
    expect(root).not.toHaveAttribute('aria-hidden');
    const decorLayers = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorLayers.length).toBeGreaterThan(0);
  });

  it('supports variants path, tool, editorial, and summa', () => {
    const variants = ['path', 'tool', 'editorial', 'summa'] as const;
    variants.forEach((v) => {
      const { container } = render(<SignalField variant={v} />);
      const root = container.querySelector('[data-testid="signal-field"]');
      expect(root).toHaveAttribute('data-variant', v);
    });
  });

  it('applies ambient motion class when ambientMotion is enabled', () => {
    const { container } = render(<SignalField variant="path" ambientMotion={true} />);
    const animatedLayer = container.querySelector('.animate-ambient-signal');
    expect(animatedLayer).toBeInTheDocument();
  });
});
