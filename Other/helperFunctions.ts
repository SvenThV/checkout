import { getData, Player } from './dataStore';
import crypto from 'crypto';

// Checks if the provided session ID is valid
function isSessionValid(sessionId: string, userSessions: string[]): boolean {
  // Iterating through each session token in the user sessions array
  for (const token of userSessions) {
    // If the session token matches the provided session ID, return true
    if (token === sessionId) {
      return true;
    }
  }
  // If no matching session ID is found, return false
  return false;
}

// Checks if the provided first and last names are valid
function isNameValid(nameFirst: string, nameLast: string) {
  // Validating the first name
  if (!/^[A-Za-z'\-\s]*$/.test(nameFirst)) {
    return { error: 'First name contains invalid characters' };
  }

  // Validating the length of the first name
  if (nameFirst.length < 2) {
    return { error: 'First name is too short' };
  }

  if (nameFirst.length > 20) {
    return { error: 'First name is too long' };
  }

  // Validating the last name
  if (!/^[A-Za-z'\-\s]*$/.test(nameLast)) {
    return { error: 'Last name contains invalid characters' };
  }

  // Validating the length of the last name
  if (nameLast.length < 2) {
    return { error: 'Last name is too short' };
  }

  if (nameLast.length > 20) {
    return { error: 'Last name is too long' };
  }
  // If both names are valid, return true
  return true;
}

// Obtaining Hash of given input
export function generateHash(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function sessionIdGenerator() {
  const data = getData();
  let count = -2344248;
  let randomInteger: number;
  let randomString: string;
  // Ensure token is not a duplicate
  while (count !== data.quizSessions.length) {
    randomString = Math.random().toString().substring(2, 8);
    randomInteger = parseInt(randomString, 10);
    count = 0;

    for (const quiz of data.quizSessions) {
      if (quiz.quizSessionId !== randomInteger) {
        count++;
      }
    }
  }
  return randomInteger;
}

export function playerIdGenerator(players: Player []) {
  let count = -211298;
  let randomInteger: number;
  let randomString: string;
  // Ensure token is not a duplicate
  while (count !== players.length) {
    randomString = Math.random().toString().substring(2, 8);
    randomInteger = parseInt(randomString, 10);
    count = 0;

    for (const Id of players) {
      if (Id.playerId !== randomInteger) {
        count++;
      }
    }
  }
  return randomInteger;
}

export function randomName(): string {
  const numbers = '0123456789';

  const letters = 'abcdefghijklmnopqrstuvwxyz';

  const shuffledLetters = letters.split('').sort(() => Math.random() - 0.5);
  const shuffledNumbers = numbers.split('').sort(() => Math.random() - 0.5);

  return shuffledLetters.slice(0, 5).join('') + shuffledNumbers.slice(0, 3).join('');
}

// Exporting the validation functions and session management functions
export {
  isNameValid,
  isSessionValid,
};

// Interface for error objects
export interface ErrorObject {
  error: string;
}
