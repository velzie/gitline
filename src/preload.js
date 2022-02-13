const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  ipcd: ipcRenderer,
  ongit: (c) => {
    ipcRenderer.on("git", c);
  },
});
