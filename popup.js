import { getActiveTabURL } from "./utils.js";

const test = async e => {
    console.log("boop");
    const activeTab = await getActiveTabURL();
    console.log(activeTab.id)

    chrome.tabs.sendMessage(activeTab.id, { action: "daily" });
};

const test2 = async e => {
    console.log("beep");
    const activeTab = await getActiveTabURL();
    console.log(activeTab.id)

    var inputText = document.getElementById('engagementNo').value;

    chrome.tabs.sendMessage(activeTab.id, { action: "engno", text: inputText.trim() });
}

const test3 = async e => {
    console.log("brrt");
    const activeTab = await getActiveTabURL();
    console.log(activeTab.id)
    
    const selectTag = document.getElementById('emsOptions').value;
    const hours = document.getElementById('hours').value;
    const desc = document.getElementById('description').value;


    chrome.tabs.sendMessage(activeTab.id, {action: "emsop", text: selectTag.trim(), time: hours, desc: desc})
}

const test4 = async e => {
    console.log("bam");
    const activeTab = await getActiveTabURL();
    console.log(activeTab.id)

    chrome.tabs.sendMessage(activeTab.id, { action: "verify" });
}

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    console.log(activeTab.url);
    
    if (activeTab.url.includes("iaccess.mossadams.com/workspace")) {
        console.log("You are currently on the timesheet page.");

        // Test Button EL
        const myButton = document.getElementById("myButton");
        myButton.addEventListener("click", test);

        // Eng Input EL
        const fillButton = document.getElementById('fillButton');
        fillButton.addEventListener('click', test2)

        // EMS EL
        const getValue = document.getElementById('emsButton');
        getValue.addEventListener('click', test3);

        // Verify EL
        const verifyButton = document.getElementById("verify");
        verifyButton.addEventListener('click', test4);
        // verifyButton.addEventListener("click", test4);
        // document.querySelector('tr[data-kendo-grid-item-index="1"]')
        // document.querySelector('tbody').childElementCount; - 1
    } else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title"> This is not an iAccess page.</div>';
    }

    document.querySelector('#go-to-options').addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
      });

});
