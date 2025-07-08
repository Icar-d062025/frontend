const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const apiUrl = process.env.API_URL || '';
const envFile = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}'
};
`;

const envPath = path.resolve(__dirname, 'src/environments/environment.ts');
fs.writeFileSync(envPath, envFile);
console.log('environment.ts generated with API_URL from .env');

