/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  publicRuntimeConfig: {
    apiUrl: `${process.env.BASE_PATH || ''}/api`,
    basePath: process.env.BASE_PATH || '',
  },
};
