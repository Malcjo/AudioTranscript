const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFileDialog: () => {
    console.log("select file");
    ipcRenderer.send('open-file-dialog');
  },
  send: (channel, data) => {
    console.log("electron data: ", data)
    let validChannels = [ 'process-file', 'save-transcription'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    let validChannels = ['selected-file','transcription-complete', 'transcription-error'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
