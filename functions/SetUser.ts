import firebase from './libs/firebase';
import { TwitchUser } from '../src/app/twitch-helix/models';
const serviceAccount = require('./libs/firebase-settings.json');

exports.handler = function(event, context, callback) {
  const headers = event.headers;

  if (headers.authorization !== serviceAccount.client_id) {
    callback(null,{
      statusCode: 502,
      body: 'Invalid Authentication',
    });
  }
  
  const dbRef = firebase.database().ref("users");
  
  function setUser(id: string, user: TwitchUser) {
    return dbRef
      .child(id)
      .set(user)
      .then(
        (_) => {
          return {
            statusCode: 200,
          }
        },
        (rejected) => {
          return {
            statusCode: 500,
            body: rejected,
          };
        }
      )
      .catch((error) => {
        return {
          statusCode: 500,
          body: 'Error: ' + error,
        };
      });
    }
    
  const users: (TwitchUser[] | TwitchUser) = JSON.parse(event.body);

  if (!Array.isArray(users)) {
    setUser(users.id, users);
  } else {
    users.map(async (user: TwitchUser) => {
      const callbackReturn = await setUser(user.id, user);
      if (callbackReturn.statusCode === 500) {
        return callback(null, callbackReturn)
      }
    });
  }
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(users),
  });
};
