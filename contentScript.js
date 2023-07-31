(() => {
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
          // The lookup table object will be available in data.lookupTable
          const lookupTable = data.lookupTable || {};
          callback(lookupTable);
        });
    }

    function sendVerifyDataToPopup(verifyData) {
        chrome.runtime.sendMessage({ action: "sendVerifyData", data: Array.from(verifyData.entries()) });
    }


    // VALIDATION CODE
    // Checks for multiple US ticket numbers in line
    // returns true if only 1 ticket number
    // returns false otherwise
    function hasMultipleUSTicketNumbers(input) {
        // const USPattern = /(US-\d{4,5})/g;
        const USPattern = /\bUS[-:\s]?(\d{4,5})\b/g;
        const matches = input.match(USPattern);
        return matches ? matches.length <= 1 : false;
        // return matches ? matches.length > 1 : false;
        // return matches ? true : matches.length <= 1;

    }

    // Checks for valid ticket format
    // returns true if ticket format is valid
    // returns false otherwise
    function isValidTicketNumberFormat(ticket) {
        const VPattern = /(?:^|\s)(V[-:\s]?\d{9})(?=\s|$)/g;
        // const VPattern = /^V\d{9}(?:\s|$)/;
        const PPattern = /(?:^|\s)(P[-:\s]?\d{8})(?=\s|$)/g
        // const PPattern = /^P\d{8}(?:\s|$)/;
        const USPattern = /(?:^|\s)(US[-:\s]?\d{4,5})(?::)?(?:[.,;!?]|(?=\s|$))/g;
        // const USPattern = /(?:^|\s)(US[-:\s]?\d{4,5})(?=\s|$)/g;
        // const USPattern = /^US-\d{4,5}(?:\s|$)/;

        return VPattern.test(ticket) || PPattern.test(ticket) || USPattern.test(ticket);
    }

    // Used to split checks among V,P and US tickets
    function checkVandP(input) {
        const VPattern = /^V\d{9}(?:\s|$)/;
        const PPattern = /^P\d{8}(?:\s|$)/;

        if (VPattern.test(input) || PPattern.test(input)) {
            return true; // The ticket number format is V P
        }

        return false; // The ticket number format is not V P
    }

    // Used to split checks among V,P and US tickets
    function checkUSTicket(input) {
        const USPattern = /(?:^|\s)(US[-:\s]?\d{4,5})(?::)?(?:[.,;!?]|(?=\s|$))/g;
        // const USPattern = /(?:^|\s)(US[-:\s]?\d{4,5})(?=\s|$)/g;
        // const USPattern = /^US-\d{4,5}(?:\s|$)/;
        // const multipleUSPattern = /(US-\d{4,5}).*?\1/;

        if (USPattern.test(input)) {
            return hasMultipleUSTicketNumbers(input);
        }

        return "INVALID TICKET FORMAT: Double check ticket number"; // The US ticket number format is invalid or multiple US tickets on the same line
    }

    function hasDescription(input) {
        const descriptionPattern = /(?:(?<=^|\s)(V[-:\s]?\d{9}|P[-:\s]?\d{8}|US[-:\s]?\d{4,5})(?::\s*|\s+)(.+)|(.+?)\s+(V[-:\s]?\d{9}|P[-:\s]?\d{8}|US[-:\s]?\d{4,5}))/;
        // const descriptionPattern = /(?:(?<=^|\s)(V[-:\s]?\d{9}|P[-:\s]?\d{8}|US[-:\s]?\d{4,5})[:\s]?(.+)|(.+?)[:\s]?(V[-:\s]?\d{9}|P[-:\s]?\d{8}|US[-:\s]?\d{4,5}))/;
        // const descriptionPattern = /(?:(?<=^|\s)(V[-:\s]?\d{9}|P[-:\s]?\d{8}|US[-:\s]?\d{4,5})\s(.+)|(.+?)\s(V[-:\s]?\d{9}|P[-:\s]?\d{8}|US[-:\s]?\d{4,5}))/;
        // const descriptionPattern = /^(V\d{9}|P\d{8}|US-\d{4,5})\s.+/;

        return descriptionPattern.test(input);
    }

    function isInputValid(input) {
        // Check if the string begins with a V, P, or US
        if (!isValidTicketNumberFormat(input)) {
            return "INVALID TICKET FORMAT: Double check ticket number1";
            return false; // Invalid ticket number format
        }

        // Check for V and P tickets
        if (checkVandP(input)) {
            // Check for descriptions
            if (hasDescription(input)) {
                return "PASSES: EVERYTHING OK";
                return true; // Valid V or P ticket with description
            } else {
                return "INVALID TICKET FORMAT: Please add a description"
                return false; // V or P ticket without a description
            }
        }

        // Check for US tickets
        if (checkUSTicket(input)) {
            // Check for descriptions
            if (hasDescription(input)) {
                return ("PASSES: EVERYTHING OK");
                return true; // Valid US ticket with description
            } else {
                return "INVALID TICKET FORMAT: Please add a description"
                return false; // US ticket without a description
            }
        } else {
            return "INVALID TICKET FORMAT: Please only have 1 US ticket per entry"
        }

    }
    // VALIDATION CODE

    let verifyData = new Map();

    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        console.log(request.action);

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
            // verifyButton.addEventListener("click", test4);
            // document.querySelector('tr[data-kendo-grid-item-index="1"]')
            // document.querySelector('tbody').childElementCount; - 1
                // for(let i = 1; i < document.querySelector('tbody').childElementCount; i++) {
                //     console.log(document.querySelector('tr[data-kendo-grid-item-index="${i}"]').querySelector('td[data-kendo-grid-column-index="8"]').textContent)
                // }
                verifyData.clear();


                for (let i = 0; i < document.querySelector('tbody').childElementCount - 1; i++) {
                    const dataIndex = i; // Store the current value of i in a variable
                    const trSelector = `tr[data-kendo-grid-item-index="${dataIndex}"]`;
                    const tdSelector = `${trSelector} td[data-kendo-grid-column-index="8"]`;
                    verifyData.set(dataIndex, isInputValid(document.querySelector(tdSelector).textContent))
                    console.log(document.querySelector(tdSelector).textContent);
                    console.log(isInputValid(document.querySelector(tdSelector).textContent));
                }

                console.log(verifyData);
                sendVerifyDataToPopup(verifyData);

                  

            default:
                break;
        }
    });
})();


// (() => {

//     function delay(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }

//     chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//         // const { type, value, thingId } = obj;
//         console.log(request.action);
    
//         if (request.action === "daily") {
//         //   employeeNumber = thingId;
//           console.log("1");
//           const test = document.getElementById('dailytimeregistrationtable_create');
//           const event = new Event('click', {
//             bubbles: true,  // Set to true if the event bubbles (optional)
//             cancelable: true  // Set to true if the event can be canceled (optional)
//           });
          
//           test.dispatchEvent(event);
//         }

//         if (request.action === "engno") {
//             console.log("2");
//             const test1 = document.querySelector('div[dm-data-id="jobnumber"]').getElementsByTagName('input')[0];
//             test1.value = request.text;
//             test1.dispatchEvent(new Event('input'));

//             await delay(1000);

//             const test3 = document.querySelector('div[dm-data-id="taskdescriptionvar"]').getElementsByTagName('input')[0];
//             test3.value = "205";
//             test3.dispatchEvent(new Event('input'));

//             await delay(1000);
          
//             const test2 = document.querySelector('div[dm-data-id="specification3name"]').getElementsByTagName('input')[0];
//             chrome.storage.sync.get("currentState", function (obj) {
//                 console.log(obj.currentState);
//                 test2.value = obj.currentState;
//                 test2.dispatchEvent(new Event('input'));
//             });
            
//             await delay(1000);

//             const test4 = document.querySelector('button[dm-data-id="dm-primary-action-button-0"]')
//             test4.dispatchEvent(new Event('click'));

//             await delay(500);

//             const test = document.getElementById('dailytimeregistrationtable_create');
//             test.dispatchEvent(new Event('click'));

//         }

//         if (request.action === "emsop") {
//             console.log("3");
//             console.log(request.text);
//             if (request.text == "EMS Support") {
//                 const test1 = document.querySelector('div[dm-data-id="jobnumber"]').getElementsByTagName('input')[0];
//                 test1.value = "641050.0115";
//                 test1.dispatchEvent(new Event('input'));

//                 await delay(1000);

//                 const test3 = document.querySelector('div[dm-data-id="taskdescriptionvar"]').getElementsByTagName('input')[0];
//                 test3.value = "1300";
//                 test3.dispatchEvent(new Event('input'));        

//                 await delay(1000);

//                 const test2 = document.querySelector('div[dm-data-id="specification3name"]').getElementsByTagName('input')[0];
//                 chrome.storage.sync.get("currentState", function (obj) {
//                     console.log(obj.currentState);
//                     test2.value = obj.currentState;
//                     test2.dispatchEvent(new Event('input'));
//                 });

//                 await delay(1000);

//                 const test5 = document.querySelector('div[dm-data-id="numberof"]').getElementsByTagName('input')[0];
//                 test5.value = request.time;
//                 test5.dispatchEvent(new Event('input'));
                
//                 await delay(500);

//                 const test4 = document.querySelector('button[dm-data-id="dm-primary-action-button-0"]');
//                 test4.dispatchEvent(new Event('click'));

//                 await delay(500);

//                 const test = document.getElementById('dailytimeregistrationtable_create');
//                 test.dispatchEvent(new Event('click'));

//             } else if (request.text == "EMS Security") {
//                 const test1 = document.querySelector('div[dm-data-id="jobnumber"]').getElementsByTagName('input')[0];
//                 test1.value = "641050.0120";
//                 console.log(test1.value);
//                 test1.dispatchEvent(new Event('input'));

//                 await delay(1000);

//                 const test3 = document.querySelector('div[dm-data-id="taskdescriptionvar"]').getElementsByTagName('input')[0];
//                 test3.value = "1300";
//                 test3.dispatchEvent(new Event('input'));        

//                 await delay(1000);

//                 const test2 = document.querySelector('div[dm-data-id="specification3name"]').getElementsByTagName('input')[0];
//                 chrome.storage.sync.get("currentState", function (obj) {
//                     console.log(obj.currentState);
//                     test2.value = obj.currentState;
//                     test2.dispatchEvent(new Event('input'));
//                 });

//                 await delay(500);

//                 const test5 = document.querySelector('div[dm-data-id="numberof"]').getElementsByTagName('input')[0];
//                 test5.value = request.time;
//                 test5.dispatchEvent(new Event('input'));

//                 await delay(500);

//                 const test4 = document.querySelector('button[dm-data-id="dm-primary-action-button-0"]');
//                 test4.dispatchEvent(new Event('click'));

//                 await delay(500);

//                 const test = document.getElementById('dailytimeregistrationtable_create');
//                 test.dispatchEvent(new Event('click'));

//             } else if (request.text == "EMS Enhancements") {
//                 const test1 = document.querySelector('div[dm-data-id="jobnumber"]').getElementsByTagName('input')[0];
//                 test1.value = "641050.0117";
//                 test1.dispatchEvent(new Event('input'));

//                 await delay(1000);

//                 const test3 = document.querySelector('div[dm-data-id="taskdescriptionvar"]').getElementsByTagName('input')[0];
//                 test3.value = "1300";
//                 test3.dispatchEvent(new Event('input'));        

//                 await delay(1000);

//                 const test2 = document.querySelector('div[dm-data-id="specification3name"]').getElementsByTagName('input')[0];
//                 chrome.storage.sync.get("currentState", function (obj) {
//                     console.log(obj.currentState);
//                     test2.value = obj.currentState;
//                     test2.dispatchEvent(new Event('input'));
//                 });

//                 await delay(500);

//                 const test5 = document.querySelector('div[dm-data-id="numberof"]').getElementsByTagName('input')[0];
//                 test5.value = request.time;
//                 test5.dispatchEvent(new Event('input'));

//                 await delay(500);

//                 const test4 = document.querySelector('button[dm-data-id="dm-primary-action-button-0"]')
//                 test4.dispatchEvent(new Event('click'));

//                 await delay(500);

//                 const test = document.getElementById('dailytimeregistrationtable_create');
//                 test.dispatchEvent(new Event('click'));
//             } else if (request.text == "Non-Billable Admin") {
//                 const test1 = document.querySelector('div[dm-data-id="jobnumber"]').getElementsByTagName('input')[0];
//                 test1.value = "999910.9997";
//                 test1.dispatchEvent(new Event('input'));

//                 await delay(1000);

//                 const test3 = document.querySelector('div[dm-data-id="taskdescriptionvar"]').getElementsByTagName('input')[0];
//                 test3.value = "205";
//                 test3.dispatchEvent(new Event('input'));        

//                 await delay(1000);

//                 const test2 = document.querySelector('div[dm-data-id="specification3name"]').getElementsByTagName('input')[0];
//                 chrome.storage.sync.get("currentState", function (obj) {
//                     console.log(obj.currentState);
//                     test2.value = obj.currentState;
//                     test2.dispatchEvent(new Event('input'));
//                 });

//                 await delay(500);

//                 const test5 = document.querySelector('div[dm-data-id="numberof"]').getElementsByTagName('input')[0];
//                 test5.value = request.time;
//                 test5.dispatchEvent(new Event('input'));

//                 await delay(500);

//                 const test4 = document.querySelector('button[dm-data-id="dm-primary-action-button-0"]')
//                 test4.dispatchEvent(new Event('click'));

//                 await delay(500);

//                 const test = document.getElementById('dailytimeregistrationtable_create');
//                 test.dispatchEvent(new Event('click'));

//             } else if (request.text == "Non-Billable CPE") {
//                 const test1 = document.querySelector('div[dm-data-id="jobnumber"]').getElementsByTagName('input')[0];
//                 test1.value = "999910.9997";
//                 test1.dispatchEvent(new Event('input'));

//                 await delay(1000);

//                 const test3 = document.querySelector('div[dm-data-id="taskdescriptionvar"]').getElementsByTagName('input')[0];
//                 test3.value = "220";
//                 test3.dispatchEvent(new Event('input'));        

//                 await delay(1000);

//                 const test2 = document.querySelector('div[dm-data-id="specification3name"]').getElementsByTagName('input')[0];
//                 chrome.storage.sync.get("currentState", function (obj) {
//                     console.log(obj.currentState);
//                     test2.value = obj.currentState;
//                     test2.dispatchEvent(new Event('input'));
//                 });

//                 await delay(500);

//                 const test5 = document.querySelector('div[dm-data-id="numberof"]').getElementsByTagName('input')[0];
//                 test5.value = request.time;
//                 test5.dispatchEvent(new Event('input'));

//                 await delay(500);

//                 const test4 = document.querySelector('button[dm-data-id="dm-primary-action-button-0"]')
//                 test4.dispatchEvent(new Event('click'));

//                 await delay(500);

//                 const test = document.getElementById('dailytimeregistrationtable_create');
//                 test.dispatchEvent(new Event('click'));
//             }
//         }
//       });
// })();

// -------

// (() => {
//     let employeeNumber;
  
//     chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//       // const { type, value, thingId } = obj;
//       console.log(request.action);
  
//       switch (request.action) {
//         case "daily":
//           // employeeNumber = thingId;
//           console.log("1");
//           const test = document.getElementById('dailytimeregistrationtable_create');
//           const event = new Event('click', {
//             bubbles: true,  // Set to true if the event bubbles (optional)
//             cancelable: true  // Set to true if the event can be canceled (optional)
//           });
  
//           test.dispatchEvent(event);
//           break;
  
//         case "engno":
//           console.log("2");
//           const test1 = document.querySelector('div[dm-data-id="jobnumber"]').getElementsByTagName('input')[0];
//           test1.value = request.text;
//           break;
  
//         default:
//           break;
//       }
//     });
//   })();
  