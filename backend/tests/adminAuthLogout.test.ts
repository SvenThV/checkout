// request calls
import { registerHelper, loginHelper, obtainDetailsHelper, logoutHelper, clearHelper } from './requests';

// Define a generic error object for testing purposes
const ERROR = { error: expect.any(String) };

// Function to clear data before each test
beforeEach(() => {
  clearHelper();
});

// Tests for adminAuthLogout function:
describe('Tests for adminAuthLogout function:', () => {
  // Successful case
  test('Testing Success: Token valid', () => {
    // Registering a new user and obtaining a token
    const token1 = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    // Logging in with the registered user's credentials to obtain a token
    const token2 = loginHelper('alex@gmail.com', 'password123');
    // Logging out using the obtained tokens
    const logoutAttempt1 = logoutHelper(token1.body.token);
    const logoutAttempt2 = logoutHelper(token2.body.token);
    // Asserting that the logout attempts return an empty object, indicating success
    expect(logoutAttempt1.body).toStrictEqual({});
    expect(logoutAttempt2.body).toStrictEqual({});
  });

  // Additional test for side effects of successful logout
  test('Testing Success: Token valid side effects', () => {
    // Registering a new user and obtaining a token
    const token1 = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    // Logging in with the registered user's credentials to obtain a token
    const token2 = loginHelper('alex@gmail.com', 'password123');
    // Logging out using the obtained tokens
    logoutHelper(token1.body.token);
    logoutHelper(token2.body.token);
    // Retrieving data after logout to check side effects
    const data = obtainDetailsHelper(token2.body.token);
    // Asserting that only one user remains in the data after logout
    expect(data.body).toStrictEqual(ERROR);
  });

  // Error cases
  test('Testing errors: Token invalid', () => {
    // Registering a new user and obtaining a token
    registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    // Logging in with the registered user's credentials to obtain a token
    loginHelper('alex@gmail.com', 'password123');
    // Attempting to log out with invalid tokens
    const logoutAttempt1 = logoutHelper('fdhyu8herguiohoe');
    const logoutAttempt2 = logoutHelper('');
    // Asserting that the logout attempts return an ERROR, indicating failure
    expect(logoutAttempt1.status).toStrictEqual(401);
    expect(logoutAttempt2.status).toStrictEqual(401);
  });
});
