import { DateTime } from 'luxon';
import formatTokens from './format_tokens';
import icons from './icons';

const asRelative = n => n.toRelative({ locale: 'en' });
const blocksAsEpoch = blocks => Date.now() + blocks * 1000 * 60 * 10;
const escape = text => text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
const flatten = arr => [].concat(...arr);
const fromNow = ms => (!ms ? undefined : DateTime.fromMillis(ms));
const nodeAlias = (alias, id) => `${alias} ${id.substring(0, 8)}`.trim();
const sumOf = arr => arr.reduce((sum, n) => sum + n, Number());
const uniq = arr => Array.from(new Set(arr));

/** Notify of pending channels and HTLCs
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
  @returns
  <Pending Item String>
*/
const pendingSummary = ({ htlcs, pending }) => {
  // Pending closing and opening channels
  const channels = pending.map(node => {
    // Opening channels, waiting for confirmation
    const openingChannels = node.opening.map(opening => {
      const direction = !!opening.is_partner_initiated ? 'in' : 'out';
      const funds = [opening.local_balance, opening.remote_balance];
      const peerId = opening.partner_public_key;
      const tx = opening.transaction_id;
      const waiting = `${icons.opening} Waiting`;

      const capacity = sumOf(funds.concat(opening.transaction_fee));
      const peer = node.nodes.find(n => n.id === peerId);

      const alias = escape(nodeAlias(peer.alias, peer.id));
      const channel = `${formatTokens({ tokens: capacity }).display} channel`;

      const action = `${direction}bound ${channel}`;

      return `${waiting} for ${action} with ${alias} to confirm: \`${tx}\``;
    });

    // Closing channels, waiting for coins to return
    const waitingOnFunds = node.closing
      .filter(n => !!n.timelock_expiration && !!n.pending_balance)
      .filter(n => n.timelock_expiration > node.height)
      .map(closing => {
        const funds = formatTokens({ tokens: closing.pending_balance }).display;
        const peerId = closing.partner_public_key;
        const waitBlocks = closing.timelock_expiration - node.height;
        const waiting = `${icons.closing} Waiting`;

        const peer = node.nodes.find(n => n.id === peerId);
        const time = asRelative(fromNow(blocksAsEpoch(waitBlocks)));

        const action = `recover ${funds} ${time} from closing channel`;
        const alias = nodeAlias(peer.alias, peer.id);

        return `${waiting} to ${action} with ${alias}`;
      });

    return {
      from: node.from,
      channels: flatten([].concat(openingChannels).concat(waitingOnFunds)),
    };
  });

  // HTLCs in flight for probing or for forwarding
  const payments = htlcs.map(node => {
    // Forwarding an HTLC in one peer and out another
    const forwarding = node.forwarding.map(forward => {
      const fee = formatTokens({ tokens: forward.fee }).display;
      const from = node.nodes.find(n => n.id === forward.in_peer);
      const to = node.nodes.find(n => n.id === forward.out_peer);
      const tokens = formatTokens({ tokens: forward.tokens }).display;

      const action = `${tokens} for ${fee} fee`;
      const forwarding = `${icons.forwarding} Forwarding`;
      const inPeer = nodeAlias(from.alias, from.id);
      const outPeer = nodeAlias(to.alias, to.id);

      return `${forwarding} ${action} from ${inPeer} to ${outPeer}`;
    });

    // Probing out peers
    const probes = uniq(node.sending.map(n => n.out_peer)).map(key => {
      const out = node.nodes.find(n => n.id === key);

      return nodeAlias(out.alias, out.id);
    });

    const probing = !probes.length ? [] : [`${icons.probe} Probing out ${probes.join(', ')}`];

    return { from: node.from, payments: [].concat(forwarding).concat(probing) };
  });

  const nodes = [];

  // Pending channels for a node
  channels
    .filter(node => !!node.channels.length)
    .forEach(node => {
      return node.channels.forEach(item => nodes.push({ item, from: node.from }));
    });

  // Pending payments for a node
  payments
    .filter(n => !!n.payments.length)
    .forEach(node => {
      return node.payments.forEach(item => nodes.push({ item, from: node.from }));
    });

  // Exit early when there is nothing pending for any nodes
  if (!nodes.length) {
    return [`${icons.bot} No pending payments or channels`];
  }

  const sections = uniq(nodes.map(n => n.from));

  return flatten(
    sections.map(from => {
      const title = [];

      return title.concat(nodes.filter(n => n.from === from).map(n => n.item));
    })
  );
};

export default pendingSummary;
