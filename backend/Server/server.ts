import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import HTTPError from 'http-errors';
import { clear } from './other';
import { adminAuthRegister, adminAuthLogin, adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate, adminAuthLogout } from './auth';
import {
  adminQuizCreate,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizList,
  adminQuizRemove,
  adminQuizDescriptionUpdate,
  adminQuizQuestion,
  adminQuizTrash,
  adminQuizTransfer,
  adminQuizTrashEmpty,
  adminQuizQuestionUpdate,
  adminQuizRestore,
  adminQuizQuestionDelete,
  adminQuizQuestionDuplicate,
  adminQuizQuestionMove,
  adminQuizThumbnailUpdate
} from './quiz';
import {
  adminQuizSessionStart,
  adminQuizSessionActivity,
  adminQuizSessionStatusGet,
  quizSessionStateUpdate,
  quizSessionResult,
  quizSessionResultCsv
} from './session';
import {
  playerJoin,
  playerSendMessage,
  playerQuestionInfo,
  playerQuestionResults,
  playerGetStatusSession,
  playerQuestionAnswer,
  playerViewMessages,
  playerFinalResults,
} from './player';
// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for throwing errors
app.use(errorHandler());
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// Clear all data
app.delete('/v1/clear', (req: Request, res: Response) => {
  return res.json(clear());
});

// Admin registration
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const response = adminAuthRegister(req.body.email, req.body.password, req.body.nameFirst, req.body.nameLast);

  if ('error' in response) {
    throw HTTPError(400, response.error);
  }

  return res.json({ token: response.sessionId });
});

// Admin login
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const response = adminAuthLogin(req.body.email, req.body.password);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Get admin user details
app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const response = adminUserDetails(req.header('token') as string);
  if ('error' in response) {
    throw HTTPError(401, response.error);
  }
  return res.json(response);
});

// Update admin user details
app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const response = adminUserDetailsUpdate(req.header('token') as string, req.body.email, req.body.nameFirst, req.body.nameLast);
  if ('error' in response && (response.error === 'Invalid token' || response.error === 'invalid token is not a valid user')) {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Update admin user password
app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const response = adminUserPasswordUpdate(req.header('token') as string, req.body.oldPassword, req.body.newPassword);
  if (response.error === 'invalid token is not a valid user') {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Admin logout
app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const response = adminAuthLogout(req.header('token') as string);
  if ('error' in response) {
    throw HTTPError(401, response.error);
  }
  return res.json(response);
});

// Quiz Server

// Create a new quiz
app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const response = adminQuizCreate(req.header('token') as string, req.body.name, req.body.description);
  if (response.error === 'sessionId is not a valid user') {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Get list of quizzes
app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const response = adminQuizList(req.header('token') as string);
  if ('error' in response) {
    throw HTTPError(401, response.error);
  }
  return res.json(response);
});

// Delete a quiz
app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const Id = parseInt(req.params.quizid);
  const response = adminQuizRemove(req.header('token') as string, Id);
  console.log(response.error + 'fryth');
  if (response.error === 'Invalid UserId') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Quiz Id is Invalid') {
    throw HTTPError(403, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Get quizzes in the trash
app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const response = adminQuizTrash(req.header('token') as string);
  if ('error' in response) {
    throw HTTPError(401, response.error);
  }
  return res.json(response);
});

// Get quiz info
app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const Id = parseInt(req.params.quizid);
  const response = adminQuizInfo(req.header('token') as string, Id);
  if (response.error === 'User is not an author of that quiz') {
    throw HTTPError(403, response.error);
  } else if ('error' in response) {
    throw HTTPError(401, response.error);
  }
  return res.json(response);
});

// Update quiz name
app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const Id = parseInt(req.params.quizid);
  const response = adminQuizNameUpdate(req.header('token') as string, Id, req.body.name);
  if (response.error === 'Quiz ID does not refer to a quiz userId owns.') {
    throw HTTPError(403, response.error);
  } else if (response.error === 'sessionId is not a valid user') {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Update quiz description
app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const Id = parseInt(req.params.quizid);
  const response = adminQuizDescriptionUpdate(req.header('token') as string, Id, req.body.description);
  if (response.error === 'Quiz ID does not refer to a quiz userId owns.') {
    throw HTTPError(403, response.error);
  } else if (response.error === 'authUserId is not a valid user') {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(401, response.error);
  }
  return res.json(response);
});

// Add a question to a quiz
app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizQuestion(quizId, req.header('token') as string, req.body.questionBody);
  if (response.error === 'Valid token provided, but sorry aint the owner') {
    throw HTTPError(403, response.error);
  } else if (response.error === 'Token seems to be not associated with no user.') {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.status(200).json(response);
});

// Transfer ownership of a quiz
app.post('/v2/admin/quiz/:quizId/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { email } = req.body;
  const response = adminQuizTransfer(req.header('token') as string, email, quizId);
  if (response.error === 'User is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if (response.error === 'Token is empty' || response.error === 'Token is invalid') {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Empty the trash of quizzes
app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  console.log(req.query.quizid as string);
  const quizArray = JSON.parse(req.query.quizid as string);
  const response = adminQuizTrashEmpty(req.header('token') as string, quizArray);
  if (response.error === 'One or more of the Quiz IDs is not currently in the trash') {
    throw HTTPError(400, response.error);
  } else if (response.error === 'Token is empty or invalid (does not refer to valid logged in user session)') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Valid token is provided, but one or more of the Quiz IDs refers to a quiz that this current user does not own') {
    throw HTTPError(403, response.error);
  }
  return res.json(response);
});

// Update a quiz question
app.put('/v2/admin/quiz/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const response = adminQuizQuestionUpdate(req.header('token') as string, quizId, questionId, req.body.questionBody);
  if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if (response.error === 'Token is empty or invalid (does not refer to valid logged in user session)') {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Restore a quiz from trash
app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const Id = parseInt(req.params.quizid);
  const response = adminQuizRestore(req.header('token') as string, Id);
  if (response.error === 'User is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if (response.error === 'Token is empty or invalid') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Quiz name of the restored quiz is already used by another active quiz') {
    throw HTTPError(400, response.error);
  } else if (response.error === 'Quiz Id not found in trash') {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Delete a quiz question
app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuizQuestionDelete(quizId, questionId, req.header('token') as string);
  if (response.error === 'Token is empty and not found!') {
    throw HTTPError(401, response.error);
  } else if (response.error === "Valid token is provided, but user doesn't own quiz") {
    throw HTTPError(400, response.error);
  } else if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Duplicate a quiz question
app.post('/v2/admin/quiz/:quizId/question/:questionId/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const response = adminQuizQuestionDuplicate(quizId, questionId, req.header('token') as string);
  if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if (response.error === 'Token is invalid' || response.error === 'Token is empty') {
    throw HTTPError(401, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Move a quiz question
app.put('/v2/admin/quiz/:quizId/question/:questionId/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);

  const response = adminQuizQuestionMove(req.header('token') as string, req.body.newPosition, quizId, questionId);

  if (response.error === 'Token is empty or invalid (does not refer to valid logged in user session)') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Quiz not found or could be that the owner is false!') {
    throw HTTPError(403, response.error);
  } else if (response.error === 'Question Id does not refer to a valid question within this quiz') {
    throw HTTPError(400, response.error);
  } else if (response.error === 'NewPosition is not within bounds') {
    throw HTTPError(400, response.error);
  } else if (response.error === 'NewPosition is the position of the current question') {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Session Start
app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);

  const response = adminQuizSessionStart(quizId, req.header('token') as string, req.body.autoStartNum);

  if (response.error === 'Token is empty or invalid (does not refer to valid logged in user session)') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Session activity
app.get('/v1/admin/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);

  const response = adminQuizSessionActivity(req.header('token') as string, quizId);
  console.log(response);
  if (response.error === 'Token is empty or invalid (does not refer to valid logged in user session)') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  }

  return res.json(response);
});

// Obtaining session status
app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const response = adminQuizSessionStatusGet(quizId, sessionId, req.header('token') as string);

  // Error Returns TODO
  if ('error' in response) {
    if (response.error === 'Token is empty or invalid') {
      throw HTTPError(401, response.error);
    } else if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
      throw HTTPError(403, response.error);
    } else if (response.error === 'SessionId does not refer to a valid session within this quiz') {
      throw HTTPError(400, response.error);
    }
  }
  return res.json(response);
});

// Update quiz thumbnail
app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.header('token') as string;
  const { imgUrl } = req.body;
  const response = adminQuizThumbnailUpdate(token, quizId, imgUrl as string);
  if (response.error === 'Token is empty or invalid (does not refer to valid logged in user session)') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// player join
app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;
  const response = playerJoin(sessionId, name);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const { messageBody } = req.body.message;
  const response = playerSendMessage(playerId, messageBody);
  if (response.error) {
    if (response.error === 'PlayerId does not exist.') {
      throw HTTPError(400, response.error);
    } else if (response.error === 'Message body is less than 1 character or more than 100 characters.') {
      throw HTTPError(400, response.error);
    }
  }
  return res.json(response);
});

// Player submission of answer(s)
app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const answerIds = req.body.answerIds;
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);

  const response = playerQuestionAnswer(answerIds, playerId, questionPosition);
  console.log(response);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// View messages sent in quiz session given valid playerid
app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = playerViewMessages(playerId);

  if (response.error) {
    if (response.error === 'playerId does not exist') {
      throw HTTPError(400, response.error);
    }
  }
  return res.json(response);
});

// Current info on question for player
app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const response = playerQuestionInfo(playerId, questionPosition);
  console.log(playerId);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Current results on question for player
app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const response = playerQuestionResults(playerId, questionPosition);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// update session state
app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const { action } = req.body;
  const token = req.header('token') as string;
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const response = quizSessionStateUpdate(quizId, sessionId, token, action);

  if (response.error === 'Token is empty or invalid') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }

  return res.json(response);
});

app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = playerGetStatusSession(playerId);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// Player results
app.get('/v1/player/:playerid/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = playerFinalResults(playerId);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  return res.json(response);
});

// quizSessionResultCsvHelper
app.get('/v1/admin/quiz/:quizid/session/:sessionid/results/csv', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const token = req.header('token') as string;
  const response = quizSessionResultCsv(quizId, sessionId, token);
  if (response.error === 'Token is empty or invalid') {
    throw HTTPError(401, response.error);
  } else if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
    throw HTTPError(403, response.error);
  } else if ('error' in response) {
    throw HTTPError(400, response.error);
  }

  return res.json(response);
});

// file obtainer helper function
app.get('/csv/:filename', (req, res) => {
  res.sendFile(req.params.filename, { root: './csv' });
});

/// Server code for quizSessionResult - returns result of all players in a quiz
// session
app.get('/v1/admin/quiz/:quizid/session/:sessionid/results', (req: Request, res: Response) => {
  const token = req.header('token') as string;
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const response = quizSessionResult(quizId, sessionId, token);

  if (response.error) {
    if (response.error === 'Token is empty or invalid (does not refer to valid logged in user session)') {
      throw HTTPError(401, response.error);
    } else if (response.error === 'Valid token is provided, but user is not an owner of this quiz') {
      throw HTTPError(403, response.error);
    } else if (response.error === 'Session is not in FINAL_RESULTS state' || response.error === 'Session Id does not refer to a valid session within this quiz') {
      throw HTTPError(400, response.error);
    }
  }

  return res.json(response);
});

//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
