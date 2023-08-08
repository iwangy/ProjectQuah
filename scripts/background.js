// Background script to store the verifyData
const verifyDataMap = new Map();

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Use switch statements for better readability and maintainability
  switch (request.action) {
    case "sendVerifyData":
      // Update verifyDataMap with the received data
      // Use destructuring assignment to directly update the map.
      ({ data } = request);
      verifyDataMap.clear();
      data.forEach(([key, value]) => verifyDataMap.set(key, value));
      break;
    case "getVerifyData":
      // Respond to the popup with the stored verifyData
      sendResponse({ data: Array.from(verifyDataMap.entries()) });
      break;
    default:
      // Handle any other actions if needed
      break;
  }
});

// It's better to return a copy of the data to avoid direct mutation.
function getStoredVerifyData() {
  return new Map(verifyDataMap);
}
