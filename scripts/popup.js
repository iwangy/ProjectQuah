import { getActiveTabURL } from "../helpers/utils.js";

const test = async () => {
  console.log("boop");
  const activeTab = await getActiveTabURL();
  console.log(activeTab.id);

  chrome.tabs.sendMessage(activeTab.id, { action: "daily" });
};

const test4 = async () => {
  console.log("bam");
  const activeTab = await getActiveTabURL();
  console.log(activeTab.id);

  chrome.tabs.sendMessage(activeTab.id, { action: "verify" });
};

function updatePopupContent(verifyData) {
  const verifyDataElement = document.getElementById("verifyData");
  verifyDataElement.innerHTML = "";

  verifyData.forEach((value, key) => {
    const paragraph = document.createElement("p");
    const lineSpan = document.createElement("span");
    lineSpan.textContent = `Line ${key + 1}: `;
    lineSpan.style.fontWeight = "bold";
    paragraph.appendChild(lineSpan);

    const valueSpan = document.createElement("span");
    valueSpan.textContent = value;

    paragraph.appendChild(valueSpan);
    verifyDataElement.appendChild(paragraph);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendVerifyData") {
    const storedVerifyData = new Map(request.data);
    updatePopupContent(storedVerifyData);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  console.log(activeTab.url);

  if (activeTab.url.includes("iaccess.mossadams.com/workspace")) {
    console.log("You are currently on the timesheet page.");

    // Test Button Event Listener
    const myButton = document.getElementById("myButton");
    myButton.addEventListener("click", test);

    // Verify Button Event Listener
    const verifyButton = document.getElementById("verify");
    verifyButton.addEventListener('click', test4);

    chrome.runtime.sendMessage({ action: "getVerifyData" }, response => {
      const storedVerifyData = response.data;
      console.log(storedVerifyData);
      updatePopupContent(storedVerifyData);
    });
  } else {
    const container = document.querySelector(".container");
    container.innerHTML = '<div class="title"> This is not an iAccess page.</div>';
  }
});
