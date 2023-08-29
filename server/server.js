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

const upload = multer({ dest: "./pdfStorage/" });

let vectorDB = null;

let similaritySearchLength;

let chatHistory = [];

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

app.post('/upload', upload.array('pdf'), async (req, res) => {

    let dbArray = [];

    similaritySearchLength = req.files.length;

    for (const file of req.files) {
        const filePath = path.join(__dirname, file.path);
        const pdf = await pdfjsLib.getDocument(filePath).promise;
        let textContent = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            textContent += content.items.map(item => item.str).join(' ');
        }

        await fs.unlink(filePath);

        db = await processText(textContent);

        if (db) {
            dbArray.push(db);
        }
    };

    vectorDB = await dbArray[0];

    for (let i = 1; i < dbArray.length; i++) {
        await vectorDB.mergeFrom(dbArray[i]);
    };

    if (vectorDB) {
        res.json({ message: true });
    }

});

app.post('/query', async (req,res) => {
    // Check if database is initialized
    if (vectorDB === null) {
        res.status(400).json({ message: 'Database not initialized' });
        return;
    }

    const query = req.body.query;

    try {
        const prompt = await vectorDB.similaritySearch(query, similaritySearchLength);

        const context = prompt.map(doc => doc.pageContent).join(' ');

        let totalCompletionTokens = 0;
        let totalPromptTokens = 0;
        let totalExecutionTokens = 0;

        const model = new ChatOpenAI({ 
            modelName: "gpt-3.5-turbo-16k",
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

        const history = chatHistory.map(interaction => `${interaction['question']} ${interaction['response']}`).join(" ");
        const chain = RetrievalQAChain.fromLLM(model, vectorDB.asRetriever());
        let response = '';

        if (chatHistory.length > 0) {
            question = `context: ${history}\nQuestion: ${query}`;
            response = await chain.call({
                query: question,
                context: context
            });
          } else {
            response = await chain.call({
                query: query,
                context: context 
            });
          }

          chatHistory.push({'question': query, 'response': response});

        const costPerPromptToken = 0.0015 / 1000; // $0.0015 per 1,000 tokens
        const costPerCompletionToken = 0.002 / 1000; // $0.002 per 1,000 tokens
        const totalCostInDollars = (totalPromptTokens * costPerPromptToken) + (totalCompletionTokens * costPerCompletionToken);

        console.log(`Total cost: $${totalCostInDollars}`);

        res.json({ chatHistory });

    } catch (error) {
        console.log(error);
        res.json({ message: 'An error occurred', error: error });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

