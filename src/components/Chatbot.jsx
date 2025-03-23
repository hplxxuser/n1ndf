// src/components/Chatbot.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Chatbot.css';

function Chatbot() {
  const { id } = useParams();
  const [messages, setMessages] = useState([
    { text: "Hello! I noticed you have items in your cart. Want to discuss a special offer?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const chatMessagesRef = useRef(null);
  const [product, setProduct] = useState({ name: '', price: '', url: '' });
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [finalPrice, setFinalPrice] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/details?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch details');
        }
        const data = await response.json();
        setProduct({
          name: data.product_name,
          price: data.cartValue,
          url: data.url // Hardcoded URL
        });
      } catch (error) {
        console.error('Error fetching details:', error);
        setProduct({ name: 'Error', price: 'Error', url: '' });
      }
    };

    fetchDetails();
  }, [id]);

  const handleSend = async () => {
    if (input.trim()) {
      // Add user's message to chat
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      setIsLoading(true); // Show loading indicator

      try {
        const fullMessageHistory = [...messages, { text: input, sender: 'user' }]
          .map(msg => `${msg.sender}: ${msg.text}`)
          .join('\n');

        // Call the Vercel Function with OpenRouter integration
        const response = await fetch('/api/negotiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: id,
            userMessage: fullMessageHistory
          })
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        // Add the bot's negotiation response to chat
        if (!data.message.includes("##END OF CONVERSATION##")) {
          setMessages(prev => [...prev, { text: data.message, sender: 'bot' }]);
        } else {
          setIsInputDisabled(true);
          const price = data.message.split("##END OF CONVERSATION##")[0].trim();
          setFinalPrice(price);
          setShowPopup(true);
        }
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

  useEffect(() => {
    // Scroll to bottom when messages update
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

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
      
      <div className="chat-messages" ref={chatMessagesRef}>
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
          disabled={isInputDisabled}
        />
        <button onClick={handleSend} disabled={isInputDisabled}>Send</button>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Final Price: {finalPrice}</h2>
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              View Product
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
