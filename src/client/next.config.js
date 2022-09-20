/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const dotenv = require('dotenv');
const { homedir } = require('os');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.join(homedir(), '.bosgui', '.env') });

module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiUrl: `${process.env.BASE_PATH || ''}/api`,
    basePath: process.env.BASE_PATH || '',
  },
};
