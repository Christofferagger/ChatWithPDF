const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pdfjsLib = require('pdfjs-dist');
const fs = require('fs').promises;
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const FaissStore = require("langchain/vectorstores/faiss").FaissStore;
const OpenAIEmbeddings = require("langchain/embeddings/openai").OpenAIEmbeddings;


const app = express();
app.use(express.json());
const port = 4000;

const upload = multer({ dest: "./pdfStorage/" })

async function processText(text) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        separator: "\n",
        chunkSize: 1000,
        chunkOverlap: 200
    });

    const chunks = await textSplitter.createDocuments([text]);

    textChunks = [];
    textIDs = [];

    chunks.forEach((chunk, index) => {
        textChunks.push(chunk.pageContent);
        textIDs.push(index);
    })

    const db = await FaissStore.fromTexts(
        textChunks,
        textIDs,
        new OpenAIEmbeddings()
    );

    return db;
}

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

    // create FAISS database
    db = processText(textContent);

    if (db) {
        res.json({ message: true });
    }
});

app.post('/query', (req,res) => {
    console.log(req.body.query);
    res.json({ message: 'query received' });
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

