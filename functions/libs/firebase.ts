import * as admin from 'firebase-admin';
const serviceAccount = require('./firebase-settings.json');

const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://followers-list.firebaseio.com',
};

export default !admin.apps.length ? admin.initializeApp(config) : admin.app();
