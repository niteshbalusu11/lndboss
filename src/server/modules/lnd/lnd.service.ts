import { authenticatedLnd, getLnds } from '~server/lnd';

import { Injectable } from '@nestjs/common';

@Injectable()
export class LndService {
  static async authenticatedLnd(args: { node: string }) {
    const { lnd } = await authenticatedLnd({ node: args.node });

    return lnd;
  }

  static async getLnds(args: { nodes?: string[] }) {
    const { lnds } = await getLnds({ nodes: args.nodes });

    return lnds;
  }
}
