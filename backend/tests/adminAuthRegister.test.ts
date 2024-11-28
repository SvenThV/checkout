// request calls
import {
  registerHelper,
  clearHelper
} from './requests';
// Function to clear data before each test
beforeEach(() => {
  clearHelper();
});

// Tests for adminAuthFunction function:
describe('Tests for admin/auth/register:', () => {
  // Testing for successful registration and correct user ID assignment
  test('Testing successful registration and user ID assignment', () => {
    const userId = registerHelper('alessandro@outlook.com', 'password123', 'Alessandro', 'Santarpia');
    // Expecting the user ID to be 1'
    expect(userId.body).toStrictEqual({ token: expect.any(String) });
    expect(userId.status).toStrictEqual(200);
  });

  // Testing for error when email is already used
  test('Testing error: email is already used', () => {
    registerHelper('user@gmail.com', 'password123', 'Jim', 'Beam');
    const user2 = registerHelper('user@gmail.com', 'coolbean2', 'Tim', 'Cahill');
    expect(user2.status).toStrictEqual(400);
  });

  // Testing for error when email is not valid
  test('Testing error: email is not valid', () => {
    const user1 = registerHelper('invalid.email', 'password123', 'John', 'Terry');
    expect(user1.status).toStrictEqual(400);
  });

  // Testing for error when first name contains invalid characters
  // Invalid characters are characters that are not
  // lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  test('Testing error: firstName contains invalid characters', () => {
    const user1 = registerHelper('user@gmail.com', 'password123', 'al{ex-p\'o\'n', 'Terry');
    expect(user1.status).toStrictEqual(400);
  });

  // Testing for error when first name contains than 2 character, which is too short
  test('Testing error: firstName < 2 characters', () => {
    const user1 = registerHelper('user@gmail.com', 'password123', 'J', 'Terry');
    expect(user1.status).toStrictEqual(400);
  });

  // Testing for error when first name had more than 20 characters, which is too long
  test('Testing error: firstName > 20 characters', () => {
    const user1 = registerHelper('user@gmail.com', 'password123', 'thisfirstnameistoolong', 'Terry');
    expect(user1.status).toStrictEqual(400);
  });

  // Testing for error when last name contains invalid characters
  // Invalid characters are characters that are not
  // lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  test('Testing error: lastName contains invalid characters', () => {
    const user1 = registerHelper('user@gmail.com', 'password123', 'John', '{{');
    expect(user1.status).toStrictEqual(400);
  });

  // Testing for error when last name contains than 2 character, which is too short
  test('Testing error: lastName < 2 characters', () => {
    const user1 = registerHelper('user@gmail.com', 'password123', 'John', 'T');
    expect(user1.status).toStrictEqual(400);
  });

  // Testing for error when last name had more than 20 characters, which is too long
  test('Testing error: lastName > 20 characters', () => {
    const user1 = registerHelper('user@gmail.com', 'password123', 'John', 'thislastnameistoolong');
    expect(user1.status).toStrictEqual(400);
  });

  // Testing for error when password contains less than 8 characters, which is too short
  test('Testing error: password is less than 8 characters', () => {
    const user1 = registerHelper('user@gmail.com', 'p', 'John', 'Terry');
    expect(user1.status).toStrictEqual(400);
  });

  // Testing for error when password doesn't contain letters and/or numbers
  test('Testing error: password doesn\'t contain letters and/or numbers', () => {
    // Error case for when password doesn't use numbers
    const user1 = registerHelper('user1@gmail.com', 'p{}@$$@#$#$@', 'John', 'Terry');
    expect(user1.status).toStrictEqual(400);
    // Error case for when password doesn't use letters
    const user2 = registerHelper('user2@gmail.com', '1{@##@#@#}', 'Terry', 'John');
    expect(user2.status).toStrictEqual(400);
  });
});
