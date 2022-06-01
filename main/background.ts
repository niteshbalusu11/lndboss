import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import serveNextAt from 'next-electron-server';
import { createWindow } from './helpers';
import {
  balanceCommand,
  chainDepositCommand,
  chartChainFeesCommand,
  chartFeesEarnedCommand,
  tagsCommand,
} from './commands';
import authenticatedLnd from './lnd/authenticated_lnd';
import * as types from '../renderer/types';
import * as lnd from './lnd';

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

ipcMain.on('pass-info', async (event, args: any) => {
  console.log('pass-info', args);
  await app.whenReady();

  const childWindow = createWindow('child', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await childWindow.loadURL('next://app/test');
  } else {
    await childWindow.loadURL('next://app/test');
    childWindow.webContents.openDevTools();
  }

  const id = setTimeout(() => {
    childWindow.webContents.send('pass-info-response', args);
  }, 1000);

  return () => clearTimeout(id);
});
