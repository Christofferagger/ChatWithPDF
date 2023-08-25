import React, { useState } from 'react';

function Query({ boolian }) {

    const [inputValue, setInputValue] = useState('');

    const placeholderText = boolian ? 'What would you like to know?' : '<-- insert pdf';

    const isValidInput = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length === 0) {
            alert('input is not valid');
            return false;
        }
        return true;
    }

    const handleSubmit = () => {
        if (isValidInput(inputValue)) {
            
            fetch('/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {query: inputValue })
            }).then(response => response.json()).then(data => console.log(data))
            };
        };

    return (
        <div>
            <input type="text"
             placeholder={placeholderText}
             disabled={!boolian} 
             onChange={(e) => setInputValue(e.target.value)}
             value={inputValue}
             />
            <button 
            onClick={handleSubmit}
            disabled={!boolian}
            >
                Submit
            </button>
        </div>
    )
};

export default Query;