const { isArray } = Array;
const isChannel = (n: string) => !!n && /^\d*x\d*x\d*$/.test(n);
const isHash = (n: string) => !!n && /^[0-9A-F]{64}$/i.test(n);
const isNumber = (n: number) => !isNaN(n);
const isPublicKey = (n: string) => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);

/** Call the raw API
  {
    args: [{
      named: <Named Argument String>,
      required: <Required Boolean>,
      type: <Type String>,
      value: <Value String>
    }]
  }

  @returns
  string | null
*/

type ReturnValue = {
  message: string | null;
};

const validateCallCommandArgs = ({ args }): ReturnValue => {
  if (!isArray(args)) {
    throw new Error('ExpectedArgumentsToBeArray');
  }

  for (let i = 0; i < args.length; i++) {
    if (!!args[i].required && !args[i].value) {
      return { message: `${args[i].named} is required` };
    }

    if (args[i].type === '' || args[i].type === undefined) {
      continue;
    }

    if (args[i].type === 'channel' && !!args[i].value && !isChannel(args[i].value)) {
      return { message: `${args[i].named} must be a standard format channel id` };
    }

    if (args[i].type === 'hash' && !!args[i].value && !isHash(args[i].value)) {
      return { message: `${args[i].named} must be a hex encoded 32 byte hash` };
    }

    if (args[i].type === 'number' && !!args[i].value && !isNumber(args[i].value)) {
      return { message: `${args[i].named} must be a number` };
    }

    if (args[i].type === 'public_key' && !!args[i].value && !isPublicKey(args[i].value)) {
      return { message: `${args[i].named} must be a hex encoded public key` };
    }

    if (args[i].type === 'boolean' && !!args[i].value && args[i].value !== 'true' && args[i].value !== 'false') {
      return { message: `${args[i].named} only takes true or false as a value` };
    }
  }

  return { message: null };
};

export default validateCallCommandArgs;
