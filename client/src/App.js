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
    <div className='parent'>
      <PdfReader pdfprocessed={handleprocess} />
      <Query boolian={boolianValue} chat={getChatHistory} />
        <div className='content'>
          <h1>ChatWithPDF</h1>
          <Chat chat={chatHistory} />
      </div>
    </div>
  );
}

export default App;
