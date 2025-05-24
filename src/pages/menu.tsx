import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Play, Trophy, Package } from 'lucide-react';
import './menu.css';

interface MainMenuProps {}

const MainMenu: React.FC<MainMenuProps> = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [bgmVolume, setBgmVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('main');

  const handleVolumeChange = (value: number): void => {
    setBgmVolume(value);
    setIsMuted(value === 0);
    console.log(`BGM Volume changed to: ${value}%`);
  };

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
    console.log(`BGM ${!isMuted ? 'Muted' : 'Unmuted'}`);
  };

  const navigate = (page: string): void => {
    setCurrentPage(page);
    console.log(`Navigating to: ${page}`);
  };

  const openSettings = (): void => {
    setShowSettings(true);
  };

  const closeSettings = (): void => {
    setShowSettings(false);
  };

  if (currentPage !== 'main') {
    return (
      <div className="page-container">
        <div className="page-content">
          <h2 className="page-title">{currentPage}</h2>
          <p className="page-description">This would be the {currentPage} page</p>
          <button onClick={() => setCurrentPage('main')} className="back-button">
            Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container" style={{ backgroundImage: "url('./assets/Main.png   ')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Settings Button */}
      <button onClick={openSettings} className="settings-button" aria-label="Open Settings">
        <Settings size={24} />
      </button>

      {/* Main Content */}
      <div className="main-content">
        <div className="title-section">
          <h1 className="main-title">CARDVERSE</h1>
        </div>

        <div className="menu-buttons">
          <button onClick={() => navigate('play')} className="menu-button menu-button-primary" aria-label="Start Playing">
            <Play size={24} />
            PLAY
          </button>
          <button onClick={() => navigate('leaderboard')} className="menu-button menu-button-secondary" aria-label="View Leaderboard">
            <Trophy size={24} />
            LEADERBOARD
          </button>
          <button onClick={() => navigate('deck')} className="menu-button menu-button-secondary" aria-label="View Deck">
            <Package size={24} />
            DECK
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={closeSettings}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Settings</h2>
              <button onClick={closeSettings} className="modal-close" aria-label="Close Settings">
                ✕
              </button>
            </div>

            <div className="settings-content">
              <div className="setting-group">
                <div className="setting-header">
                  <label htmlFor="bgm-volume" className="setting-label">BGM Volume</label>
                  <button onClick={toggleMute} className="mute-button" aria-label={isMuted ? "Unmute BGM" : "Mute BGM"}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>

                <div className="volume-control">
                  <input
                    id="bgm-volume"
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : bgmVolume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="volume-slider"
                    disabled={isMuted}
                    aria-label="BGM Volume Slider"
                  />
                  <span className="volume-value">
                    {isMuted ? 0 : bgmVolume}%
                  </span>
                </div>
              </div>

              <div className="setting-group">
                <div className="setting-header">
                  <label className="setting-label">Sound Effects</label>
                </div>
                <p className="setting-description">More audio settings can be added here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenu;
