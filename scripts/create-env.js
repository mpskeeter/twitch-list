const fs = require('fs');

require('dotenv').config();

const twitchSettings = `
export const environment = {
  production: true,
  twitchClientSecret: '${process.env.twitchClientSecret}',
  twitchClientId: '${process.env.twitchClientId}',
  redirectUrl: '${process.env.redirectUrl}',
};
`;

const twitchSettingsDev = `
export const environment = {
  production: false,
  twitchClientSecret: '${process.env.twitchClientSecret}',
  twitchClientId: '${process.env.twitchClientId}',
  redirectUrl: '${process.env.redirectUrl}',
};
`;

const firebaseJson = `{
  "type": "service_account",
  "projectId": "followers-list",
  "privateKeyId": "${process.env.firebasePrivateKeyId}",
  "privateKey": "${process.env.firebasePrivateKey}",
  "clientEmail": "${process.env.firebaseServiceAccount}",
  "clientId": "${process.env.firebaseClientId}",
  "authUri": "https://accounts.google.com/o/oauth2/auth",
  "tokenUri": "https://oauth2.googleapis.com/token",
  "authProviderX509XertUrl": "https://www.googleapis.com/oauth2/v1/certs",
  "clientX509CertUrl": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jsi44%40followers-list.iam.gserviceaccount.com"
}`;

const twitchJson = `{
  "production": false,
  "twitchClientSecret": "${process.env.twitchClientSecret}",
  "twitchClientId": "${process.env.twitchClientId}",
  "redirectUrl": "${process.env.redirectUrl}"
}`;

fs.writeFileSync('./src/environments/environment.prod.ts', twitchSettings);
fs.writeFileSync('./src/environments/environment.ts', twitchSettingsDev);

fs.writeFileSync('./functions/libs/twitch-settings.ts', twitchSettings);
fs.writeFileSync('./functions/libs/twitch-settings.json', twitchJson);
fs.writeFileSync('./functions/libs/firebase-settings.json', firebaseJson);
