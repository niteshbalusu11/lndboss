import * as types from './types';

export interface IElectronAPI {
  commandBalance: (args: types.commandBalance) => Promise<types.commandBalanceReturn>;
  commandChainDeposit: (args: types.commandChainDeposit) => Promise<types.commandChainDepositReturn>;
  credentialsCreate: (args: types.credentialsCreate) => Promise<types.createCredentialsReturn>;
  checkconnectionGet: () => Promise<types.checkConnectionReturn>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
