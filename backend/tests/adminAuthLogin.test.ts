// request calls
import {
  registerHelper,
  loginHelper,
  obtainDetailsHelper,
  clearHelper
} from './requests';

// Function to clear data before each test
beforeEach(() => {
  clearHelper();
});
// Tests for loginHelper function:
describe('Tests for admin/auth/login', () => {
  // Testing for successful login
  test('Testing successful login', () => {
    registerHelper('alessandro@outlook.com', 'password123', 'Alessandro', 'Santarpia');
    const token = loginHelper('alessandro@outlook.com', 'password123');
    const userDetails = obtainDetailsHelper(token.body.token).body;
    const numSuccessfulLogin = userDetails.user.numSuccessfulLogins;
    // Expecting the number of successful logins to be 2
    expect(numSuccessfulLogin).toStrictEqual(2);
  });

  // Blackbox testing
  test('Testing login returns a sessionId object containing a token', () => {
    registerHelper('alessandro@outlook.com', 'password123', 'Alessandro', 'Santarpia');
    expect(loginHelper('alessandro@outlook.com', 'password123').status).toStrictEqual(200);
  });

  // Testing for successful login with multiple users
  test('Testing successful login with multiple users', () => {
    registerHelper('alessandro@outlook.com', 'password123', 'Alessandro', 'Santarpia');
    registerHelper('alex@outlook.com', 'password123', 'Alessandro', 'Santarpia');
    // Expecting successful login with second user

    expect(loginHelper('alex@outlook.com', 'password123').status).toStrictEqual(200);
  });

  // Testing for error when email address does not exist
  test('Testing error: Testing error email address does not exist', () => {
    expect(loginHelper('alessandro@outlook.com', 'password123').status).toStrictEqual(400);
  });

  // Testing for error when incorrect password is provided
  test('Testing error: Incorrect password', () => {
    const token = registerHelper('alessandro@outlook.com', 'password123', 'Alessandro', 'Santarpia');
    // Attempting login with incorrect password
    expect(loginHelper('alessandro@outlook.com', 'wrongpassword').status).toStrictEqual(400);
    // Retrieving the number of failed password attempts
    const userDetails = obtainDetailsHelper(token.body.token).body;
    const numFailedPasswords = userDetails.user.numFailedPasswordsSinceLastLogin;
    // Expecting the number of failed password attempts to be 1
    expect(numFailedPasswords).toStrictEqual(1);
  });
});
