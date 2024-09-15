const path = require('path');
const ffmpegStatic = require('ffmpeg-static');
const { exec } = require('child_process');

const extractAudio = (inputFile) => {
  return new Promise((resolve, reject) => {
    const outputFile = path.join(__dirname, 'output.wav');

    // Convert the audio to 16-bit PCM mono WAV at 16000 Hz
    exec(`${ffmpegStatic} -i ${inputFile} -acodec pcm_s16le -ar 16000 -ac 1 ${outputFile}`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(outputFile);
      }
    });
  });
};

module.exports = { extractAudio };
