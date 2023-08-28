import React from 'react';

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
                                <p>{question}</p>
                                <p>{response}</p>
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