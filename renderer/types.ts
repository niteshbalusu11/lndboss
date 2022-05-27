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

//=========================Command Types=====================================

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

export type commandChartChainFees = {
  days?: number;
  node?: string;
};

export type commandChartChainFeesReturn = {
  result: any;
  error?: string;
};

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
