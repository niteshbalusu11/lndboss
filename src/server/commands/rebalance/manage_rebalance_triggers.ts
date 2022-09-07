import { AuthenticatedLnd } from 'lightning';
import { auto } from 'async';
import createRebalanceTrigger from './create_rebalance_trigger';
import getTriggers from './get_triggers';
import writeRebalanceFile from './write_rebalance_file';

const actionAddRebalanceTrigger = 'action-add-rebalance-trigger';
const actionDeleteRebalanceTrigger = 'action-delete-trigger';
const actionListRebalancesTriggers = 'action-list-triggers';
const editTriggerType = 'edit';

/** Manage trigger actions

  {
    action: <Action To Perform String>
    [data]: <Rebalance Data String>
    [id]: <Rebalance ID String>
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
  lnd?: AuthenticatedLnd;
};

type Tasks = {
  validate: undefined;
  createRebalanceTrigger: any;
  getTriggers: string[];
  deleteTrigger: undefined;
};

const manageRebalanceTriggers = async ({ action, data, id, lnd }: Args) => {
  const result = await auto<Tasks>({
    // Check arguments
    validate: (cbk: any) => {
      if (!action) {
        return cbk([400, 'ExpectedTriggerActionToManageTriggers']);
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

        const trigger = (
          await createRebalanceTrigger({
            data,
            lnd,
          })
        ).create;

        return trigger;
      },
    ],

    // Get the list of triggers
    getTriggers: [
      'validate',
      async ({}) => {
        // Exit early when not listing triggers
        if (action !== actionListRebalancesTriggers) {
          return;
        }

        const triggers = (await getTriggers({})).getTriggers;

        return triggers;
      },
    ],

    // Delete a trigger
    deleteTrigger: [
      'validate',
      async ({}) => {
        // Exit early when not deleting a triger
        if (action !== actionDeleteRebalanceTrigger) {
          return;
        }

        const deleteTrigger = await writeRebalanceFile({ id, rebalance: '', type: editTriggerType });

        return deleteTrigger;
      },
    ],
  });

  return result;
};

export default manageRebalanceTriggers;
