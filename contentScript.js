// UTILITIES
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clickElement(selector) {
    const element = document.querySelector(selector);
    element.dispatchEvent(new Event('click'));
}

function setInputValue(selector, value) {
    const inputElement = document.querySelector(selector).getElementsByTagName('input')[0];
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input'));
}

function getLookupTable(callback) {
    chrome.storage.sync.get("lookupTable", function(data) {
        const lookupTable = data.lookupTable || {};
        callback(lookupTable);
    });
}

function sendVerifyDataToPopup(verifyData) {
    chrome.runtime.sendMessage({ action: "sendVerifyData", data: Array.from(verifyData.entries()) });
}

// TICKET VALIDATION FUNCTIONS
function hasMultipleUSTicketNumbers(input) {
    const USPattern = /\bus[-:\s]?(\d{4,5})\b/g;
    const matches = input.match(USPattern);
    return matches ? matches.length <= 1 : false;
}

function isValidTicketNumberFormat(input) {
    const VPattern = /(?:^|\s)(v[-:\s]?\d{9})(?=\s|$)/g;
    const PPattern = /(?:^|\s)(p[-:\s]?\d{8})(?=\s|$)/g;
    const USPattern = /(?:^|\s)(us[-:\s]?\d{4,5})(?::)?(?:[.,;!?]|(?=\s|$))/g;
    return VPattern.test(input) || PPattern.test(input) || USPattern.test(input);
}

function checkMixTicketNumbers(input) {
    const mixedPattern = /(?:(v[-:\s]?\d{9})|(p[-:\s]?\d{8})|(us[-:\s]?\d{4,5}))/g;
    const mixedMatches = input.match(mixedPattern);

    if (mixedMatches) {
        const vMatches = mixedMatches.filter(match => /v[-:\s]?\d{9}/.test(match));
        const pMatches = mixedMatches.filter(match => /p[-:\s]?\d{8}/.test(match));
        const usMatches = mixedMatches.filter(match => /us[-:\s]?\d{4,5}/.test(match));

        return (vMatches.length > 0 || pMatches.length > 0) && usMatches.length > 0;
    }

    return false;
}

function checkVandP(input) {
    const VPattern = /^v\d{9}(?:\s|$)/;
    const PPattern = /^p\d{8}(?:\s|$)/;
    return VPattern.test(input) || PPattern.test(input);
}

function checkUSTicket(input) {
    const USPattern = /(?:^|\s)(us[-:\s]?\d{4,5})(?::)?(?:[.,;!?]|(?=\s|$))/g;
    if (USPattern.test(input)) {
        return hasMultipleUSTicketNumbers(input);
    }
    return "INVALID TICKET FORMAT: Double-check ticket number"; // The US ticket number format is invalid or multiple US tickets on the same line
}

function hasDescription(input) {
    const descriptionPattern = /(?:(?<=^|\s)(v[-:\s]?\d{9}|p[-:\s]?\d{8}|us[-:\s]?\d{4,5})(?::\s*|\s+)(.+)|(.+?)\s+(v[-:\s]?\d{9}|p[-:\s]?\d{8}|us[-:\s]?\d{4,5}))/;
    return descriptionPattern.test(input);
}

function isInputValid(input) {
    if (checkMixTicketNumbers(input)) {
        return "INVALID TICKET FORMAT: SIM & US Tickets cannot be in the same line"
    }

    if (!isValidTicketNumberFormat(input)) {
        return "INVALID TICKET FORMAT: Double-check ticket number";
    }

    if (checkVandP(input)) {
        if (hasDescription(input)) {
            return "PASSES: EVERYTHING OK";
        } else {
            return "INVALID TICKET FORMAT: Please add a description";
        }
    }

    if (checkUSTicket(input)) {
        if (hasDescription(input)) {
            return "PASSES: EVERYTHING OK";
        } else {
            return "INVALID TICKET FORMAT: Please add a description";
        }
    }

    return "INVALID TICKET FORMAT: Please only have 1 US ticket per entry";
}

(() => {
    let verifyData = new Map();
    let isRowAdded = false;

    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        console.log(request.action);
        const numRows = document.querySelector('tbody').childElementCount - 1;
        switch (request.action) {
            case "daily":
                console.log("1");
                clickElement('#dailytimeregistrationtable_create');
                break;

            case "engno":
                console.log("2");
                setInputValue('div[dm-data-id="jobnumber"]', request.text);
                await delay(1000);
                setInputValue('div[dm-data-id="taskdescriptionvar"]', "205");
                await delay(1000);
                chrome.storage.sync.get("currentState", function (obj) {
                    console.log(obj.currentState);
                    setInputValue('div[dm-data-id="specification3name"]', obj.currentState);
                });
                await delay(1000);
                clickElement('button[dm-data-id="dm-primary-action-button-0"]');
                await delay(500);
                clickElement('#dailytimeregistrationtable_create');
                break;

            case "emsop":
                console.log("3");
                let jobNumber, taskDesc, descCode, descCodeVal;
                switch (request.text) {
                    case "EMS Support":
                        jobNumber = "641050.0115";
                        taskDesc = "1300";
                        descCodeVal = '';
                        getLookupTable(function(lookupTable) {
                            descCode = request.desc;
                            console.log(descCode);
                            descCodeVal = lookupTable[descCode];
                            console.log(desCodeVal + "THIS IS A TEST");
                        });
                        break;
                    case "EMS Security":
                        jobNumber = "641050.0120";
                        taskDesc = "1300";
                        break;
                    case "EMS Enhancements":
                        jobNumber = "641050.0117";
                        taskDesc = "1300";
                        break;
                    case "Non-Billable Admin":
                        jobNumber = "999910.9997";
                        taskDesc = "205";
                        break;
                    case "Non-Billable CPE":
                        jobNumber = "999910.9997";
                        taskDesc = "220";
                        break;
                    default:
                        break;
                }

                if (jobNumber && taskDesc) {
                    setInputValue('div[dm-data-id="jobnumber"]', jobNumber);
                    await delay(1000);
                    setInputValue('div[dm-data-id="taskdescriptionvar"]', descCodeVal);
                    await delay(1000);
                    chrome.storage.sync.get("currentState", function (obj) {
                        console.log(obj.currentState);
                        setInputValue('div[dm-data-id="specification3name"]', obj.currentState);
                    });
                    await delay(500);
                    setInputValue('div[dm-data-id="numberof"]', request.time);
                    await delay(500);
                    clickElement('button[dm-data-id="dm-primary-action-button-0"]');
                    await delay(500);
                    clickElement('#dailytimeregistrationtable_create');
                }

                break;
            
            case "verify":
                verifyData.clear();

                const entryCount = document.querySelector('tbody').childElementCount - 1;
                const trSelector = `tr[data-kendo-grid-item-index="${entryCount}"]`;
                const engSelector = `${trSelector} td[data-kendo-grid-column-index="4"]`;
                const engNo = document.querySelector(engSelector).textContent;
                console.log(engNo + "hi");
                if(engNo == "") {
                    console.log
                    clickElement('#dailytimeregistrationtable_create');
                    await delay(500);
                }

                // if (numRows - (document.querySelector('tbody').childElementCount - 1) == 1) {
                //     isRowAdded = false;
                // };
                // console.log(numRows)
                // const lastRowSelector = document.querySelector(`tr[data-kendo-grid-item-index="${numRows}"]`)
                // clickElement(lastRowSelector);
                // console.log("click");
                
                // if (!isRowAdded) {
                //     clickElement('#dailytimeregistrationtable_create');
                //     await delay(500);
                //     isRowAdded = true;
                // }

                for (let i = 0; i < document.querySelector('tbody').childElementCount - 1; i++) {
                    const dataIndex = i; // Store the current value of i in a variable
                    const trSelector = `tr[data-kendo-grid-item-index="${dataIndex}"]`;
                    const tdSelector = `${trSelector} td[data-kendo-grid-column-index="8"]`;
                    const engSelector = `${trSelector} td[data-kendo-grid-column-index="4"]`;
                    const engNo = document.querySelector(engSelector).textContent;
                    console.log(engNo);
                    if(engNo == "641050.0120" || engNo == "641050.0115" || engNo == "641050.0117") {
                        console.log(engNo)
                        verifyData.set(dataIndex, isInputValid(document.querySelector(tdSelector).textContent.toLowerCase()))
                        console.log(document.querySelector(tdSelector).textContent);
                        console.log(isInputValid(document.querySelector(tdSelector).textContent.toLowerCase()));
                    }
                    
                    // verifyData.set(dataIndex, isInputValid(document.querySelector(tdSelector).textContent.toLowerCase()))
                    // console.log(document.querySelector(tdSelector).textContent);
                    // console.log(isInputValid(document.querySelector(tdSelector).textContent.toLowerCase()));
                }

                console.log(verifyData);
                sendVerifyDataToPopup(verifyData);
                break;
            
            default:
                break;
        }
    });
})();
