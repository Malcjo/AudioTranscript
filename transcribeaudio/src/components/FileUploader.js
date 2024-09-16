import React, { useState } from 'react';
import '../CSS/fileUploader.css';

function FileUploader({ onFileUpload }) {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onFileUpload(file.path);
    }
  };

  return (
    <div className="fileUploader">
      <label className="custom-file-upload">
        <input type="file" onChange={handleChange} />
        Choose File
      </label>
      <button onClick={handleUpload}>Upload and Transcribe</button>
      {file && <p>Selected file: {file.name}</p>} {/* Display the file name after selection */}
    </div>
  );
}

export default FileUploader;
