import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SavingsCalculator } from './savings-calculator';

describe('SavingsCalculator Component', () => {
  it('renders and computes default savings projection', () => {
    render(<SavingsCalculator />);

    expect(screen.getByLabelText(/Kostnad för abonnemanget/i)).toBeInTheDocument();
    // Default 149 kr/month: 1 year = 1 788 kr, 5 year = 8 940 kr
    expect(screen.getByText('1 788 kr')).toBeInTheDocument();
    expect(screen.getByText('8 940 kr')).toBeInTheDocument();
  });

  it('updates calculation dynamically on valid input with comma decimal', () => {
    render(<SavingsCalculator />);

    const input = screen.getByLabelText(/Kostnad för abonnemanget/i);
    fireEvent.change(input, { target: { value: '200' } });

    // 200 kr/month: 1 year = 2 400 kr, 5 year = 12 000 kr
    expect(screen.getByText('2 400 kr')).toBeInTheDocument();
    expect(screen.getByText('12 000 kr')).toBeInTheDocument();
  });

  it('displays error message on invalid negative input', () => {
    render(<SavingsCalculator />);

    const input = screen.getByLabelText(/Kostnad för abonnemanget/i);
    fireEvent.change(input, { target: { value: '-50' } });

    expect(screen.getByText(/Vänligen ange ett giltigt positivt belopp/i)).toBeInTheDocument();
  });
});
