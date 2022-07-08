import { authenticatedLnd, getLnds } from '~server/lnd';

import { Injectable } from '@nestjs/common';

/**
  Authenticated LND
  {
    [node]: <Node String>
  }
  @returns via Promise
  {
    lnd: <Authenticated LND Object>
  }

  Authenticated LNDs
  {
    [nodes]: <Node String Array>
  }
  @returns via Promise
  {
    lnds: <Authenticated LND Object Array>
  }
 */

@Injectable()
export class LndService {
  // Get a single authenticated LND for a node
  static async authenticatedLnd(args: { node: string }) {
    const { lnd } = await authenticatedLnd({ node: args.node });

    return lnd;
  }

  // Get multiple authenticated LNDs for a node array
  static async getLnds(args: { nodes?: string[] }) {
    const { lnds } = await getLnds({ nodes: args.nodes });

    return lnds;
  }
}
