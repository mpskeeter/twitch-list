import Firebase from './libs/firebase';
import { UnAuthorized } from './libs/http-responses';
const serviceAccount = require('./libs/firebase-settings.json');

exports.handler = (event, context, callback) => {
  const headers = event.headers;

  if (headers.authorization !== serviceAccount.clientId) {
    return callback(null, UnAuthorized);
  }

  let firebase = new Firebase();

  return firebase.get('channels');
};
