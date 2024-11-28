import request from 'sync-request-curl';
import { port, url } from './config.json';
import { QuestionBody } from './dataStore';

// Define the server URL using the configuration parameters
const SERVER_URL = `${url}:${port}`;
// Define a generic error object for testing purposes
export function clearHelper() {
  request(
    'DELETE',
    SERVER_URL + '/v1/clear'
  );
}
/// ///////////////////////////////////////////////////////////
/// //////////////////////////////////////////////////////////
// All auth.ts function requests

// request for adminAuthRegister
export function registerHelper(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminAuthLogin
export function loginHelper(email: string, password: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      json: {
        email: email,
        password: password
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminAuthDetails
export function obtainDetailsHelper(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/user/details',
    {
      headers: {
        token: token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminAuthDetailsUpdate
export function updateDetailsHelper(token: string, email: string, nameFirst: string, nameLast: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/user/details',
    {
      headers: {
        token: token
      },
      json: {
        email: email,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminAuthPasswordUpdate
export function passwordHelper(token: string, oldPassword: string, newPassword: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/user/password',
    {
      headers: {
        token: token
      },
      json: {
        oldPassword: oldPassword,
        newPassword: newPassword
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminAuthLogout
export function logoutHelper(token: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/auth/logout',
    {
      headers: {
        token: token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/// //////////////////////////////////////////////////////////
/// //////////////////////////////////////////////////////////
// All quiz.ts function requests

// request for adminQuizCreate
export function createQuizHelper(token: string, name: string, description: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/quiz',
    {
      headers: {
        token: token
      },
      json: {
        name: name,
        description: description,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizInfo
export function infoHelper(token: string, quizid: number) {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/quiz/' + quizid,
    {
      headers: {
        token: token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// requests for adminQuizNameUpdate
export function nameUpdateHelper(token: string, quizid: number, name: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/quiz/' + quizid + '/name',
    {
      headers: {
        token: token
      },
      json: {
        name: name
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// requests for adminQuizList
export function listHelper(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/quiz/list',
    {
      headers: {
        token: token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// requests for adminQuizRemove
export function trashHelper(token: string, quizid: number) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v2/admin/quiz/' + quizid,
    {
      headers: {
        token: token
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// requests for adminQuizDescriptionUpdate
export function descriptionUpdateHelper(token: string, quizid: number, description: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/quiz/' + quizid + '/description',
    {
      headers: {
        token: token
      },
      json: {
        description: description
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// requests for adminQuizQuestion
export function createQuestionHelper(token: string, quizid: number, questionBody: QuestionBody) {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/quiz/' + quizid + '/question',
    {
      headers: {
        token: token
      },
      json: {
        questionBody: questionBody
      }
    });
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// requests for adminQuizTrash
export function trashViewHelper(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/quiz/trash',
    {
      headers: {
        token: token,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// requests for adminQuizTrashEmpty
export function trashEmptyHelper(token: string, quizid: string) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v2/admin/quiz/trash/empty',
    {
      headers: {
        token: token
      },
      qs: {
        quizid: quizid,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizTransfer
export function quizTransferHelper(token: string, userEmail: string, quizId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/quiz/' + quizId + '/transfer',
    {
      headers: {
        token: token
      },
      json: {
        email: userEmail
      }
    });
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizQuestionUpdate
export function questionUpdateHelper(token: string, quizId: number, questionId: number, questionBody: QuestionBody) {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/quiz/' + quizId + '/question/' + questionId,
    {
      headers: {
        token: token
      },
      json: {
        questionBody: questionBody
      }
    });
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizRestore
export function restoreQuizHelper(token: string, quizid: number) {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/quiz/' + quizid + '/restore',
    {
      headers: {
        token: token
      },
      json: {
        quizid: quizid,
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizQuestionDelete
export function deleteQuestionHelper(quizid: number, questionid: number, token: string) {
  const res = request(
    'DELETE',
    SERVER_URL + '/v2/admin/quiz/' + quizid + '/question/' + questionid,
    {
      headers: {
        token: token
      }
    }
  );

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizQuestionMove
export function quizMoveHelper(token: string, newPosition: number, quizId: number, questionId: number) {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/quiz/' + quizId + '/question/' + questionId + '/move',
    {
      headers: {
        token: token
      },
      json: {
        newPosition: newPosition
      }
    });
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizQuestionDuplicate
export function questionDuplicateHelper(token: string, quizid: number, questionid: number) {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/quiz/' + quizid + '/question/' + questionid + '/duplicate',
    { headers: { token: token } }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// Below is a helper function for quizThumbnailUpdate
export function quizThumbnailUpdateHelper(quizid: number, token: string, thumbnailUrl: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/thumbnail',
    {
      headers: { token: token },
      json: { imgUrl: thumbnailUrl }
    });
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/// /////////////////////////////////////////////////////////
/// //////////////////////////////////////////////////////////
// for session.ts file

// request for adminQuizSessionStart.
// parameters:
// autoStartNum - countdownn before quetion start in the quiz
export function sessionStartHelper(quizid: number, token: string, autoStartNum: number) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/session/start',
    {
      headers: {
        token: token
      },
      json: {
        autoStartNum: autoStartNum
      }
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizSessionActivity
export function adminQuizSessionActivity(quizid: number, token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/sessions',
    {
      headers: {
        token: token
      },
    });
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizSessionStatusGet
export function quizSessionStatusGetHelper(quizid: number, sessionid: number, token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/session/' + sessionid,
    {
      headers: {
        token: token
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for quizSessionStateUpdate
export function quizSessionStateUpdateHelper(quizid: number, sessionid: number, token: string, action: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/session/' + sessionid,
    {
      headers: {
        token: token
      },
      json: {
        action: action
      }
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

/// ///////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////
// for player.ts file

// request for player joining session
export function playerJoinHelper(sessionId: number, name: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/player/join',
    {
      json: {
        sessionId: sessionId,
        name: name
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

export function sendMessageHelper(playerId: number, message: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/player/' + playerId + '/chat',
    {
      json: {
        message: {
          messageBody: message
        }
      }
    }
  );
  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}
// request for player answering questions
export function playerQuestionAnswerHelper(answerids: number[], playerid: number, questionposition: number) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/player/' + playerid + '/question/' + questionposition + '/answer',
    {
      json: {
        answerIds: answerids
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// get message helper
export function viewMessagesHelper(playerid: number) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/player/' + playerid + '/chat',
    {
      json: {
        playerid: playerid
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode
  };
}

// player question information
export function playerQuestionInfoHelper(playerid: number, questionposition: number) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/player/' + playerid + '/question/' + questionposition,
    {
      json: {
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// player question results
export function playerQuestionResultsHelper(playerid: number, questionposition: number) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/player/' + playerid + '/question/' + questionposition + '/results',
    {
      json: {
        playerid: playerid,
        questionposition: questionposition
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// Helper function which gets the status of a player in a quiz session.
export function playerGetStatusHelper(playerid: number) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/player/' + playerid,
    {
      json: {
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// Get player results
export function playerFinalResultsHelper(playerid: number) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/player/' + playerid + '/results/',
    {
      json: {
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}

// request for adminQuizSessionStatusGet
export function quizSessionResultHelper(quizid: number, sessionid: number, token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/session/' + sessionid + '/results',
    {
      headers: {
        token: token
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}
export function quizSessionResultCsvHelper(quizid: number, sessionid: number, token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/session/' + sessionid + '/results/csv',
    {
      headers: {
        token: token
      },
    });

  return {
    body: JSON.parse(res.body.toString()),
    status: res.statusCode,
  };
}
