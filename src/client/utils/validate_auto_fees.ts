const isNumber = (n: number) => !isNaN(n);

type Args = {
  baseFees: string[];
  feeRate: string[];
  maxHtlcRatio: string[];
  ratio: string[];
};
const validateAutoFees = (args: Args) => {
  if (!!args.baseFees.filter(n => !isNumber(Number(n))).length) {
    return { is_valid: false, message: 'ExpectedNumericBaseFeesValues' };
  }

  if (!!args.feeRate.filter(n => !isNumber(Number(n))).length) {
    return { is_valid: false, message: 'ExpectedNumericFeeRateValues' };
  }

  if (!!args.maxHtlcRatio.filter(n => !isNumber(Number(n))).length) {
    return { is_valid: false, message: 'ExpectedNumericMaxHtlcRatioValues' };
  }

  if (!!args.ratio.filter(n => !isNumber(Number(n))).length) {
    return { is_valid: false, message: 'ExpectedNumericOutboundCapacityValues' };
  }

  if (!!args.baseFees.filter(n => Number(n) < 0).length) {
    return { is_valid: false, message: 'ExpectedBaseFeesGreaterThanZero' };
  }

  if (!!args.feeRate.filter(n => Number(n) < 0).length) {
    return { is_valid: false, message: 'ExpectedFeeRateGreaterThanZero' };
  }

  if (!!args.ratio.filter(n => Number(n) > 1 || Number(n) < 0).length) {
    return { is_valid: false, message: 'ExpectedOutboundCapacityRatioLessThanOneAndGreaterThanZero' };
  }

  if (!!args.maxHtlcRatio.filter(n => Number(n) > 1 || Number(n) < 0).length) {
    return { is_valid: false, message: 'ExpectedMaxHtlcRatioLessThanOneAndGreaterThanZero' };
  }

  return { is_valid: true, message: '' };
};

export default validateAutoFees;
