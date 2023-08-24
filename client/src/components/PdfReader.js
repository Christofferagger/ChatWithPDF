import React, { useState } from 'react';

function PdfReader() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('not valid PDF file');
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            // server code logic
            console.log('recieved file', selectedFile);
        }
    };

    return (
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Submit</button>
        </div>
    )
}

export default PdfReader;