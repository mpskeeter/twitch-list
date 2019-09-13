import Firebase from './libs/firebase';
import { UnAuthorized, CallbackInterface } from './libs/http-responses';
import { TwitchUser } from '../src/app/twitch-helix/models';
const serviceAccount = require('./libs/firebase-settings.json');

exports.handler = function(event, context, callback) {
  const headers = event.headers;

  if (headers.authorization !== serviceAccount.clientId) {
    return callback(null, UnAuthorized);
  }

  let db = new Firebase();

  const users: (TwitchUser[] | TwitchUser) = JSON.parse(event.body);
  let response: CallbackInterface = db.set('channels', users);

  return callback(null, response);
};
