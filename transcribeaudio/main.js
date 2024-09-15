const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ffmpeg = require('./backend/ffmpeg');
const { execFile } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  //mainWindow.loadURL('http://localhost:3000');
  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  /*
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
  */
  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

ipcMain.on('process-file', async (event, filePath) => {
  try {
    const audioFile = await ffmpeg.extractAudio(filePath);

    // Call the Python script for transcription
    execFile('python', ['./backend/transcribe.py', audioFile], (error, stdout, stderr) => {
      if (error) {
        event.reply('transcription-error', error.message);
        return;
      }
      event.reply('transcription-complete', stdout);
    });
  } catch (error) {
    event.reply('transcription-error', error.message);
  }
});
