const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const { electron } = require("process");
const ipc = require("electron").ipcMain;

const util = require("util");

const acmd = util.promisify(exec); // (cmd) => new Promise((r) => exec(cmd, r));
const cmd = (cmd) => {
  return new Promise((r) => {
    exec(cmd, (err, stdout, stderr) => {
      r(stdout);
    });
  });
};

var mainWindow;
function createWindow() {
  // Create the browser window.
  Git.getCommits();
  // mainWindow = new BrowserWindow({
  //   width: 1050,
  //   height: 700,
  //   webPreferences: {
  //     preload: path.join(__dirname, "src/preload.js"),
  //     nodeIntegration: true,
  //     enableRemoteModule: true,
  //   },
  // });
  // mainWindow.loadFile("src/index.html");
  // //   ipc.on("makesave", () => {
  // //     console.log("making save");
  // //   });
  // mainWindow.setFullScreen(true);
}

app.whenReady().then(() => {
  // ipcMain.on("git", (res, req) => {
  //   console.log(req);
  //   Git.log((stdout) => {
  //     mainWindow.webContents.send("git", { type: "commit", data: stdout });
  //   });
  // });
  createWindow();
});

app.on("window-all-closed", function () {
  app.quit();
});

const Git = {
  log: () => {
    return cmd("git log");
  },
  getDiff: async (id, id2) => {
    return cmd(id + ".." + id2);
  },
  getCommits: async () => {
    let result = []; // wanted format : [{id:1hjkhdaiut817egdbvjhSb,author:coolelectronics,date:"idk",message:"hi"}]

    let log = await cmd("git log");
    let loglines = log.split("\n");
    for (let i = 0; i < loglines.length; ) {
      let line = loglines[i];
      if (line.split(" ")[0] == "commit") {
        let commit = {};

        commit.id = line.split(" ")[1];
        commit.author = loglines[i + 1].split(" ")[1];
        commit.message = loglines[i + 4].substring(4, loglines[i + 4].length);

        result.push(commit);
        i += 5;
      } else {
        i++;
      }
    }
    return result.reverse();
  },
};
