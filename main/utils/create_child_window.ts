type Args = {
  app: Electron.App;
  createWindow: (name: string, options: Electron.BrowserWindowConstructorOptions) => Electron.BrowserWindow;
  flags: any;
  isProd: boolean;
  path: string;
  windowName: string;
};

const createChildWindow = async ({ app, createWindow, flags, isProd, path, windowName }: Args) => {
  await app.whenReady();

  const childWindow = createWindow(`${windowName}`, {
    width: 800,
    height: 600,
  });

  if (isProd) {
    await childWindow.loadURL(`next://app/${path}`);
  } else {
    await childWindow.loadURL(`next://app/${path}`);
    childWindow.webContents.openDevTools();
  }

  const id = setTimeout(() => {
    childWindow.webContents.send('pass-args', flags);
  }, 2000);

  return () => clearTimeout(id);
};

export default createChildWindow;
