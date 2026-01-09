function getBusinessWhatsAppNumber(): string {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const cleaned = typeof rawNumber === 'string' ? rawNumber.replace(/\D/g, '') : '';
  if (cleaned.length >= 8) return cleaned;

  // René's business number (from site contact): +501 670 7760
  return '5016707760';
}

export function getWhatsAppLink(message: string): string {
  const number = getBusinessWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

type WhatsAppLinkOptions = {
  tourName: string;
};

export function buildWhatsAppTourLink({ tourName }: WhatsAppLinkOptions): string {
  const message = `Hi René,\n\nCan we book the ${tourName}?\n\nThank you!`;
  return getWhatsAppLink(message);
}
