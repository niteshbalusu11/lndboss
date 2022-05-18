type Commands = {
  name: string;
  value: string;
  description: string;
  flags: {
    [key: string]: string;
  };
}[];

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
    name: 'Chain Deposit',
    value: 'ChainDeposit',
    description: 'Generate an onchain deposit address',
    flags: {
      amount: 'Amount',
    },
  },
  {
    name: 'Chain Fees',
    value: 'ChainFees',
    description: 'Lookup chain fee estimates at various confirm targets',
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
    name: 'Chart Chain Fees',
    value: 'ChartChainFees',
    description: 'Show the routing fees earned',
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
    name: 'Chart Fees Paid',
    value: 'ChartFeesPaid',
    description: 'Show the routing fees paid to forwarding nodes',
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
];

export default commands;
