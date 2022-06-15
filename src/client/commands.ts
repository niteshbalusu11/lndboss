/*
  List of commands that will be used in the app, this list will be used
  for command labels, descriptions, help text and flags.
*/

export type Commands = {
  args?: {
    [key: string]: string;
  };
  name: string;
  value: string;
  description: string;
  longDescription?: string;
  flags: {
    [key: string]: string;
  };
}[];

export const globalCommands = {
  node: {
    name: 'Saved Node (Optional)',
    value: 'node',
  },
};

const commands: Commands = [
  {
    name: 'Balance',
    value: 'Balance',
    description: 'Sums balances on-chain, in channels, and pending, plus commit fees',
    flags: {
      above: 'Above',
      below: 'Below',
      confirmed: 'Confirmed',
      detailed: 'Detailed',
      offchain: 'Offchain',
      onchain: 'Onchain',
    },
  },
  {
    name: 'Cert Validity Days',
    value: 'CertValidityDays',
    description: 'Number of days until the cert is invalid',
    flags: {
      below: 'Below',
    },
  },
  {
    args: {
      amount: 'Amount',
    },
    name: 'Chain Deposit',
    value: 'ChainDeposit',
    description: 'Generate an onchain deposit address',
    flags: {
      amount: 'Amount',
    },
  },
  {
    name: 'Chart Chain Fees',
    value: 'ChartChainFees',
    description: 'Show chart of mining fee expenditure over time',
    longDescription:
      'Show chart of mining fee expenditure over time. Privacy note: this requests tx data from third parties',
    flags: {
      days: 'Days',
    },
  },
  {
    args: {
      via: 'Via',
    },
    name: 'Chart Fees Earned',
    value: 'ChartFeesEarned',
    description: 'Show the routing fees earned',
    flags: {
      count: 'Count',
      days: 'Days',
      forwarded: 'Forwarded',
    },
  },
  {
    name: 'Chart Fees Paid',
    value: 'ChartFeesPaid',
    description: 'Show the routing fees paid to forwarding nodes',
    longDescription:
      'Show the routing fees paid to forwarding nodes. Rebalances flag can return results much more quickly',
    flags: {
      days: 'Days',
      in: 'In',
      is_most_fees_table: 'MostFees',
      is_most_forwarded_table: 'MostForwarded',
      is_network: 'NetworkOnly',
      is_peer: 'PeersOnly',
      is_rebalances_only: 'RebalancesOnly',
      out: 'Out',
    },
  },
  {
    name: 'Chart Payments Received',
    value: 'ChartPaymentsReceived',
    description: 'Show chart for settled invoices from external parties',
    flags: {
      days: 'Days',
    },
  },
  {
    args: {
      tag: 'Tag',
    },
    name: 'Tags',
    value: 'Tags',
    description: 'Tags can be used in other commands via tag and avoid options',
    flags: {
      tag: 'Tag',
      add: 'Add',
      avoid: 'Avoid',
      icon: 'Icon',
      remove: 'Remove',
    },
  },
];

export default commands;
