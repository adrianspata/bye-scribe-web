export type MessageType =
  | 'standard'
  | 'trial'
  | 'terms_info'
  | 'confirmation_request';

export interface MessageTemplateData {
  name: string;
  serviceName: string;
  customerId?: string;
  endDate?: string;
  customNote?: string;
  messageType: MessageType;
}

export const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  standard: 'Vanlig uppsägning',
  trial: 'Uppsägning under provperiod',
  terms_info: 'Begäran om villkor & bindningstid',
  confirmation_request: 'Begäran om skriftlig bekräftelse',
};

/**
 * Generates an editable text draft from user inputs in-memory.
 */
export function generateCancellationMessage(data: MessageTemplateData): string {
  const name = data.name.trim() || '[Ditt Namn]';
  const serviceName = data.serviceName.trim() || '[Tjänstens Namn]';
  const customerId = data.customerId?.trim();
  const endDate = data.endDate?.trim();
  const customNote = data.customNote?.trim();

  const customerIdLine = customerId
    ? `Kund-/Medlemsnummer: ${customerId}`
    : null;

  switch (data.messageType) {
    case 'standard': {
      const terminationTarget = endDate
        ? `per den ${endDate}`
        : 'snarast möjligt eller vid innevarande avtalsperiods utgång';

      return [
        `Hej,`,
        ``,
        `Härmed önskar jag säga upp mitt abonnemang/medlemskap hos ${serviceName} ${terminationTarget}.`,
        customerIdLine,
        customNote ? `Övrig information: ${customNote}` : null,
        ``,
        `Vänligen skicka en skriftlig bekräftelse på att uppsägningen är mottagen och registrerad, samt vilket datum avtalet och betalningarna slutgiltigt upphör.`,
        ``,
        `Med vänliga hälsningar,`,
        name,
      ]
        .filter((line) => line !== null)
        .join('\n');
    }

    case 'trial': {
      return [
        `Hej,`,
        ``,
        `Jag vill härmed avsluta min provperiod för ${serviceName} innan den övergår i ett betalt abonnemang.`,
        customerIdLine,
        customNote ? `Övrig information: ${customNote}` : null,
        ``,
        `Vänligen bekräfta att provperioden är avslutad och att inga framtida debiteringar kommer att ske.`,
        ``,
        `Med vänliga hälsningar,`,
        name,
      ]
        .filter((line) => line !== null)
        .join('\n');
    }

    case 'terms_info': {
      return [
        `Hej,`,
        ``,
        `Jag kontaktar er gällande mitt abonnemang för ${serviceName}.`,
        customerIdLine,
        ``,
        `Vänligen meddela mig följande information:`,
        `- Eventuell kvarvarande bindningstid och slutdatum för denna.`,
        `- Gällande uppsägningstid.`,
        `- Sista datum jag behöver säga upp avtalet för att undvika förlängning.`,
        customNote ? `Övrig fråga: ${customNote}` : null,
        ``,
        `Med vänliga hälsningar,`,
        name,
      ]
        .filter((line) => line !== null)
        .join('\n');
    }

    case 'confirmation_request': {
      return [
        `Hej,`,
        ``,
        `Jag har tidigare skickat en uppsägning av mitt abonnemang hos ${serviceName} men har ännu inte mottagit en formell bekräftelse.`,
        customerIdLine,
        customNote ? `Tidigare information: ${customNote}` : null,
        ``,
        `Vänligen bekräfta omgående att min uppsägning är registrerad och ange slutdatumet för abonnemanget och dragningarna.`,
        ``,
        `Med vänliga hälsningar,`,
        name,
      ]
        .filter((line) => line !== null)
        .join('\n');
    }
  }
}
