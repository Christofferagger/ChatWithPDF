import React, { useState, useRef, useEffect } from 'react';
import './query.css';

function Query({ boolian, chat }) {

    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        const resizeTextarea = () => {
            if (inputValue.trim() !== '') {
                textarea.style.height = 'auto';
                textarea.style.padding = '0.5rem';
                textarea.style.height = `${textarea.scrollHeight}px`;
            } else {
                textarea.style.height = '20px';  
            }
        };
        resizeTextarea();
        textarea.addEventListener('input', resizeTextarea);
        return () => textarea.removeEventListener('input', resizeTextarea);
    }, [inputValue]);

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
            }).then(response => response.json()).then(data => {
                chat(data);
            })
            };
        };

    return (
        <div className='layoutquery'>
            <textarea
            ref={textareaRef}
            placeholder={placeholderText}
            disabled={!boolian}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            className='input'
            rows="1" 
            />
            <button 
            onClick={handleSubmit}
            disabled={!boolian}
            className='miniCTA'
            >
                Send
            </button>
        </div>
    )
};

export default Query;