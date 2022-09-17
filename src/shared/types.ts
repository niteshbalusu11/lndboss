// ========================Command Accouting==============================
export type commandAccounting = {
  category: string;
  is_csv: boolean;
  is_fiat_disabled: boolean;
  month: string;
  node: string;
  rate_provider: string;
  year: string;
};

// ========================Balance Command=====================================

export type commandBalance = {
  above: number;
  below: number;
  node: string;
  is_confirmed: boolean;
  is_detailed: boolean;
  is_offchain_only: boolean;
  is_onchain_only: boolean;
};

// ========================Cert Validity Days=====================================

export type commandCertValidityDays = {
  below: number;
  node: string;
};

// ========================Chain Deposit Command=====================================

export type commandChainDeposit = {
  amount: number;
  node: string;
  format: any;
};

// ========================Chainfees Command=====================================

export type commandChainfees = {
  blocks: number;
  file: boolean;
  node: string;
};

// ========================Chart Chain Fees Command=====================================

export type commandChartChainFees = {
  days: number;
  end_date: string;
  nodes: string[];
  start_date: string;
};

// ========================Chart Fees Earned Command=====================================

export type commandChartFeesEarned = {
  days: number;
  end_date: string;
  is_count: boolean;
  is_forwarded: boolean;
  nodes: string[];
  start_date: string;
  via: string;
};

// ========================Chart Fees Paid Command=====================================

export type commandChartFeesPaid = {
  days: number;
  end_date: string;
  in: string;
  is_most_fees_table: boolean;
  is_most_forwarded_table: boolean;
  is_network: boolean;
  is_peer: boolean;
  is_rebalances_only: boolean;
  nodes: string[];
  out: string;
  start_date: string;
};

// ========================Chart Payments Received Command=====================================

export type commandChartPaymentsReceived = {
  days: number;
  end_date: string;
  is_count: boolean;
  nodes: string[];
  query: string;
  start_date: string;
};

// ========================Closed Command=====================================

export type commandClosed = {
  limit: number;
  node: string;
};

// ========================Find Command=====================================

export type commandFind = {
  query: string;
  node: string;
};

// ========================Forwards Command=====================================

export type commandForwards = {
  days: number;
  from: string;
  node: string;
  sort: string;
  to: string;
};

// ========================Graph Command=====================================

export type commandGraph = {
  filters: string[];
  node: string;
  query: string;
  sort: string;
};

// ========================Lnurl Command=====================================

export type commandLnurl = {
  amount: number;
  avoid: string[];
  function: string;
  is_private: boolean;
  max_fee: number;
  max_paths: number;
  message_id?: string;
  node: string;
  out: string[];
  url: string;
};

// ========================Pay command=======================================

export type commandPay = {
  avoid: string[];
  in_through: string;
  max_fee: number;
  max_paths: number;
  message: string;
  message_id?: string;
  node: string;
  out: string[];
  request: string;
};

// ========================Open Command======================================

export type commandOpen = {
  capacities: string[];
  cooperative_close_addresses: string[];
  gives: number[];
  internal_fund_fee_rate: number;
  is_avoiding_broadcast: boolean;
  message_id: string;
  node: string;
  public_keys: string[];
  types: string[];
};

// ========================Peers Command=====================================
export type commandPeers = {
  earnings_days: string;
  filters: string[];
  idle_days: number;
  is_active: boolean;
  is_offline: boolean;
  is_private: boolean;
  is_public: boolean;
  is_table: boolean;
  node: string;
  omit: string[];
  sort_by: string;
  tags: string[];
};

// ========================Price Command=====================================

export type commandPrice = {
  file: boolean;
  from: string;
  symbols: string;
};

// ========================Probe Command=====================================

export type commandProbe = {
  avoid: string[];
  destination: string;
  find_max: boolean;
  in_through: string;
  max_paths: number;
  node: string;
  out: string[];
  tokens: string;
};

// ========================Rebalance Command=====================================

export type commandRebalance = {
  avoid: string[];
  in_filters: string[];
  in_outbound: string;
  in_through: string;
  max_fee: number;
  max_fee_rate: number;
  max_rebalance: string;
  message_id?: string;
  node: string;
  out_filters: string[];
  out_inbound: string;
  out_through: string;
  schedule: string;
  timeout_minutes: number;
};

// ========================Reconnect Command=====================================
export type commandReconnect = {
  node: string;
};

// ========================Send command================================

export type commandSend = {
  amount: string;
  avoid: string[];
  destination: string;
  in_through: string;
  is_dry_run: boolean;
  is_omitting_message_from: boolean;
  max_fee: number;
  max_fee_rate: number;
  message: string;
  message_id?: string;
  node: string;
  out_through: string;
};

// ========================Tags Command=====================================

export type commandTags = {
  add: string[] | string;
  icon: string;
  id: string;
  is_avoided: boolean;
  remove: string[] | string;
  tag: string;
};
