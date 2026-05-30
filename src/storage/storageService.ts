/// <reference types="chrome" />

export const storageService = {
  get: async <T>(key: string): Promise<T | null> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result: { [key: string]: any }) => {
          resolve((result[key] as T) || null);
        });
      });
    } else {
      const val = localStorage.getItem(key);
      try {
        return val ? (JSON.parse(val) as T) : null;
      } catch {
        return (val as T) || null;
      }
    }
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    } else {
      const strValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, strValue);
    }
  },

  remove: async (key: string): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], () => {
          resolve();
        });
      });
    } else {
      localStorage.removeItem(key);
    }
  }
};
