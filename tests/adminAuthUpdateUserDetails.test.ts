// request calls
import {
  registerHelper,
  obtainDetailsHelper,
  updateDetailsHelper,
  clearHelper,
} from './requests';

// Function to clear data before each test
beforeEach(() => {
  clearHelper();
});

// Tests for updateAdminUserDetails function:
describe('Tests for updateAdminUserDetails function:', () => {
  // Testing for successful case: Update user details
  test('Successful test case: Update user details', () => {
    // Registering a user
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    // Updating user details
    const updateAttempt = updateDetailsHelper(token.body.token, 'alessandro@gmail.com', 'Alessandro', 'Santarpia');
    // Expecting no errors, meaning the update was successful
    expect(updateAttempt.status).toBe(200);
    // Retrieving updated user details
    const updatedUserDetails = obtainDetailsHelper(token.body.token);
    // Expecting the updated details to match the changes
    expect(updatedUserDetails.body).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Alessandro Santarpia',
        email: 'alessandro@gmail.com',
        // Assuming no logins after the update
        numSuccessfulLogins: 1,
        // Assuming no login attempts after the update
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  // Testing for successful case: Update user details
  test('Successful test case: Update user details', () => {
    // Registering a user
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    // Updating user details
    const updateAttempt = updateDetailsHelper(token.body.token, 'alessandro@gmail.com', 'Alessandro', 'Santarpia');
    // Expecting the update attempt to have a status code of 200, indicating success
    expect(updateAttempt.status).toBe(200);
    // No need to check the body since the function returns an empty object upon success
  });

  // Testing for error when authId is not valid
  test('Testing error: AuthUserId is not a valid user', () => {
    const updateAttempt = updateDetailsHelper('1', 'alex@gmail.com', 'Alex', 'Choi');
    expect(updateAttempt.status).toBe(401);
  });

  // Testing for error when email is already used
  test('Testing error: Email is currently used by another user', () => {
    registerHelper('alessandro@gmail.com', 'password123', 'Alessandro', 'Santarpia');
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    const updateAttempt = updateDetailsHelper(token.body.token, 'alessandro@gmail.com', 'Alex', 'Choi');
    expect(updateAttempt.status).toBe(400);
  });

  // Testing for error when email is not valid
  test('Testing error: Email is not valid', () => {
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    const updateAttempt = updateDetailsHelper(token.body.token, 'alex.email', 'Alex', 'Choi');
    expect(updateAttempt.status).toBe(400);
  });

  // Testing for error when first name contains invalid characters
  // Invalid characters are characters that are not
  // lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  test('Testing error: NameFirst contains invalid characters', () => {
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    const updateAttempt = updateDetailsHelper(token.body.token, 'alex@gmail.com', '@lex', 'Choi');
    expect(updateAttempt.status).toBe(400);
  });

  // Testing for error when first name contains than 2 character, which is too short
  test('Testing error: NameFirst length less than 2 characters', () => {
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    const updateAttempt = updateDetailsHelper(token.body.token, 'alex@gmail.com', 'A', 'Choi');
    expect(updateAttempt.status).toBe(400);
  });

  // Testing for error when first name had more than 20 characters, which is too long
  test('Testing error: NameFirst length more than 20 characters', () => {
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    // Attempt to update first name with more than 20 characters
    const updateAttempt = updateDetailsHelper(token.body.token, 'alex@gmail.com', 'ThisFirstNameIsTooLong', 'Name');
    expect(updateAttempt.status).toBe(400);
  });

  // Testing for error when last name contains invalid characters
  // Invalid characters are characters that are not
  // lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
  test('Testing error: NameLast contains invalid characters', () => {
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    const updateAttempt = updateDetailsHelper(token.body.token, 'alex@gmail.com', 'Alex', 'Ch@i');
    expect(updateAttempt.status).toBe(400);
  });

  // Testing for error when last name contains than 2 character, which is too short
  test('Testing error: NameLast length less than 2 characters', () => {
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    const updateAttempt = updateDetailsHelper(token.body.token, 'alex@gmail.com', 'Alex', 'C');
    expect(updateAttempt.status).toBe(400);
  });

  // Testing for error when last name had more than 20 characters, which is too long
  test('Testing error: NameLast length more than 20 characters', () => {
    const token = registerHelper('alex@gmail.com', 'password123', 'Alex', 'Choi');
    const updateAttempt = updateDetailsHelper(token.body.token, 'alex@gmail.com', 'Valid', 'ThisLastNameIsTooLong');
    expect(updateAttempt.status).toBe(400);
  });
});
