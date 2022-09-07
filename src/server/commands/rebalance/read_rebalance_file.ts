import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';

const home = '.bosgui';
const { isArray } = Array;
const { parse } = JSON;
const rebalancesFile = 'rebalances.json';

/** Write the rebalances file

  @returns via Promise
  data: <Rebalance Data String>
*/

type Tasks = {
  readFile: string;
};
const readRebalanceFile = async ({}) => {
  return (
    await auto<Tasks>({
      // Read from rebalanceFile
      readFile: (cbk: any) => {
        const filePath = join(...[homedir(), home, rebalancesFile]);

        readFile(filePath, (err, data) => {
          if (!!err) {
            // Ignore errors, the file may not exist
            return cbk();
          }

          try {
            parse(data.toString());
          } catch (error) {
            return cbk([400, 'ExpectedValidRebalancesFile', error]);
          }

          const parsedData = parse(data.toString());

          if (!isArray(parsedData.rebalances)) {
            return cbk([400, 'ExpectedValidArrayInRebalancesFile']);
          }

          return cbk(null, data.toString());
        });
      },
    })
  ).readFile;
};

export default readRebalanceFile;
