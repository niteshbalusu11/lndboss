import * as lightning from 'lightning';
import * as lnSync from 'ln-sync';

import { auto } from 'async';
import { rawApi } from '~shared/raw_api';

const fromLnSync = 'ln-sync';
const lower = n => n.toLowerCase();

/** Call the raw API

  {
    lnd: <Authenticated LND API Object>
    method: <Method to Call String>
    [params]: [<Querystring Encoded Parameter String>]
  }

  @returns via Promise
  <Result Object>
*/

type Tasks = {
  validate: null;
  buildArgs: { [key: string]: string };
  call: any;
};
const callCommand = async ({ args, lnd }) => {
  return auto<Tasks>({
    validate: (cbk: any) => {
      if (!args.method) {
        return cbk([400, 'ExpectedMethodToCallRawApi']);
      }

      if (!!args.method && !rawApi.calls.find(n => lower(n.method) === lower(args.method))) {
        return cbk([404, 'UnrecognizedMethodToCallRawApi']);
      }

      return cbk();
    },

    buildArgs: [
      'validate',
      async () => {
        const { postArgs } = args;
        const obj = { lnd };

        for (const key in postArgs) {
          if (Object.prototype.hasOwnProperty.call(postArgs, key)) {
            const element = postArgs[key];
            obj[key] = element;
          }
        }

        return obj;
      },
    ],

    call: [
      'buildArgs',
      async ({ buildArgs }) => {
        if (args.from === fromLnSync) {
          return await lnSync[args.method](buildArgs);
        }

        return await lightning[args.method](buildArgs);
      },
    ],
  });
};

export default callCommand;
