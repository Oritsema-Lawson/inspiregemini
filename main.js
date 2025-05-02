// Import modules.
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { isatty } = require('tty');

// Store OS and environment.
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

// Variable to hold the main window instance.
let mainWindow;

// Function to create and configure the main application window.
function createWindow() {
    mainWindow = new BrowserWindow({
        title: 'InspireGemini',
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Open DevTools in development mode.
    isDev && mainWindow.webContents.openDevTools();


    // Load the main HTML file.
    mainWindow.loadFile(path.join(__dirname, './app/index.html'));
}


// When the app is ready, create the window and set up handlers.
app.whenReady().then(() => {
    createWindow();

    // Set the application menu.
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

    // Re-create window on macOS dock icon click if no windows are open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

// Appmenu
const menu = [{ role: 'fileMenu', /* Don't need more than this */ }];

// IPC Handlers
// Listen for 'text:generate' message from renderer and return text to renderer
ipcMain.on('text:generate', (e, options) => {
    let resultText = `Theme is ${options['text']}`;
    //Have logic for generating text here
    console.log(resultText);
    // Send 'text:generatedtext' message back to the renderer.
    mainWindow.webContents.send('text:generatedtext', { resultText });
})


// Quit the app when all windows are closed, unless on mac
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});
