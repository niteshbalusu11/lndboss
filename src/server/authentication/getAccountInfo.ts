import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';

const auth = 'auth.json';
const home = '.bosgui';

type Tasks = {
  readFile: any;
};

const getAccountInfo = async (): Promise<any> => {
  const result = await auto<Tasks>({
    readFile: (cbk: any) => {
      const path = join(...[homedir(), home, auth]);

      return readFile(path, (err: any, data: any) => {
        if (!!err) {
          return cbk([503, 'UnexpectedErrorReadingCredentialsFile', { err }]);
        }

        return cbk(null, data);
      });
    },
  });

  return result.readFile;
};

export default getAccountInfo;
