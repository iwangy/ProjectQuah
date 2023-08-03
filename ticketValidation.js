// Function: hasMultipleUSTicketNumbers
// Description: Checks for multiple US ticket numbers in line.
// Returns: True if only 1 ticket number, False otherwise.
function hasMultipleUSTicketNumbers(input) {
    const USPattern = /\bUS[-:\s]?(\d{4,5})\b/g;
    const matches = input.match(USPattern);
    return matches ? matches.length <= 1 : false;
}

// Function: isValidTicketNumberFormat
// Description: Checks for valid ticket format.
// Returns: True if ticket format is valid, False otherwise.
// function isValidTicketNumberFormat(ticket) {
//     const VPattern = /(?:^|\s)(V[-:\s]?\d{9})(?=\s|$)/g;
//     const PPattern = /(?:^|\s)(P[-:\s]?\d{8})(?=\s|$)/g;
//     const USPattern = /(?:^|\s)(US[-:\s]?\d{4,5})(?::)?(?:[.,;!?]|(?=\s|$))/g;
//     return VPattern.test(ticket) || PPattern.test(ticket) || USPattern.test(ticket);
// }

// function isValidTicketNumberFormat(ticket) {
//     const VPattern = /(?:^|\s)(V[-:\s]?\d{9})(?=\s|$)(?![\s\S]*\bUS[-:\s]?\d{4,5}\b)/g;
//     const PPattern = /(?:^|\s)(P[-:\s]?\d{8})(?=\s|$)(?![\s\S]*\bUS[-:\s]?\d{4,5}\b)/g;
//     const USPattern = /(?:^|\s)(US[-:\s]?\d{4,5})(?::)?(?:[.,;!?]|(?=\s|$))/g;
//     console.log(VPattern.test(ticket));
//     console.log(PPattern.test(ticket));
//     console.log(USPattern.test(ticket));
//     console.log(VPattern.test(ticket) || PPattern.test(ticket) || USPattern.test(ticket));
//     return VPattern.test(ticket) || PPattern.test(ticket) || USPattern.test(ticket);
// }

// function isValidTicketNumberFormat(ticket) {
//     const VPattern = /(?:^|\s)(V[-:\s]?\d{9})(?=\s|$)(?![\s\S]*\bUS[-:\s]?\d{4,5}\b)/g;
//     const PPattern = /(?:^|\s)(P[-:\s]?\d{8})(?=\s|$)(?![\s\S]*\bUS[-:\s]?\d{4,5}\b)/g;
//     const USPattern = /(?:^|\s)(US[-:\s]?\d{4,5})(?::)?(?:[.,;!?]|(?=\s|$))/g;

//     const mixedTicketPattern = /\b(?:V[-:\s]?\d{9}|P[-:\s]?\d{8})\b[\s\S]*\bUS[-:\s]?\d{4,5}\b/g;

//     return (
//         (VPattern.test(ticket) || PPattern.test(ticket) || USPattern.test(ticket)) &&
//         !mixedTicketPattern.test(ticket)
//     );
// }

function isValidTicketNumberFormat(ticket) {
    const VPattern = /(?:^|\s)V[-:\s]?\d{9}(?=\s|$)/g;
    const PPattern = /(?:^|\s)P[-:\s]?\d{8}(?=\s|$)/g;
    const USPattern = /(?:^|\s)US[-:\s]?\d{4,5}(?::)?(?:[.,;!?]|(?=\s|$))/g;

    const hasUS = USPattern.test(ticket);
    const hasV = VPattern.test(ticket);
    const hasP = PPattern.test(ticket);

    return (hasUS && !(hasV || hasP)) || (!hasUS && (hasV || hasP));
}




// Function: checkVandP
// Description: Used to split checks among V, P, and US tickets.
function checkVandP(input) {
    const VPattern = /^V\d{9}(?:\s|$)/;
    const PPattern = /^P\d{8}(?:\s|$)/;
    return VPattern.test(input) || PPattern.test(input);
}

// Function: checkUSTicket
// Description: Used to split checks among V, P, and US tickets.
function checkUSTicket(input) {
    const USPattern = /(?:^|\s)(US[-:\s]?\d{4,5})(?::)?(?:[.,;!?]|(?=\s|$))/g;
    if (USPattern.test(input)) {
        return hasMultipleUSTicketNumbers(input);
    }
    return "INVALID TICKET FORMAT: Double-check ticket number"; // The US ticket number format is invalid or multiple US tickets on the same line
}

// Function: hasDescription
// Description: Checks if the input has a valid description for a ticket.
function hasDescription(input) {
    const descriptionPattern = /(?:(?<=^|\s)(V[-:\s]?\d{9}|P[-:\s]?\d{8}|US[-:\s]?\d{4,5})(?::\s*|\s+)(.+)|(.+?)\s+(V[-:\s]?\d{9}|P[-:\s]?\d{8}|US[-:\s]?\d{4,5}))/;
    return descriptionPattern.test(input);
}

// Function: isInputValid
// Description: Checks if the input is a valid ticket format with descriptions.
// Returns: "PASSES: EVERYTHING OK" if valid, an error message otherwise.
function isInputValid(input) {
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

module.exports = {
    hasMultipleUSTicketNumbers,
    isValidTicketNumberFormat,
    checkVandP,
    checkUSTicket,
    hasDescription,
    isInputValid,
};


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

console.log(isInputValid('V123456789 US-1234 This is a mixed ticket description'))