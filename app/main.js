const { app, BrowserWindow, ipcMain } = require("electron");
module.exports = { startApp:startApp, startAuth:startAuth };
const windowStateKeeper = require('electron-window-state');
const { autoUpdater } = require("electron-updater");
var constants = require("./constants");
var spotifyApi = constants.spotifyApi;
var settings = constants.settings;
var auth = require('./auth');
require("./videos");

autoUpdater.checkForUpdatesAndNotify();

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 800
  });
  win = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    minWidth: 200,
    minHeight: 200,
    title: "Gemini",
    backgroundColor: "#000000",
    webPreferences: {
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: (__dirname + "/preload.js"),
    },
    frame: false
  });

  win.on("blur", () => {
    win.webContents.send("focus", "no");
  });

  win.on("focus", () => {
    win.webContents.send("focus", "yes");
  });

  // and load the index.html of the app.
  win.menuBarVisible = false;
  mainWindowState.manage(win);

  if (settings.hasSync('refresh_token')) {
    auth.tryRefresh(settings.getSync('refresh_token'))
  } else {
    startAuth()
  }
}

function startApp() {
  setInterval(refresh, 60*59*1000);
  win.loadFile('src/index.html');
}
function startAuth() {
  win.loadURL(auth.getAuthUrl())
}
function refresh() {
  auth.refresh(spotifyApi.getRefreshToken())
}

// Initial /currently-playing request
ipcMain.on("init-playing", (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function (data) {
      event.reply("init-playing-reply", data);
    },
    function (err) {
      refresh();
      event.reply("init-playing-reply", err);
    }
  );
});
// Updating /currently-playing request
ipcMain.on("update-playing", (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function (data) {
      event.reply("update-playing-reply", data);
    },
    function (err) {
      refresh();
      event.reply("update-playing-reply", err);
    }
  );
});
// Set play/pause button to correct state
ipcMain.on("toggle-play", (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function (data) {
      event.reply("toggle-play-reply", data);
    },
    function (err) {
      refresh()
      event.reply("toggle-play-reply", err);
    }
  );
});
// Set shuffle true/false based on current state
ipcMain.on("toggle-shuffle", (event, arg) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    function (data) {
      event.reply("toggle-shuffle-reply", data);
    },
    function (err) {
      refresh()
      event.reply("toggle-shuffle-reply", err);
    }
  )
})
// Cycle through repeat options in order (none, context, track)
ipcMain.on("cycle-repeat", (event, arg) => {
      switch (arg) {
        case 'off':
          spotifyApi.setRepeat({state: 'context'})
          .catch((err) => {
            catch_error(err)
          })
          event.reply("repeat-reply", 'context')
          break;
        case 'context':
          spotifyApi.setRepeat({state: 'track'})
          .catch((err) => {
            catch_error(err)
          })
          event.reply("repeat-reply", 'track')
          break;
        case 'track':
          spotifyApi.setRepeat({state: 'off'})
          .catch((err) => {
            catch_error(err)
          })
          event.reply("repeat-reply", 'off')
          break;
      };
})
// Handles controlling requests (play, pause, skip, previous)
ipcMain.on("control", (event, arg) => {
  switch (arg) {
    case "play":
      spotifyApi.play().catch((err) => {
        catch_error(err);
      });
      break;
    case "pause":
      spotifyApi.pause().catch((err) => {
        catch_error(err);
      });
      break;
    case "forward":
      spotifyApi.skipToNext().catch((err) => {
        catch_error(err);
      });
      break;
    case "backward":
      spotifyApi.seek(0).catch((err) => {
        catch_error(err);
      });
      spotifyApi.skipToPrevious().catch((err) => {
        catch_error(err);
      });
      break;
    case "shuffle":
      spotifyApi.getMyCurrentPlaybackState()
      .then(function(data) {
        if (data.body.shuffle_state == true) {
          spotifyApi.setShuffle({state: false}).then(function(data) {
          })
          event.reply("is_shuffle", false);
        }
        if (data.body.shuffle_state == false) {
          spotifyApi.setShuffle({state: true}).then(function(data) {
          }).catch((err) => {
            console.log(err)
          });
          event.reply("is_shuffle", true);
        }
      }, function(error) {
        console.log(error)
        refresh()
      })
  }
});
// Allows for re-signin
ipcMain.on("auth-server", (event, arg) => {
  if (arg == "sign-in") {
    win.loadURL(auth.getAuthUrl());
  }
});
// Electron window controls (minimize, maximize, close)
ipcMain.on("buttons", (event, arg) => {
  switch (arg) {
    case "close":
      win.close();
      break;

    case "maximize":
      if (!win.isMaximized()) {
        win.maximize();
      } else {
        win.unmaximize();
      }
      break;

    case "full":
      if (!win.isFullScreen()) {
        win.webContents.send("hidepin", "fullscreen");
        win.setFullScreen(true);
        event.reply("pin", false);
        event.reply("pin-mac", false);
        win.setAlwaysOnTop(false);
        event.reply("not", false);
        event.reply("mac", false);
      } else {
        win.webContents.send("hidepin", "notfullscreen");
        win.setFullScreen(false);
        event.reply("pin", true);
        event.reply("pin-mac", true);
      }
      break;

    case "minimize":
      win.minimize();
      break;

    case "top":
      if (!win.isAlwaysOnTop()) {
        win.setAlwaysOnTop(true);
        event.reply("not", true);
      } else {
        win.setAlwaysOnTop(false);
        event.reply("not", false);
      }
      break;

    case "topmac":
      if (!win.isAlwaysOnTop()) {
        win.setAlwaysOnTop(true);
        event.reply("mac", true);
      } else {
        win.setAlwaysOnTop(false);
        event.reply("mac", false);
      }
      break;

    default:
      break;
  }
});
// Set window width to window height
ipcMain.on("set-square", (event, arg) => {
  width = (win.getSize())[0];
  height = (win.getSize())[1];
  if (width < height) {
    win.setSize(width, width);
  } else if (height < width) {
    win.setSize(height, height);
  };
});
// Search Spotify for local files
ipcMain.on("search", (event, args) => {	
  console.log('searching for ', args)	
  spotifyApi.search(args, ['track'], {limit : 1}).then(function(data) {	
    if (data.body.tracks.items[0]) {	
      var imgURL = data.body.tracks.items[0].album.images[0].url;	
      console.log(imgURL);	
      event.reply("local-reply", imgURL);	
    } else {	
      console.log('no image');	
      event.reply("local-reply", '')	
    }	
  }, function (err) {	
    console.log(err)	
  }).catch((err) => catch_error(err))	
});

function catch_error(error) {
  console.error(error)
  refresh()
}

app.whenReady().then(createWindow);