// bucks2bar/src/js/main.test.js

// The regex from main.js
const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

describe('Username Regex Validation', () => {
  test('Valid username: meets all requirements', () => {
    expect(usernameRegex.test('Abcdef1!')).toBe(true);
    expect(usernameRegex.test('Password1@')).toBe(true);
    expect(usernameRegex.test('A1!aaaaa')).toBe(true);
    expect(usernameRegex.test('XyZ1234$')).toBe(true);
  });

  test('Invalid: less than 8 characters', () => {
    expect(usernameRegex.test('A1!aaaa')).toBe(false);
    expect(usernameRegex.test('A1!a')).toBe(false);
  });

  test('Invalid: missing uppercase letter', () => {
    expect(usernameRegex.test('abcdef1!')).toBe(false);
    expect(usernameRegex.test('password1@')).toBe(false);
  });

  test('Invalid: missing number', () => {
    expect(usernameRegex.test('Abcdefg!')).toBe(false);
    expect(usernameRegex.test('Password!@')).toBe(false);
  });

  test('Invalid: missing special character', () => {
    expect(usernameRegex.test('Abcdefg1')).toBe(false);
    expect(usernameRegex.test('Password1')).toBe(false);
  });

  test('Invalid: contains invalid special character', () => {
    expect(usernameRegex.test('Abcdef1?')).toBe(false); // ? not allowed
    expect(usernameRegex.test('Abcdef1.')).toBe(false); // . not allowed
  });

  test('Invalid: contains whitespace', () => {
    expect(usernameRegex.test('Abc def1!')).toBe(false);
    expect(usernameRegex.test('Abcdef1 !')).toBe(false);
  });
});