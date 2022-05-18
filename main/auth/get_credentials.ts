import { auto } from 'async';
import fs from 'fs';
import { homedir } from 'os';
import path from 'path';

const folderName = '.bosgui';
const fileName = 'credentials.json';

type Credentials = {
  cert: string;
  macaroon: string;
  socket: string;
};

const getCredentials = async (): Promise<Credentials> => {
  try {
    const result: any = await auto({
      // Check if folder exists
      checkDirectory: async () => {
        const directory = path.join(homedir(), folderName);
        const exists = fs.existsSync(directory);

        if (!exists) {
          throw new Error('ExpectedCredentialsDirectoryToGetCredentials');
        }

        return exists;
      },

      // Check if file exists
      checkFile: [
        'checkDirectory',
        async ({}) => {
          const filePath = path.join(homedir(), folderName, fileName);
          const exists = fs.existsSync(filePath);

          if (!exists) {
            throw new Error('ExpectedCredentialsFileToGetCredentials');
          }

          return exists;
        },
      ],

      // Read file
      readFile: [
        'checkFile',
        async ({ checkFile }) => {
          if (!checkFile) {
            throw new Error('ExpectedCredentialsFileToGetCredentials');
          }

          const filePath = path.join(homedir(), folderName, fileName);

          const file = fs.readFileSync(filePath);
          try {
            JSON.parse(file.toString());
          } catch (error) {
            throw new Error('FailedToParseCredentialsFileToGetCredentials');
          }

          const { cert, macaroon, socket }: Credentials = JSON.parse(file.toString());

          return { cert, macaroon, socket };
        },
      ],
    });
    return result.readFile;
  } catch (error) {
    return error;
  }
};

export default getCredentials;
