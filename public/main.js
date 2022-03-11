const path = require("path");
var fs = require("fs");
const NodeID3 = require("node-id3");
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
var SpotifyWebApi = require("spotify-web-api-node");
const { default: axios } = require("axios");
var spotifyApi = new SpotifyWebApi({
  clientId: "1de9c1a9b6144f9eb5c48414ce428578",
  clientSecret: "a7b2e43765514cc2a171441cf9881449",
  redirectUri: "http://www.example.com/callback",
});
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log("The access token expires in " + data.body["expires_in"]);
    console.log("The access token is " + data.body["access_token"]);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);
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
  ipcMain.handle("set-file", handleSetTags);
  ipcMain.handle("search-song", handleSearch);

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

  return {
    title: tags.title,
    album: tags.album,
    artist: tags.artist,
    image:
      tags.raw && tags.raw.APIC && tags.raw.APIC.imageBuffer
        ? tags.raw.APIC.imageBuffer.toString("base64")
        : null,
  };
}
function handleSetTags(event, path, tags) {
  if (tags.image) tags.image = Buffer.from(tags.image, "base64");
  const success = NodeID3.update(tags, path);
  return success;
}
async function handleSearch(event, song) {
  let searchTerm = song.title + " " + song.artist;
  try {
    let results = await spotifyApi.searchTracks(searchTerm);
    let imgUrl = results.body.tracks.items[0].album.images[0].url;
    const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
    results.body.tracks.items[0].defaultImage = Buffer.from(
      response.data,
      "utf-8"
    ).toString("base64");
    return results.body.tracks.items;
  } catch (error) {
    console.log(error);
  }
}
