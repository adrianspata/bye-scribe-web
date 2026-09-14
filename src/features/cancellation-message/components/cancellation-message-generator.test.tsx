import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CancellationMessageGenerator } from './cancellation-message-generator';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('service=NordicPlay'),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('CancellationMessageGenerator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders privacy banner and pre-fills service name from query param', () => {
    render(<CancellationMessageGenerator />);

    expect(screen.getByRole('region', { name: /Integritetsinformation/i })).toBeInTheDocument();
    expect(screen.getByText(/Det du skriver stannar i din webbläsare och skickas inte till ByeScribe/i)).toBeInTheDocument();

    const serviceInput = screen.getByLabelText(/Tjänstens namn/i) as HTMLInputElement;
    expect(serviceInput.value).toBe('NordicPlay');
  });

  it('renders all three semantic field groups', () => {
    render(<CancellationMessageGenerator />);

    expect(screen.getByText('1. Om tjänsten')).toBeInTheDocument();
    expect(screen.getByText('2. Dina uppgifter')).toBeInTheDocument();
    expect(screen.getByText('3. Kompletterande information')).toBeInTheDocument();
  });

  it('updates draft in-memory when user types synthetic test values', () => {
    render(<CancellationMessageGenerator />);

    const nameInput = screen.getByLabelText(/Ditt för- och efternamn/i);
    fireEvent.change(nameInput, { target: { value: 'Testperson Testsson' } });

    const customerInput = screen.getByLabelText(/Kundnummer eller medlemsnummer/i);
    fireEvent.change(customerInput, { target: { value: 'KUND-9999' } });

    const output = screen.getByLabelText(/Genererat uppsägningsmeddelande/i) as HTMLTextAreaElement;
    expect(output.value).toContain('Testperson Testsson');
    expect(output.value).toContain('NordicPlay');
    expect(output.value).toContain('KUND-9999');
  });

  it('allows manual editing of output and reset to template', () => {
    render(<CancellationMessageGenerator />);

    const output = screen.getByLabelText(/Genererat uppsägningsmeddelande/i) as HTMLTextAreaElement;
    fireEvent.change(output, { target: { value: 'Helt egentillverkad meddelandetext' } });

    expect(output.value).toBe('Helt egentillverkad meddelandetext');
    expect(screen.getByText('Återställ till mall')).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Återställ till mall/i });
    fireEvent.click(resetBtn);

    expect(output.value).toContain('NordicPlay');
    expect(screen.queryByText('Återställ till mall')).not.toBeInTheDocument();
  });

  it('copies text to clipboard with success feedback', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<CancellationMessageGenerator />);

    const copyBtn = screen.getByRole('button', { name: /Kopiera meddelandetext/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalled();
      expect(screen.getByText(/Kopierat till urklipp!/i)).toBeInTheDocument();
      expect(screen.getByText(/Texten har kopierats till urklipp/i)).toBeInTheDocument();
    });
  });

  it('falls back to manual selection when clipboard API rejects or fails', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard denied'));
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<CancellationMessageGenerator />);

    const copyBtn = screen.getByRole('button', { name: /Kopiera meddelandetext/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Markera texten och kopiera manuellt/i)).toBeInTheDocument();
    });
  });
});
