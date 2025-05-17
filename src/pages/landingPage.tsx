import './landingPage.css';
import background from '../assets/background-landing.png';
import { useState } from 'react';

const LandingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('Home');

  return (
    <div
      className="landing-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="homePage">
        <div className="navbar">
          <h1> CardVerse </h1>
          <div className="navbar-options">
            <a
              href="#"
              onClick={() => setCurrentPage('Home')}
              className={currentPage === 'Home' ? 'active' : ''}
            >
              {' '}
              Home{' '}
            </a>
            <a
              href="#"
              onClick={() => setCurrentPage('About Us')}
              className={currentPage === 'About Us' ? 'active' : ''}
            >
              {' '}
              About Us{' '}
            </a>
            <a
              href="#"
              onClick={() => setCurrentPage('News')}
              className={currentPage === 'News' ? 'active' : ''}
            >
              {' '}
              News{' '}
            </a>
            <a
              href="#"
              onClick={() => setCurrentPage('Support')}
              className={currentPage === 'Support' ? 'active' : ''}
            >
              {' '}
              Support{' '}
            </a>
          </div>
          <div className="navbar-buttons">
            <button> Sign up </button>
            <button> Login</button>
          </div>
        </div>

        <button className="get-started-btn"> Get Started </button>
      </div>
    </div>
  );
};

export default LandingPage;
