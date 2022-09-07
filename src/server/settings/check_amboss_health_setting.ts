import { auto } from 'async';
import getSettingsFile from './get_settings.file';

const { parse } = JSON;

/**
  @Returns via Promise
  boolean - true if amboss health is enabled, false otherwise
 */

type Tasks = {
  getFile: string;
  checkAmbossHealth: boolean;
};
const checkAmbossHealthSetting = async () => {
  return (
    await auto<Tasks>({
      // Get the settings file
      getFile: async () => {
        return await getSettingsFile();
      },

      // Check if amboss health is enabled
      checkAmbossHealth: [
        'getFile',
        ({ getFile }, cbk: any) => {
          // Exit early if the settings file doesn't exist
          if (!getFile) {
            return cbk(null, false);
          }

          try {
            const isEnabled = parse(getFile).ambossHealthCheck;

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
  ).checkAmbossHealth;
};

export default checkAmbossHealthSetting;
