// ========================Child Window Creation Types==========================
export type childWindow = {
  flags: any;
  path: string;
  windowName: string;
};

//=========================Credential Create Types=====================================

export type credentialsCreate = {
  cert: string;
  macaroon: string;
  node: string;
  socket: string;
  is_default: boolean;
};

export type createCredentialsReturn = {
  connection: {
    hasAccess: boolean;
    error: string;
  };
  error: string;
  result: boolean;
};

export type getSavedNodesReturn = {
  defaultSavedNode: string | null;
  error: string;
  savedNodes: string[];
};

//=========================Balance Command=====================================

export type commandBalance = {
  above?: number;
  below?: number;
  node?: string;
  is_confirmed?: boolean;
  is_detailed?: boolean;
  is_offchain_only?: boolean;
  is_onchain_only?: boolean;
};

export type commandBalanceReturn = {
  result: {
    Balance: number;
    ChannelBalance: number;
    ClosingBalance: string;
    ConflictedPending: string;
    InvalidPending: string;
    OffchainBalance: string;
    OffchainPending: string;
    OnchainBalance: string;
  };
  error?: string;
};

//=========================Chain Deposit Command=====================================

export type commandChainDeposit = {
  node?: string;
  amount?: number;
};

export type commandChainDepositReturn = {
  result: {
    address: string;
    url: string;
  };
  error?: string;
};

//=========================Chart Chain Fees Command=====================================

export type commandChartChainFees = {
  days?: number;
  nodes: string[];
};

export type commandChartChainFeesReturn = {
  result: any;
  error?: string;
};

//=========================Chart Fees Earned Command=====================================

export type commandChartFeesEarned = {
  days: number;
  is_count?: boolean;
  is_forwarded?: boolean;
  nodes?: string[];
  via?: string;
};

export type commandChartFeesEarnedReturn = {
  result: any;
  error?: string;
};

//=========================Chart Fees Paid Command=====================================

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

export type commandChartFeesPaidReturn = {
  result: any;
  error?: string;
};

// ========================Chart Payments Received Command=====================================

export type commandChartPaymentsReceived = {
  days: number;
  nodes?: string[];
};

export type commandChartPaymentsReceivedReturn = {
  result: any;
  error?: string;
};

//=========================Tags Command=====================================

export type commandTags = {
  add: string[];
  icon?: string;
  id?: string;
  is_avoided?: boolean;
  remove: string[];
  tag?: string;
};

export type commandTagsReturn = {
  result: {
    alias: string;
    id: string;
    icon?: string;
    is_avoided?: boolean;
    nodes?: string[];
  }[];
  error?: string;
};
