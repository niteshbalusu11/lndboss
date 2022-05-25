//=========================Credential Create Types=====================================

export type credentialsCreate = {
  cert: string;
  macaroon: string;
  node: string;
  socket: string;
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
  error: string;
  savedNodes: string[];
};

//=========================Command Types=====================================

export type commandBalance = {
  above?: number;
  below?: number;
  node: string;
  is_confirmed?: boolean;
  is_offchain_only?: boolean;
  is_onchain_only?: boolean;
};

export type commandBalanceReturn = {
  result?: {
    balance: number;
    channel_balance: number;
  };
  error?: string;
};

export type commandChainDeposit = {
  node: string;
  amount: number;
};

export type commandChainDepositReturn = {
  result?: {
    address: string;
    url: string;
  };
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
