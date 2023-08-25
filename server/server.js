const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pdfjsLib = require('pdfjs-dist');
const fs = require('fs').promises;
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const FaissStore = require("langchain/vectorstores/faiss").FaissStore;
const OpenAIEmbeddings = require("langchain/embeddings/openai").OpenAIEmbeddings;
const { RetrievalQAChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");



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

app.post('/query', async (req,res) => {
    // Check if database is initialized
    if (db === null) {
        res.status(400).json({ message: 'Database not initialized' });
        return;
    }

    const query = req.body.query;

    try {
        const prompt = await db.similaritySearch(query, 2)

        const context = prompt.map(doc => doc.pageContent).join(' ');

        let totalCompletionTokens = 0;
        let totalPromptTokens = 0;
        let totalExecutionTokens = 0;

        const model = new ChatOpenAI({ 
            modelName: "gpt-3.5-turbo",
            callbacks: [
                {
                    handleLLMEnd: (output, runId, parentRunId, tags) => {
                        if (output && output.llmOutput && output.llmOutput.tokenUsage) {
                            const tokenUsage = output.llmOutput.tokenUsage;
                            totalCompletionTokens += tokenUsage.completionTokens || 0;
                            totalPromptTokens += tokenUsage.promptTokens || 0;
                            totalExecutionTokens += tokenUsage.totalTokens || 0;
                        }
                    },
                }
            ],
         });
        const chain = RetrievalQAChain.fromLLM(model, db.asRetriever());

        const response = await chain.call({
            query: query,
            context: context 
        });

        const costPerPromptToken = 0.0015 / 1000; // $0.0015 per 1,000 tokens
        const costPerCompletionToken = 0.002 / 1000; // $0.002 per 1,000 tokens
        const totalCostInDollars = (totalPromptTokens * costPerPromptToken) + (totalCompletionTokens * costPerCompletionToken);

        console.log(`Total cost: $${totalCostInDollars}`);

        res.json({ response });

    } catch (error) {
        console.log(error);
        res.json({ message: 'An error occurred', error: error });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

