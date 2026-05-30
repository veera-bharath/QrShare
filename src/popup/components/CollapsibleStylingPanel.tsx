import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Palette, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';
import { useQRStore } from '../../store/useQRStore';

export const CollapsibleStylingPanel: React.FC = () => {
  const { qrStyle, setQrStyle } = useQRStore();
  const [isOpen, setIsOpen] = useState(false);

  // Preselected Material Design Dark Color Palette
  const foregroundPresets = ['#8ab4f8', '#ffffff', '#81c995', '#fdd663', '#f28b82', '#ff8bcb'];
  const backgroundPresets = ['#2a2a2a', '#1f1f1f', '#000000'];

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <div className="w-full border border-border rounded-xl bg-surface/50 overflow-hidden transition-all duration-300">
      {/* Panel Header Toggle */}
      <button
        onClick={togglePanel}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text/60 hover:text-text cursor-pointer hover:bg-surface/30 transition-all select-none"
      >
        <div className="flex items-center gap-2">
          <Palette size={13} className="text-accent" />
          <span>Styling Options</span>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Panel Body Content (Accordion slider) */}
      <div
        className={`transition-all duration-300 ease-in-out px-4 ${
          isOpen ? 'max-h-[320px] py-4 border-t border-border opacity-100 overflow-y-auto' : 'max-h-0 py-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Foreground Color Customizer */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text/50">Foreground (Dots)</span>
            <div className="flex items-center gap-2 flex-wrap">
              {foregroundPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => setQrStyle({ foregroundColor: color })}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform border hover:scale-110 active:scale-95 ${
                    qrStyle.foregroundColor === color ? 'border-accent scale-105 shadow-sm' : 'border-border/50'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {/* Native Color Picker */}
              <div className="relative w-6 h-6 rounded-full border border-border/50 overflow-hidden cursor-pointer hover:scale-110">
                <input
                  type="color"
                  value={qrStyle.foregroundColor}
                  onChange={(e) => setQrStyle({ foregroundColor: e.target.value })}
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                  title="Custom color"
                />
              </div>
            </div>
          </div>

          {/* Background Color Customizer */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text/50">Background</span>
            <div className="flex items-center gap-2 flex-wrap">
              {backgroundPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => setQrStyle({ backgroundColor: color })}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform border hover:scale-110 active:scale-95 ${
                    qrStyle.backgroundColor === color ? 'border-accent scale-105 shadow-sm' : 'border-border/50'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {/* Native Color Picker */}
              <div className="relative w-6 h-6 rounded-full border border-border/50 overflow-hidden cursor-pointer hover:scale-110">
                <input
                  type="color"
                  value={qrStyle.backgroundColor}
                  onChange={(e) => setQrStyle({ backgroundColor: e.target.value })}
                  className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                  title="Custom color"
                />
              </div>
            </div>
          </div>

          {/* Geometry Options (Dots & Corner Shapes) */}
          <div className="grid grid-cols-2 gap-3.5 border-t border-border/50 pt-3">
            {/* Dot Type Toggle */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text/45 flex items-center gap-1">
                <Sliders size={9} />
                Dot Geometry
              </span>
              <div className="flex rounded-lg bg-surface border border-border p-0.5 mt-1 select-none">
                <button
                  onClick={() => setQrStyle({ dotType: 'square' })}
                  className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded cursor-pointer transition-all ${
                    qrStyle.dotType === 'square' ? 'bg-accent text-bg shadow-sm' : 'text-text/60 hover:text-text'
                  }`}
                >
                  Square
                </button>
                <button
                  onClick={() => setQrStyle({ dotType: 'rounded' })}
                  className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded cursor-pointer transition-all ${
                    qrStyle.dotType === 'rounded' ? 'bg-accent text-bg shadow-sm' : 'text-text/60 hover:text-text'
                  }`}
                >
                  Circle
                </button>
              </div>
            </div>

            {/* Corner Type Toggle */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text/45 flex items-center gap-1">
                <Sliders size={9} />
                Finder Corners
              </span>
              <div className="flex rounded-lg bg-surface border border-border p-0.5 mt-1 select-none">
                <button
                  onClick={() => setQrStyle({ cornerType: 'square' })}
                  className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded cursor-pointer transition-all ${
                    qrStyle.cornerType === 'square' ? 'bg-accent text-bg shadow-sm' : 'text-text/60 hover:text-text'
                  }`}
                >
                  Square
                </button>
                <button
                  onClick={() => setQrStyle({ cornerType: 'rounded' })}
                  className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded cursor-pointer transition-all ${
                    qrStyle.cornerType === 'rounded' ? 'bg-accent text-bg shadow-sm' : 'text-text/60 hover:text-text'
                  }`}
                >
                  Squircle
                </button>
              </div>
            </div>
          </div>

          {/* Center Brand Logo Switch */}
          <div className="flex items-center justify-between border-t border-border/50 pt-3 select-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text/50">Overlay Brand Logo</span>
            <button
              onClick={() => setQrStyle({ useCenterLogo: !qrStyle.useCenterLogo })}
              className="text-accent cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title={qrStyle.useCenterLogo ? 'Disable center logo' : 'Enable center logo'}
            >
              {qrStyle.useCenterLogo ? (
                <ToggleRight size={22} className="stroke-[2.5]" />
              ) : (
                <ToggleLeft size={22} className="stroke-[2.5] text-text/30" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
