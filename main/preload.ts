import { contextBridge, ipcRenderer } from 'electron';
import * as types from '../renderer/types';

contextBridge.exposeInMainWorld('electronAPI', {
  commandBalance: (args: types.commandBalance) => ipcRenderer.invoke('command:balance', args),
  commandChainDeposit: (args: types.commandChainDeposit) => ipcRenderer.invoke('command:chainDeposit', args),
  credentialsCreate: (args: types.credentialsCreate) => ipcRenderer.invoke('credentials:create', args),
  checkconnectionGet: () => ipcRenderer.invoke('checkconnection:get'),
});
