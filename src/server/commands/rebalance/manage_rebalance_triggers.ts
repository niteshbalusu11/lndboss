import { AuthenticatedLnd, cancelHodlInvoice } from 'lightning';

import { auto } from 'async';
import createRebalanceTrigger from './create_rebalance_trigger';
import getTriggers from './get_triggers';

// import subscribeToTriggers from './subscribe_to_triggers';

const actionAddRebalanceTrigger = 'action-add-rebalance-trigger';
const actionDeleteTrigger = 'action-delete-trigger';
const actionListTriggers = 'action-list-triggers';
const actionSubscribeToTriggers = 'action-subscribe-to-triggers';

/** Manage trigger actions

  {
    action: <Action To Perform String>
    [data]: <Rebalance Data String>
    [id]: <Rebalance ID String>
    [invoiceId]: <Invoice ID String>
    lnd: <Authenticated LND API Object>
  }

  @returns via or Promise
  {
    [createRebalanceTrigger]: <Create Rebalance Trigger Result>
    [getTriggers]: <Rebalance Triggers Array>
    [deleteTrigger]: <Undefined Object>
  }
*/

type Args = {
  action: string;
  data?: string;
  id?: string;
  invoiceId?: string;
  lnd: AuthenticatedLnd;
};

const manageRebalanceTriggers = async ({ action, data, id, invoiceId, lnd }: Args) => {
  const result = await auto({
    // Check arguments
    validate: (cbk: any) => {
      if (!lnd) {
        return cbk([400, 'ExpectedAuthenticatedLndToManageTriggers']);
      }

      return cbk();
    },

    // Create a new connectivity trigger
    createRebalanceTrigger: [
      'validate',
      async ({}) => {
        // Exit early when not adding a new trigger
        if (action !== actionAddRebalanceTrigger) {
          return;
        }

        const trigger = await createRebalanceTrigger({
          data,
          id,
          lnd,
        });

        return trigger;
      },
    ],

    // Get the list of triggers
    getTriggers: [
      'validate',
      async ({}) => {
        // Exit early when not listing triggers
        if (action !== actionListTriggers) {
          return;
        }

        const triggers = await getTriggers({ lnd });

        return triggers;
      },
    ],

    // Delete a trigger
    deleteTrigger: [
      'validate',
      async ({}) => {
        // Exit early when not deleting a triger
        if (action !== actionDeleteTrigger) {
          return;
        }

        const deleteTrigger = await cancelHodlInvoice({ lnd, id: invoiceId });

        return deleteTrigger;
      },
    ],
  });

  return result;
};

export default manageRebalanceTriggers;
