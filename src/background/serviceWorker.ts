/// <reference types="chrome" />
// Background Service Worker for QrShare Extension

chrome.runtime.onInstalled.addListener(() => {
  // Create Context Menu for selected text
  chrome.contextMenus.create({
    id: 'generate-qr-selection',
    title: 'Generate QR for selection: "%s"',
    contexts: ['selection'],
  });

  // Create Context Menu for links
  chrome.contextMenus.create({
    id: 'generate-qr-link',
    title: 'Generate QR for this link',
    contexts: ['link'],
  });
});

chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData) => {
  let textToShare = '';

  if (info.menuItemId === 'generate-qr-selection') {
    textToShare = info.selectionText || '';
  } else if (info.menuItemId === 'generate-qr-link') {
    textToShare = info.linkUrl || '';
  }

  if (textToShare.trim()) {
    // Save the text to chrome storage for the popup to retrieve
    chrome.storage.local.set({ pendingQRText: textToShare }, () => {
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
  chrome.action.setBadgeBackgroundColor({ color: '#7c5cff' });
}
