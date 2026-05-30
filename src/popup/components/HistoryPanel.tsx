import React from 'react';
import { History, Trash2, CornerDownRight } from 'lucide-react';
import { useQRStore } from '../../store/useQRStore';

export const HistoryPanel: React.FC = () => {
  const { history, setCurrentText, deleteHistoryItem, clearHistory } = useQRStore();

  const handleItemClick = (text: string) => {
    setCurrentText(text);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDisplayTitle = (text: string, title?: string) => {
    if (title && title !== text) return title;
    try {
      const url = new URL(text);
      return url.hostname + (url.pathname.length > 1 ? url.pathname : '');
    } catch {
      return text;
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-3 border border-dashed border-border rounded-xl text-text/25 gap-1.5 w-full select-none">
        <History size={16} className="stroke-[1.25]" />
        <span className="text-[9px] font-bold uppercase tracking-wider">No history recorded</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full pr-0.5">
      <div className="flex items-center justify-between select-none">
        <span className="text-xs font-semibold uppercase tracking-wider text-text/50 flex items-center gap-1">
          <History size={12} className="text-accent" />
          History ({history.length})
        </span>
        <button
          onClick={clearHistory}
          className="text-[9px] font-bold text-red-500 hover:text-red-400 cursor-pointer transition-colors uppercase tracking-wider"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-1.5 w-full max-h-[140px] overflow-y-auto pr-1">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.text)}
            className="group flex items-center justify-between p-2 rounded-xl bg-surface border border-border hover:border-accent hover:bg-accent/5 cursor-pointer transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 max-w-[85%]">
              <CornerDownRight size={10} className="text-accent/60 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-text/90 truncate" title={item.text}>
                  {getDisplayTitle(item.text, item.title)}
                </span>
                <span className="text-[8px] font-bold text-text/40">
                  {formatTime(item.timestamp)}
                </span>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteHistoryItem(item.id);
              }}
              className="p-1 rounded-lg text-text/25 hover:text-red-500 hover:bg-red-500/10 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0"
              title="Delete item"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
