// Import modules.
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const genai = require('@google/genai');

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
ipcMain.on('text:generate', async (e, options) => {
    console.log(`Theme is ${options['theme']}, and api key is ${options['api']}.`);

    const response = await getQuote(options['api'], options['theme']);
    const resultText = response.text;
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

async function getQuote(apikey, theme) {
    const ai = new genai.GoogleGenAI({ apiKey: apikey })
    return await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Give me a single inspirational quote within 8 words or less, on the following theme: ${theme}. Do not include ANY formatting, solely just the raw text.`,
    });
}