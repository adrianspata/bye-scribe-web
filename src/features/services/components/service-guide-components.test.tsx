import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServiceGuideHeader } from './service-guide-header';
import { ServiceFacts } from './service-facts';
import { CancellationSteps } from './cancellation-steps';
import { OfficialCancellationAction } from './official-cancellation-action';
import { ServiceTermsSection } from './service-terms-section';
import { ServicePricesSection } from './service-prices-section';
import { SourceList } from './source-list';
import { ServiceInPageNav } from './service-in-page-nav';
import { ServiceDetail } from '../types';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockService: ServiceDetail = {
  id: 'srv-test-1',
  slug: 'test-service',
  name: 'Test Service',
  nameNormalized: 'test service',
  legalName: 'Test Service AB',
  summary: 'En testtjänst för guider.',
  category: { id: 'cat-1', slug: 'streaming', name: 'Streaming' },
  publicationStatus: 'published',
  verificationStatus: 'verified',
  cancellationChannel: 'website',
  noticePeriodValue: 0,
  noticePeriodUnit: 'days',
  bindingNotes: 'Ingen bindningstid.',
  confirmationNotes: 'Bekräftelse via e-post.',
  officialCancellationUrl: 'https://example.com/cancel',
  websiteUrl: 'https://example.com',
  lastVerifiedAt: new Date('2026-03-01T10:00:00Z'),
  aliases: [],
  steps: [
    {
      id: 'step-2',
      serviceId: 'srv-test-1',
      position: 2,
      title: 'Klicka på avsluta',
      instruction: 'Tryck på knappen avsluta prenumeration.',
    },
    {
      id: 'step-1',
      serviceId: 'srv-test-1',
      position: 1,
      title: 'Logga in',
      instruction: 'Logga in på ditt konto.',
      source: {
        id: 'src-1',
        serviceId: 'srv-test-1',
        url: 'https://example.com/help',
        title: 'Hjälpartikel',
        sourceType: 'official_help',
        retrievedAt: new Date('2026-03-01T10:00:00Z'),
      },
    },
  ],
  prices: [
    {
      id: 'price-1',
      serviceId: 'srv-test-1',
      planName: 'Månadsplan',
      amountMinor: 9900,
      currency: 'SEK',
      billingInterval: 'monthly',
      validFrom: new Date('2026-01-01T00:00:00Z'),
    },
  ],
  sources: [
    {
      id: 'src-1',
      serviceId: 'srv-test-1',
      url: 'https://example.com/terms',
      title: 'Allmänna villkor',
      sourceType: 'official_terms',
      retrievedAt: new Date('2026-03-01T10:00:00Z'),
      verifiedAt: new Date('2026-03-01T10:00:00Z'),
    },
  ],
};

describe('Service Guide Components', () => {
  describe('ServiceGuideHeader', () => {
    it('renders single H1 with service name and category', () => {
      render(<ServiceGuideHeader service={mockService} isFixtureMode={false} />);
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
      expect(h1Elements[0]).toHaveTextContent('Säg upp Test Service');
      expect(screen.getByText('Streaming')).toBeInTheDocument();
      expect(screen.getByText('Juridiskt namn: Test Service AB')).toBeInTheDocument();
    });

    it('displays demo notice when isFixtureMode is true', () => {
      render(<ServiceGuideHeader service={mockService} isFixtureMode={true} />);
      expect(
        screen.getByText('Lokal demo – informationen är inte en verkligt verifierad tjänsteguide.')
      ).toBeInTheDocument();
      // Verified date should NOT be displayed as real verification on fixtures
      expect(screen.queryByText(/Verifierad 1 mars 2026/)).not.toBeInTheDocument();
    });

    it('displays stale notice when verificationStatus is stale', () => {
      const staleService: ServiceDetail = {
        ...mockService,
        verificationStatus: 'stale',
      };
      render(<ServiceGuideHeader service={staleService} isFixtureMode={false} />);
      expect(
        screen.getByText('Denna guide är i behov av ny granskning. Villkor och kontaktvägar kan ha ändrats hos leverantören.')
      ).toBeInTheDocument();
    });
  });

  describe('ServiceFacts', () => {
    it('renders cancellation channel and notice period correctly', () => {
      render(<ServiceFacts service={mockService} />);
      expect(screen.getByText('Primär uppsägningskanal')).toBeInTheDocument();
      expect(screen.getByText('Webbplats / Mina sidor')).toBeInTheDocument();
      expect(screen.getByText('Uppsägningstid')).toBeInTheDocument();
      expect(screen.getByText('Ingen uppsägningstid (0 dagar)')).toBeInTheDocument();
    });
  });

  describe('CancellationSteps', () => {
    it('sorts steps by position and renders semantic ordered list', () => {
      render(<CancellationSteps steps={mockService.steps} serviceName="Test Service" />);
      const stepHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(stepHeadings).toHaveLength(2);
      expect(stepHeadings[0]).toHaveTextContent('Logga in');
      expect(stepHeadings[1]).toHaveTextContent('Klicka på avsluta');
      expect(screen.getByText('Hjälpartikel')).toBeInTheDocument();
    });
  });

  describe('OfficialCancellationAction', () => {
    it('renders primary CTA when officialCancellationUrl exists', () => {
      render(
        <OfficialCancellationAction
          serviceName="Test Service"
          officialCancellationUrl="https://example.com/cancel"
          websiteUrl="https://example.com"
        />
      );
      expect(screen.getByText('Gå till Test Service')).toBeInTheDocument();
      expect(
        screen.getByText('Du lämnar ByeScribe och genomför uppsägningen hos leverantören.')
      ).toBeInTheDocument();
    });

    it('renders secondary website link when only websiteUrl exists', () => {
      render(
        <OfficialCancellationAction
          serviceName="Test Service"
          officialCancellationUrl={null}
          websiteUrl="https://example.com"
        />
      );
      expect(screen.getByText('Besök Test Services webbplats')).toBeInTheDocument();
    });

    it('renders null when no valid URLs exist', () => {
      const { container } = render(
        <OfficialCancellationAction
          serviceName="Test Service"
          officialCancellationUrl={null}
          websiteUrl={null}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('ServiceTermsSection', () => {
    it('renders binding and confirmation notes', () => {
      render(
        <ServiceTermsSection
          bindingNotes="Ingen bindningstid."
          confirmationNotes="Bekräftelse via e-post."
        />
      );
      expect(screen.getByText('Villkor och bekräftelse')).toBeInTheDocument();
      expect(screen.getByText('Ingen bindningstid.')).toBeInTheDocument();
      expect(screen.getByText('Bekräftelse via e-post.')).toBeInTheDocument();
    });

    it('renders null if no notes exist', () => {
      const { container } = render(
        <ServiceTermsSection bindingNotes={null} confirmationNotes={null} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('ServicePricesSection', () => {
    it('formats price in SEK with billing interval', () => {
      render(<ServicePricesSection prices={mockService.prices} isFixtureMode={false} />);
      expect(screen.getByText('Månadsplan')).toBeInTheDocument();
      expect(screen.getByText(/99 kr\/mån/)).toBeInTheDocument();
    });
  });

  describe('SourceList', () => {
    it('renders sources with type and dates without synthetic publishers', () => {
      render(<SourceList sources={mockService.sources} />);
      expect(screen.getByText('Allmänna villkor')).toBeInTheDocument();
      expect(screen.getByText('Allmänna avtalsvillkor')).toBeInTheDocument();
      expect(screen.getByText(/Åtkomstdatum:/)).toBeInTheDocument();
      expect(screen.getByText(/Verifierad:/)).toBeInTheDocument();
    });
  });

  describe('ServiceInPageNav', () => {
    it('renders navigation links when at least 3 sections exist', () => {
      const sections = [
        { id: 'snabbfakta', label: 'Snabböversikt' },
        { id: 'steg', label: 'Uppsägningssteg' },
        { id: 'verktyg', label: 'Verktyg' },
      ];
      render(<ServiceInPageNav sections={sections} />);
      expect(screen.getByText('Innehåll i guiden')).toBeInTheDocument();
      expect(screen.getByText('Snabböversikt')).toBeInTheDocument();
      expect(screen.getByText('Uppsägningssteg')).toBeInTheDocument();
      expect(screen.getByText('Verktyg')).toBeInTheDocument();
    });

    it('renders null when less than 3 sections exist', () => {
      const sections = [
        { id: 'snabbfakta', label: 'Snabböversikt' },
        { id: 'steg', label: 'Uppsägningssteg' },
      ];
      const { container } = render(<ServiceInPageNav sections={sections} />);
      expect(container.firstChild).toBeNull();
    });
  });
});
