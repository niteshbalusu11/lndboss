import { auto } from 'async';
import { homedir } from 'os';
import { join } from 'path';
import { readFile } from 'fs';

const flatten = arr => [].concat(...arr);
const { isArray } = Array;
const { parse } = JSON;
const uniq = arr => Array.from(new Set(arr));

/** Get icons for public keys from tags

  {
    fs: {
      getFile: <Read File Contents Function> (path, cbk) => {}
    }
  }

  @returns via cbk or Promise
  {
    nodes: [{
      aliases: [<Alias String>]
      icons: [<Icon String>]
      public_key: <Public Key Hex String>
    }]
  }
*/
const getIcons = async ({}) => {
  return (
    await auto({
      // Get icons from the tags file
      getIcons: (cbk: any) => {
        const tagFilePath = join(...[homedir(), '.bosgui', 'tags.json']);

        return readFile(tagFilePath, (err, res) => {
          // Exit early when there is no tag file
          if (!!err || !res) {
            return cbk(null, { nodes: [] });
          }

          try {
            const file = parse(res.toString());

            const keys = uniq(flatten(file.tags.map(n => n.nodes)));

            const nodes = keys.map(key => {
              // Only tags this node is included in
              const meta = file.tags.filter(tag => {
                return isArray(tag.nodes) && tag.nodes.includes(key);
              });

              return {
                aliases: uniq(meta.map(n => n.alias)),
                icons: uniq(meta.map(n => n.icon)),
                public_key: key,
              };
            });

            return cbk(null, { nodes });
          } catch (err) {
            return cbk(null, { nodes: [] });
          }
        });
      },
    })
  ).getIcons;
};

export default getIcons;
