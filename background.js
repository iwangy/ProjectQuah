chrome.tabs.onUpdated.addListener((tabId, tab) => {

  if (changeInfo.status === 'complete') {
    // Inject your content script into the updated tab
    chrome.tabs.executeScript(tabId, { file: "contentScript.js" }, function() {
      // Content script has been injected
      console.log("Content script injected");
    });
  }
    // if (tab.url && tab.url.includes("EmployeeNumber=")) {
    //   const employeeNumberRegex = /EmployeeNumber=(\d+)/;
    //   const match = tab.url.match(employeeNumberRegex);

    //   if (match) {
    //     const employeeNumber = match[1];
    //     console.log(employeeNumber)
    //   }
    //   console.log("ok.")
      
    //   // Check if the employee number is valid (not null)
    //   if (employeeNumber) {
    //     // Now you can send the employee number to the content script
    //     chrome.tabs.sendMessage(tabId, {
    //       type: "NEW",
    //       employeeNumber: employeeNumber,
    //     });
    //   }
    // }
  });
  