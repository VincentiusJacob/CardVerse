import './landingPage.css';
import LandingBackgroundImg from '../assets/animation_background.mp4';
import AboutUsBackgroundImg from '../assets/aboutUs.png';
import NewsBackgroundImg from '../assets/background3.png';
import SupportBackgroundImg from '../assets/support.png';
import { useState, useEffect, useRef } from 'react';

const paragraphText = `Immerse yourself in CardVerse, a thrilling and strategic play-to-earn blockchain game where every card is a powerful NFT warrior. Enter intense PvP arenas, build your ultimate deck, and outsmart opponents with unique attack, defense, and skill combinations. Collect rare cards, rise through the ranks, and earn ICP tokens with every victory — all while owning your digital assets on the blockchain.`;

type SectionId = 'home' | 'about' | 'news' | 'support';

const sectionTitles: Record<SectionId, string> = {
  home: 'Home',
  about: 'About Us',
  news: 'News',
  support: 'Support',
};

const dummyNews = [
  {
    title: 'CardVerse Announces Official Launch Date!',
    date: 'June 10, 2025',
    content:
      'We’re excited to announce the official release of CardVerse on July 15, 2025! Prepare for an exhilarating card game experience like never before. Players will enter a world of strategy, fantasy, and epic battles as they compete for victory. Stay tuned for exclusive launch events and early access opportunities!',
  },
  {
    title: "CardVerse Reveals New Expansion: 'Shadows of the Arcane'",
    date: 'May 20, 2025',
    content:
      "Get ready for the next big chapter in CardVerse – the 'Shadows of the Arcane' expansion! This exciting update introduces new cards, mechanics, and lore that will change the way you play. Players can expect new abilities, powerful creatures, and mystical artifacts. Shadows of the Arcane will be available for download next month, so mark your calendars!",
  },
  {
    title: 'CardVerse Hosts Its First Global Tournament!',
    date: 'May 15, 2025',
    content:
      'CardVerse’s first global tournament is officially happening! Players from all over the world will compete in an intense series of matches for a chance to win exclusive in-game rewards and a $10,000 prize pool. The tournament will kick off on June 1, 2025, and registration opens today. Don’t miss your chance to be a part of history!',
  },
  {
    title: 'New Feature Spotlight: Deck Customization Options in CardVerse',
    date: 'May 5, 2025',
    content:
      'The latest update to CardVerse introduces new deck customization options! Now, players can fine-tune their decks with personalized card backs, player avatars, and unique visual effects for their cards. Express yourself like never before as you create your perfect deck. This update is available now – update your game to start customizing!',
  },
];

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
      },
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
          {(['home', 'about', 'news', 'support'] as SectionId[]).map(
            (section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section);
                }}
                className={
                  currentPage === sectionTitles[section] ? 'active' : ''
                }
              >
                {sectionTitles[section]}
              </a>
            ),
          )}
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
          background: `url(${LandingBackgroundImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="video-background">
          <video
            autoPlay
            muted
            playsInline
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Ensure it covers the whole screen
              zIndex: -1, // Place the video behind other content
            }}
          >
            <source src={LandingBackgroundImg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
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

      {/* NEWS SECTION */}

      <div
        ref={aboutRef}
        className="news-section"
        id="news"
        style={{
          backgroundImage: `url(${NewsBackgroundImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="news-content">
          <h2 className="news-title">Latest News</h2>
          <div className="news-cards-container">
            {dummyNews.map((newsItem, index) => (
              <div key={index} className="news-card">
                <div className="news-card-header">
                  <h3>{newsItem.title}</h3>
                  <span>{newsItem.date}</span>
                </div>
                <p>{newsItem.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={aboutRef}
        className="support-section"
        id="support"
        style={{
          backgroundImage: `url(${SupportBackgroundImg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
    </div>
  );
};

export default LandingPage;
