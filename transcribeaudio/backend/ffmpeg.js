const path = require('path');
const ffmpegStatic = require('ffmpeg-static');
const { exec } = require('child_process');
const fs = require('fs');
const { app } = require('electron');  // Import electron to get app path

const extractAudio = (inputFile) => {
  console.log("Starting audio extraction from:", inputFile);  // Added logging
  
  return new Promise((resolve, reject) => {
    // Store output files in a writable directory (userData directory)
    const outputDir = path.join(app.getPath('userData'), 'output');
    console.log("Output directory:", outputDir);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('Created output directory: ', outputDir);
    }
    
    const outputFile = path.join(outputDir, 'output.wav');
    console.log("Output file:", outputFile);

    // This command converts to WAV with mono channel and 16-bit PCM encoding at 16000 Hz
    const ffmpegCommand = `${ffmpegStatic} -i "${inputFile}" -acodec pcm_s16le -ar 16000 -ac 1 "${outputFile}"`;
    console.log(`Running ffmpeg command: ${ffmpegCommand}`);  // Log the command

    // Execute the ffmpeg command
    exec(`"${ffmpegStatic}" -i "${inputFile}" -acodec pcm_s16le -ar 16000 -ac 1 "${outputFile}"`, (err) => {
      if (err) {
        console.log("Error during audio extraction:", err);  // Added logging
        reject(err);
      } else {
        console.log("Audio extraction completed, output file:", outputFile);  // Added logging
        resolve(outputFile);
      }
    });
  });
};

module.exports = { extractAudio };
