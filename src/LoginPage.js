import backgroundImage from './images/t-5.jpg'; // Your background image
import logo from './images/logo.jpg.png'; // Your logo
import logo2 from './images/Image.png'; 
import './LoginPage.css'; // Your styles

function LoginPage() {

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
        <div className="service-unavailable-ribbon">
          <p className="ribbon-message">
            We have temporarily stopped the service. Please contact us at  
            <a href="mailto:projectadmin@gmail.com" className="email-link"> projectadmin@ak-tech.in</a>
          </p>
          
          
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

