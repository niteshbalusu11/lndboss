import * as moment from 'moment';

import { AuthenticatedLnd, GetForwardsResult } from 'lightning';
import { auto, until } from 'async';

import { getForwards } from 'ln-service';

const defaultForwardsLimit = 200;

/** Fetch forwards for inactivity period
  {
    idle_days: <Idle Days Number>
    lnd: <Authenticated Lnd Object>
  }

  @returns via Promise
  {
    forwards: [Fowards Object]
  }
 */

type Args = {
  idle_days: number;
  lnd: AuthenticatedLnd;
};
type Tasks = {
  validate: undefined;
  fetchForwards: Result;
};
type Result = {
  created_at: string;
  fee: number;
  fee_mtokens: string;
  incoming_channel: string;
  mtokens: string;
  outgoing_channel: string;
  tokens: number;
}[];
const fetchForwards = async (args: Args): Promise<Result> => {
  return (
    await auto<Tasks>({
      // Check arguments
      validate: (cbk: any) => {
        if (!args.idle_days) {
          return cbk([400, 'ExpectedIdleDaysToGetIdlePeers']);
        }

        if (!args.lnd) {
          return cbk([400, 'ExpectedAuthenticatedLndToGetIdlePeers']);
        }

        return cbk();
      },

      // Get forwards
      fetchForwards: [
        'validate',
        ({}, cbk: any) => {
          const forwards = [];
          let token;

          if (args.idle_days === undefined) {
            return cbk(null, forwards);
          }

          const after = moment().subtract(args.idle_days, 'days').toISOString();
          const before = moment().toISOString();

          return until(
            cbk => cbk(null, token === false),
            cbk => {
              return getForwards(
                {
                  after,
                  before,
                  token,
                  limit: !token ? defaultForwardsLimit : undefined,
                  lnd: args.lnd,
                },
                (err, res: GetForwardsResult) => {
                  if (!!err) {
                    return cbk(err);
                  }

                  token = res.next || false;

                  // When there is a too-old forward returned, stop paging
                  if (!!after && res.forwards.find(n => n.created_at < after)) {
                    token = false;
                  }

                  res.forwards.forEach(n => forwards.push(n));

                  return cbk();
                }
              );
            },
            err => {
              if (!!err) {
                return cbk(err);
              }

              return cbk(null, forwards);
            }
          );
        },
      ],
    })
  ).fetchForwards;
};

export default fetchForwards;
