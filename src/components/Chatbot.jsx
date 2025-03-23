// src/components/Chatbot.jsx
import { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! I noticed you have items in your cart. Want to discuss a special offer?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  const product = {
    name: "Premium Wireless Headphones",
    price: "$199.99",
    url: "https://www.amazon.com/Sony-WH-1000XM5-Canceling-Headphones-Hands-Free/dp/B09XS7JWHH/ref=sr_1_1_sspa?dib=eyJ2IjoiMSJ9.YRFLJECEITNU402ZpvF6W5hqUQHQbPUgN22x47slryTYso9QfHvA1HYXZrTqHB_yw9ig5L2F5qHB0N4RcpswlsSNPa6tqLy9b8_jEGP4Qp6mEBkmdZFoNzeyIa-wTbO63ZeaoejIsJU-lsnrI6X6xWwbBw_EG3f0prisyqyT0yAZbCcIL8PK765J_WnKUSjo6LvD_PbdwnUbXP6K94PfjU0E8NSnn6gkFe4PKKcnqLs.C_1qwyy_zmwXLoVOMvaIaeqV8aT4-aJq5Zw4KspxMuo&dib_tag=se&keywords=premium%2Bheadphones&qid=1742720885&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1"
  };

  const handleSend = async () => {
    if (input.trim()) {
      // Add user's message to chat
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      setIsLoading(true); // Show loading indicator

      try {
        // Call the Vercel Function with OpenRouter integration
        const response = await fetch('/api/negotiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartValue: 199.99,
            pastPurchases: 2,
            sessionTime: 300,
            userMessage: input
          })
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        // Add the bot's negotiation response to chat
        setMessages(prev => [...prev, { text: data.message, sender: 'bot' }]);
      } catch (error) {
        console.error('Error calling negotiate API:', error);
        setMessages(prev => [...prev, { text: 'Sorry, I couldn’t process that. Try again!', sender: 'bot' }]);
      } finally {
        setIsLoading(false); // Hide loading indicator
      }

      // Clear input field
      setInput('');
    }
  };

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
        <a href={product.url} target="_blank" rel="noopener noreferrer">
          View Product
        </a>
      </header>
      
      <div className="chat-messages">
        {isLoading && (
          <div className="loading-indicator">Agent is typing...</div>
        )}
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;