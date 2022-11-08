import { AuthenticatedLnd, getChannels, getHeight, getPendingChannels } from 'lightning';
import { auto, map } from 'async';

import { getNodeAlias } from 'ln-sync';
import pendingPayments from './pending_payments';
import pendingSummary from './pending_summary';

const uniq = arr => Array.from(new Set(arr));

/** Handle pending command
  {
    lnd: <Authenticated Lnd Object>
  }
  @returns Promise
  {
    count: <Nodes Count Number>
    htlcs: [{
      forwarding: [{
        fee: <Routing Fee Tokens Number>
        in_peer: <Inbound Peer Public Key Hex String>
        out_peer: <Outbound Peer Public Key Hex String>
        tokens: <Routing Tokens Number>
      }]
      from: <From Node Named String>
      nodes: [{
        alias: <Node Alias String>
        id: <Public Key Hex String>
      }]
      sending: [{
        out_peer: <Outbound Peer Public Key Hex String>
      }]
    }]
    pending: [{
      closing: [{
        partner_public_key: <Peer Public Key Hex String>
        pending_balance: <Pending Balance Tokens Number>
        timelock_expiration: <Funds Locked Until Height Number>
      }]
      from: <From Node Named String>
      height: <Current Block Height Number>
      nodes: [{
        alias: <Node Alias String>
        id: <Public Key Hex String>
      }]
      opening: [{
        is_partner_initiated: <Opening Channel is Peer Initiated Bool>
        local_balance: <Opening Channel Local Balance Tokens Number>
        partner_public_key: <Opening Channel With Public Key Hex String>
        remote_balance: <Opening Channel Remote Balance Tokens Number>
        transaction_fee: <Commitment Transaction Fee Tokens Number>
        transaction_id: <Funding Transaction Id Hex String>
      }]
    }]
  }
*/
type Args = {
  lnd: AuthenticatedLnd;
};
const getPending = async ({ lnd }: Args) => {
  return (
    await auto({
      // Check arguments
      validate: (cbk: any) => {
        return cbk();
      },

      // Get HTLCs in channels
      getHtlcs: [
        'validate',
        ({}, cbk: any) => {
          const nodes = [{ lnd }];
          return map(
            nodes,
            ({ lnd }, cbk: any) => {
              return getChannels({ lnd }, (err, res) => {
                if (!!err) {
                  return cbk(err);
                }

                const { forwarding, sending } = pendingPayments({
                  channels: res.channels,
                });

                const peers = []
                  .concat(forwarding.map(n => n.in_peer))
                  .concat(forwarding.map(n => n.out_peer))
                  .concat(sending.map(n => n.out_peer));

                return map(
                  uniq(peers),
                  (id, cbk) => {
                    return getNodeAlias({ id, lnd }, cbk);
                  },
                  (err, nodes) => {
                    if (!!err) {
                      return cbk(err);
                    }

                    return cbk(null, { forwarding, nodes, sending });
                  }
                );
              });
            },
            cbk
          );
        },
      ],

      // Get pending channels
      getPending: [
        'validate',
        ({}, cbk: any) => {
          const nodes = [{ lnd }];

          return map(
            nodes,
            ({ lnd }, cbk: any) => {
              return getPendingChannels({ lnd }, (err, res) => {
                if (!!err) {
                  return cbk(err);
                }

                // Pending closing channels
                const closing = res.pending_channels
                  .filter(n => !!n.is_closing)
                  .map(channel => ({
                    close_transaction_id: channel.close_transaction_id,
                    is_partner_initiated: channel.is_partner_initiated,
                    partner_public_key: channel.partner_public_key,
                    pending_balance: channel.pending_balance,
                    timelock_expiration: channel.timelock_expiration,
                    transaction_id: channel.transaction_id,
                  }));

                // Pending opening channels
                const opening = res.pending_channels
                  .filter(n => !!n.is_opening)
                  .map(channel => ({
                    is_partner_initiated: channel.is_partner_initiated,
                    local_balance: channel.local_balance,
                    partner_public_key: channel.partner_public_key,
                    remote_balance: channel.remote_balance,
                    transaction_fee: channel.transaction_fee,
                    transaction_id: channel.transaction_id,
                  }));

                const peers = []
                  .concat(closing.map(n => n.partner_public_key))
                  .concat(opening.map(n => n.partner_public_key));

                return map(
                  uniq(peers),
                  (id, cbk) => {
                    return getNodeAlias({ id, lnd }, cbk);
                  },
                  (err, nodes) => {
                    if (!!err) {
                      return cbk(err);
                    }

                    return getHeight({ lnd }, (err, res) => {
                      if (!!err) {
                        return cbk(err);
                      }

                      const height = res.current_block_height;

                      return cbk(null, { closing, height, nodes, opening });
                    });
                  }
                );
              });
            },
            cbk
          );
        },
      ],
      // Notify of pending forwards and channels
      notify: [
        'getHtlcs',
        'getPending',
        async ({ getHtlcs, getPending }) => {
          const summary = pendingSummary({
            htlcs: getHtlcs,
            pending: getPending,
          });

          return summary;
        },
      ],
    })
  ).notify;
};

export default getPending;
