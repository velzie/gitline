const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const { electron } = require("process");
const ipc = require("electron").ipcMain;
var mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 700,
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js"),
    //   nodeIntegration: true,
    //   enableRemoteModule: true,
    // },
  });
  mainWindow.loadFile("src/index.html");
  //   ipc.on("makesave", () => {
  //     console.log("making save");
  //   });
  mainWindow.setFullScreen(true);
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", function () {
  app.quit();
});
