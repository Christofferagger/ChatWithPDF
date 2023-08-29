import React from 'react';
import You from '../assets/You.svg';
import ChatIcon from '../assets/ChatIcon.svg';

function Chat ({ chat }) {

    const chatLog = chat?.chatHistory;
    

    return (
        <div>
            {
                Array.isArray(chatLog) && chatLog.length > 0 ? (
                    chatLog.map((entry, index) => {
                        const question = entry.question;
                        const response = entry.response.text;

                        return (
                            <div key={index}>
                                <div>
                                    <img src={You} alt="Your icon" />
                                    <p>{question}</p>
                                </div>
                                <div>
                                    <img src={ChatIcon} alt="Chat icon" />
                                    <p>{response}</p>
                                </div>
                                
                            </div>
                        );
                    })
                ) : (
                    <p>Ask a question</p>
                )
            }
        </div>
    );
}

export default Chat;