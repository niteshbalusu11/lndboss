const { isInteger } = Number;
const allEqual = (n: number[]) => n.every(v => v === n[0] || v === 0);
const checkRatio = (n: string[]) => Number(n[0]) < Number(n[1]);
const isNumber = (n: number) => !isNaN(n);

/** Validate automated fees parameters client side
  {
    [baseFees]: [<Base Fees To Set String>]
    [feeRates]: [<Fee Rate To Set String>]
    [maxhtlcratio]: [<Max Htlc Ratio To Set to Set String>]
    inactivityPeriods: [<Inactivity Period String>]
    index: <Array Index Number>
    ratios: [<Outbound to Capacity Ratio String>]
  }

  @returns boolean
*/

type Args = {
  baseFees: string[];
  feeRates: string[];
  inactivityPeriods: string[];
  index: number;
  maxHtlcRatios: string[];
  ratios: string[];
};
const validateAutoFees = (args: Args) => {
  const baseFees = args.baseFees.filter(n => !!n);
  const feeRates = args.feeRates.filter(n => !!n);
  const inactivityPeriods = args.inactivityPeriods.filter(n => !!n);
  const maxHtlcRatios = args.maxHtlcRatios.filter(n => !!n);
  const ratios = args.ratios.filter(n => !!n);

  const lengths = [ratios.length, baseFees.length, feeRates.length, inactivityPeriods.length, maxHtlcRatios.length];

  if (!ratios.length) {
    throw new Error(`Ratios cannot be empty in row ${args.index}`);
  }

  if (!allEqual(lengths)) {
    throw new Error(`ExpectedEqualNumberOfValuesFor Ratio, BaseFees, FeeRate, MaxHtlc In Row ${args.index}`);
  }

  ratios.forEach(n => {
    const split = n.split('-');

    if (split.length !== 2) {
      throw new Error('Expected Valid Range Of Ratios');
    }

    split.forEach(n => {
      if (!isNumber(Number(n))) {
        throw new Error(`Expected Numeric Values In Ratios In Row ${args.index}`);
      }

      if (Number(n) > 1 || Number(n) < 0) {
        throw new Error(`Expected Outbound Capacity Ratio Less Than One And Greater Than Zero In Row ${args.index}`);
      }
    });

    if (!checkRatio(split)) {
      throw new Error(`Expected First Number In Ratio Lower Than Second Number In Row ${args.index}`);
    }
  });

  if (!!baseFees.filter(n => !isNumber(Number(n))).length) {
    throw new Error(`Expected Numeric BaseFees Values In Row ${args.index}`);
  }

  if (!!feeRates.filter(n => !isNumber(Number(n))).length) {
    throw new Error(`Expected Numeric FeeRate Values In Row ${args.index}`);
  }

  if (!!inactivityPeriods.filter(n => !isNumber(Number(n))).length) {
    throw new Error(`Expected Numeric Numeric Inactivity Periods In Row ${args.index}`);
  }

  if (!!maxHtlcRatios.filter(n => !isNumber(Number(n))).length) {
    throw new Error(`Expected Numeric MaxHtlc Ratio Values In Row ${args.index}`);
  }

  if (!!baseFees.filter(n => Number(n) < 0).length) {
    throw new Error(`Expected BaseFees Greater Than Zero In Row ${args.index}`);
  }

  if (!!feeRates.filter(n => Number(n) < 0).length) {
    throw new Error(`Expected FeeRate Greater Than Zero In Row ${args.index}`);
  }

  if (!!inactivityPeriods.filter(n => Number(n) <= 0).length) {
    throw new Error(`Expected Inactivity Period Greater Than Zero In Row ${args.index}`);
  }

  if (!!maxHtlcRatios.filter(n => Number(n) > 1 || Number(n) < 0).length) {
    throw new Error(`Expected MaxHtlc Ratio Less Than One And Greater Than Zero In Row ${args.index}`);
  }

  if (!!inactivityPeriods.filter(n => !isInteger(Number(n))).length) {
    throw new Error(`Expected Intergers For Inactivity Period In Row ${args.index}`);
  }

  return true;
};

export default validateAutoFees;
