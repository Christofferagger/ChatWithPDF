import React, { useEffect, useRef } from 'react';
import You from '../assets/You.svg';
import ChatIcon from '../assets/ChatIcon.svg';
import './chat.css';

function Chat ({ chat }) {

    const chatLog = chat?.chatHistory;
    const lastChat = useRef(null);

    useEffect (() => {
        if (lastChat.current) {
            lastChat.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatLog]);
    

    return (
        <div>
            {
                Array.isArray(chatLog) && chatLog.length > 0 ? (
                    chatLog.map((entry, index) => {
                        const question = entry.question;
                        const response = entry.response.text;

                        return (
                            <div key={index}>
                                <div className='chatDiv'>
                                    <img src={You} alt="Your icon" className='iconSpace' />
                                    <p>{question}</p>
                                </div>
                                <div className='chatDiv'>
                                    <img src={ChatIcon} alt="Chat icon" className='iconSpace' />
                                    <p>{response}</p>
                                </div>
                                
                            </div>
                        );
                    })
                ) : (
                    <p>Let's get started</p>
                )
            }
            <div ref={lastChat}></div>
        </div>
    );
}

export default Chat;