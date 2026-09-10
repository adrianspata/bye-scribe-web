import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CancellationMessageGenerator } from './cancellation-message-generator';

// Mock next/navigation useSearchParams
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('service=NordicPlay'),
}));

describe('CancellationMessageGenerator Component', () => {
  it('renders privacy banner and pre-fills service name from query param', () => {
    render(<CancellationMessageGenerator />);

    expect(screen.getByRole('region', { name: /Integritetsinformation/i })).toBeInTheDocument();
    expect(screen.getByText(/Det du skriver stannar i din webbläsare och skickas inte till ByeScribe/i)).toBeInTheDocument();

    const serviceInput = screen.getByLabelText(/Tjänstens namn/i) as HTMLInputElement;
    expect(serviceInput.value).toBe('NordicPlay');
  });

  it('updates draft in-memory when user types their name', () => {
    render(<CancellationMessageGenerator />);

    const nameInput = screen.getByLabelText(/Ditt för- och efternamn/i);
    fireEvent.change(nameInput, { target: { value: 'Sara Lind' } });

    const output = screen.getByLabelText(/Genererat uppsägningsmeddelande/i) as HTMLTextAreaElement;
    expect(output.value).toContain('Sara Lind');
    expect(output.value).toContain('NordicPlay');
  });

  it('copies text to clipboard with feedback', async () => {
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
      expect(screen.getByText(/✓ Kopierat till urklipp!/i)).toBeInTheDocument();
    });
  });
});
