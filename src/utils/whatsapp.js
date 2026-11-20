import React from 'react';

/**
 * RentBridge WhatsApp Channel Utilities
 * Centralized configuration - does not reveal raw phone numbers in the UI.
 */

const RAW_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+2347062842119';
const CLEAN_DIGITS = RAW_PHONE.replace(/[^\d]/g, '');

export const WHATSAPP_WEBHOOK_URL = 
  process.env.NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL || 
  'https://prime-tech-hub.duckdns.org/webhook/ca680578-b0bb-455b-9495-a9d11e8c93d2';

export const DEFAULT_WHATSAPP_MESSAGE = "Hello Ada, I am browsing vacancies on RentBridge and would like assistance.";

export function getWhatsAppDeepLink(customMessage = DEFAULT_WHATSAPP_MESSAGE) {
  if (!CLEAN_DIGITS) return '#';
  return `https://wa.me/${CLEAN_DIGITS}?text=${encodeURIComponent(customMessage)}`;
}

export const WHATSAPP_DIRECT_URL = getWhatsAppDeepLink();

/**
 * Official WhatsApp SVG Icon Component
 */
export function WhatsAppIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.175 8.175 0 012.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.11l-.3-.17-3.12.82.83-3.04-.19-.31a8.163 8.163 0 01-1.25-4.44c0-4.54 3.69-8.23 8.24-8.23zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.39-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
    </svg>
  );
}
