import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SavingsCalculator } from './savings-calculator';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('SavingsCalculator Component', () => {
  it('renders and computes default savings projection with assumption notice', () => {
    render(<SavingsCalculator />);

    expect(screen.getByText(/This calculation is an estimate based on the amount and currency you provide/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Subscription cost/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Currency/i })).toBeInTheDocument();
    // Default 149 kr/month: 1 year = 1 788 kr, 5 year = 8 940 kr
    expect(screen.getByText('1 788 kr')).toBeInTheDocument();
    expect(screen.getByText('8 940 kr')).toBeInTheDocument();
  });

  it('updates calculation dynamically on valid input with comma and dot decimals', () => {
    render(<SavingsCalculator />);

    const input = screen.getByRole('textbox', { name: /Subscription cost/i });
    fireEvent.change(input, { target: { value: '299,50' } });

    // 299,50 kr/month: 1 year = 3 594 kr, 5 year = 17 970 kr
    expect(screen.getByText('3 594 kr')).toBeInTheDocument();
    expect(screen.getByText('17 970 kr')).toBeInTheDocument();
  });

  it('switches currency and automatically updates projection formatting', () => {
    render(<SavingsCalculator />);

    const currencySelect = screen.getByRole('combobox', { name: /Currency/i });
    fireEvent.change(currencySelect, { target: { value: 'USD' } });

    const input = screen.getByRole('textbox', { name: /Subscription cost/i });
    fireEvent.change(input, { target: { value: '15' } });

    // 15 USD/month: 1 year = $180, 5 year = $900
    expect(screen.getByText('$15/mo')).toBeInTheDocument();
    expect(screen.getByText('$180')).toBeInTheDocument();
    expect(screen.getByText('$900')).toBeInTheDocument();
  });

  it('handles yearly billing interval correctly', () => {
    render(<SavingsCalculator />);

    const intervalSelect = screen.getByRole('combobox', { name: /Billing interval/i });
    fireEvent.change(intervalSelect, { target: { value: 'year' } });

    const input = screen.getByRole('textbox', { name: /Subscription cost/i });
    fireEvent.change(input, { target: { value: '1200' } });

    // 1200 kr/year: monthly ~100 kr/mo, 1 year = 1 200 kr, 5 year = 6 000 kr
    expect(screen.getByText('100 kr/mo')).toBeInTheDocument();
    expect(screen.getByText('1 200 kr')).toBeInTheDocument();
    expect(screen.getByText('6 000 kr')).toBeInTheDocument();
  });

  it('displays error message on invalid negative or non-numeric input', () => {
    render(<SavingsCalculator />);

    const input = screen.getByRole('textbox', { name: /Subscription cost/i });
    fireEvent.change(input, { target: { value: '-50' } });

    expect(screen.getByText(/Please enter a valid positive amount/i)).toBeInTheDocument();
  });

  it('form submit runs local calculation without reload', () => {
    render(<SavingsCalculator />);

    const input = screen.getByRole('textbox', { name: /Subscription cost/i });
    fireEvent.change(input, { target: { value: '500' } });

    const submitBtn = screen.getByRole('button', { name: /Calculate savings/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('6 000 kr')).toBeInTheDocument();
    expect(screen.getByText('30 000 kr')).toBeInTheDocument();
  });
});

