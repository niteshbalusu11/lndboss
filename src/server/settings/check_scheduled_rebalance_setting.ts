import { auto } from 'async';
import getSettingsFile from './get_settings.file';

const { parse } = JSON;

/**
  @Returns via Promise
  boolean - true if scheduled rebalances are turned on, false otherwise
 */

type Tasks = {
  getFile: string;
  checkScheduledRebalance: boolean;
};
const checkScheduledRebalanceSetting = async () => {
  return (
    await auto<Tasks>({
      // Get the settings file
      getFile: async () => {
        return await getSettingsFile();
      },

      // Check if scheduled rebalances are enabled
      checkScheduledRebalance: [
        'getFile',
        ({ getFile }, cbk: any) => {
          // Exit early if the settings file doesn't exist
          if (!getFile) {
            return cbk(null, false);
          }

          try {
            const isEnabled = parse(getFile).scheduledRebalancing;

            if (!!isEnabled.is_enabled) {
              return cbk(null, true);
            }
          } catch (err) {
            // Ignore errors, the settings file may not be valid json
            return cbk(null, false);
          }

          return cbk(null, false);
        },
      ],
    })
  ).checkScheduledRebalance;
};

export default checkScheduledRebalanceSetting;
