import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from './button';
import { FieldLabel, FieldError } from './field';
import { Input } from './input';
import { Select } from './select';
import { Badge } from './badge';
import { InlineNotice } from './inline-notice';
import { Card } from './card';
import { Logo } from './logo';

describe('Base UI Components', () => {
  describe('Logo', () => {
    it('renders with bold "Bye" and light "Scribe"', () => {
      render(<Logo />);
      const logo = screen.getByTestId('brand-logo');
      expect(logo).toHaveTextContent('ByeScribe');
      const boldPart = screen.getByText('Bye');
      const lightPart = screen.getByText('Scribe');
      expect(boldPart).toHaveClass('font-bold');
      expect(lightPart).toHaveClass('font-light');
    });
  });

  describe('Button', () => {
    it('renders with loading spinner and aria-busy when isLoading is true', () => {
      render(<Button isLoading>Laddar...</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toHaveAttribute('aria-busy', 'true');
      expect(btn).toBeDisabled();
    });

    it('renders icon-only button with aria-label', () => {
      render(<Button size="icon-only" aria-label="Sök ikonen">🔍</Button>);
      expect(screen.getByRole('button', { name: 'Sök ikonen' })).toBeInTheDocument();
    });
  });

  describe('Field Primitives', () => {
    it('renders FieldLabel with asterisk when required', () => {
      render(<FieldLabel htmlFor="test-id" required>Namn</FieldLabel>);
      expect(screen.getByText('Namn')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders FieldError with role="alert"', () => {
      render(<FieldError>Felaktig e-postadress</FieldError>);
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Felaktig e-postadress');
    });

    it('renders nothing when FieldError has no children', () => {
      const { container } = render(<FieldError />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Input & Select', () => {
    it('marks Input with aria-invalid when hasError is true', () => {
      render(<Input hasError placeholder="Test" />);
      expect(screen.getByPlaceholderText('Test')).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders Select with options', () => {
      render(
        <Select defaultValue="val1">
          <option value="val1">Val 1</option>
          <option value="val2">Val 2</option>
        </Select>
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('InlineNotice & Badge & Card', () => {
    it('renders InlineNotice with correct role based on variant', () => {
      render(<InlineNotice variant="critical" title="Viktigt!">Något gick fel</InlineNotice>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Viktigt!')).toBeInTheDocument();
      expect(screen.getByText('Något gick fel')).toBeInTheDocument();
    });

    it('renders Badge with custom children', () => {
      render(<Badge variant="success">Verifierad</Badge>);
      expect(screen.getByText('Verifierad')).toBeInTheDocument();
    });

    it('renders Card with path step styling when requested', () => {
      render(<Card hasPathStep data-testid="path-card">Kort innehåll</Card>);
      const card = screen.getByTestId('path-card');
      expect(card).toBeInTheDocument();
    });
  });
});
