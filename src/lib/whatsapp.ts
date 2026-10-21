import { WHATSAPP_NUMBER } from '../config';

export const waUrl = (text: string, number = WHATSAPP_NUMBER) =>
  `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

export const openWhatsApp = (text: string) => {
  window.open(waUrl(text), '_blank', 'noopener');
};

/** 5511900000000 → +55 (11) 90000-0000 */
export const waDisplay = (number = WHATSAPP_NUMBER) =>
  '+' + number.replace(/\D/g, '').replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, '$1 ($2) $3-$4');
