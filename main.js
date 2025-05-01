const { app, BrowserWindow } = require('electron');
const path = require('path');
const { isatty } = require('tty');
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: 'InspireGemini',
        width: isDev ? 1000 : 500,
        height: 600,
    })

    // Open devtools if in dev mode
    isDev && mainWindow.webContents.openDevTools();
    

    mainWindow.loadFile(path.join(__dirname, './app/index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
    })
})

app.on('window-all-closed', () => { !isMac && app.quit() });