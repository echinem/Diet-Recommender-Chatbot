// dietbot.jsx
import React, { useState } from 'react';
import './dietbot.css';

const DietBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    const response = await fetch('http://localhost:5000/api/diet-recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();

    setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
  };

  return (
    <div className="dietbot-container">
      <div className="dietbot-header">Diet Recommendation Chatbot</div>
      <div className="dietbot-chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
      </div>
      <div className="dietbot-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Enter your health details..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default DietBot; 
