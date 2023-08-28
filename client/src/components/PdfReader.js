import React, { useState } from 'react';
import Exit from '../assets/Exit.svg';

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

    const removeFile = (index) => {
        const newSelectedFile = [...selectedFile];
        newSelectedFile.splice(index, 1);
        setSelectedFile(newSelectedFile);
    }

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
                        <div key={index}>
                            <h3>{file.name}</h3>
                            <a href="#" onClick={removeFile}>
                                <img src={Exit} alt="Exit button" />
                            </a>
                        </div>
                    ))
                }
            </div>
            <button onClick={handleUpload}>Submit</button>
        </div>
    )
}

export default PdfReader;