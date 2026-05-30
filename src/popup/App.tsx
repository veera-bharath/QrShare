import { useEffect } from 'react';
import { useQRStore } from '../store/useQRStore';
import { QRViewer } from './components/QRViewer';
import { ActionsBar } from './components/ActionsBar';
import { InputSection } from './components/InputSection';
import { CollapsibleStylingPanel } from './components/CollapsibleStylingPanel';
import { HistoryPanel } from './components/HistoryPanel';

export default function App() {
  const { setCurrentText } = useQRStore();

  useEffect(() => {
    // Fetch context menu pending text or active tab URL
    const initializeText = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        // First check for pending text from context menu click
        chrome.storage.local.get(['pendingQRText'], (result: { [key: string]: any }) => {
          if (result.pendingQRText) {
            const pendingText = result.pendingQRText;
            setCurrentText(pendingText);
            
            // Clean up storage and badge
            chrome.storage.local.remove(['pendingQRText']);
            chrome.action.setBadgeText({ text: '' });
          } else {
            // Otherwise, grab current tab URL
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
              if (tabs && tabs[0] && tabs[0].url) {
                const activeUrl = tabs[0].url;
                // Exclude internal chrome:// or edge:// pages for better utility
                if (!activeUrl.startsWith('chrome://') && !activeUrl.startsWith('edge://')) {
                  setCurrentText(activeUrl);
                } else {
                  setCurrentText('');
                }
              }
            });
          }
        });
      } else {
        // Fallback for local browser testing
        const params = new URLSearchParams(window.location.search);
        const demoUrl = params.get('url') || 'https://github.com';
        setCurrentText(demoUrl);
      }
    };

    initializeText();
  }, [setCurrentText]);

  return (
    <main className="w-[360px] p-4 bg-bg text-text transition-colors duration-200 flex flex-col gap-3.5 select-none animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <img
            src="/icon-32.png"
            alt="QrShare Logo"
            className="w-7 h-7 object-contain rounded-lg shadow-sm accent-glow select-none"
            draggable={false}
          />
          <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
            QrShare
          </span>
        </div>
      </header>

      {/* Content Area */}
      <section className="flex flex-col gap-3.5 items-center w-full">
        <QRViewer />
        <ActionsBar />
        <InputSection />
        <CollapsibleStylingPanel />
        <HistoryPanel />
      </section>

      {/* Footer */}
      <footer className="text-center text-[9px] font-bold text-text/30 select-none border-t border-border/50 pt-2.5">
        Right-click links or selections to share instantly
      </footer>
    </main>
  );
}
