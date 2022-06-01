import { app, ipcMain } from 'electron';
import serveNextAt from 'next-electron-server';
import { createWindow } from './helpers';
import {
  balanceCommand,
  chainDepositCommand,
  chartChainFeesCommand,
  chartFeesEarnedCommand,
  tagsCommand,
} from './commands';
import * as lnd from './lnd';
import authenticatedLnd from './lnd/authenticated_lnd';
import * as types from '../renderer/types';
import createChildWindow from './utils/create_child_window';

const isProd: boolean = process.env.NODE_ENV === 'production';

serveNextAt('next://app', {
  outputDir: './app',
  port: 8888,
});

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (!!isProd) {
    await mainWindow.loadURL('next://app/home');
  } else {
    await mainWindow.loadURL('next://app/home');
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

// ==========================Balance Command=====================================
ipcMain.handle('command:balance', async (_event, args: types.commandBalance) => {
  const { lnd } = await authenticatedLnd({ node: args.node });
  const { result, error } = await balanceCommand(args, lnd);

  return { result, error };
});

// ==========================Chain Deposit Command=====================================
ipcMain.handle('command:chainDeposit', async (_event, args: types.commandChainDeposit) => {
  const { lnd } = await authenticatedLnd({ node: args.node });
  const { result, error } = await chainDepositCommand(args, lnd);

  return { result, error };
});

// ==========================Chart Chain Fees Command=====================================
ipcMain.handle('command:chartChainFees', async (_event, args: types.commandChartChainFees) => {
  const { lnds } = await lnd.getLnds({ nodes: args.nodes });
  const { result, error } = await chartChainFeesCommand(args, lnds);

  return { result, error };
});

// ==========================Chart Fees Earned Command=====================================
ipcMain.handle('command:chartFeesEarned', async (_event, args: types.commandChartFeesEarned) => {
  const { lnds } = await lnd.getLnds({ nodes: args.nodes });
  const { result, error } = await chartFeesEarnedCommand(args, lnds);

  return { result, error };
});

// ==========================Tags Command=====================================
ipcMain.handle('command:tags', async (_event, args: types.commandTags) => {
  const { result, error } = await tagsCommand(args);

  return { result, error };
});

// ==========================Create Credentials=====================================
ipcMain.handle('credentials:create', async (_event, args: types.credentialsCreate) => {
  const { result, error } = await lnd.putSavedCredentials(args);
  const connection = await lnd.checkConnection({ node: args.node });

  return { connection, result, error };
});

// ==========================Get Saved Nodes=====================================
ipcMain.handle('credentials:getSavedNodes', async () => {
  const { defaultSavedNode, savedNodes, error } = await lnd.getSavedNodes();

  return { defaultSavedNode, savedNodes, error };
});

ipcMain.on('create-child-window', async (_event, flags: types.childWindow, path: string, windowName: string) => {
  await createChildWindow({
    app,
    createWindow,
    isProd,
    flags,
    path,
    windowName,
  });
});
