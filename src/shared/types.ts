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
  above?: number;
  below?: number;
  node?: string;
  is_confirmed?: boolean;
  is_detailed?: boolean;
  is_offchain_only?: boolean;
  is_onchain_only?: boolean;
};

// ========================Cert Validity Days=====================================

export type commandCertValidityDays = {
  below?: number;
  node?: string;
};

// ========================Chain Deposit Command=====================================

export type commandChainDeposit = {
  node?: string;
  amount?: number;
};

// ========================Chart Chain Fees Command=====================================

export type commandChartChainFees = {
  days: number;
  nodes: string[];
};

// ========================Chart Fees Earned Command=====================================

export type commandChartFeesEarned = {
  days: number;
  is_count?: boolean;
  is_forwarded?: boolean;
  nodes?: string[];
  via?: string;
};

// ========================Chart Fees Paid Command=====================================

export type commandChartFeesPaid = {
  days: number;
  in?: string;
  is_most_fees_table?: boolean;
  is_most_forwarded_table?: boolean;
  is_network?: boolean;
  is_peer?: boolean;
  is_rebalances_only?: boolean;
  nodes: string[];
  out?: string;
};

// ========================Chart Payments Received Command=====================================

export type commandChartPaymentsReceived = {
  days: number;
  nodes?: string[];
};

// ========================Tags Command=====================================

export type commandTags = {
  add: string[] | string;
  icon?: string;
  id?: string;
  is_avoided?: boolean;
  remove: string[] | string;
  tag?: string;
};
