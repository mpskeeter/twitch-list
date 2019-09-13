// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/firestore";

const serviceAccount = require('./firebase-settings.json');

// const config = {
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: 'https://followers-list.firebaseio.com',
// };
// export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
export default !firebase.apps.length ? firebase.initializeApp(serviceAccount) : firebase.app();
