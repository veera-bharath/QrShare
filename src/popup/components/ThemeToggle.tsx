import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useQRStore } from '../../store/useQRStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useQRStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-surface border border-border hover:border-accent text-text transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer accent-glow"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-amber-400 animate-spin-slow" />
      ) : (
        <Moon size={18} className="text-violet-600 animate-pulse-slow" />
      )}
    </button>
  );
};
