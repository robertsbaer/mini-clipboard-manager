const MAX_ITEMS = 10;

// Create context menu items when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveSelection",
    title: "Save selection to Clipboard Manager",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "savePageUrl",
    title: "Save Page URL to Clipboard Manager",
    contexts: ["page"],
  });
  chrome.contextMenus.create({
    id: "saveImage",
    title: "Save Image to Clipboard Manager",
    contexts: ["image"],
  });
});

// Listen for messages from content or popup scripts.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveItem") {
    saveItem(message.item).then(() => sendResponse({ status: "saved" }));
    return true; // asynchronous response.
  }
});

// Listen for context menu clicks.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveSelection" && info.selectionText) {
    saveItem({ content: info.selectionText, type: "text" });
  } else if (info.menuItemId === "savePageUrl" && info.pageUrl) {
    saveItem({ content: info.pageUrl, type: "url" });
  } else if (info.menuItemId === "saveImage" && info.srcUrl) {
    saveItem({ content: info.srcUrl, type: "image" });
  }
});

async function saveItem(newItem) {
  // Add a timestamp.
  newItem.date = new Date().toLocaleString();
  let { items } = await chrome.storage.local.get({ items: [] });
  // Prepend new item.
  items.unshift(newItem);
  // Keep only the 10 most recent.
  items = items.slice(0, MAX_ITEMS);
  await chrome.storage.local.set({ items });
}
