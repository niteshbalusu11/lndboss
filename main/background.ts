import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import balanceCommand from './commands/balance/balance_command';
import chainDepositCommand from './commands/chainDeposit/chain_deposit';
import authenticatedLnd from './lnd/authenticated_lnd';
import * as types from '../renderer/types';
import tagsCommand from './commands/tags/tags_command';
import * as lnd from './lnd';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}
(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.handle('command:balance', async (_event, args: types.commandBalance) => {
  const { lnd } = await authenticatedLnd({ node: args.node });
  const { result, error } = await balanceCommand(args, lnd);

  return { result, error };
});

ipcMain.handle('command:chainDeposit', async (_event, args: types.commandChainDeposit) => {
  const { lnd } = await authenticatedLnd({ node: args.node });
  const { result, error } = await chainDepositCommand(args, lnd);
  return { result, error };
});

ipcMain.handle('credentials:create', async (_event, args: types.credentialsCreate) => {
  const { result, error } = await lnd.putSavedCredentials(args);
  const connection = await lnd.checkConnection({ node: args.node });
  return { connection, result, error };
});

ipcMain.handle('credentials:getSavedNodes', async () => {
  const { savedNodes, error } = await lnd.getSavedNodes();
  return { savedNodes, error };
});

ipcMain.handle('command:tags', async (_event, args: types.commandTags) => {
  const { result, error } = await tagsCommand(args);
  return { result, error };
});
