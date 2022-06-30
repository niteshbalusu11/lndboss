import { AuthenticatedLnd, CreateInvoiceResult, createInvoice } from 'lightning';

import { auto } from 'async';
import encodeTrigger from './encode_trigger';

const daysAsMs = (days: number) => Number(days) * 1000 * 60 * 60 * 24;
const defaultTriggerDays = 365;
const futureDate = (ms: number) => new Date(Date.now() + ms).toISOString();

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
  description: string;
  create: CreateInvoiceResult;
};

type Args = {
  data: string;
  id: string;
  lnd: AuthenticatedLnd;
};

const createRebalanceTrigger = async ({ data, id, lnd }: Args) => {
  return auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!data) {
        return cbk([400, 'ExpectedRebalanceDataToCreateRebalanceTrigger']);
      }

      if (!id) {
        return cbk([400, 'ExpectedNodeIdToCreateConnectivityTrigger']);
      }

      if (!lnd) {
        return cbk([400, 'ExpectedLndToCreateConnectivityTrigger']);
      }

      return cbk();
    },

    // Encode the trigger
    description: [
      'validate',
      ({}, cbk: any) => {
        try {
          const { encoded } = encodeTrigger({ data, id });

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
        return await createInvoice({
          description,
          lnd,
          expires_at: futureDate(daysAsMs(defaultTriggerDays)),
        });
      },
    ],
  });
};

export default createRebalanceTrigger;
