import { contextBridge, ipcRenderer } from 'electron';
import * as types from '../renderer/types';

contextBridge.exposeInMainWorld('electronAPI', {
  commandBalance: (args: types.commandBalance) => ipcRenderer.invoke('command:balance', args),
  commandChainDeposit: (args: types.commandChainDeposit) => ipcRenderer.invoke('command:chainDeposit', args),
  commandChartChainFees: (args: types.commandChartChainFees) => ipcRenderer.invoke('command:chartChainFees', args),
  commandChartFeesEarned: (args: types.commandChartFeesEarned) => ipcRenderer.invoke('command:chartFeesEarned', args),
  credentialsCreate: (args: types.credentialsCreate) => ipcRenderer.invoke('credentials:create', args),
  commandTags: (args: types.commandTags) => ipcRenderer.invoke('command:tags', args),
  getSavedNodes: () => ipcRenderer.invoke('credentials:getSavedNodes'),
  passInfo: (args: any) => ipcRenderer.send('pass-info', args),
  passInfoResponse: (callback: any) => {
    console.log('inside preload');
    return ipcRenderer.on('pass-info-response', callback);
  },
});
