import { app, BrowserWindow } from 'electron';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: false,
    width: 450,
    resizable: false
  })

  mainWindow.setMenu(null);

  mainWindow.loadURL(winURL)

  // Uncomment to use Chrome developer tools
  //mainWindow.webContents.openDevTools({detach:true});

  mainWindow.on('closed', () => {
    mainWindow = null
  });

  const {ipcMain} = require('electron');

  ipcMain.on('resize', (e, width, height) => {
    mainWindow.setSize(width+6, height+28);
  });
}

/*
  이벤트 명 : 'ready'
  조건 : 앱이 준비되었을때
*/
app.on('ready', createWindow)

/*
  이벤트 명 : 'window-all-closed'
  조건 : 앱 닫았을때
*/
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
