import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import balanceCommand from "./commands/balance/balance_command";
import createCredentials from "./auth/create_credentials";
import checkConnection from "./auth/check_connection";
import chainDepositCommand from "./commands/chainDeposit/chain_deposit";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.handle("command:balance", async (event, args) => {
  const { result, error } = await balanceCommand(args);

  return { result, error };
});

ipcMain.handle("command:chainDeposit", async (event, args) => {
  const { result, error } = await chainDepositCommand(args);
  console.log(result, error);
  return { result, error };
});

ipcMain.handle("credentials:create", async (event, args) => {
  const { result, error } = await createCredentials({
    cert: args.cert,
    macaroon: args.macaroon,
    socket: args.socket,
  });

  return { result, error };
});

ipcMain.handle("checkconnection:get", async (event) => {
  const publicKey = await checkConnection();

  return publicKey;
});
