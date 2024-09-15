import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import TranscriptionDisplay from './components/TranscriptDisplay';

function App() {
  const [transcript, setTranscript] = useState('');

  const handleFileUpload = (filePath) => {
    window.electron.send('process-file', filePath);  // Using the API exposed by preload.js
  };

  window.electron.on('transcription-complete', (transcript) => {
    console.log(transcript)
    setTranscript(transcript);
  });

  window.electron.on('transcription-error', (error) => {
    console.log(`Error: ${error}`)
    setTranscript(`Error: ${error}`);
  });

  return (
    <div>
      <h1>Video/Audio Transcription</h1>
      <FileUploader onFileUpload={handleFileUpload} />
      <TranscriptionDisplay transcript={transcript} />
    </div>
  );
}

export default App;
