// Import necessary modules
const os = require('os');
const path = require('path');
const toastify = require('toastify-js');
const { contextBridge, ipcRenderer } = require('electron');

// Expose the os.homedir() function.
contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
});

// Expose the path.join() function.
contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args),
});

// Expose Toastify's showToast function.
contextBridge.exposeInMainWorld('toastify', {
    alert: (options) => toastify(options).showToast(),
});

// Expose ipcRenderer's send and on functions for IPC.
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) =>ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});