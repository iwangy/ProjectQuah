// document.addEventListener('DOMContentLoaded', function() {
//   const fileInput = document.getElementById('fileInput');
//   const statusMessage = document.getElementById('statusMessage');
//   const stateSelect = document.getElementById('state');

//   fileInput.addEventListener('change', handleFileUpload);

//   // Saves options to chrome.storage
//   const saveOptions = () => {
//     const state = stateSelect.value;

//     chrome.storage.sync.set(
//       { currentState: state },
//       () => {
//         // Update status to let the user know options were saved.
//         statusMessage.textContent = 'Options saved.';
//         setTimeout(() => {
//           statusMessage.textContent = '';
//         }, 750);
//       }
//     );
//   };

//   // Restores select box state using the preferences
//   // stored in chrome.storage.
//   const restoreOptions = () => {
//     chrome.storage.sync.get(
//       { currentState: "WA" },
//       (items) => {
//         stateSelect.value = items.currentState;
//       }
//     );
//   };

//   function handleFileUpload(event) {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onload = function(event) {
//       try {
//         const fileContent = event.target.result;
//         const lookupTable = JSON.parse(fileContent); // Or parse CSV data if using CSV format

//         // Store the lookupTable in Chrome storage
//         chrome.storage.sync.set({ lookupTable }, function() {
//           statusMessage.textContent = 'Lookup table uploaded successfully!';
//         });

//       } catch (error) {
//         statusMessage.textContent = 'Error parsing file content. Please upload a valid JSON or CSV file.';
//         console.error('Error parsing file content:', error);
//       }
//     };

//     reader.readAsText(file);
//   }

//   document.addEventListener('DOMContentLoaded', restoreOptions);
//   document.getElementById('save').addEventListener('click', saveOptions);
// });


// // // Saves options to chrome.storage
// // const saveOptions = () => {
// //     const state = document.getElementById('state').value;
  
// //     chrome.storage.sync.set(
// //       { currentState: state },
// //       () => {
// //         // Update status to let user know options were saved.
// //         const status = document.getElementById('status');
// //         status.textContent = 'Options saved.';
// //         setTimeout(() => {
// //           status.textContent = '';
// //         }, 750);
// //       }
// //     );
// //   };
  
// //   // Restores select box and checkbox state using the preferences
// //   // stored in chrome.storage.
// //   const restoreOptions = () => {
// //     chrome.storage.sync.get(
// //       { currentState: "WA", },
// //       (items) => {
// //         document.getElementById('state').value = items.currentState;
// //       }
// //     );
// //   };
  
// //   document.addEventListener('DOMContentLoaded', restoreOptions);
// //   document.getElementById('save').addEventListener('click', saveOptions);