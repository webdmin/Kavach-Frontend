import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import logo from './images/logo.jpg.png';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBlurred] = useState(false);
  const messageEndRef = useRef(null);

  // Scroll to bottom whenever messages state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Depend on messages, so it triggers every time messages change

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setInput(value);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      // Clear the input field immediately after the message is sent
      setInput('');  // This will clear the input field

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

        if (data.images && Array.isArray(data.images)) {
          // Separate small and large images
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

        // Remove '*' from the response text
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

                  {/* Render small images first */}
                  {message.images && message.images.small.length > 0 && (
                    <div className="image-gallery small-images">
                      {message.images.small.map((image, idx) => (
                        <div className="image-container small-image" key={idx}>
                          <img
                            src={image.src}
                            alt={`response-image-small-${idx}`}
                            className="response-image"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render large images below small images */}
                  {message.images && message.images.large.length > 0 && (
                    <div className="image-gallery large-images">
                      {message.images.large.map((image, idx) => (
                        <div className="image-container large-image" key={idx}>
                          <img
                            src={image.src}
                            alt={`response-image-large-${idx}`}
                            className="response-image"
                          />
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


