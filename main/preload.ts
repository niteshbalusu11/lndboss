import { contextBridge, ipcRenderer, webFrame } from 'electron';
import * as types from '../renderer/types';

contextBridge.exposeInMainWorld('electronAPI', {
  commandBalance: (args: types.commandBalance) => ipcRenderer.invoke('command:balance', args),
  commandChainDeposit: (args: types.commandChainDeposit) => ipcRenderer.invoke('command:chainDeposit', args),
  commandChartChainFees: (args: types.commandChartChainFees) => ipcRenderer.invoke('command:chartChainFees', args),
  commandChartFeesEarned: (args: types.commandChartFeesEarned) => ipcRenderer.invoke('command:chartFeesEarned', args),
  commandChartFeesPaid: (args: types.commandChartFeesPaid) => ipcRenderer.invoke('command:chartFeesPaid', args),
  commandChartPaymentsReceived: (args: types.commandChartPaymentsReceived) =>
    ipcRenderer.invoke('command:chartPaymentsReceived', args),
  credentialsCreate: (args: types.credentialsCreate) => ipcRenderer.invoke('credentials:create', args),
  commandTags: (args: types.commandTags) => ipcRenderer.invoke('command:tags', args),
  getSavedNodes: () => ipcRenderer.invoke('credentials:getSavedNodes'),
  createChildWindow: (args: types.childWindow, path: string, windowName: string) =>
    ipcRenderer.send('create-child-window', args, path, windowName),
  passArgs: (callback: any) => ipcRenderer.on('pass-args', callback),
});

webFrame.executeJavaScript(`Object.defineProperty(globalThis, 'WebSocket', {
  value: new Proxy(WebSocket, {
    construct: (Target, [url, protocols]) => {
      if (url.endsWith('/_next/webpack-hmr')) {
        // Fix the Next.js hmr client url
        return new Target("ws://localhost:8888/_next/webpack-hmr", protocols)
      } else {
        return new Target(url, protocols)
      }
    }
  })
});`);
