// tslint:disable-next-line: quotemark
const fs = require('fs');
fs.writeFileSync(
  // tslint:disable-next-line: quotemark
  './src/environments/environment.prod.ts',
  // tslint:disable-next-line: trailing-comma
  `export const environment = {\n  production: true,\n  twitchClientSecret: '${process.env.twitchClientSecret}',\n  twitchClientId: '${process.env.twitchClientId}',\n  redirectUrl: '${process.env.redirectUrl}',\n};\n`,
);
