import * as lightning from 'lightning';

import { auto } from "async";
import { rawApi } from "~shared/raw_api";

const lower = n => n.toLowerCase();

type Tasks = {
  validate: null;
  buildArgs: any;
  call: any;
}
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

    buildArgs: ['validate', async () => {
      const { postArgs } = args;
      const obj = { lnd };

      for (const key in postArgs) {
        if (Object.prototype.hasOwnProperty.call(postArgs, key)) {
          const element = postArgs[key];
          obj[key] = element;
        }
      }

      return obj;
    }],

    call: ['buildArgs', async ({ buildArgs }) => {
      return await lightning[args.method](buildArgs);
    }],
  })
};

export default callCommand;
