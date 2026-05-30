import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Link } from 'lucide-react';
import { useQRStore } from '../../store/useQRStore';

export const InputSection: React.FC = () => {
  const { currentText, setCurrentText } = useQRStore();
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

  const isLimitNearing = localText.length > 1000;
  const isLimitExceeded = localText.length > 2000;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor="qr-input" className="text-xs font-semibold uppercase tracking-wider text-text/50 flex items-center gap-1">
          <Link size={12} className="text-accent" />
          Content / Link / Text
        </label>
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
          placeholder="Paste URL or type custom text here..."
          className="w-full min-h-[72px] max-h-[96px] p-3 text-sm rounded-xl bg-surface border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-text transition-all duration-200 resize-none font-normal"
          maxLength={2500}
        />
        
        {localText.length > 0 && (
          <div className={`absolute bottom-2 right-2 text-[9px] px-1.5 py-0.5 rounded font-medium ${
            isLimitExceeded 
              ? 'bg-red-500/10 text-red-500' 
              : isLimitNearing 
                ? 'bg-amber-500/10 text-amber-500' 
                : 'bg-text/5 text-text/40'
          }`}>
            {localText.length}/2000
          </div>
        )}
      </div>
    </div>
  );
};
