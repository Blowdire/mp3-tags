const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getFile: (file) => ipcRenderer.invoke("get-file", file),
  setFile: (path, tags) => ipcRenderer.invoke("set-file", path, tags),
  searchSong: async (song) => ipcRenderer.invoke("search-song", song),
});
