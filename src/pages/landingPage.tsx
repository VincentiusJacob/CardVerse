import './landingPage.css';
import LandingBackgroundImg from '../assets/background-landing.png';
import AboutUsBackgroundImg from '../assets/aboutUs.png';
import { useState, useEffect, useRef } from 'react';

const paragraphText = `Immerse yourself in CardVerse, a thrilling and strategic play-to-earn blockchain game where every card is a powerful NFT warrior. Enter intense PvP arenas, build your ultimate deck, and outsmart opponents with unique attack, defense, and skill combinations. Collect rare cards, rise through the ranks, and earn ICP tokens with every victory — all while owning your digital assets on the blockchain.`;


type SectionId = 'home' | 'about' | 'news' | 'support';

const sectionTitles: Record<SectionId, string> = {
  home: 'Home',
  about: 'About Us',
  news: 'News',
  support: 'Support',
};

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState<string>('Home');
  const [isAboutVisible, setIsAboutVisible] = useState<boolean>(false);

  // Ref for the about section div
  const aboutRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll function with typed parameter
  const scrollToSection = (sectionId: SectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      setCurrentPage(sectionTitles[sectionId]);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAboutVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3,
      }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  return (
    <div className="page-wrapper">
      {/* NAVBAR */}
      <div className="navbar">
        <h1>CardVerse</h1>
        <div className="navbar-options">
          {(['home', 'about', 'news', 'support'] as SectionId[]).map((section) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(section);
              }}
              className={currentPage === sectionTitles[section] ? 'active' : ''}
            >
              {sectionTitles[section]}
            </a>
          ))}
        </div>
        <div className="navbar-buttons">
          <button>Sign up</button>
          <button>Login</button>
        </div>
      </div>

      {/* HOME SECTION */}
      <div
        className="landing-page"
        id="home"
        style={{
          backgroundImage: `url(${LandingBackgroundImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <button className="get-started-btn">Get Started</button>
      </div>

      {/* ABOUT SECTION */}
      <div
        ref={aboutRef}
        className="about-section"
        id="about"
        style={{
          backgroundImage: `url(${AboutUsBackgroundImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="about-content">
          <h2 className={`${isAboutVisible ? 'visible' : ''}`}>About</h2>
          <p className={`about-text ${isAboutVisible ? 'visible' : ''}`}>
            {isAboutVisible
              ? paragraphText.split(' ').map((word, index) => (
                  <span
                    key={index}
                    className="animate-word"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {word}
                  </span>
                ))
              : paragraphText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
