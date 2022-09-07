import { mkdir, writeFile } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import readRebalanceFile from './read_rebalance_file';

const home = '.bosgui';
const { parse } = JSON;
const rebalancesFile = 'rebalances.json';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);
const defaultRebalances = { rebalances: [] };
const createTriggerType = 'create';
const editTriggerType = 'edit';

/** Write the rebalances file
  {
    settings: <Settings Object>
  }

  @returns via Promise
*/

type Tasks = {
  validate: undefined;
  registerDirectory: undefined;
  readFile: string;
  addData: {
    data: string;
  };
  modifyData: {
    data: string;
  };
  writeFile: undefined;
};
const writeRebalanceFile = async ({ id, rebalance, type }) => {
  return (
    await auto<Tasks>({
      // Check arguments
      validate: (cbk: any) => {
        if (!id) {
          return cbk([400, 'ExpectedRebalanceIdToWriteRebalanceFile']);
        }

        if (!type) {
          return cbk([400, 'ExpectedRebalanceWriteTypeToWriteRebalanceFile']);
        }

        return cbk();
      },

      // Make sure the node directory is there
      registerDirectory: [
        'validate',
        ({}, cbk: any) => {
          const homeDirPath = join(...[homedir(), home]);

          return mkdir(homeDirPath, () => {
            // Ignore errors, the directory may already be there
            return cbk();
          });
        },
      ],

      // Read the rebalance file
      readFile: [
        'registerDirectory',
        async () => {
          const data = await readRebalanceFile({});

          return data;
        },
      ],

      // Append data to existing rebalances
      addData: [
        'readFile',
        ({ readFile }, cbk: any) => {
          if (type !== createTriggerType) {
            return cbk(null, { data: undefined });
          }

          const obj = {
            id,
            rebalance,
          };

          // Exit early if there is no data or file
          if (!readFile) {
            defaultRebalances.rebalances.push(obj);

            return cbk(null, { data: Buffer.from(stringify(defaultRebalances)) });
          }

          const parsedData = parse(readFile);

          parsedData.rebalances.push(obj);

          return cbk(null, { data: Buffer.from(stringify(parsedData)) });
        },
      ],

      // Modify existing rebalance data
      modifyData: [
        'readFile',
        ({ readFile }, cbk: any) => {
          if (type !== editTriggerType) {
            return cbk(null, { data: undefined });
          }

          if (!readFile) {
            return cbk([400, 'ExpectedRebalanceDataToDeleteRebalanceTrigger']);
          }

          const parsedData = parse(readFile);

          if (!parsedData.rebalances.length) {
            return cbk([400, 'ExpectedRebalanceDataToDeleteRebalanceTrigger']);
          }

          const findRebalance = parsedData.rebalances.find(n => n.id === id);

          if (!findRebalance) {
            return cbk([400, 'ExpectedValidRebalanceIdToDeleteRebalanceJob']);
          }

          const filterdData = parsedData.rebalances.filter(n => n.id !== id);

          const modifiedData = { rebalances: filterdData };

          return cbk(null, { data: Buffer.from(stringify(modifiedData)) });
        },
      ],

      // write the rebalances to file
      writeFile: [
        'addData',
        'modifyData',
        'readFile',
        'registerDirectory',
        ({ addData, modifyData }, cbk: any) => {
          const filePath = join(...[homedir(), home, rebalancesFile]);

          const data = addData.data || modifyData.data;

          writeFile(filePath, data, err => {
            if (!!err) {
              return cbk([500, 'UnexpectedErrorWritingSettingsFile', err]);
            }

            return cbk();
          });
        },
      ],
    })
  ).writeFile;
};

export default writeRebalanceFile;
