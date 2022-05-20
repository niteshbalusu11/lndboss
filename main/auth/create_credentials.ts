import { auto } from 'async';
import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import * as types from '../../renderer/types';

const folderName = '.bosgui';
const fileName = 'credentials.json';

/** Write to cert, macaroon and socket to credentials.json file
  {
    cert: <TLS Cert String>
    macaroon: <Macaroon String>
    socket: <Socket String>
  }
  @returns via Promise
  {
    writeFile: <Boolean>
    error: <Error String>
  }
*/

const createCredentials = async ({ cert, macaroon, socket }: types.credentialsCreate) => {
  try {
    const result = await auto({
      // Check if folder exists
      checkDirectory: async () => {
        const directory = path.join(homedir(), folderName);
        const exists = fs.existsSync(directory);
        return exists;
      },

      // Check if file exists
      checkFile: [
        'checkDirectory',
        async ({ checkDirectory }) => {
          if (!checkDirectory) {
            return false;
          }
          const filePath = path.join(homedir(), folderName, fileName);
          return fs.existsSync(filePath);
        },
      ],

      // Create folder
      createDirectory: [
        'checkDirectory',
        'checkFile',
        async ({ checkDirectory }) => {
          if (checkDirectory) {
            return false;
          }
          fs.mkdirSync(path.join(homedir(), folderName));
          return true;
        },
      ],

      // Create file
      createFile: [
        'checkDirectory',
        'checkFile',
        'createDirectory',
        async ({ checkFile }) => {
          if (checkFile) {
            return false;
          }

          fs.writeFileSync(
            path.join(homedir(), folderName, fileName),
            JSON.stringify({
              macaroon,
              cert,
              socket,
            })
          );
          return true;
        },
      ],

      // Write to file and replace values
      writeFile: [
        'checkFile',
        'createDirectory',
        'createFile',
        async ({ createFile }) => {
          if (createFile) {
            return true;
          }

          fs.writeFileSync(
            path.join(homedir(), folderName, fileName),
            JSON.stringify({
              macaroon,
              cert,
              socket,
            })
          );
          return true;
        },
      ],
    });

    return { result: result.writeFile };
  } catch (error) {
    return { error };
  }
};

export default createCredentials;
