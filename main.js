const { app, BrowserWindow } = require('electron')
const path = require('path')
const {ipcMain} = require('electron')
const {userSelectImage} = require ("./dialogWindow")
const {saveImage} = require ("./dialogWindow")

function createWindow() {
        const mainWindow = new BrowserWindow({
            width: 1200, height: 800, modal: true,
            webPreferences: {
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }

    })
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.handle("select-image-popup",async(handler,args)=>{
    const result = await userSelectImage();
    return result;
})

ipcMain.handle("save-image",async(handler,args)=>{
  const result = await saveImage();
  return result;
})

