const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const { electron } = require("process");
const ipc = require("electron").ipcMain;

const util = require("util");

var gitindex = 0;
const cmd = (cmd) => {
  return new Promise((r) => {
    exec(
      cmd,
      {
        encoding: "utf8",
        timeout: 0,
        maxBuffer: 20000 * 1024,
        killSignal: "SIGTERM",
        cwd: null,
        env: null,
      },
      (err, stdout, stderr) => {
        if (err != null) {
          console.error(err);
        }
        if (stderr != null) {
          console.error(stderr);
        }
        r(stdout);
      }
    );
  });
};

var mainWindow;
function createWindow() {
  // Create the browser window.

  mainWindow = new BrowserWindow({
    width: 1050,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "src/preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadFile("src/index.html");
  //   ipc.on("makesave", () => {
  //     console.log("making save");
  //   });
  mainWindow.setFullScreen(true);
}

app.whenReady().then(() => {
  ipcMain.on("git", (res, req) => {
    console.log(req);
    Git.getCommits().then((e) => {
      if (e[gitindex + 1] != null) {
        Git.getDiff(e[gitindex].id, e[gitindex + 1].id).then((e2) => {
          mainWindow.webContents.send("git", {
            type: "commit",
            data: e2,
            author: e[gitindex + 1].author,
            message: e[gitindex + 1].message,
          });
          gitindex++;
        });
      }
    });
  });
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
    let result = []; //[{remove:false,code:"kdasjdkla.aksdl();"}]

    let rawdiff = await cmd("git diff " + id + ".." + id2);

    let difflines = rawdiff.split("\n");

    let sectionname = "null";

    let buffer = [];

    for (let i = 0; i < difflines.length; i++) {
      let line = difflines[i];
      switch (line[0]) {
        case " ":
        //fallthrough indended. super cursed tho
        case "+":
          if (line[1] != "+") {
            buffer.push({ sign: true, code: line.substring(1, line.length) });
          } else {
            result.push({
              file: sectionname,
              code: buffer,
            });
            sectionname = line.substring(6, line.length);
            buffer = [];
          }
          break;
        case "-":
          if (line[1] != "-") {
            buffer.push({ sign: false, code: line.substring(1, line.length) });
          }
          break;
      }
    }

    result.shift();
    result.forEach((r) => {
      if (r.file[0] == "." || r.file.includes("package-lock")) {
        result = result.filter((i) => {
          return i != r;
        });
      }
    });
    return result.reverse();
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
