function MessageList({ messages, username }) {
    console.log(messages)
    return (
        <div className="messages-container">
            {messages.map((message, index) => (
                <div 
                    key={index} 
                    className={`message ${message.sender === username ? 'sent' : 'received'}`}
                    style={{
                        alignSelf: message.sender === username ? 'flex-end' : 'flex-start',
                        minWidth: "10%",
                        maxWidth: '70%',
                        padding: '8px 12px',
                        margin: '5px',
                        borderRadius: '12px',
                        backgroundColor: message.sender === username ? '#dcf8c6' : '#ffffff',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {message.sender !== username && (
                        <span style={{fontWeight: 'bold', fontSize: '12px', marginBottom: '3px'}}>
                            {message.sender}
                        </span>
                    )}
                    
                    {message.type === "text" ? (
                        <span>{message.content}</span>
                    ) : message.type === "gif" ? (
                        <img src={message.content} alt="GIF" style={{width: "200px"}}/>
                    ) : (
                        <span style={{ fontSize: "1.5rem" }}>{message.content}</span>
                    )}
                    
                    <span style={{
                        fontSize: "0.75rem", 
                        alignSelf: 'flex-end',
                        marginTop: '2px',
                        color: '#999'
                    }}>
                        {message.time}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default MessageList;