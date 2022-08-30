import { AuthenticatedLnd } from 'lightning';
import authenticatedLnd from './authenticated_lnd';
import { auto } from 'async';

const flatten = (arr: string[]) => [].concat(...arr);
const uniq = (arr: Iterable<string>) => Array.from(new Set(arr));

/** Get LNDs for specified nodes

  {
    [logger]: <Winston Logger Object>
    [nodes]: <Node Name String> || [<Node Name String>]
  }

  @return via cbk or Promise
  {
    lnds: [<Authenticated LND API Object>]
  }
*/

type Tasks = {
  getLnd: {
    lnd: AuthenticatedLnd;
  };
  getLnds: {
    lnds: AuthenticatedLnd[];
  };
  lnds: {
    lnds: AuthenticatedLnd[];
  };
};

type MapArgs = {
  lnd: AuthenticatedLnd;
};

type MapArray = {
  lnds: AuthenticatedLnd[];
  map: (cbk: (n: MapArgs) => any) => AuthenticatedLnd[];
};

const getLnds = async ({ nodes }) => {
  const result = await auto<Tasks>({
    // Default lnd
    getLnd: async () => {
      if (!!nodes && !!nodes.length) {
        return;
      }

      return await authenticatedLnd({});
    },

    // Authenticated LND Objects
    getLnds: async () => {
      if (!nodes || !nodes.length) {
        return;
      }
      const nodesList = uniq(flatten([nodes].filter(n => !!n)));

      const lnds = await Promise.all(
        nodesList.map(async (node: string) => {
          return await authenticatedLnd({ node });
        })
      );

      return lnds;
    },

    // Final lnds
    lnds: [
      'getLnd',
      'getLnds',
      async ({ getLnd, getLnds }) => {
        if (!nodes || !nodes.length) {
          return { lnds: [getLnd.lnd] };
        }
        return { lnds: (getLnds as MapArray).map(n => n.lnd) };
      },
    ],
  });

  const lnds = result.lnds.lnds;
  return { lnds };
};

export default getLnds;
