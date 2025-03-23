import { useState } from 'react'
import './Chatbot.css'

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! I noticed you have items in your cart. Want to discuss a special offer?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')

  const product = {
    name: "Premium Wireless Headphones",
    price: "$249.99",
    url: "https://www.amazon.com/Sony-WH-1000XM5-Canceling-Headphones-Hands-Free/dp/B09XS7JWHH/ref=sr_1_1_sspa?dib=eyJ2IjoiMSJ9.YRFLJECEITNU402ZpvF6W5hqUQHQbPUgN22x47slryTYso9QfHvA1HYXZrTqHB_yw9ig5L2F5qHB0N4RcpswlsSNPa6tqLy9b8_jEGP4Qp6mEBkmdZFoNzeyIa-wTbO63ZeaoejIsJU-lsnrI6X6xWwbBw_EG3f0prisyqyT0yAZbCcIL8PK765J_WnKUSjo6LvD_PbdwnUbXP6K94PfjU0E8NSnn6gkFe4PKKcnqLs.C_1qwyy_zmwXLoVOMvaIaeqV8aT4-aJq5Zw4KspxMuo&dib_tag=se&keywords=premium%2Bheadphones&qid=1742720885&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1"
  }

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }])
      // Simulate bot response (in reality, this would come from your AI model)
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: `Based on your cart, I can offer you a 15% discount. Would that work for you?`, 
          sender: 'bot' 
        }])
      }, 1000)
      setInput('')
    }
  }

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
  )
}

export default Chatbot