import { describe, it, expect } from 'vitest';
import { generateCancellationMessage } from './templates';

describe('generateCancellationMessage', () => {
  it('generates standard cancellation with custom customer ID and end date', () => {
    const text = generateCancellationMessage({
      name: 'Anna Andersson',
      serviceName: 'NordicPlay',
      customerId: '123456',
      endDate: '2026-04-30',
      messageType: 'standard',
    });

    expect(text).toContain('NordicPlay per den 2026-04-30');
    expect(text).toContain('Kund-/Medlemsnummer: 123456');
    expect(text).toContain('Anna Andersson');
    expect(text).toContain('Vänligen skicka en skriftlig bekräftelse');
  });

  it('handles standard cancellation when optional fields are omitted', () => {
    const text = generateCancellationMessage({
      name: 'Anna Andersson',
      serviceName: 'NordicPlay',
      messageType: 'standard',
    });

    expect(text).toContain('snarast möjligt eller vid innevarande avtalsperiods utgång');
    expect(text).not.toContain('Kund-/Medlemsnummer:');
  });

  it('generates trial cancellation template', () => {
    const text = generateCancellationMessage({
      name: 'Erik Svensson',
      serviceName: 'AudioStream',
      messageType: 'trial',
    });

    expect(text).toContain('avsluta min provperiod för AudioStream');
    expect(text).toContain('inga framtida debiteringar');
  });

  it('generates terms info request template', () => {
    const text = generateCancellationMessage({
      name: 'Erik Svensson',
      serviceName: 'GymKedjan',
      messageType: 'terms_info',
    });

    expect(text).toContain('Eventuell kvarvarande bindningstid');
    expect(text).toContain('Gällande uppsägningstid');
  });

  it('generates confirmation reminder request template', () => {
    const text = generateCancellationMessage({
      name: 'Erik Svensson',
      serviceName: 'GymKedjan',
      messageType: 'confirmation_request',
    });

    expect(text).toContain('har ännu inte mottagit en formell bekräftelse');
  });
});
