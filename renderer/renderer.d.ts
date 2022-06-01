import * as types from './types';

export interface IElectronAPI {
  commandBalance: (args: types.commandBalance) => Promise<types.commandBalanceReturn>;
  commandChainDeposit: (args: types.commandChainDeposit) => Promise<types.commandChainDepositReturn>;
  commandChartChainFees: (args: types.commandChartChainFees) => Promise<types.commandChartChainFeesReturn>;
  commandChartFeesEarned: (args: types.commandChartFeesEarned) => Promise<types.commandChartFeesEarnedReturn>;
  credentialsCreate: (args: types.credentialsCreate) => Promise<types.createCredentialsReturn>;
  checkconnectionGet: () => Promise<types.checkConnectionReturn>;
  commandTags: (args: types.commandTags) => Promise<types.commandTagsReturn>;
  getSavedNodes: () => Promise<types.getSavedNodesReturn>;
  passInfo: (args: any) => any;
  passInfoResponse: (args: any) => any;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
