import './App.css';
import PdfReader from './components/PdfReader.js';

function App() {
  fetch('/api')
  .then((response) => response.json())
  .then((data) => console.log(data.message))
  .catch((error) => console.error('There was an error!', error));

  return (
    <div>
      <h1>Hello world</h1>
      <PdfReader />
    </div>
  );
}

export default App;
