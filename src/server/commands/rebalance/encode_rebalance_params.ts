import { encodeTlvStream } from 'bolt01';

const isString = (n: any) => typeof n === 'string';
const typeRebalanceId = '7';
const typeRebalanceData = '8';
const stringToHex = (n: string) => Buffer.from(n, 'hex');

/** Encode the follow node params

  [0]: <Version>
  1: <Node Id>

  {
    id: <Node Identity Public Key Hex String>
  }

  @throws
  <Error>

  @returns
  {
    encoded: <Trigger Parameters Hex String>
  }
*/

type Args = {
  data: string;
  id: string;
};

const encodeRebalanceParams = ({ data, id }: Args) => {
  if (!isString(id) || !isString(data)) {
    throw new Error('ExpectedRebalanceDataAndIdToEncodeFollowParams');
  }

  return encodeTlvStream({
    records: [
      { type: typeRebalanceId, value: stringToHex(id) },
      { type: typeRebalanceData, value: stringToHex(data) },
    ],
  });
};

export default encodeRebalanceParams;
