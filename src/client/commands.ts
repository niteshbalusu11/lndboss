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
  flags?: {
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
    name: 'Accounting',
    value: 'Accounting',
    description: 'Get an accounting rundown of your node',
    longDescription:
      'Get an accounting rundown of your node. Rate providers: coindesk, coingecko. Privacy note: this requests tx related data from third parties.',
    args: {
      chainFees: 'chain-fees',
      chainReceives: 'chain-receives',
      chainSends: 'chain-sends',
      forwards: 'forwards',
      invoices: 'invoices',
      payments: 'payments',
    },
    flags: {
      is_csv: 'CSV',
      is_fiat_disabled: 'DisableFiat',
      month: 'Month',
      rate_provider: 'RateProvider',
      year: 'Year',
    },
  },
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
    name: 'Call (Experimental)',
    value: 'Call',
    description: 'Make a raw API call and to get a raw API response (Experimental)',
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
    name: 'Chain Deposit',
    value: 'ChainDeposit',
    args: {
      amount: 'Amount',
    },
    description: 'Generate an onchain deposit address',
    flags: {
      format: 'Format',
    },
  },
  {
    name: 'Chain Fees',
    value: 'Chainfees',
    description: 'Lookup chain fee estimates at various confirm targets',
    flags: {
      blocks: 'Blocks',
      file: 'File',
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
      end: 'End',
      start: 'Start',
    },
  },
  {
    name: 'Chart Fees Earned',
    value: 'ChartFeesEarned',
    description: 'Show the routing fees earned',
    args: {
      via: 'Via',
    },
    flags: {
      count: 'Count',
      days: 'Days',
      end: 'End',
      forwarded: 'Forwarded',
      start: 'Start',
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
      end: 'End',
      in: 'In',
      is_most_fees_table: 'MostFees',
      is_most_forwarded_table: 'MostForwarded',
      is_network: 'NetworkOnly',
      is_peer: 'PeersOnly',
      is_rebalances_only: 'RebalancesOnly',
      out: 'Out',
      start: 'Start',
    },
  },
  {
    name: 'Chart Payments Received',
    value: 'ChartPaymentsReceived',
    description: 'Show chart for settled invoices from external parties',
    flags: {
      days: 'Days',
      end: 'End',
      start: 'Start',
    },
  },
  {
    name: 'Closed',
    value: 'Closed',
    description: 'Channel closes with chain-transaction derived resolution details',
    longDescription:
      'Channel closes with chain-transaction derived resolution details. Privacy note: this requests tx data from third parties.',
    flags: {
      limit: 'Limit',
    },
  },
  {
    name: 'Find',
    value: 'Find',
    description: 'Look for something in the node db that matches a query',
    args: {
      query: 'Query',
    },
  },
  {
    name: 'Forwards',
    value: 'Forwards',
    description: 'Peers where routing has taken place from inbound and outbound sides',
    longDescription:
      'Peers where routing has taken place from inbound and outbound sides. Sorts: earned_in/earned_out/earned_total/inbound/liquidity/outbound',
    flags: {
      days: 'Days',
      from: 'From',
      sort: 'Sort',
      to: 'To',
    },
  },
  {
    name: 'Graph',
    value: 'Graph',
    description: 'List out the connections a node has with other nodes',
    longDescription:
      'List out the connections a node has with other nodes. --filter variables: AGE/CAPACITY/HOPS/IN_FEE_RATE/OUT_FEE_RATE. --filter "age<7*144" for connections in the last week',
    args: {
      alias_or_pubkey: 'AliasOrPubkey',
    },
    flags: {
      filter: 'Filter',
      sort: 'Sort',
    },
  },
  {
    name: 'Lnurl',
    value: 'Lnurl',
    description: 'Collection of lnurl features',
    longDescription:
      'Functions: auth, channel, pay, withdraw. lnurl auth will request authorization. lnurl channel will request an incoming payment channel. lnurl pay will request a payment request from a service. lnurl withdraw will create an invoice and send it to a service',
    args: {
      auth: 'auth',
      channel: 'channel',
      pay: 'pay',
      withdraw: 'withdraw',
    },
    flags: {
      amount: 'Amount',
      avoid: 'Avoid',
      is_private: 'Private',
      max_fee: 'MaxFee',
      max_paths: 'MaxPaths',
      out: 'Out',
      url: 'Url',
    },
  },
  {
    name: 'Pay',
    value: 'Pay',
    args: {
      request: 'PaymentRequest',
    },
    description: 'Pay a payment request, probing first',
    flags: {
      avoid: 'Avoid',
      in: 'In',
      max_fee: 'MaxFee',
      max_paths: 'MaxPaths',
      message: 'Message',
      out: 'Out',
    },
  },
  {
    name: 'Peers',
    value: 'Peers',
    description: 'Get a list of channel-connected peers',
    longDescription:
      'Sort options: alias, est_disk_usage_mb, fee_earnings, first_connected, inbound_fee_rate, inbound_liquidity, outbound_liquidity, public_key. Icons: 🤢 often d/c, 💸 active HTLC, 💀 d/c, 🌚 private, 🧊 delayed coop close, ⏳ pending channel, 🚫 in disabled, 🦐 limited max htlc. Filters can take formula expressions to limit results. Filter variable AGE: "age > 144 * 7" for peers older than a week. Filter variable CAPACITY: "capacity > 8*m". Filter variable DISK_USAGE_MB: "disk_usage_mb > 9" for disk estimate. Filter variable INBOUND_LIQUIDITY: "inbound_liquidity > 1*m". Filter variable OUTBOUND_LIQUIDITY: "outbound_liquidity > 1*m"',
    flags: {
      active: 'Active',
      complete: 'Complete',
      fee_days: 'FeeDays',
      filter: 'Filter',
      idle_days: 'IdleDays',
      offline: 'Offline',
      omit: 'Omit',
      private: 'Private',
      public: 'Public',
      sort: 'Sort',
      tag: 'Tag',
    },
  },
  {
    name: 'Price',
    value: 'Price',
    description: 'Get the price of Bitcoin in fiat',
    longDescription:
      'Price is denominated in cents or equivalent. Rate provider options: coinbase, coindesk, or coingecko. Privacy note: this requests tx data from third parties.',
    args: {
      symbols: 'Symbols',
    },
    flags: {
      file: 'File',
      from: 'From',
    },
  },
  {
    name: 'Probe',
    value: 'Probe',
    description: 'Check if a payment request is sendable',
    longDescription: 'Simulate paying a payment request without actually paying it',
    args: {
      amount: 'Amount',
      to: 'To',
    },
    flags: {
      avoid: 'Avoid',
      find_max: 'FindMax',
      in: 'In',
      max_paths: 'MaxPaths',
      out: 'Out',
    },
  },
  {
    name: 'Rebalance',
    value: 'Rebalance',
    description: 'Rebalance funds between peers',
    longDescription:
      'Change the liquidity profile of two peers \n Specifying target liquidity you can use CAPACITY/2, other formulas \n You can specify tags for --avoid, --in, --out (see help tags) \n --amount can take m/k variables: 5*m for 5 million, 250*k = 0.0025 \n --avoid can take a channel id or a public key to avoid \n --avoid can take a public_key/public_key to avoid a directed pair \n --avoid can take a FORMULA/public_key to avoid inbound peers \n --avoid can take a public_key/FORMULA to avoid outbound peers \n --avoid FORMULA variables: FEE_RATE, BASE_FEE, HEIGHT, AGE \n --in decreases the inbound liquidity with a specific peer/tag \n --in-filter/--out-filter vars: CAPACITY/HEIGHTS/INBOUND_LIQUIDITY \n --in-filter/--out-filter vars: OUTBOUND_LIQUIDITY/PENDING_PAYMENTS \n',
    flags: {
      avoid: 'Avoid',
      in_filters: 'InFilters',
      in_outbound: 'InTargetOutbound',
      in_through: 'In',
      max_fee: 'MaxFee',
      max_fee_rate: 'MaxFeeRate',
      max_rebalance: 'Amount',
      out_filters: 'OutFilters',
      out_inbound: 'OutTargetInbound',
      out_through: 'Out',
      timeout_minutes: 'Timeout',
    },
  },
  {
    name: 'Reconnect',
    value: 'Reconnect',
    description: 'Reconnect to disconnected channel partners',
    longDescription:
      'Reconnect to disconnected channel partners. Inactive channels are also treated as disconnected channels.',
  },
  {
    name: 'Send',
    value: 'Send',
    args: {
      destination: 'Destination',
    },
    description: 'Send funds to a node off-chain via keysend or lnurl/lightning address',
    longDescription:
      'Formulas supported in amount, and N*USD or N*EUR. Also supported in formulas: LIQUIDITY, INBOUND, OUTBOUND (with peer), OUT_INBOUND, OUT_OUTBOUND (when specifying outbound peer)',
    flags: {
      amount: 'Amount',
      avoid: 'Avoid',
      in_through: 'In',
      is_dry_run: 'Dryrun',
      is_omitting_message_from: 'messageOmitFromKey',
      max_fee: 'MaxFee',
      max_fee_rate: 'MaxFeeRate',
      message: 'Message',
      out_through: 'Out',
    },
  },
  {
    name: 'Tags',
    value: 'Tags',
    description: 'Tags can be used in other commands via tag and avoid options',
    args: {
      tag: 'Tag',
    },
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
