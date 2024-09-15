const fs = require('fs');
const wav = require('wav');
const { Model, Recognizer } = require('vosk');
const path = require('path');

// Load Vosk model (make sure to provide the correct path to your model)
const model = new Model(path.join(__dirname, '../models/vosk-model-small-en-us-0.15'));

const transcribeAudio = (audioFilePath) => {
  return new Promise((resolve, reject) => {
    const wfReader = new wav.Reader();

    wfReader.on('format', async (format) => {
      const rec = new Recognizer({ model: model, sampleRate: format.sampleRate });

      wfReader.on('data', (data) => {
        rec.acceptWaveform(data);
      });

      wfReader.on('end', () => {
        const result = rec.finalResult();
        resolve(result.text);
      });
    });

    fs.createReadStream(audioFilePath).pipe(wfReader);
  });
};

module.exports = { transcribeAudio };
