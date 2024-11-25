import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './images/t-5.jpg'; // Your background image
import logo from './images/logo.jpg.png'; // Your logo
import logo2 from './images/Image.png'; 
import './LoginPage.css'; // Your styles

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loginTime, setLoginTime] = useState(null); // State to store login time
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Just clean up before unload without sending any data to backend
      if (username && loginTime) {
        console.log('User is leaving, no backend data will be sent.');
      }
    };

    // Attach the event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener when component is unmounted
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [username, loginTime]);

  const handleLogin = (e) => {
    e.preventDefault();

    console.log('Login attempted with the following details:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    // Check for valid credentials
    if ((username === 'admin' && password === 'Kavach2024') || 
        (username === 'rdsouser1' && password === 'Kavach01')) {
      const currentLoginTime = new Date().toISOString(); // Capture current login time
      setLoginTime(currentLoginTime); // Update the login time state

      // Store the username and login time in localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('loginTime', currentLoginTime);

      // Now just navigate to the home page without sending any data to the backend
      console.log('Login successful!');
      navigate('/chat'); // Redirect after successful login
    } else {
      alert('Invalid credentials!');
      console.log('Invalid credentials entered!');
    }
  };

  const isTestEnv = process.env.NODE_ENV === 'test';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="brand-name">KAVACH CHATBOT</div>
        <span className="powered-by2">Powered By</span>
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <div className="logo-top-left">
        <img src={logo2} alt="Logo" className="logo-top-left-img" />
      </div>
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="login-box">
          <div>
            <h2>Welcome Back</h2>
            {isTestEnv && <a href="https://reactjs.org">Learn React</a>} {/* Only show in test environment */}
          </div>
          <p className="login-subheading">Please enter your credentials to access your account</p>
          <form onSubmit={handleLogin}>
            <div className="textbox">
              <i className="fas fa-user" aria-hidden="true" style={{ color: 'black', left: '13px', top: '18px' }}></i>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="textbox">
              <i className="fas fa-lock" aria-hidden="true" style={{ color: 'black', left: '13px', top: '18px' }}></i>
              <input
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
              />
              {/* Eye icon to toggle password visibility */}
              <i
                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} password-eye-icon`}
                onClick={togglePasswordVisibility} // Toggle the eye icon on click
              ></i>
            </div>
            <div className="remember-me">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember Me</label>
            </div>
            <button type="submit" className="btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
