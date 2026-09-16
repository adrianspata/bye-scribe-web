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

    expect(screen.getByRole('region', { name: /Privacy Notice/i })).toBeInTheDocument();
    expect(screen.getByText(/What you type stays in your browser and is never sent to ByeScribe/i)).toBeInTheDocument();

    const serviceInput = screen.getByLabelText(/Service name/i) as HTMLInputElement;
    expect(serviceInput.value).toBe('NordicPlay');
  });

  it('renders all three semantic field groups', () => {
    render(<CancellationMessageGenerator />);

    expect(screen.getByText('1. Service Details')).toBeInTheDocument();
    expect(screen.getByText('2. Your Information')).toBeInTheDocument();
    expect(screen.getByText('3. Additional Details')).toBeInTheDocument();
  });

  it('updates draft in-memory when user types synthetic test values', () => {
    render(<CancellationMessageGenerator />);

    const nameInput = screen.getByLabelText(/Your full name/i);
    fireEvent.change(nameInput, { target: { value: 'Testperson Testsson' } });

    const customerInput = screen.getByLabelText(/Customer or membership ID/i);
    fireEvent.change(customerInput, { target: { value: 'KUND-9999' } });

    const output = screen.getByLabelText(/Generated cancellation message/i) as HTMLTextAreaElement;
    expect(output.value).toContain('Testperson Testsson');
    expect(output.value).toContain('NordicPlay');
    expect(output.value).toContain('KUND-9999');
  });

  it('allows manual editing of output and reset to template', () => {
    render(<CancellationMessageGenerator />);

    const output = screen.getByLabelText(/Generated cancellation message/i) as HTMLTextAreaElement;
    fireEvent.change(output, { target: { value: 'Completely custom message text' } });

    expect(output.value).toBe('Completely custom message text');
    expect(screen.getByText('Reset to template')).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset to template/i });
    fireEvent.click(resetBtn);

    expect(output.value).toContain('NordicPlay');
    expect(screen.queryByText('Reset to template')).not.toBeInTheDocument();
  });

  it('copies text to clipboard with success feedback', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<CancellationMessageGenerator />);

    const copyBtn = screen.getByRole('button', { name: /Copy message text/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalled();
      expect(screen.getByText(/Copied to clipboard!/i)).toBeInTheDocument();
      expect(screen.getByText(/Text copied to clipboard/i)).toBeInTheDocument();
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

    const copyBtn = screen.getByRole('button', { name: /Copy message text/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(screen.getByText(/Select the text and copy manually/i)).toBeInTheDocument();
    });
  });
});
