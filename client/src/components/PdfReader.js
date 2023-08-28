import React, { useState } from 'react';

function PdfReader({ pdfprocessed }) {
    const [selectedFile, setSelectedFile] = useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile([...selectedFile, file]);
        } else {
            alert('not valid PDF file');
        }
    };

    const handleUpload = () => {
        const formData = new FormData();

        selectedFile.forEach((file, index) => {
            formData.append('pdf', file);
        });

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(function (data) {
            pdfprocessed(data.message);
        })
        .catch(error => console.log('Error in file uploading: ', error));
    };

    return (
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <div>
                {
                    selectedFile.map((file, index) => (
                        <h3 key={index}>{file.name}</h3>
                    ))
                }
            </div>
            <button onClick={handleUpload}>Submit</button>
        </div>
    )
}

export default PdfReader;