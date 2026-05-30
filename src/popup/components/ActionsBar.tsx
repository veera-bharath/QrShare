import React, { useState } from 'react';
import { Download, Copy, Clipboard, Maximize2, Check, X } from 'lucide-react';
import { useQRStore } from '../../store/useQRStore';

export const ActionsBar: React.FC = () => {
  const { currentText, qrDataUrl } = useQRStore();
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImg, setCopiedImg] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!qrDataUrl || !currentText.trim()) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      
      let filename = 'qrshare';
      try {
        const url = new URL(currentText);
        filename = `qrshare-${url.hostname}`;
      } catch {
        filename = `qrshare-${currentText.substring(0, 15).replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
      }
      
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Downloaded QR Code');
    } catch (err) {
      console.error(err);
      triggerToast('Download failed');
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      setCopiedText(true);
      triggerToast('Copied content text');
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error(err);
      triggerToast('Failed to copy text');
    }
  };

  const handleCopyImage = async () => {
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopiedImg(true);
      triggerToast('Copied QR image');
      setTimeout(() => setCopiedImg(false), 2000);
    } catch (err) {
      console.error(err);
      triggerToast('Failed to copy image');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-accent text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg glass-panel animate-fade-in z-50 transition-all select-none">
          {toastMessage}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between gap-2.5 w-full">
        {/* Copy Image */}
        <button
          onClick={handleCopyImage}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface border border-border hover:border-accent text-text/70 hover:text-text transition-all duration-200 cursor-pointer w-[76px] hover:scale-[1.03] active:scale-[0.97]"
          title="Copy QR Image to Clipboard"
        >
          {copiedImg ? <Check size={16} className="text-green-500 animate-pulse" /> : <Copy size={16} />}
          <span className="text-[9px] font-bold tracking-wide">Copy Img</span>
        </button>

        {/* Copy Text */}
        <button
          onClick={handleCopyText}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface border border-border hover:border-accent text-text/70 hover:text-text transition-all duration-200 cursor-pointer w-[76px] hover:scale-[1.03] active:scale-[0.97]"
          title="Copy Text Content to Clipboard"
        >
          {copiedText ? <Check size={16} className="text-green-500 animate-pulse" /> : <Clipboard size={16} />}
          <span className="text-[9px] font-bold tracking-wide">Copy Text</span>
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface border border-border hover:border-accent text-text/70 hover:text-text transition-all duration-200 cursor-pointer w-[76px] hover:scale-[1.03] active:scale-[0.97]"
          title="Download QR as PNG"
        >
          <Download size={16} />
          <span className="text-[9px] font-bold tracking-wide">Download</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface border border-border hover:border-accent text-text/70 hover:text-text transition-all duration-200 cursor-pointer w-[76px] hover:scale-[1.03] active:scale-[0.97]"
          title="View Fullscreen"
        >
          <Maximize2 size={16} />
          <span className="text-[9px] font-bold tracking-wide">Expand</span>
        </button>
      </div>

      {/* Fullscreen Modal Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-[3px] z-50 flex flex-col items-center justify-center p-6 animate-fade-in select-none">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Close"
          >
            <X size={20} />
          </button>
          
          <div className="bg-white p-5 rounded-3xl shadow-2xl max-w-[270px] w-full flex flex-col items-center justify-center gap-4 border border-white/25 animate-scale-in">
            <img src={qrDataUrl} alt="QR Fullscreen" className="w-full aspect-square object-contain" draggable={false} />
            <span className="text-[10px] font-semibold text-gray-500 truncate w-full text-center px-1.5 select-text">
              {currentText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
