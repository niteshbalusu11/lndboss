import { readFile, readdirSync } from 'fs';

import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { logger } from '~server/utils/global_functions';

const home = '.bosgui';
const config = 'config.json';

const { parse } = JSON;

/** Get saved nodes list

  @returns via Promise
  {
    defaultSavedNode: <Default Saved Node String>
    savedNodes: <Saved Nodes Array>
    [error]: <Error String>
  }
*/

type Tasks = {
  getSavedNodes: string[];
  getDefaultSavedNode: string | null;
};

const getSavedNodes = async () => {
  const result = await auto<Tasks>({
    // Get saved nodes
    getSavedNodes: (cbk: any) => {
      const savedNodesDir = join(...[homedir(), home]);
      const savedNodes = readdirSync(savedNodesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      return cbk(null, savedNodes);
    },

    // Get default saved node
    getDefaultSavedNode: (cbk: any) => {
      const path = join(...[homedir(), home, config]);

      return readFile(path, (err, res) => {
        // Exit early on errors, there is no config found
        if (!!err || !res) {
          return cbk();
        }

        try {
          parse(res.toString());
        } catch (err) {
          return cbk(logger({ error: [400, 'ConfigurationFileIsInvalidFormat', { err }] }));
        }

        const config = parse(res.toString());

        if (!!config.default_saved_node) {
          return cbk(null, config.default_saved_node);
        }

        return cbk();
      });
    },
  });
  return { defaultSavedNode: result.getDefaultSavedNode, savedNodes: result.getSavedNodes };
};

export default getSavedNodes;
