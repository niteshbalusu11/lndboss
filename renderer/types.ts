export type commandBalance = {
  above?: number;
  below?: number;
  is_confirmed?: boolean;
  is_offchain_only?: boolean;
  is_onchain_only?: boolean;
};

export type credentialsCreate = {
  cert: string;
  macaroon: string;
  socket: string;
};

export type commandChainDeposit = {
  amount: number;
};
