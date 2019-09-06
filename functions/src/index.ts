// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';

import fetch from 'node-fetch';
import { TwitchUser } from './models';

const API_ENDPOINT = "https://icanhazdadjoke.com/";

const serviceAccount = require("./settings.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://followers-list.firebaseio.com"
});
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.twitch = async (_: any, __: any) => {

  const token: string = '';

  return fetch(API_ENDPOINT, {headers: { "Authorization": `OAuth ${token}`}})
    .then((response: any) => response.json())
    .then((data: any) => ({
      statusCode: 200,
      body: data,
    }))
    .catch((error: any) => ({ statusCode: 422, body: String(error) }));
}

exports.dbAddUser = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const twitchUser: TwitchUser = req.query.user;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  await admin.database().ref('/twitch_user/' + twitchUser.id).push(twitchUser);
  // const snapshot = await admin.database().ref('/twitch_user/' + twitchUser.id).push(twitchUser);
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  // res.redirect(303, snapshot.ref.toString());
  res.sendStatus(200);
});
