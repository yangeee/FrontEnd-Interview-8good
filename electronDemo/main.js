const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

app.on("ready", () => {
  const browserWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true, enableRemoteModule: true },
  });
  browserWindow.loadFile(path.resolve(__dirname, "index.html"));

  globalShortcut.register('CommandOrControl+Shift+R', () => browserWindow.webContents.send("StartRecording"))
  globalShortcut.register('CommandOrControl+Shift+S', () => browserWindow.webContents.send("StopRecording"))
});

app.on('will-quit', () => globalShortcut.unregisterAll())
