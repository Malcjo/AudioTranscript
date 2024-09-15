import React from 'react';

function TranscriptionDisplay({ transcript }) {

  const handleSave = () =>{
    // Use the exposed Electron API to send the transcription to the main process
    window.electron.send('save-transcription', transcript);
  };

  return (
    <div>
      <h2>Transcript</h2>
      <p>{transcript ? transcript : ''}</p>
      <p>{transcript && <button onClick={handleSave}>Save Transcript</button>}</p>
    </div>
  );
}

export default TranscriptionDisplay;
