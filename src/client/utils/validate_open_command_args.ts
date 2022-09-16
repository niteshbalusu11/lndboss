const isNumber = (n: any) => !isNaN(n);
const isPublicKey = n => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);
const knownTypes = ['public', 'private', 'public-trusted', 'private-trusted'];

/** Validates arguments client side for open command
  {
  is_avoiding_broadcast: <Avoid broadcast boolean>;
  capacities: [<Capacities string>];
  cooperative_close_addresses: [<Coop Closing addresses string>];
  gives: [<Gift amount string>];
  internal_fund_fee_rate: <Internal fund rate number>;
  node: <Opening Node string>;
  public_keys: [<Public keys Hex string>];
  types: [<Channel Type string>];
  }
  @Returns
  {
    is_valid: <Is Valid Boolean>
    message: <Failure Message string>
  }
 */

type Args = {
  is_avoiding_broadcast: boolean;
  capacities: string[];
  cooperative_close_addresses: string[];
  gives: number[];
  internal_fund_fee_rate: number;
  node: string;
  public_keys: string[];
  types: string[];
};
type Return = {
  is_valid: boolean;
  message: string;
};
const validateOpenCommandArgs = (args: Args): Return => {
  if (!args.public_keys.length) {
    return { is_valid: false, message: 'NodesToOpenWithMustBeSpecifiedWithAtleastOnePublicKey' };
  }

  if (!args.capacities.length) {
    return { is_valid: false, message: 'NodesToOpenWithMustBeSpecifiedWithAtleastOneCapacity' };
  }

  if (!args.internal_fund_fee_rate) {
    return { is_valid: false, message: 'ExpectedValidInternalFundFeeRate' };
  }

  if (!!args.public_keys.filter(n => !isPublicKey(n)).length) {
    return { is_valid: false, message: 'NodesToOpenWithMustBeSpecifiedWithValidOnly' };
  }

  if (!!args.capacities.filter(n => !isNumber(Number(n))).length) {
    return { is_valid: false, message: 'NodesToOpenWithMustBeSpecifiedWithValidCapacities' };
  }

  if (!!args.gives.filter(n => !isNumber(Number(n))).length) {
    return { is_valid: false, message: 'NodesToOpenWithMustBeSpecifiedWithValidGiftAmounts' };
  }

  const closeAddrCount = args.cooperative_close_addresses.length;
  const hasCapacities = !!args.capacities.length;
  const hasGives = !!args.gives.length;
  const publicKeysLength = args.public_keys.length;

  if (!!hasCapacities && publicKeysLength !== args.capacities.length) {
    return { is_valid: false, message: 'CapacitiesMustBeSpecifiedForEveryPublicKey' };
  }

  if (!!closeAddrCount && publicKeysLength !== closeAddrCount) {
    return { is_valid: false, message: 'MustSetCoopClosingAddressForEveryPublicKey' };
  }

  if (!!hasGives && publicKeysLength !== args.gives.length) {
    return { is_valid: false, message: 'GivesMustBeSpecifiedForEveryPublicKey' };
  }

  if (args.types.findIndex(n => !knownTypes.includes(n)) !== -1) {
    return { is_valid: false, message: 'UnknownChannelType' };
  }

  if (!!args.types.length && args.types.length !== publicKeysLength) {
    return { is_valid: false, message: 'TypesMustBeSpecifiedForEveryPublicKey' };
  }

  return { is_valid: true, message: '' };
};

export default validateOpenCommandArgs;
