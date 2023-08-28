import React, { useState } from 'react';
import './App.css';
import PdfReader from './components/PdfReader.js';
import Query from './components/query.js';
import Chat from './components/chat.js';

function App() {

  const [boolianValue, setBoolianValue] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const handleprocess = (status) => {
    setBoolianValue(status);
  }

  const getChatHistory = (history) => {
    setChatHistory(history);
  }

  return (
    <div>
      <h1>Hello world</h1>
      <PdfReader pdfprocessed={handleprocess} />
      <Query boolian={boolianValue} chat={getChatHistory} />
      <Chat chat={chatHistory} />
    </div>
  );
}

export default App;
