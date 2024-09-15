import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import TranscriptionDisplay from './components/TranscriptDisplay';

function App() {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (filePath) => {
    window.electron.send('process-file', filePath);  // Send file to Electron
  };

  // Listen for the transcription complete event and set the transcript state
  window.electron.on('transcription-complete', (transcript) => {
    setTranscript(transcript);
  });

  // Listen for any errors during transcription and set the error state
  window.electron.on('transcription-error', (error) => {
    setError(`Error: ${error}`);
  });

  return (
    <div>
      <h1>Video/Audio Transcription</h1>
      <FileUploader onFileUpload={handleFileUpload} />
      {error ? <p>{error}</p> : <TranscriptionDisplay transcript={transcript} />}
    </div>
  );
}

export default App;
