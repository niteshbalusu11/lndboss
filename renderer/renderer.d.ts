import * as types from './types';

export interface IElectronAPI {
  commandBalance: (args: types.commandBalance) => Promise<any>;
  commandChainDeposit: (args: types.commandChainDeposit) => Promise<any>;
  credentialsCreate: (args: types.credentialsCreate) => Promise<any>;
  checkconnectionGet: () => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
