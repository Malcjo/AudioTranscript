import React from 'react';
import '../CSS/TranscriptDisplay.css'; 

function TranscriptionDisplay({ transcript }) {

  const handleSave = () =>{
    // Use the exposed Electron API to send the transcription to the main process
    window.electron.send('save-transcription', transcript);
  };

  return (
    <div className="transcript-container">
      <h2>Transcript</h2>
      <div>
        <p>{transcript ? transcript : ''}</p>
        <p>{transcript && <button onClick={handleSave}>Save Transcript</button>}</p>
      </div>
    </div>
  );
}

export default TranscriptionDisplay;
