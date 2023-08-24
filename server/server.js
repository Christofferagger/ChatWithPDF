const express = require('express');
const multer = require('multer');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');
const fs = require('fs').promises;

const app = express();
const port = 4000;

const upload = multer({ dest: "./pdfStorage/" })

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.post('/upload', upload.single('pdf'), async (req, res) => {
    
    // Set up a temporary pdf file
    const filePath = path.join(__dirname, req.file.path);

    // Read the pdf file using pdf.js
    const pdf = await pdfjsLib.getDocument(filePath).promise;
    let textContent = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        textContent += content.items.map(item => item.str).join(' ');
    }

    // Delete the temporary file
    await fs.unlink(filePath);


    console.log('Got pdf')
    console.log(textContent)
    res.json({ message: 'got pdf' })
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

