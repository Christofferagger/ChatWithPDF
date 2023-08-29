import React, { useState, useRef, useEffect } from 'react';
import './query.css';

function Query({ boolian, chat }) {

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        const resizeTextarea = () => {
            if (inputValue.trim() !== '') {
                textarea.style.height = 'auto';
                textarea.style.paddingBottom = '0.4rem';
                textarea.style.height = `${textarea.scrollHeight}px`;
            } else {
                textarea.style.height = '20px';  
                textarea.style.paddingBottom = '0.8rem';
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
            setIsLoading(true);
            const currentValue = inputValue;
            setInputValue('');
            fetch('/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {query: currentValue })
            }).then(response => response.json()).then(data => {
                setIsLoading(false);
                chat(data);
            })
            };
        };

    return (
        <div className='layoutquery'>
            <textarea
            ref={textareaRef}
            placeholder={isLoading ? "loading" : placeholderText}
            disabled={!boolian}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            className='input'
            rows="1" 
            />
            <button 
            onClick={handleSubmit}
            disabled={!boolian || isLoading}
            className='miniCTA'
            >
                Send
            </button>
        </div>
    )
};

export default Query;