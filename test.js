// function isInputValid(input) {
//   // Regular expressions for ticket number patterns
//   const VPattern = /^V\d{9}$/; // V followed by 9 numbers
//   const PPattern = /^P\d{8}$/; // P followed by 8 numbers
//   const USPattern = /^US-\d{4,5}$/; // US- followed by 4 or 5 numbers

//   // Regular expression for checking multiple US ticket numbers
//   const multipleUSPattern = /(US-\d{4,5}).*?\1/;

//   // Check if input begins with a valid ticket number
//   if (VPattern.test(input) || PPattern.test(input) || USPattern.test(input)) {
//     // Check if there are multiple US ticket number sequences
//     if (multipleUSPattern.test(input)) {
//       return false;
//     }
//     return true;
//   }

//   return false;
// }

// // Test cases
// console.log(isInputValid("V123456789")); // true
// console.log(isInputValid("P12345678")); // true
// console.log(isInputValid("US-1234")); // true
// console.log(isInputValid("V12345678")); // false (should have 9 numbers)
// console.log(isInputValid("US-12345")); // true (should have 4 or 5 numbers)
// console.log(isInputValid("US-1234 US-5678")); // false (multiple US ticket numbers)
// console.log(isInputValid("V123456789")); // true

function hasMultipleUSTicketNumbers(input) {
  const USPattern = /(US-\d{4,5})/g;
  const matches = input.match(USPattern);
  return matches ? matches.length > 1 : false;
}

function isInputValid(input) {
  // Regular expressions for ticket number patterns
  const VPattern = /^V\d{9}$/; // V followed by 9 numbers
  const PPattern = /^P\d{8}$/; // P followed by 8 numbers
  const USPattern = /^US-\d{4,5}$/; // US- followed by 4 or 5 numbers

  // Check if input begins with a valid ticket number
  if (VPattern.test(input) || PPattern.test(input) || USPattern.test(input)) {
    // Check if there are multiple US ticket number sequences
    if (hasMultipleUSTicketNumbers(input)) {
      return "TEST";
    }
    return true;
  }

  return false;
}

// Test cases
console.log(isInputValid("V123456789")); // true
console.log(isInputValid("P12345678")); // true
console.log(isInputValid("US-1234")); // true
console.log(isInputValid("V12345678")); // false (should have 9 numbers)
console.log(isInputValid("US-12345")); // true (should have 4 or 5 numbers)
console.log(isInputValid("US-123456")); // true (should have 4 or 5 numbers)
console.log(isInputValid("US-1234 US-5678")); // false (multiple US ticket numbers)
console.log(isInputValid("V123456789")); // true

