import { auto } from 'async';
import decodeTrigger from './decode_trigger';
import readRebalanceFile from './read_rebalance_file';

const defaultRebalances = { rebalances: [] };
const { parse } = JSON;

/** Get registered triggers

  {}

  @returns via cbk or Promise
  {
    triggers: [{
      [connectivity]: {
        id: <Node Identity Public Key Hex String>
      }
      [follow]: {
        id: <Node Identity Public Key Hex String>
      }
      id: <Trigger Id Hex String>
    }]
  }
*/
const getTriggers = async ({}) => {
  return auto({
    // Check arguments
    validate: (cbk: any) => {
      return cbk();
    },

    // Get the past triggers
    getTriggers: [
      'validate',
      async () => {
        const triggers = [];
        const data = await readRebalanceFile({});
        if (!data) {
          return defaultRebalances;
        }

        const parsedData = parse(data);

        parsedData.rebalances.forEach(n => {
          const { result } = decodeTrigger({ encoded: n.rebalance });
          triggers.push({
            id: n.id,
            rebalance_data: parse(result.rebalance_data),
          });
        });

        return triggers;
      },
    ],
  });
};

export default getTriggers;
