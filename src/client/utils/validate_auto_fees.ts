const isNumber = (n: number) => !isNaN(n);
const allEqual = arr => arr.every(v => v === arr[0] || v === 0);

type Args = {
  baseFees: string[];
  feeRates: string[];
  index: number;
  maxHtlcRatios: string[];
  ratios: string[];
};
const validateAutoFees = (args: Args) => {
  const ratios = args.ratios.filter(n => !!n);
  const baseFees = args.baseFees.filter(n => !!n);
  const feeRates = args.feeRates.filter(n => !!n);
  const maxHtlcRatios = args.maxHtlcRatios.filter(n => !!n);

  const lengths = [ratios.length, baseFees.length, feeRates.length, maxHtlcRatios.length];

  if (!allEqual(lengths)) {
    throw new Error(`ExpectedEqualNumberOfValuesFor Ratio, BaseFees, FeeRate, MaxHtlc In Row ${args.index}`);
  }

  if (!!baseFees.filter(n => !isNumber(Number(n))).length) {
    throw new Error(`Expected Numeric BaseFees Values In Row ${args.index}`);
  }

  if (!!feeRates.filter(n => !isNumber(Number(n))).length) {
    throw new Error(`Expected Numeric FeeRate Values In Row ${args.index}`);
  }

  if (!!maxHtlcRatios.filter(n => !isNumber(Number(n))).length) {
    throw new Error(`Expected Numeric MaxHtlc Ratio Values In Row ${args.index}`);
  }

  if (!!ratios.filter(n => !isNumber(Number(n))).length) {
    throw new Error(`Expected Numeric Outbound Capacity Values In Row ${args.index}`);
  }

  if (!!baseFees.filter(n => Number(n) < 0).length) {
    throw new Error(`Expected BaseFees Greater Than Zero In Row ${args.index}`);
  }

  if (!!feeRates.filter(n => Number(n) < 0).length) {
    throw new Error(`Expected FeeRate Greater Than Zero In Row ${args.index}`);
  }

  if (!!ratios.filter(n => Number(n) > 1 || Number(n) < 0).length) {
    throw new Error(`Expected Outbound Capacity Ratio Less Than One And Greater Than Zero In Row ${args.index}`);
  }

  if (!!maxHtlcRatios.filter(n => Number(n) > 1 || Number(n) < 0).length) {
    throw new Error(`Expected MaxHtlc Ratio Less Than One And Greater Than Zero In Row ${args.index}`);
  }

  return true;
};

export default validateAutoFees;
