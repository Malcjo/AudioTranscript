const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
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

  /*
  const startURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : path.join('file://', __dirname, 'build', 'index.html');
  */
 // const startURL = path.join('file://', 'build', 'index.html');
  
/*
  const startURL = app.isPackaged
    ? path.join('file://', __dirname, 'build', 'index.html')
    : 'http://localhost:3000';

  */
  const startURL = path.join(app.getAppPath(), 'build', 'index.html');
  
  //mainWindow.loadURL('http://localhost:3000');
  //mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  /*
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
  */
 mainWindow.loadURL(startURL);
  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

ipcMain.on('open-file-dialog', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Media Files', extensions: ['mp3', 'wav', 'm4a', 'mp4'] }]
  });

  if (!canceled && filePaths.length > 0) {
    event.reply('selected-file', filePaths[0]); // Send selected file path to the renderer process
  }
});

ipcMain.on('process-file', async (event, filePath) => {
  
  console.log("File received for processing:", filePath);  // Added logging

  try {
    const audioFile = await ffmpeg.extractAudio(filePath);
    console.log("Audio file extracted:", audioFile);  // Added logging

    // Call the Python script for transcription
    execFile('python', ['./backend/transcribe.py', audioFile], (error, stdout, stderr) => {
      if (error) {
        console.log("Error during transcription:", error);  // Added logging
        event.reply('transcription-error', error.message);
        return;
      }
      console.log("Transcription complete, output:", stdout);  // Added logging
      event.reply('transcription-complete', stdout);
    });
  } catch (error) {
    console.log("Error during file processing:", error);  // Added logging
    event.reply('transcription-error', error.message);
  }
});

ipcMain.on('save-transcription', async (event, transcriptText) => {
  // Open the save dialog
  const { filePath } = await dialog.showSaveDialog({
    title: 'Save Transcript',
    defaultPath: 'transcript.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (filePath) {
    // Write the transcript to the selected file path
    fs.writeFile(filePath, transcriptText, (err) => {
      if (err) {
        console.log("Error saving file:", err);
      } else {
        console.log("File saved successfully:", filePath);
      }
    });
  }
});