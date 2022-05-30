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
    name: 'Closed',
    value: 'Closed',
    description: 'Channel closes with chain-transaction derived resolution details.',
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
