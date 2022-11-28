const isCode = n => !!n && n.length === 98;
const isNumber = (n: number) => !isNaN(n);

/** Validate join group channel body
  {
    code: <Invite Code String>
    max_rate: <Max Onchain Fee Rate Number>
  }

  @returns boolean
*/

type Args = {
  code: string;
  max_rate: number;
};
const validateJoinGroupChannelCommand = (args: Args) => {
  if (!args.code || !isCode(args.code)) {
    throw new Error('Expected Valid Invite Code To Join Group Channel');
  }

  if (!args.max_rate || !isNumber(args.max_rate)) {
    throw new Error('Expected Numeric Max Fee Rate To Join Group Channel');
  }

  return true;
};

export default validateJoinGroupChannelCommand;
