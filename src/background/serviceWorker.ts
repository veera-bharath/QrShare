/// <reference types="chrome" />

// Background Service Worker for QrShare Extension

chrome.runtime.onInstalled.addListener(() => {
  // 1. Context Menu for selected text
  chrome.contextMenus.create({
    id: 'generate-qr-selection',
    title: 'Generate QR for selection: "%s"',
    contexts: ['selection'],
  });

  // 2. Context Menu for links
  chrome.contextMenus.create({
    id: 'generate-qr-link',
    title: 'Generate QR for this link',
    contexts: ['link'],
  });

  // 3. Context Menu for page URL
  chrome.contextMenus.create({
    id: 'generate-qr-page',
    title: 'Generate QR for this page',
    contexts: ['page'],
  });

  // 4. Context Menu for images
  chrome.contextMenus.create({
    id: 'generate-qr-image',
    title: 'Generate QR for this image',
    contexts: ['image'],
  });
});

chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData) => {
  let textToShare = '';

  if (info.menuItemId === 'generate-qr-selection') {
    textToShare = info.selectionText || '';
  } else if (info.menuItemId === 'generate-qr-link') {
    textToShare = info.linkUrl || '';
  } else if (info.menuItemId === 'generate-qr-image') {
    textToShare = info.srcUrl || '';
  } else if (info.menuItemId === 'generate-qr-page') {
    textToShare = info.pageUrl || '';
  }

  if (textToShare.trim()) {
    // Store with a timestamp so the popup can discard stale entries
    chrome.storage.local.set({ pendingQRText: { text: textToShare, ts: Date.now() } }, () => {
      // Try to open the popup programmatically (requires Chrome 99+)
      const action = chrome.action as any;
      if (action && typeof action.openPopup === 'function') {
        action.openPopup().catch((err: any) => {
          console.warn('Programmatic openPopup failed, setting badge fallback:', err);
          setBadgeFallback();
        });
      } else {
        setBadgeFallback();
      }
    });
  }
});

function setBadgeFallback() {
  chrome.action.setBadgeText({ text: 'NEW' });
  chrome.action.setBadgeBackgroundColor({ color: '#8ab4f8' }); // Chrome Material Dark Blue
}
