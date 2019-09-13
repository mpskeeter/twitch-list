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

const firebaseSettings = `
{
  "type": "service_account",
  "project_id": "followers-list",
  "private_key_id": "${process.env.firebasePrivateKeyId}",
  "private_key": "${process.env.firebasePrivateKey}",
  "client_email": "${process.env.firebaseServiceAccount}",
  "client_id": "${process.env.firebaseClientId}",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jsi44%40followers-list.iam.gserviceaccount.com"
}
`;

console.log('twitch settings: ', twitchSettings);

fs.writeFileSync('./src/environments/environment.prod.ts', twitchSettings);
fs.writeFileSync('./src/environments/environment.ts', twitchSettingsDev);

fs.writeFileSync('./functions/libs/twitch-settings.json', twitchSettings);
fs.writeFileSync('./functions/libs/firebase-settings.json', firebaseSettings);
