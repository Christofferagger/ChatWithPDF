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

let db = null;

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

    return await FaissStore.fromTexts(
        textChunks,
        textIDs,
        new OpenAIEmbeddings()
    );
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
    db = await processText(textContent);

    if (db) {
        res.json({ message: true });
    }
});

app.post('/query', (req,res) => {
    // Check if database is initialized
    if (db === null) {
        res.status(400).json({ message: 'Database not initialized' });
        return;
    }

    const query = req.body.query;
    const prompt = db.similaritySearch(query, 2)
        .then(prompt => {
            console.log(prompt);
            res.json({ message: 'query received' });
        })
        .catch(error => {
            console.log(error);
            res.json({ message: 'An error occurred' });
        })
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

