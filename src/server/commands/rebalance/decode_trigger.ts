import { decodeTlvStream } from 'bolt01';

const base64AsHex = base64 => Buffer.from(base64, 'base64').toString('hex');
const defaultVersionRecord = { value: '00' };
const findRecord = (records, type) => records.find(n => n.type === type);
const hexToString = (n: string) => Buffer.from(n, 'hex').toString('utf8');
const knownVersions = ['00', '01'];
const triggerPrefix = 'lndboss-rebalance-trigger:';
const typeRebalanceData = '5';
const typeVersion = '0';

/** Decode an encoded trigger

  {
    encoded: <Encoded Trigger String>
  }

  @throws <Error>

  @returns
  {
    result: {
      rebalance_id: <Rebalance Id String>
      rebalance_data: <Rebalance Data JSON String>
    }
  }
*/

type Args = {
  encoded: string;
};

const decodeTrigger = ({ encoded }: Args) => {
  if (!encoded) {
    throw new Error('ExpectedEncodedTriggerToDecode');
  }

  if (!encoded.startsWith(triggerPrefix)) {
    throw new Error('ExpectedTriggerPrefixForEncodedPrefix');
  }

  const data = base64AsHex(encoded.slice(triggerPrefix.length));

  const { records } = decodeTlvStream({ encoded: data });

  const version = findRecord(records, typeVersion) || defaultVersionRecord;

  // Check the trigger version
  if (!knownVersions.includes(version.value)) {
    throw new Error('UnexpectedVersionForEncodedTrigger');
  }

  const rebalanceRecord = findRecord(records, typeRebalanceData);

  if (!rebalanceRecord || !rebalanceRecord.value) {
    throw new Error('ExpectedRebalanceDataForEncodedTrigger');
  }

  return {
    result: {
      rebalance_data: hexToString(rebalanceRecord.value),
    },
  };
};

export default decodeTrigger;
