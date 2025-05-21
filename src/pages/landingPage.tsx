import './landingPage.css';
import LandingBackground from '../assets/background-landing.png';
import AboutUsBackground from '../assets/aboutUs.png';
import { useState } from 'react';

const LandingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('Home');

  return (
    <div className="page-wrapper">
      {/* NAVBAR */}
      <div className="navbar">
        <h1> CardVerse </h1>
        <div className="navbar-options">
          <a
            href="#home"
            onClick={() => setCurrentPage('Home')}
            className={currentPage === 'Home' ? 'active' : ''}
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setCurrentPage('About Us')}
            className={currentPage === 'About Us' ? 'active' : ''}
          >
            About Us
          </a>
          <a
            href="#news"
            onClick={() => setCurrentPage('News')}
            className={currentPage === 'News' ? 'active' : ''}
          >
            News
          </a>
          <a
            href="#support"
            onClick={() => setCurrentPage('Support')}
            className={currentPage === 'Support' ? 'active' : ''}
          >
            Support
          </a>
        </div>
        <div className="navbar-buttons">
          <button> Sign up </button>
          <button> Login </button>
        </div>
      </div>

      {/* HOME SECTION */}
      <div
        className="landing-page"
        style={{
          backgroundImage: `url(${LandingBackground})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        id="home"
      >
          <button className="get-started-btn"> Get Started </button>
      </div>

      {/* ABOUT SECTION */}
      <div
        className="about-section"
        id="about"
        style={{
          backgroundImage: `url(${AboutUsBackground})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="about-content">
          <h2>About</h2>
          <p>
            Immerse yourself in <strong>[Nama game]</strong>, a thrilling and strategic play-to-earn blockchain game where every card is a powerful NFT warrior.
            Enter intense PvP arenas, build your ultimate deck, and outsmart opponents with unique attack, defense, and skill combinations.
            Collect rare cards, rise through the ranks, and earn ICP tokens with every victory — all while owning your digital assets on the blockchain.
          </p>
        </div>
      </div>
    </div>

  );
};

export default LandingPage;
