import React, { useState } from 'react';

function Query({ boolian }) {

    const [inputValue, setInputValue] = useState('');

    const placeholderText = boolian ? 'What would you like to know?' : '<-- insert pdf';

    const handleSubmit = () => {
        console.log(inputValue);
    }

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