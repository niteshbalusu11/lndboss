import { encodeTlvStream } from 'bolt01';

const hexAsBase64 = (hex: string) => Buffer.from(hex, 'hex').toString('base64');
const stringToHex = (n: string) => Buffer.from(n, 'utf8').toString('hex');
const triggerPrefix = 'lndboss-rebalance-trigger:';
const typeRebalanceData = '5';
const typeVersion = '0';
const version = '01';

/** Encode a trigger

  [0]: <Version>
  [1]: <Method>
  [2]: <Parameters>

  {
    [connectivity]: {
      id: <Node Id Hex String>
    }
    [follow]: {
      id: <Node Id Hex String>
    }
  }

  @throws
  <Error>

  @returns
  {
    encoded: <Encoded Trigger String>
  }
*/

type Args = {
  data: string;
};

const encodeTrigger = ({ data }: Args) => {
  if (!data) {
    throw new Error('ExpectedRebalanceDataToEncodeTrigger');
  }

  // Encode the trigger parameters for a follow trigger
  const { encoded } = encodeTlvStream({
    records: [
      {
        type: typeRebalanceData,
        value: stringToHex(data),
      },
      {
        type: typeVersion,
        value: version,
      },
    ],
  });

  return { encoded: `${triggerPrefix}${hexAsBase64(encoded)}` };
};

export default encodeTrigger;
