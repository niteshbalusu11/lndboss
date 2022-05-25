//=========================Credential Check Types=====================================

export type checkConnectionReturn = {
  hasAccess?: boolean;
  error?: string;
};

export type credentialsCreate = {
  cert: string;
  macaroon: string;
  socket: string;
};

export type createCredentialsReturn = {
  result?: boolean;
  error?: string;
};

//=========================Command Types=====================================

export type commandBalance = {
  above?: number;
  below?: number;
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
