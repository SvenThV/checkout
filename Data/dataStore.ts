const fs = require('fs');

export interface DataStore {
  users: Users[];
  quizzes: Quiz [];
  quizSessions: QuizSessions [];
}

export interface Users {
  userId: number;
  tokens: string [];
  email: string;
  nameFirst: string;
  nameLast: string;
  password: string;
  oldPasswords: string[];
  numSuccessfulLogins: number;
  numFailedPasswords: number;
}

export interface Quiz {
  authUserId: number;
  quizId: number;
  name: string;
  description: string;
  timeCreated: number;
  timeLastEdited: number;
  numQuestions: number;
  questions: Questions[];
  inTrash: boolean;
  duration: number;
  thumbnailUrl: string;
}

export interface Metadata {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: Questions[];
  duration: number;
  thumbnailUrl: string;
}

export interface QuizSessions {
  quizSessionId: number;
  players: Player [];
  state: States;
  metaData: Metadata;
  autoStartNum: number;
  atQuestion: number;
  messages: Message[];
  usersRankedByScore: UsersRankedByScore [];
  questionResults: QuestionResults[];
  questionOpenStart: number;
  attempts: number [];
}

export interface Message {
  messageBody: string,
  playerId: number,
  playerName: string,
  timeSent: number
}

export interface Player {
  playerId: number;
  playerName: string;
}

export interface UsersRankedByScore {
  name: string,
  score: number
}

export interface QuestionResults {
  questionId: number,
  playersCorrectList : string[],
  averageAnswerTime: number,
  percentCorrect: number,
}

export interface Questions {
  questionId: number;
  question: string;
  duration: number;
  points: number;
  answers: Answer[]
  thumbnailUrl: string;
}

export interface QuestionBody {

  question: string;
  duration: number;
  points: number;
  answers: Answers[];
  thumbnailUrl: string;
}

export interface Answer {
  answer: string;
  correct: boolean;
  answerId: number;
  colour: string;
}

export interface Answers {
  answer: string;
  correct: boolean;
}

export enum States {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

export enum Actions {
  NEXT_QUESTION = 'NEXT_QUESTION',
  SKIP_COUNTDOWN = 'SKIP_COUNTDOWN',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  END = 'END'
}

// [ red, blue, green, yellow, purple, brown, orange ]
export const Colours = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'brown',
  'orange'
];

// // ITER 2  - Data interface when a user attempts to  create a quiz quetion
// export interface UserQuestionCreate {
//   // Pass the sessionId.
//   token: string;
//   question: Questions;

// }

// YOU SHOULD MODIFY THIS OBJECT ABOVE ONLY

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData(): DataStore {
  const file = fs.readFileSync('./src/DataStore.json', 'utf8');
  return JSON.parse(file);
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: DataStore) {
  fs.writeFileSync('./src/DataStore.json', JSON.stringify(newData));
}

export { getData, setData };
