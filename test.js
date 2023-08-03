const { expect } = require('chai');
const {
  isInputValid,
  isValidTicketNumberFormat,
  checkVandP,
  checkUSTicket,
  hasDescription,
} = require('./ticketValidation.js');

// Test cases for isValidTicketNumberFormat function
describe('isValidTicketNumberFormat', () => {
  it('should return true for valid ticket formats', () => {
    expect(isValidTicketNumberFormat('V123456789')).to.be.true;
    expect(isValidTicketNumberFormat('P12345678')).to.be.true;
    expect(isValidTicketNumberFormat('US-1234')).to.be.true;
    expect(isValidTicketNumberFormat('US-12345')).to.be.true;
  });

  it('should return false for invalid ticket formats', () => {
    expect(isValidTicketNumberFormat('V12345678')).to.be.false;
    expect(isValidTicketNumberFormat('P1234567A')).to.be.false;
    expect(isValidTicketNumberFormat('V1234567890')).to.be.false;
    expect(isValidTicketNumberFormat('V123456789This')).to.be.false;
  });
});

// Test cases for checkVandP function
describe('checkVandP', () => {
  it('should return true for valid V and P ticket formats', () => {
    expect(checkVandP('V123456789 This is a valid description')).to.be.true;
    expect(checkVandP('P12345678 Another valid description')).to.be.true;
  });

  it('should return false for invalid V and P ticket formats', () => {
    expect(checkVandP('V12345678')).to.be.false;
    expect(checkVandP('P1234567A')).to.be.false;
  });
});

// Test cases for checkUSTicket function
describe('checkUSTicket', () => {
  it('should return true for valid US ticket formats', () => {
    expect(checkUSTicket('US-1234 Description for US ticket')).to.be.true;
    expect(checkUSTicket('US-12345 Another description')).to.be.true;
  });

  it('should return error message for invalid US ticket formats', () => {
    expect(checkUSTicket('US-123456')).to.equal('INVALID TICKET FORMAT: Double-check ticket number');
    expect(checkUSTicket('US-123')).to.equal('INVALID TICKET FORMAT: Double-check ticket number');
  });
});

// Test cases for hasDescription function
describe('hasDescription', () => {
  it('should return true if the input has a valid description for a ticket', () => {
    expect(hasDescription('V123456789 This is a valid description')).to.be.true;
    expect(hasDescription('P12345678 Another valid description')).to.be.true;
    expect(hasDescription('US-1234 Description for US ticket')).to.be.true;
  });

  it('should return false if the input does not have a valid description', () => {
    expect(hasDescription('V123456789')).to.be.false;
    expect(hasDescription('P12345678')).to.be.false;
    expect(hasDescription('US-1234')).to.be.false;
  });
});

// Test cases for isInputValid function
describe('isInputValid', () => {
  it('should return "PASSES: EVERYTHING OK" for valid input', () => {
    expect(isInputValid('V123456789 This is a valid description')).to.equal(
      'PASSES: EVERYTHING OK'
    );
    expect(isInputValid('P12345678 Another valid description')).to.equal(
      'PASSES: EVERYTHING OK'
    );
    expect(
      isInputValid('US-1234 Description for US ticket')
    ).to.equal('PASSES: EVERYTHING OK');
  });

  it('should return an error message for invalid input', () => {
    expect(isInputValid('V12345678')).to.equal(
      'INVALID TICKET FORMAT: Double-check ticket number'
    );
    expect(isInputValid('US-1234')).to.equal(
      'INVALID TICKET FORMAT: Please add a description'
    );
    expect(isInputValid('US-12345')).to.equal(
      'INVALID TICKET FORMAT: Please add a description'
    );
    expect(isInputValid('US-1234 US-5678 US-12345')).to.equal(
      'INVALID TICKET FORMAT: Please only have 1 US ticket per entry'
    );

    expect(isInputValid('V123456789 US-1234 This is a mixed ticket description')).to.equal(
      'INVALID TICKET FORMAT: Double-check ticket number'
    );
    expect(isInputValid('US-1234 Another description P12345678')).to.equal(
      'INVALID TICKET FORMAT: Double-check ticket number'
    );
  });
});
