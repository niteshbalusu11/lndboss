import { auto } from 'async';
import { readdirSync, readFile } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const home = '.bosgui';
const config = 'config.json';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);
const { parse } = JSON;

/** Write saved credentials for node

  @returns via cbk or Promise
  {
    savedNodes: <Saved Nodes Array>
    error: <Error String>
  }
*/

type Tasks = {
  getSavedNodes: string[];
  getDefaultSavedNode: string | null;
};

const getSavedNodes = async () => {
  try {
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
            return cbk([400, 'ConfigurationFileIsInvalidFormat', { err }]);
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
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default getSavedNodes;
