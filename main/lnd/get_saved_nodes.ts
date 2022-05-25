import { readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const home = '.bosgui';
const stringify = (obj: any) => JSON.stringify(obj, null, 2);

/** Write saved credentials for node

  @returns via cbk or Promise
  {
    savedNodes: <Saved Nodes Array>
    error: <Error String>
  }
*/

const getSavedNodes = async () => {
  try {
    const savedNodesDir = join(...[homedir(), home]);
    const savedNodes = readdirSync(savedNodesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return { savedNodes };
  } catch (error) {
    return { error: stringify(error) };
  }
};

export default getSavedNodes;
