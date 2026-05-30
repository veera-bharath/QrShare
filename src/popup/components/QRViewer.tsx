import React, { useEffect, useRef, useState } from 'react';
import { QrCode, AlertTriangle } from 'lucide-react';
import { useQRStore } from '../../store/useQRStore';
import { qrRenderer } from '../../utils/qrRenderer';

export const QRViewer: React.FC = () => {
  const { currentText, setQrDataUrl, qrStyle, detectedType, isLoading, setLoading, addToHistory } = useQRStore();
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        if (canvasRef.current) {
          // Pass detectedType to dynamically render context-specific center icons (phone, envelope, globe, wifi)
          await qrRenderer.render(canvasRef.current, trimmed, qrStyle, detectedType);
          
          const dataUrl = canvasRef.current.toDataURL('image/png');
          setQrDataUrl(dataUrl);
        }

        // Add to history
        addToHistory(trimmed);
      } catch (err: any) {
        console.error('Failed to render styled QR code:', err);
        setError(err.message || 'Failed to generate styled QR Code.');
        setQrDataUrl('');
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [currentText, qrStyle, detectedType, setQrDataUrl, setLoading, addToHistory]);

  const isTextEmpty = !currentText.trim();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-48 h-48 flex items-center justify-center rounded-2xl bg-surface border border-border p-3 shadow-md transition-all duration-300 hover:shadow-lg accent-glow overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-105 ${
            isTextEmpty || error || isLoading ? 'hidden' : 'block'
          }`}
        />

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface/85 backdrop-blur-[1px] animate-pulse">
            <QrCode size={36} className="text-accent animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Generating</span>
          </div>
        )}

        {isTextEmpty && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-text/30 text-center px-4 select-none">
            <QrCode size={44} className="stroke-[1.25]" />
            <span className="text-xs font-semibold tracking-wide">Enter content to preview</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-red-500 text-center px-3">
            <AlertTriangle size={32} className="stroke-[1.5] text-red-500" />
            <span className="text-xs font-bold">Generation Failed</span>
            <span className="text-[9px] text-text/50 max-h-[48px] overflow-hidden leading-snug">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
