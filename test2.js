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
            return ("PASSES: EVERYTHING OK");
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



// Test cases V & P PASSES
// console.log(isInputValid("V123456789 This is a valid description")); // T
// console.log(isInputValid("V12345678 This is a valid description")); // F, num 
// console.log(isInputValid("P12345678 Another valid description")); // T
// console.log(isInputValid("P123456789 Another valid description")); // F, num
// console.log(isInputValid("V12345678")); // F, num
// console.log(isInputValid("P1234567A")); // F, num
// console.log(isInputValid("V1234567890")); // F, num
// console.log(isInputValid("V123456789This")); // F, desc
// console.log(isInputValid("P12345678\n")); // F, desc
// console.log(isInputValid("P12345678")); // F, desc

// // Test cases US PASSES
// console.log(isInputValid("US-1234 Description for US ticket")); // T
// console.log(isInputValid("US-12345 Another description")); // T
// console.log(isInputValid("US-123456")); // false (should have 4 or 5 numbers)
// console.log(isInputValid("US-123")); // false (should have 4 or 5 numbers)
// console.log(isInputValid("US-1234 US-5678 US-12345")); // false (multiple US ticket numbers)
// console.log(isInputValid("US-1234 US-1234")); // false (multiple US ticket numbers)
// console.log(isInputValid("US-1234 US-5678 Another description")); // false (multiple US ticket numbers)
// console.log(isInputValid("US-1234US-5678 Another description")); // false (multiple US ticket numbers)
// console.log(isInputValid("US-1234")); // false (no description)

// // Test Cases Description PASSES
// console.log(isInputValid("V123456789 This is a valid description")); // true
// console.log(isInputValid("P12345678 Another valid description")); // true
// console.log(isInputValid("US-1234 Description for US ticket")); // true
// console.log(isInputValid("V123456789")); // false (no description)
// console.log(isInputValid("US-12345")); // false (no description)
// console.log(isInputValid("V12345678 NoDesc")); // false (no space between ticket number and description)
// console.log(isInputValid("P12345678 ")); // false (no description)
// console.log(isInputValid("US-12345678")); // false (no description)
// console.log(isInputValid("US-1234")); // false (no description)

// console.log(isInputValid("standup, touchbase with stock team, billing, questions from team, user story cleanup"));


