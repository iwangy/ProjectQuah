// Background script to store the verifyData
let storedVerifyData = new Map();

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Inject content script into the updated tab
    chrome.scripting.executeScript(tabId, { file: "contentScript.js" }, () => {
      // Content script has been injected
      console.log("Content script injected");
    });
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendVerifyData") {
    // Update storedVerifyData with the received data
    storedVerifyData = new Map(request.data);
  } else if (request.action === "getVerifyData") {
    // Respond to popup with the stored verifyData
    sendResponse({ data: Array.from(storedVerifyData.entries()) });
  }
});

// Function to get the stored verifyData
function getStoredVerifyData() {
  return storedVerifyData;
}
