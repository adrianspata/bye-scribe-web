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

    expect(text).toContain('NordicPlay effective as of 2026-04-30');
    expect(text).toContain('Customer / Account Number: 123456');
    expect(text).toContain('Anna Andersson');
    expect(text).toContain('Please provide a written confirmation');
  });

  it('handles standard cancellation when optional fields are omitted', () => {
    const text = generateCancellationMessage({
      name: 'Anna Andersson',
      serviceName: 'NordicPlay',
      messageType: 'standard',
    });

    expect(text).toContain('as soon as possible or at the end of the current billing cycle');
    expect(text).not.toContain('Customer / Account Number:');
  });

  it('generates trial cancellation template', () => {
    const text = generateCancellationMessage({
      name: 'Erik Svensson',
      serviceName: 'AudioStream',
      messageType: 'trial',
    });

    expect(text).toContain('cancel my trial subscription for AudioStream');
    expect(text).toContain('no future charges will occur');
  });

  it('generates terms info request template', () => {
    const text = generateCancellationMessage({
      name: 'Erik Svensson',
      serviceName: 'GymKedjan',
      messageType: 'terms_info',
    });

    expect(text).toContain('Any remaining contract commitment');
    expect(text).toContain('The applicable notice period');
  });

  it('generates confirmation reminder request template', () => {
    const text = generateCancellationMessage({
      name: 'Erik Svensson',
      serviceName: 'GymKedjan',
      messageType: 'confirmation_request',
    });

    expect(text).toContain('have not yet received formal confirmation');
  });
});
