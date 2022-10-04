import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';

const feesFile = 'fees.json';
const home = '.bosgui';
const { parse } = JSON;

/** Read the fees.json file

  @returns via Promise
  {
    data: <Fee JSON File String>
  }
 */
type Tasks = {
  readFile: {
    data: any;
  };
};
const readFeesFile = async ({}) => {
  return (
    await auto<Tasks>({
      readFile: (cbk: any) => {
        const filePath = join(...[homedir(), home, feesFile]);
        readFile(filePath, (err, res) => {
          if (!!err || !res) {
            return cbk(null, false);
          }

          try {
            parse(res.toString());
          } catch (err) {
            return cbk([400, 'ExpectedValidFeesJsonFileToScheduleFeesCommand']);
          }

          return cbk(null, { data: parse(res.toString()) });
        });
      },
    })
  ).readFile;
};

export default readFeesFile;
