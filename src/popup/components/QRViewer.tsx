import React, { useEffect, useState } from 'react';
import { QrCode, AlertTriangle } from 'lucide-react';
import { useQRStore } from '../../store/useQRStore';
import { qrGenerator } from '../../utils/qrGenerator';

export const QRViewer: React.FC = () => {
  const { currentText, qrDataUrl, setQrDataUrl, isLoading, setLoading, addToHistory } = useQRStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = currentText.trim();
    if (!trimmed) {
      setQrDataUrl('');
      setError(null);
      return;
    }

    const generateQR = async () => {
      setLoading(true);
      setError(null);
      try {
        // Permanently set theme parameter to dark (true) for Chrome dark mode integration
        const dataUrl = await qrGenerator.generate(trimmed, true);
        setQrDataUrl(dataUrl);

        // Add to history (avoid duplication is handled in the store)
        addToHistory(trimmed);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to generate QR Code. Content is likely too large.');
        setQrDataUrl('');
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [currentText, setQrDataUrl, setLoading, addToHistory]);

  const isTextEmpty = !currentText.trim();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-48 h-48 flex items-center justify-center rounded-2xl bg-surface border border-border p-3 shadow-md transition-all duration-300 hover:shadow-lg accent-glow overflow-hidden select-none">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface/85 backdrop-blur-[1px] animate-pulse">
            <QrCode size={36} className="text-accent animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Generating</span>
          </div>
        ) : isTextEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2.5 text-text/30 text-center px-4 select-none">
            <QrCode size={44} className="stroke-[1.25]" />
            <span className="text-xs font-semibold tracking-wide">Enter content to preview</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-1.5 text-red-500 text-center px-3">
            <AlertTriangle size={32} className="stroke-[1.5] text-red-500" />
            <span className="text-xs font-bold">Generation Failed</span>
            <span className="text-[9px] text-text/50 max-h-[48px] overflow-hidden leading-snug">{error}</span>
          </div>
        ) : (
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-105"
            draggable={false}
          />
        )}
      </div>
    </div>
  );
};
