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

// Tests for adminUserDetails function:
describe('Tests for adminUserDetails', () => {
  // Testing for successful case: Singular login
  test('Successful tests cases: Singular login', () => {
    // Registering a user
    registerHelper('jane.doe@gmail.com', 'password1234', 'Jane', 'Doe');
    // Logging in
    const token = loginHelper('jane.doe@gmail.com', 'password1234');
    // Expecting user details to match after successful login
    expect(obtainDetailsHelper(token.body.token).body).toStrictEqual({
      user:
      {
        userId: expect.any(Number),
        name: 'Jane Doe',
        email: 'jane.doe@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  // Testing for successful case: only registered
  test('Succesful tests cases: only registered', () => {
    const token = registerHelper('jane.doe@gmail.com', 'password1234', 'Jane', 'Doe');
    expect(obtainDetailsHelper(token.body.token).body).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Jane Doe',
        email: 'jane.doe@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  // Testing for successful case: Multiple unsuccessful and successful logins
  test('Succesful tests cases: Multiple unsuccesful and successful logins', () => {
    registerHelper('jane.doe@gmail.com', 'password1234', 'Jane', 'Doe');
    // Performing login attempts
    loginHelper('jane.doe@gmail.com', 'password1234');
    loginHelper('jane.doe@gmail.com', 'password123454');
    loginHelper('jane.doe@gmail.com', 'password441234');
    const token = loginHelper('jane.doe@gmail.com', 'password1234');
    // Expecting user details to match after login attempts
    expect(obtainDetailsHelper(token.body.token).body).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Jane Doe',
        email: 'jane.doe@gmail.com',
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });
  // Testing for unsuccessful case due to Invalid UserId error: negative authUserId
  test('Unsuccesful tests due to Invalid UserId error: negative UserId', () => {
    registerHelper('alessandro@outlook.com', 'password123', 'Alessandro', 'Santarpia');
    expect(obtainDetailsHelper('string').status).toBe(401);
  });
});
