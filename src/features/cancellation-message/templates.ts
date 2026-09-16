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
  standard: 'Standard Cancellation',
  trial: 'Trial Cancellation',
  terms_info: 'Contract Terms & Notice Period Inquiry',
  confirmation_request: 'Written Confirmation Request',
};

/**
 * Generates an editable text draft from user inputs in-memory.
 */
export function generateCancellationMessage(data: MessageTemplateData): string {
  const name = data.name.trim() || '[Your Name]';
  const serviceName = data.serviceName.trim() || '[Service Name]';
  const customerId = data.customerId?.trim();
  const endDate = data.endDate?.trim();
  const customNote = data.customNote?.trim();

  const customerIdLine = customerId
    ? `Customer / Account Number: ${customerId}`
    : null;

  switch (data.messageType) {
    case 'standard': {
      const terminationTarget = endDate
        ? `effective as of ${endDate}`
        : 'as soon as possible or at the end of the current billing cycle';

      return [
        `Hello,`,
        ``,
        `I hereby request the cancellation of my subscription/membership for ${serviceName} ${terminationTarget}.`,
        customerIdLine,
        customNote ? `Additional details: ${customNote}` : null,
        ``,
        `Please provide a written confirmation that this cancellation has been received and processed, including the final date of service and payment cessation.`,
        ``,
        `Sincerely,`,
        name,
      ]
        .filter((line) => line !== null)
        .join('\n');
    }

    case 'trial': {
      return [
        `Hello,`,
        ``,
        `I hereby cancel my trial subscription for ${serviceName} prior to it converting into a recurring paid plan.`,
        customerIdLine,
        customNote ? `Additional details: ${customNote}` : null,
        ``,
        `Please confirm that the trial has been cancelled and that no future charges will occur.`,
        ``,
        `Sincerely,`,
        name,
      ]
        .filter((line) => line !== null)
        .join('\n');
    }

    case 'terms_info': {
      return [
        `Hello,`,
        ``,
        `I am writing regarding my subscription with ${serviceName}.`,
        customerIdLine,
        ``,
        `Please provide me with the following contract details:`,
        `- Any remaining contract commitment and its expiration date.`,
        `- The applicable notice period for cancellation.`,
        `- The deadline by which notice must be submitted to prevent renewal.`,
        customNote ? `Additional inquiry: ${customNote}` : null,
        ``,
        `Sincerely,`,
        name,
      ]
        .filter((line) => line !== null)
        .join('\n');
    }

    case 'confirmation_request': {
      return [
        `Hello,`,
        ``,
        `I previously submitted a cancellation request for my subscription with ${serviceName} but have not yet received formal confirmation.`,
        customerIdLine,
        customNote ? `Previous submission notes: ${customNote}` : null,
        ``,
        `Please promptly confirm that my cancellation has been registered and provide the definitive end date for services and billing.`,
        ``,
        `Sincerely,`,
        name,
      ]
        .filter((line) => line !== null)
        .join('\n');
    }
  }
}
