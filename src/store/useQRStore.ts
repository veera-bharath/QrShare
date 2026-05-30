/// <reference types="chrome" />
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import type { QRItem } from '../types/qr';

// Asynchronous persistent storage manager supporting Chrome API & LocalStorage
const chromeStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([name], (result: { [key: string]: any }) => {
          resolve(result[name] ? JSON.stringify(result[name]) : null);
        });
      });
    } else {
      return localStorage.getItem(name);
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [name]: JSON.parse(value) }, () => {
          resolve();
        });
      });
    } else {
      localStorage.setItem(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([name], () => {
          resolve();
        });
      });
    } else {
      localStorage.removeItem(name);
    }
  },
};

interface QRStore {
  currentText: string;
  qrDataUrl: string;
  history: QRItem[];
  isLoading: boolean;
  
  setCurrentText: (text: string) => void;
  setQrDataUrl: (url: string) => void;
  setLoading: (isLoading: boolean) => void;
  addToHistory: (text: string, title?: string) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

export const useQRStore = create<QRStore>()(
  persist(
    (set) => ({
      currentText: '',
      qrDataUrl: '',
      history: [],
      isLoading: false,

      setCurrentText: (text) => set({ currentText: text }),
      setQrDataUrl: (url) => set({ qrDataUrl: url }),
      setLoading: (isLoading) => set({ isLoading }),

      addToHistory: (text, title) => {
        const trimmedText = text.trim();
        if (!trimmedText) return;

        set((state) => {
          const filteredHistory = state.history.filter(
            (item) => item.text.trim() !== trimmedText
          );

          const newItem: QRItem = {
            id: Math.random().toString(36).substring(2, 9),
            text: trimmedText,
            timestamp: Date.now(),
            title: title || trimmedText,
          };

          const newHistory = [newItem, ...filteredHistory].slice(0, 10);
          return { history: newHistory };
        });
      },

      deleteHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'qrshare-store-v2', // Incremented storage version since schema changed
      storage: createJSONStorage(() => chromeStorage),
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);
