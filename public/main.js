const path = require("path");
var fs = require("fs");
const NodeID3 = require("node-id3");
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("get-file", handleFile);
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
/**
 * Handle getting file id3 metadata throug ipc
 * @param {*} event
 * @param {String} path path to mp3 file
 */
function handleFile(event, path) {
  //create mo3 file stream
  const tags = NodeID3.read(path);
  console.log(tags);
  console.log("\n******************************\n");
  return {
    title: tags.title,
    album: tags.album,
    artist: tags.artist,
    image: tags.raw.APIC.imageBuffer.toString("base64"),
  };
}
