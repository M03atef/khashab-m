import { BRAND } from "@/lib/catalog";

/** Digits-only international WhatsApp id (Egypt: 20XXXXXXXXXX). */
export function resolveWhatsAppNumber(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (fromEnv) {
    const digits = fromEnv.replace(/\D/g, "");
    if (digits.length >= 10) return digits;
  }
  return BRAND.whatsapp;
}

export function buildWhatsAppLink(prefillText?: string): string {
  const number = resolveWhatsAppNumber();
  if (!prefillText) return `https://wa.me/${number}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(prefillText)}`;
}
