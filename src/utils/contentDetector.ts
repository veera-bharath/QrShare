import type { ContentType } from '../types/qr';

export const contentDetector = {
  detect: (text: string): ContentType => {
    const trimmed = text.trim();
    if (!trimmed) {
      return 'text';
    }

    // 1. WiFi Credential Format (WIFI:S:SSID;T:WPA;P:PASSWORD;;)
    if (/^wifi:/i.test(trimmed) && trimmed.includes(';')) {
      return 'wifi';
    }

    // 2. Email Address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(trimmed) || /^mailto:/i.test(trimmed)) {
      return 'email';
    }

    // 3. Phone Number
    // Matches standard phone numbers with optional country codes, spaces, dashes, or parentheses
    const phoneRegex = /^\+?[0-9\s\-()]{7,18}$/;
    if (phoneRegex.test(trimmed) || /^tel:/i.test(trimmed)) {
      const digitsCount = trimmed.replace(/\D/g, '').length;
      if (digitsCount >= 7) {
        return 'phone';
      }
    }

    // 4. URL
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (urlRegex.test(trimmed) || /^(https?|ftp|file):\/\//i.test(trimmed) || /^www\./i.test(trimmed)) {
      return 'url';
    }

    // Fallback
    return 'text';
  },
};
