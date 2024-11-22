import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import logo from './images/logo.jpg.png';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [loginTime, setLoginTime] = useState('');
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false); // Track background blur state
  const messageEndRef = useRef(null);

  // Function to handle the input change and capitalize first letter
  const handleInputChange = (e) => {
    let value = e.target.value;

    // Capitalize the first letter if there's at least one character
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setInput(value);
  };

  // handleSendMessage function remains unchanged
  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);

      try {
        const response = await fetch('https://kavachimage2o-arf9cuexg6ehhgh4.centralindia-01.azurewebsites.net/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: input }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error from API:', errorData);
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        const newMessage = { sender: 'bot' };

        // If images are received, process them for display
        if (data.images && Array.isArray(data.images)) {
          newMessage.images = data.images.map(image => {
            return `data:image/png;base64,${image.image_data}`;
          });
        }

        newMessage.text = data.response;

        setMessages([...newMessages, newMessage]);

      } catch (err) {
        console.error('Error fetching answer from API:', err);
        setMessages([...newMessages, { text: 'Sorry, please ask about Kavach-related questions.', sender: 'bot' }]);
      }

      setInput('');
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="Homepageheader">
        <div className="chat-title">KAVACH GUIDELINES CHATBOT</div>
      </header>

      <div className={`chat-container ${isBlurred ? 'blurred' : ''}`}>
        <div className="chat-header">
          <h1>How can I assist you?</h1>
        </div>

        <div className="chat-box">
          <div className="message-list">
            {messages.map((message, index) => (
              <div key={index} className={`message-bubble ${message.sender}`}>
                <div className={`message-icon ${message.sender}`}>
                  {message.sender === 'user' ? (
                    <i className="fas fa-question-circle"></i>
                  ) : (
                    <i className="fas fa-robot"></i>
                  )}
                </div>
                <div className={`message-content ${message.sender}`}>
                  {message.text && <span>{message.text}</span>}
                  {/* Check for images and render them */}
                  {message.images && message.images.length > 0 && (
                    <div className="image-gallery">
                      {message.images.map((image, idx) => (
                        <div className="image-container" key={idx}>
                          <img src={image} alt={`response-image-${idx}`} className="response-image" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          <div className="input-area">
            <div className="input-container">
              <input
                type="text"
                placeholder="Ask your question here"
                value={input}
                onInput={handleInputChange}  // Updated to call handleInputChange
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="input-field"
              />
              <button onClick={handleSendMessage} className="send-button">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <img src={logo} alt="Logo" className="footer-logo" />
          <span className="powered-by1">Powered by</span>
        </div>
      </footer>
    </>
  );
};

export default Home;

