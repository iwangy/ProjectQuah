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

    function getTextBeforeColon(inputString) {
        const parts = inputString.split(':');
        return parts[0];
    }

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
  