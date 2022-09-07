import { AuthenticatedLnd } from 'lightning';
import { auto } from 'async';
import encodeTrigger from './encode_trigger';
import { getNodeAlias } from 'ln-sync';
import { randomBytes } from 'crypto';
import writeRebalanceFile from './write_rebalance_file';

const isPublicKey = (n: string) => !!n && /^0[2-3][0-9A-F]{64}$/i.test(n);
const { parse } = JSON;
const makeId = () => randomBytes(8).toString('hex');
const createTriggerType = 'create';

/** Create a new trigger for rebalance

  {
    data: <Rebalance Data JSON String>
    id: <Rebalance Id String>
    lnd: <Authenticated LND API Object>
  }

  @returns via Promise
*/

type Tasks = {
  validate: undefined;
  inPeerAlias: string;
  outPeerAlias: string;
  pushAliases: {
    data: string;
  };
  description: string;
  create: {
    id: string;
  };
};

type Args = {
  data: string;
  lnd: AuthenticatedLnd;
};

const createRebalanceTrigger = async ({ data, lnd }: Args) => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!data) {
        return cbk([400, 'ExpectedRebalanceDataToCreateRebalanceTrigger']);
      }

      if (!lnd) {
        return cbk([400, 'ExpectedLndToCreateConnectivityTrigger']);
      }

      return cbk();
    },

    // Get in peer alias
    inPeerAlias: [
      'validate',
      async () => {
        try {
          const parsedData = parse(data);

          if (!parsedData.in_through || !isPublicKey(parsedData.in_through)) {
            return '';
          }
          return (await getNodeAlias({ id: parsedData.in_through, lnd })).alias;
        } catch (err) {
          // Ingore errors
          return '';
        }
      },
    ],

    // Get out peer alias
    outPeerAlias: [
      'validate',
      async () => {
        try {
          const parsedData = parse(data);

          if (!parsedData.out_through || !isPublicKey(parsedData.out_through)) {
            return '';
          }
          return (await getNodeAlias({ id: parsedData.out_through, lnd })).alias;
        } catch (err) {
          // Ingore errors
          return '';
        }
      },
    ],

    // Push alias data into data object
    pushAliases: [
      'inPeerAlias',
      'outPeerAlias',
      async ({ inPeerAlias, outPeerAlias }) => {
        try {
          const parsedData = parse(data);
          parsedData.in_through_alias = inPeerAlias;
          parsedData.out_through_alias = outPeerAlias;

          return { data: JSON.stringify(parsedData) };
        } catch (err) {
          return { data };
        }
      },
    ],

    // Encode the trigger
    description: [
      'pushAliases',
      'validate',
      ({ pushAliases }, cbk: any) => {
        try {
          const { encoded } = encodeTrigger({ data: pushAliases.data });

          return cbk(null, encoded);
        } catch (err) {
          return cbk([400, err.message]);
        }
      },
    ],

    // Add the trigger invoice
    create: [
      'description',
      async ({ description }) => {
        const id = makeId();
        await writeRebalanceFile({ id, rebalance: description, type: createTriggerType });

        return { id };
      },
    ],
  });
};

export default createRebalanceTrigger;
