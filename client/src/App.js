import React, { useState } from 'react';
import './App.css';
import PdfReader from './components/PdfReader.js';
import Query from './components/query.js';

function App() {

  const [boolianValue, setBoolianValue] = useState(null);

  const handleprocess = (status) => {
    setBoolianValue(status);
  }

  return (
    <div>
      <h1>Hello world</h1>
      <PdfReader pdfprocessed={handleprocess} />
      <Query boolian={boolianValue} />
    </div>
  );
}

export default App;
