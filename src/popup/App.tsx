import { useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { useQRStore } from '../store/useQRStore';
import { ThemeToggle } from './components/ThemeToggle';
import { QRViewer } from './components/QRViewer';
import { ActionsBar } from './components/ActionsBar';
import { InputSection } from './components/InputSection';
import { HistoryPanel } from './components/HistoryPanel';

export default function App() {
  const { setCurrentText, theme } = useQRStore();

  useEffect(() => {
    // 1. Sync theme class on init
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. Fetch context menu pending text or active tab URL
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
  }, [setCurrentText, theme]);

  return (
    <main className="w-[360px] p-4 bg-bg text-text transition-colors duration-200 flex flex-col gap-3.5 select-none">
      {/* Header */}
      <header className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-accent text-white shadow-md accent-glow">
            <QrCode size={18} className="stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
            QrShare
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Content Area */}
      <section className="flex flex-col gap-3.5 items-center w-full">
        <QRViewer />
        <ActionsBar />
        <InputSection />
        <HistoryPanel />
      </section>

      {/* Footer */}
      <footer className="text-center text-[9px] font-bold text-text/30 select-none border-t border-border/50 pt-2.5">
        Right-click links or selections to share instantly
      </footer>
    </main>
  );
}
