import React from 'react';

function TranscriptionDisplay({ transcript }) {
  return (
    <div>
      <h2>Transcript</h2>
      <p>{transcript}</p>
    </div>
  );
}

export default TranscriptionDisplay;
