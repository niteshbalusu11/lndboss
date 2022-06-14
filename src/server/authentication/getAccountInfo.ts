import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';

const auth = 'auth.json';
const home = '.bosgui';

/** Read account info from auth.json

  @returns via Promise
  {
    result: <Account Info Object>
  }
*/

type Tasks = {
  readFile: any;
};

const getAccountInfo = async (): Promise<any> => {
  const result = await auto<Tasks>({
    readFile: (cbk: any) => {
      const path = join(...[homedir(), home, auth]);

      return readFile(path, (err: any, data: any) => {
        // Ignore errors, the file may not exist
        if (!!err) {
          return cbk();
        }

        return cbk(null, data);
      });
    },
  });

  return result.readFile;
};

export default getAccountInfo;
