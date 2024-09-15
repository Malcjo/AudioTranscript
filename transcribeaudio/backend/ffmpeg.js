const path = require('path');
const ffmpegStatic = require('ffmpeg-static');
const { exec } = require('child_process');
const fs = require('fs');

const extractAudio = (inputFile) => {
  console.log("Starting audio extraction from:", inputFile);  // Added logging
  return new Promise((resolve, reject) => {

        // Ensure the backend directory exists
        const backendDirectory = path.join(__dirname, 'backend');
        console.log("directory: ", backendDirectory);
        if (!fs.existsSync(backendDirectory)) {
          fs.mkdirSync(backendDirectory);
          console.log('Created backend directory: ', backendDirectory);
        }
        
    const outputFile = path.join(backendDirectory, 'output.wav');
    console.log("output file: ",outputFile);

    // This command converts to WAV with mono channel and 16-bit PCM encoding at 16000 Hz
    const ffmpegCommand = `${ffmpegStatic} -i "${inputFile}" -acodec pcm_s16le -ar 16000 -ac 1 "${outputFile}"`;
    console.log(`Running ffmpeg command: ${ffmpegCommand}`);  // Log the command

    // Convert the audio to 16-bit PCM mono WAV at 16000 Hz
    exec(`${ffmpegStatic} -i ${inputFile} -acodec pcm_s16le -ar 16000 -ac 1 ${outputFile}`, (err) => {
      console.log("running exec iun ffmpeg ");
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
