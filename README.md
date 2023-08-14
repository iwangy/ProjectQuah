# ProjectQuah - Front Street N Chrome Extension

Front Street N is a Chrome extension developed for EMS description validation on the Maconomy platform. This extension helps streamline the process of validating and managing EMS ticket descriptions.

## Installation

1. Clone this repository or download the code as a ZIP file.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle switch in the top-right corner.
4. Click on "Load unpacked" and select the directory where you've cloned or unzipped the extension code.

## Features

### Background Script (`background.js`)

The `background.js` script serves as the background process for the extension. It handles communication between different components, such as the content script and the popup.

- Stores and manages EMS verification data using a `Map`.
- Listens for messages from the content script and the popup to perform various actions, such as updating verification data and retrieving stored data.

### Content Script (`contentScript.js`)

The `contentScript.js` script is injected into iAccess pages and interacts with the page's DOM to provide various functionalities related to EMS ticket validation.

- Provides utility functions for interacting with the page, like clicking elements and setting input values.
- Implements ticket validation functions to ensure the correct format and content of EMS tickets.
- Collects and verifies EMS ticket data on the timesheet page.
- Communicates with the background script and popup to send and receive information.

### Popup Script (`popup.js`)

The `popup.js` script is responsible for the extension's popup UI that appears when you click on the extension icon in the Chrome toolbar.

- Offers buttons to trigger different actions, such as entering daily time entries and verifying EMS ticket data.
- Displays verification results obtained from the content script.
- Retrieves and displays stored verification data.
- Interacts with the background script to manage data communication.

## Usage

1. Make sure you're logged into the iAccess platform.
2. Click on the Front Street extension icon in the Chrome toolbar to open the popup.
3. If you're on the timesheet page, the popup will display buttons for entering daily time entries and verifying EMS ticket data.
4. Click the "Add" button to Add a time sheet line.
5. Click the "Verify" button to validate and verify EMS ticket descriptions.
6. The popup will display the verification results for each line of data.

## Permissions

- `storage`: Used to store and retrieve data within the extension.
- `tabs`: Allows the extension to access and interact with browser tabs.
- `activeTab`: Grants access to the currently active tab.
- `scripting`: Enables the extension to inject scripts into web pages.
- `https://*.mossadams.com/*`: Required permission to access the iAccess platform.

## Version History

- **0.1.0**: Initial release of Front Street Chrome Extension.
- **1.0.1**: Add color prompts to invalid entries
- **1.0.2**: Fix error on reopening extension mappings

## Contact

For any questions, issues, or suggestions regarding the extension, please make a PR Your feedback is greatly appreciated!
