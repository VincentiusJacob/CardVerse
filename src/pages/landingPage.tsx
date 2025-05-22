import './landingPage.css';
import { useState } from 'react';
import video_background from '../assets/animation_background.mp4';

const LandingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('Home');

  return (
    <div className="landing-page">
      {/* Video Background (Plays only once) */}
      <video autoPlay muted className="background-video">
        <source src={video_background} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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
