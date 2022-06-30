import async, { auto } from 'async';

import decodeTrigger from './decode_trigger';
import { getInvoices } from 'ln-service';

const defaultInvoicesLimit = 100;

/** Get registered triggers

  {
    lnd: <Authenticated LND API Object>
  }

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
const getTriggers = async ({ lnd }) => {
  return auto({
    // Check arguments
    validate: (cbk: any) => {
      if (!lnd) {
        return cbk([400, 'ExpectedAuthenticatedLndToGetTriggers']);
      }

      return cbk();
    },

    // Get the past triggers
    getTriggers: [
      'validate',
      ({}, cbk: any) => {
        let token: any;
        const triggers = [];

        // Register past trigger invoices
        return async.until(
          cbk => cbk(null, token === false),
          cbk => {
            return getInvoices(
              {
                lnd,
                token,
                is_unconfirmed: true,
                limit: !token ? defaultInvoicesLimit : undefined,
              },
              (err, res) => {
                if (!!err) {
                  return cbk(err);
                }

                token = res.next || false;

                res.invoices.forEach(({ description, id }) => {
                  try {
                    const trigger = decodeTrigger({ encoded: description });

                    return triggers.push({
                      id,
                      rebalance_id: trigger.result.rebalance_id,
                      rebalance_data: trigger.result.rebalance_data,
                    });
                  } catch (err) {
                    // Ignore invoices that are not triggers
                  }
                });

                return cbk();
              }
            );
          },
          err => {
            if (!!err) {
              return cbk(err);
            }

            return cbk(null, triggers);
          }
        );
      },
    ],
  });
};

export default getTriggers;
