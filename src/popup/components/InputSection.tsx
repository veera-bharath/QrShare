import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Link2, Mail, Phone, Wifi, FileText } from 'lucide-react';
import { useQRStore } from '../../store/useQRStore';

const MAX_INPUT_LENGTH = 2000;

export const InputSection: React.FC = () => {
  const { currentText, setCurrentText, detectedType } = useQRStore();
  const [localText, setLocalText] = useState(currentText);
  const debounceTimer = useRef<number | null>(null);

  // Sync local text when store text changes (e.g. from history click or active tab load)
  useEffect(() => {
    setLocalText(currentText);
  }, [currentText]);

  // Debounced store update
  useEffect(() => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      if (localText !== currentText) {
        setCurrentText(localText);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, [localText, currentText, setCurrentText]);

  const handleClear = () => {
    setLocalText('');
    setCurrentText('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
  };

  const isLimitNearing = localText.length > MAX_INPUT_LENGTH * 0.5;
  const isLimitExceeded = localText.length > MAX_INPUT_LENGTH;

  // Render the smart type badge with custom icons
  const renderTypeBadge = () => {
    const iconSize = 11;
    switch (detectedType) {
      case 'url':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full select-none animate-fade-in border border-accent/10">
            <Link2 size={iconSize} />
            URL Link
          </span>
        );
      case 'email':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full select-none animate-fade-in border border-emerald-500/10">
            <Mail size={iconSize} />
            Email Address
          </span>
        );
      case 'phone':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full select-none animate-fade-in border border-amber-500/10">
            <Phone size={iconSize} />
            Phone Number
          </span>
        );
      case 'wifi':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-violet-400 uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded-full select-none animate-fade-in border border-violet-500/10">
            <Wifi size={iconSize} />
            WiFi Network
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-text/40 uppercase tracking-wider bg-text/5 px-2 py-0.5 rounded-full select-none animate-fade-in border border-text/10">
            <FileText size={iconSize} />
            Plain Text
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="qr-input" className="text-xs font-semibold uppercase tracking-wider text-text/50 select-none">
            Analyzed Input
          </label>
          {localText && renderTypeBadge()}
        </div>
        {localText && (
          <button
            onClick={handleClear}
            className="text-xs font-medium text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors duration-150"
            title="Clear text"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          id="qr-input"
          value={localText}
          onChange={handleInputChange}
          placeholder="Paste URL, email, wifi credentials, or custom text here..."
          className="w-full min-h-[72px] max-h-[96px] p-3 text-sm rounded-xl bg-surface border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-text transition-all duration-200 resize-none font-normal"
          maxLength={MAX_INPUT_LENGTH}
        />

        {localText.length > 0 && (
          <div className={`absolute bottom-2 right-2 text-[9px] px-1.5 py-0.5 rounded font-medium select-none ${
            isLimitExceeded
              ? 'bg-red-500/10 text-red-500'
              : isLimitNearing
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-text/5 text-text/40'
          }`}>
            {localText.length}/{MAX_INPUT_LENGTH}
          </div>
        )}
      </div>
    </div>
  );
};
