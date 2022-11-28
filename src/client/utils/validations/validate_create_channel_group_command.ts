const isNumber = (n: number) => !isNaN(n);
const { isArray } = Array;
const isOdd = n => !!(n % 2);
const isPublicKey = n => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);
const maxGroupSize = 420;
const minChannelSize = 2e4;
const minGroupSize = 2;

/** Validate create group channel body
  {
    capacity: <Channel Capacity Number>
    count: <Group Size Number>
    rate: <Onchain Fee Rate Number>
  }

  @returns boolean
*/

type Args = {
  capacity: number;
  count: number;
  rate: number;
  members: string[];
};
const validateCreateGroupChannelCommand = (args: Args) => {
  if (!args.capacity || !isNumber(args.capacity)) {
    throw new Error('Expected Numeric Capacity To Open Group Channel');
  }

  if (!args.count || !isNumber(args.count)) {
    throw new Error('Expected Numeric Size To Open Group Channel');
  }

  if (args.count < minGroupSize) {
    throw new Error('Expected Group Size Of Minimum 2');
  }

  if (args.count > maxGroupSize) {
    throw new Error('Expected Group Size Of Maximum 420');
  }

  if (args.capacity < minChannelSize) {
    throw new Error('Expected Channel Capacity Greater Than 20000');
  }

  if (isOdd(args.capacity)) {
    throw new Error('Expected Even Number For Capacity');
  }

  if (!args.rate || !isNumber(args.rate)) {
    throw new Error('Expected Numeric Fee Rate To Open Group Channel');
  }

  if (!isArray(args.members)) {
    throw new Error('Expected Array Of Members To Open Group Channel');
  }

  if (!!args.members.length && !!args.members.filter(n => !isPublicKey(n)).length) {
    throw new Error('Expected Valid Pubkey For Allow Flag');
  }

  return true;
};

export default validateCreateGroupChannelCommand;
