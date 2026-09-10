import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  it('renders children properly', () => {
    render(<Button>Klicka här</Button>);
    expect(screen.getByRole('button', { name: 'Klicka här' })).toBeInTheDocument();
  });

  it('renders disabled state correctly', () => {
    render(<Button disabled>Avstängd</Button>);
    const btn = screen.getByRole('button', { name: 'Avstängd' });
    expect(btn).toBeDisabled();
  });
});
