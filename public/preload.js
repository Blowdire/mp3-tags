const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getFile: (file) => ipcRenderer.invoke("get-file", file),
});
