import firebase from './libs/firebase';
const serviceAccount = require('./libs/firebase-settings.json');

exports.handler = (event, context, callback) => {
  const headers = event.headers;

  if (headers.authorization !== serviceAccount.client_id) {
    return callback(null, {
      statusCode: 502,
      body: 'Invalid Authentication',
    });
  }

  firebase.database()
    .ref("users")
    .once("value")
    .then(
      (snapshot) => {
        if (snapshot.val()) {
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify(snapshot.val()),
          });
        }
      },
      (rejected) => {
        return callback(null, {
          statusCode: 500,
          body: rejected,
        });
      }
    )
    .catch((error) => {
      return callback(null, {
        statusCode: 500,
        body: 'Error: ' + error,
      });
    });
};
