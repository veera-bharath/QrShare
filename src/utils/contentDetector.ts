import type { ContentType } from '../types/qr';

export const contentDetector = {
  detect: (text: string): ContentType => {
    const trimmed = text.trim();
    if (!trimmed) return 'text';

    // 1. WiFi Credential Format (WIFI:S:SSID;T:WPA;P:PASSWORD;;)
    if (/^wifi:/i.test(trimmed) && trimmed.includes(';')) return 'wifi';

    // 2. Email Address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(trimmed) || /^mailto:/i.test(trimmed)) return 'email';

    // 3. Phone Number — tel: URIs are always phone regardless of digit count (tel:911 is valid)
    if (/^tel:/i.test(trimmed)) return 'phone';
    const phoneRegex = /^\+?[0-9\s\-()]{7,18}$/;
    if (phoneRegex.test(trimmed) && trimmed.replace(/\D/g, '').length >= 7) return 'phone';

    // 4. URL — use URL constructor instead of regex to avoid ReDoS from nested quantifiers
    const hasExplicitProtocol = /^(https?|ftp|file):\/\//i.test(trimmed);
    if (hasExplicitProtocol || /^www\./i.test(trimmed)) {
      try {
        new URL(hasExplicitProtocol ? trimmed : 'https://' + trimmed);
        return 'url';
      } catch {
        // not a valid URL despite the prefix
      }
    }

    return 'text';
  },
};
