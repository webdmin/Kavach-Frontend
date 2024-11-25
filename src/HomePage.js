import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import logo from './images/logo.jpg.png';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBlurred] = useState(false);
  const [isBot1, setIsBot1] = useState(true); // State to track which API is used
  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setInput(value);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setInput('');
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);

      const apiUrl = isBot1
        ? 'https://kavachimage2o-arf9cuexg6ehhgh4.centralindia-01.azurewebsites.net/query'  // Replace with actual API URL for Bot 1
        : 'https://kavachimg-version2-a9dbhsamgwadaygp.centralindia-01.azurewebsites.net/query'; // Replace with actual API URL for Bot 2

      try {
        const response = await fetch(apiUrl, {
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

        if (data.images && Array.isArray(data.images)) {
          newMessage.images = {
            small: [],
            large: [],
          };

          data.images.forEach(image => {
            if (image.width < 300 && image.height < 300) {
              newMessage.images.small.push({
                src: `data:image/png;base64,${image.image_data}`,
                width: image.width,
                height: image.height,
              });
            } else {
              newMessage.images.large.push({
                src: `data:image/png;base64,${image.image_data}`,
                width: image.width,
                height: image.height,
              });
            }
          });
        }

        newMessage.text = data.response.replace(/\*/g, '');
        setMessages([...newMessages, newMessage]);
      } catch (err) {
        console.error('Error fetching answer from API:', err);
        setMessages([...newMessages, { text: 'Sorry, please ask about Kavach-related questions.', sender: 'bot' }]);
      }
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggle = () => {
    setIsBot1(!isBot1); // Toggle between Bot1 and Bot2
  };

  return (
    <>
      <header className="Homepageheader">
        <div className="chat-title">KAVACH GUIDELINES CHATBOT</div>
        <label className="toggle-switch">
          <input type="checkbox" checked={!isBot1} onChange={handleToggle} />
          <span className="slider"></span>
        </label>
        <span className="bot-label">{isBot1 ? 'MODEL A' : 'MODEL B'}</span>
      </header>


      <div className={`chat-container ${isBlurred ? 'blurred' : ''}`}>
        <div className="chat-header">
          <h1>How can I assist you?</h1>
          {/* <label className="toggle-switch">
            <input type="checkbox" checked={!isBot1} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
          <span className="bot-label">{isBot1 ? 'BOT1' : 'BOT2'}</span> */}
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
                  {message.images && message.images.small.length > 0 && (
                    <div className="image-gallery small-images">
                      {message.images.small.map((image, idx) => (
                        <div className="image-container small-image" key={idx}>
                          <img src={image.src} alt={`response-image-small-${idx}`} className="response-image" />
                        </div>
                      ))}
                    </div>
                  )}
                  {message.images && message.images.large.length > 0 && (
                    <div className="image-gallery large-images">
                      {message.images.large.map((image, idx) => (
                        <div className="image-container large-image" key={idx}>
                          <img src={image.src} alt={`response-image-large-${idx}`} className="response-image" />
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
                onInput={handleInputChange}
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
