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
    name: "Balance",
    value: "Balance",
    description:
      "Sums balances on-chain, in channels, and pending, plus commit fees",
    flags: {
      above: "Above",
      below: "Below",
      confirmed: "Confirmed",
      detailed: "Detailed",
      offchain: "Offchain",
      onchain: "Onchain",
    },
  },
  {
    name: "Chain Deposit",
    value: "ChainDeposit",
    description: "Generate an onchain deposit address",
    flags: {
      amount: "Amount",
    },
  },
  {
    name: "Balance",
    value: "Balance3",
    description:
      "Sums balances on-chain, in channels, and pending, plus commit fees",
    flags: {
      above: "Above",
      below: "Below",
      confirmed: "Confirmed",
      detailed: "Detailed",
      offchain: "Offchain",
      onchain: "Onchain",
    },
  },
  {
    name: "Balance",
    value: "Balanc4",
    description:
      "Sums balances on-chain, in channels, and pending, plus commit fees",
    flags: {
      above: "Above",
      below: "Below",
      confirmed: "Confirmed",
      detailed: "Detailed",
      offchain: "Offchain",
      onchain: "Onchain",
    },
  },
  {
    name: "Balance",
    value: "Balance5",
    description:
      "Sums balances on-chain, in channels, and pending, plus commit fees",
    flags: {
      above: "Above",
      below: "Below",
      confirmed: "Confirmed",
      detailed: "Detailed",
      offchain: "Offchain",
      onchain: "Onchain",
    },
  },
  {
    name: "Balance",
    value: "Balanc6",
    description:
      "Sums balances on-chain, in channels, and pending, plus commit fees",
    flags: {
      above: "Above",
      below: "Below",
      confirmed: "Confirmed",
      detailed: "Detailed",
      offchain: "Offchain",
      onchain: "Onchain",
    },
  },
];

export default commands;
