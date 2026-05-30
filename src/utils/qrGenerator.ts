import QRCode from 'qrcode';

export const qrGenerator = {
  generate: async (text: string, darkTheme: boolean = false): Promise<string> => {
    if (!text.trim()) {
      return '';
    }

    const options: QRCode.QRCodeToDataURLOptions = {
      width: 512, // High resolution for download and copying
      margin: 2,
      errorCorrectionLevel: 'Q', // High reliability error correction
      color: {
        dark: darkTheme ? '#ffffff' : '#1f1f1f',      // Foreground
        light: darkTheme ? '#2a2a2a' : '#ffffff',     // Background (matches surface color of each theme)
      },
    };

    try {
      return await QRCode.toDataURL(text, options);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      throw err;
    }
  },
};
