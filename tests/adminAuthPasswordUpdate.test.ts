// request calls
import {
  registerHelper,
  passwordHelper,
  clearHelper
} from './requests';

// Function to clear data before each test
beforeEach(() => {
  clearHelper();
});

// Tests for adminUserPasswordUpdate function:
describe('Tests for adminUserPasswordUpdate function:', () => {
  const users: string[] = [];
  // Before each test, register two users
  beforeEach(() => {
    const token1 = registerHelper('jane.doe@gmail.com', 'password1234', 'Jane', 'Doe');
    const token2 = registerHelper('john.doe@gmail.com', 'password5678', 'John', 'Doe');
    users.splice(0, 1, token1.body.token);
    users.splice(1, 1, token2.body.token);
  });
  // Test cases for success scenarios
  test.each([
    { userId: 0, newPassword: 'ab76387ygf', oldPassword: 'password1234', text: 'No previous' },
    { userId: 1, newPassword: 'h72yn7dyn087fy', oldPassword: '74fn0ynyjfjd', text: 'Multiple prior passwords' },
  ])("Testing Success cases: '$text'", ({ userId, newPassword, oldPassword }) => {
    // Setting up prior passwords for user 2
    passwordHelper(users[userId], 'password5678', '74fn0ynyjfjd');
    // Expecting successful password update and correct data storage
    expect(passwordHelper(users[userId], oldPassword, newPassword)).toMatchObject({});
  });

  // Test cases for error scenarios
  test.each([
    // Error case for when authId is not valid
    { userId: -1, newPassword: 'anvcu398dj0', oldPassword: 'password1234', text: 'Invalid negative UserId' },
    // Error case for when password contains less than 8 characters, which is too short
    { userId: 0, newPassword: 'abce232', oldPassword: 'password1234', text: 'password length too short' },
    // Error case for when password doesn't use numbers
    { userId: 0, newPassword: 'abcedfghjk', oldPassword: 'password1234', text: 'Only characters' },
    // Error case for when password doesn't use letters
    { userId: 0, newPassword: '123456789', oldPassword: 'password1234', text: 'Only integers' },
    // Error case for when old password is incorrect
    { userId: 0, newPassword: 'abced384758', oldPassword: 'password123', text: 'Old password incorrect' },
    // Error case for when new password is the same as old passowrd
    { userId: 0, newPassword: 'password1234', oldPassword: 'password1234', text: 'New password matches old password' },
  ])("Testing Error cases: '$text'", ({ userId, newPassword, oldPassword }) => {
    // Expecting an error object when running passwordHelper with invalid inputs
    if (userId === -1) {
      expect(passwordHelper(users[userId], oldPassword, newPassword).status).toStrictEqual(401);
    } else {
      expect(passwordHelper(users[userId], oldPassword, newPassword).status).toStrictEqual(400);
    }
  });
  test('Error Case: newPassword has already been used', () => {
    const userId = 0;
    const newPassword1 = 'ab76387ygf';
    const oldPassword1 = 'password1234';
    expect(passwordHelper(users[userId], oldPassword1, newPassword1)).toMatchObject({});
    const oldPassword2 = 'ab76387ygf';
    // second new password has been used before
    const newPassword2 = 'password1234';
    expect(passwordHelper(users[userId], oldPassword2, newPassword2).status).toStrictEqual(400);
  });
});
