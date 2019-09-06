// tslint:disable-next-line: quotemark
const fs = require('fs');
fs.writeFileSync(
  // tslint:disable-next-line: quotemark
  './src/environments/environment.prod.ts',
  `
export const environment = {\n
  production: true,\n
  twitchClientSecret: '${process.env.twitchClientSecret}',\n
  twitchClientId: '${process.env.twitchClientId}',\n
  redirectUrl: '${process.env.redirectUrl}',\n
};\n
`,
);

fs.writeFileSync(
  // tslint:disable-next-line: quotemark
  './functions/src/settings.ts',
  `
{\n
  "type": "service_account",\n
  "project_id": "followers-list",\n
  "private_key_id": "${process.env.firebasePrivateKeyId}",\n
  "private_key": "${process.env.firebasePrivateKey}",\n
  "client_email": "${process.env.firebaseServiceAccount}",\n
  "client_id": "${process.env.firebaseClientId}",\n
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",\n
  "token_uri": "https://oauth2.googleapis.com/token",\n
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",\n
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jsi44%40followers-list.iam.gserviceaccount.com",\n
}\n
`,
);
