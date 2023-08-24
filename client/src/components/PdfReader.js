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
            const file = selectedFile;
            const formData = new FormData();
            formData.append('pdf', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            }).then(response => response.json()).then(data => console.log(data));
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