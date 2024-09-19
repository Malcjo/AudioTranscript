import React, { useState } from 'react';
import '../CSS/fileUploader.css';

function FileUploader({ onFileUpload }) {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      console.log("uploading file: ", file, " at path: ", file.path);
      onFileUpload(file.path);
    }
  };

  const handleSelectFile = () => {
    console.log("select file");
    window.electron.openFileDialog();  // Open the file dialog via Electron
  };

  window.electron.on('selected-file', (filePath) => {
    setFile({ name: filePath.split('\\').pop(), path: filePath });  // Update with selected file name and path
  });

  return (
    <div className="fileUploader">
      <button onClick={handleSelectFile}>Choose File</button>
      {/*<label className="custom-file-upload">
        <input type="file" onChange={handleChange} />
        Choose File
      </label> */}
      <button onClick={handleUpload}>Upload and Transcribe</button>
      {file && <p>Selected file: {file.name}</p>} {/* Display the file name after selection */}
    </div>
  );
}

export default FileUploader;
