import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Gamepad2, 
  Monitor, 
  User, 
  ArrowLeft,
  Check,
  RotateCcw
} from 'lucide-react';
import './setting.css';

interface SettingsProps {
  onBack: () => void;
}

interface AudioSettings {
  bgmVolume: number;
  sfxVolume: number;
  bgmMuted: boolean;
  sfxMuted: boolean;
}

interface GameplaySettings {
  difficulty: 'easy' | 'medium' | 'hard';
  autoSave: boolean;
  hints: boolean;
  animations: boolean;
}

interface DisplaySettings {
  resolution: string;
  fullscreen: boolean;
  vsync: boolean;
  particles: 'low' | 'medium' | 'high';
}

interface ProfileSettings {
  username: string;
  avatar: string;
  showStats: boolean;
  publicProfile: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('audio');
  
  // Audio Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    bgmVolume: 75,
    sfxVolume: 80,
    bgmMuted: false,
    sfxMuted: false
  });

  // Gameplay Settings
  const [gameplaySettings, setGameplaySettings] = useState<GameplaySettings>({
    difficulty: 'medium',
    autoSave: true,
    hints: true,
    animations: true
  });

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    resolution: '1920x1080',
    fullscreen: false,
    vsync: true,
    particles: 'high'
  });

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    username: 'Player',
    avatar: 'default',
    showStats: true,
    publicProfile: false
  });

  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Audio handlers
  const handleVolumeChange = (type: 'bgm' | 'sfx', value: number): void => {
    setAudioSettings(prev => ({
      ...prev,
      [`${type}Volume`]: value,
      [`${type}Muted`]: value === 0
    }));
    setHasChanges(true);
  };

  const toggleMute = (type: 'bgm' | 'sfx'): void => {
    setAudioSettings(prev => ({
      ...prev,
      [`${type}Muted`]: !prev[`${type}Muted` as keyof AudioSettings]
    }));
    setHasChanges(true);
  };

  // Gameplay handlers
  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard'): void => {
    setGameplaySettings(prev => ({ ...prev, difficulty }));
    setHasChanges(true);
  };

  const toggleGameplaySetting = (setting: keyof Omit<GameplaySettings, 'difficulty'>): void => {
    setGameplaySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setHasChanges(true);
  };

  // Display handlers
  const handleDisplayChange = (setting: keyof DisplaySettings, value: any): void => {
    setDisplaySettings(prev => ({ ...prev, [setting]: value }));
    setHasChanges(true);
  };

  // Profile handlers
  const handleProfileChange = (setting: keyof ProfileSettings, value: any): void => {
    setProfileSettings(prev => ({ ...prev, [setting]: value }));
    setHasChanges(true);
  };

  const saveSettings = (): void => {
    // Save settings logic here
    console.log('Settings saved:', {
      audio: audioSettings,
      gameplay: gameplaySettings,
      display: displaySettings,
      profile: profileSettings
    });
    setHasChanges(false);
  };

  const resetToDefaults = (): void => {
    setAudioSettings({
      bgmVolume: 75,
      sfxVolume: 80,
      bgmMuted: false,
      sfxMuted: false
    });
    setGameplaySettings({
      difficulty: 'medium',
      autoSave: true,
      hints: true,
      animations: true
    });
    setDisplaySettings({
      resolution: '1920x1080',
      fullscreen: false,
      vsync: true,
      particles: 'high'
    });
    setProfileSettings({
      username: 'Player',
      avatar: 'default',
      showStats: true,
      publicProfile: false
    });
    setHasChanges(true);
  };

  const tabs = [
    { id: 'audio', label: 'Audio', icon: <Volume2 size={20} /> },
    { id: 'gameplay', label: 'Gameplay', icon: <Gamepad2 size={20} /> },
    { id: 'display', label: 'Display', icon: <Monitor size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> }
  ];

  return (
    <div className="settings-container">
      {/* Background Elements */}
      <div className="settings-background">
        <div className="settings-orb settings-orb-1"></div>
        <div className="settings-orb settings-orb-2"></div>
        <div className="settings-orb settings-orb-3"></div>
      </div>

      {/* Header */}
      <div className="settings-header">
        <button onClick={onBack} className="settings-back-button">
          <ArrowLeft size={24} />
        </button>
        <h1 className="settings-title">Settings</h1>
        <div className="settings-actions">
          <button onClick={resetToDefaults} className="settings-reset-button">
            <RotateCcw size={20} />
            Reset
          </button>
          {hasChanges && (
            <button onClick={saveSettings} className="settings-save-button">
              <Check size={20} />
              Save
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="settings-content">
        {/* Sidebar */}
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`settings-tab ${activeTab === tab.id ? 'settings-tab-active' : ''}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="settings-main">
          {/* Audio Settings */}
          {activeTab === 'audio' && (
            <div className="settings-section">
              <h2 className="settings-section-title">
                <Music size={24} />
                Audio Settings
              </h2>
              
              {/* BGM Volume */}
              <div className="settings-group">
                <div className="settings-group-header">
                  <label className="settings-label">Background Music</label>
                  <button
                    onClick={() => toggleMute('bgm')}
                    className="settings-mute-button"
                  >
                    {audioSettings.bgmMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
                <div className="settings-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioSettings.bgmMuted ? 0 : audioSettings.bgmVolume}
                    onChange={(e) => handleVolumeChange('bgm', parseInt(e.target.value))}
                    className="settings-slider"
                    disabled={audioSettings.bgmMuted}
                  />
                  <span className="settings-value">
                    {audioSettings.bgmMuted ? 0 : audioSettings.bgmVolume}%
                  </span>
                </div>
              </div>

              {/* SFX Volume */}
              <div className="settings-group">
                <div className="settings-group-header">
                  <label className="settings-label">Sound Effects</label>
                  <button
                    onClick={() => toggleMute('sfx')}
                    className="settings-mute-button"
                  >
                    {audioSettings.sfxMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
                <div className="settings-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioSettings.sfxMuted ? 0 : audioSettings.sfxVolume}
                    onChange={(e) => handleVolumeChange('sfx', parseInt(e.target.value))}
                    className="settings-slider"
                    disabled={audioSettings.sfxMuted}
                  />
                  <span className="settings-value">
                    {audioSettings.sfxMuted ? 0 : audioSettings.sfxVolume}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Gameplay Settings */}
          {activeTab === 'gameplay' && (
            <div className="settings-section">
              <h2 className="settings-section-title">
                <Gamepad2 size={24} />
                Gameplay Settings
              </h2>
              
              {/* Difficulty */}
              <div className="settings-group">
                <label className="settings-label">Difficulty</label>
                <div className="settings-radio-group">
                  {['easy', 'medium', 'hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => handleDifficultyChange(diff as any)}
                      className={`settings-radio-button ${gameplaySettings.difficulty === diff ? 'active' : ''}`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Settings */}
              <div className="settings-group">
                <div className="settings-toggle-item">
                  <label className="settings-label">Auto Save</label>
                  <button
                    onClick={() => toggleGameplaySetting('autoSave')}
                    className={`settings-toggle ${gameplaySettings.autoSave ? 'active' : ''}`}
                  >
                    <div className="settings-toggle-thumb"></div>
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <div className="settings-toggle-item">
                  <label className="settings-label">Show Hints</label>
                  <button
                    onClick={() => toggleGameplaySetting('hints')}
                    className={`settings-toggle ${gameplaySettings.hints ? 'active' : ''}`}
                  >
                    <div className="settings-toggle-thumb"></div>
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <div className="settings-toggle-item">
                  <label className="settings-label">Animations</label>
                  <button
                    onClick={() => toggleGameplaySetting('animations')}
                    className={`settings-toggle ${gameplaySettings.animations ? 'active' : ''}`}
                  >
                    <div className="settings-toggle-thumb"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="settings-section">
              <h2 className="settings-section-title">
                <Monitor size={24} />
                Display Settings
              </h2>
              
              {/* Resolution */}
              <div className="settings-group">
                <label className="settings-label">Resolution</label>
                <select
                  value={displaySettings.resolution}
                  onChange={(e) => handleDisplayChange('resolution', e.target.value)}
                  className="settings-select"
                >
                  <option value="1280x720">1280x720</option>
                  <option value="1920x1080">1920x1080</option>
                  <option value="2560x1440">2560x1440</option>
                  <option value="3840x2160">3840x2160</option>
                </select>
              </div>

              {/* Particles Quality */}
              <div className="settings-group">
                <label className="settings-label">Particle Effects</label>
                <div className="settings-radio-group">
                  {['low', 'medium', 'high'].map(quality => (
                    <button
                      key={quality}
                      onClick={() => handleDisplayChange('particles', quality)}
                      className={`settings-radio-button ${displaySettings.particles === quality ? 'active' : ''}`}
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Settings */}
              <div className="settings-group">
                <div className="settings-toggle-item">
                  <label className="settings-label">Fullscreen</label>
                  <button
                    onClick={() => handleDisplayChange('fullscreen', !displaySettings.fullscreen)}
                    className={`settings-toggle ${displaySettings.fullscreen ? 'active' : ''}`}
                  >
                    <div className="settings-toggle-thumb"></div>
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <div className="settings-toggle-item">
                  <label className="settings-label">V-Sync</label>
                  <button
                    onClick={() => handleDisplayChange('vsync', !displaySettings.vsync)}
                    className={`settings-toggle ${displaySettings.vsync ? 'active' : ''}`}
                  >
                    <div className="settings-toggle-thumb"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2 className="settings-section-title">
                <User size={24} />
                Profile Settings
              </h2>
              
              {/* Username */}
              <div className="settings-group">
                <label className="settings-label">Username</label>
                <input
                  type="text"
                  value={profileSettings.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  className="settings-input"
                  placeholder="Enter username"
                />
              </div>

              {/* Avatar */}
              <div className="settings-group">
                <label className="settings-label">Avatar</label>
                <div className="settings-avatar-selection">
                  {['default', 'warrior', 'mage', 'archer'].map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => handleProfileChange('avatar', avatar)}
                      className={`settings-avatar-option ${profileSettings.avatar === avatar ? 'active' : ''}`}
                    >
                      <div className={`avatar-preview avatar-${avatar}`}></div>
                      {avatar.charAt(0).toUpperCase() + avatar.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Settings */}
              <div className="settings-group">
                <div className="settings-toggle-item">
                  <label className="settings-label">Show Statistics</label>
                  <button
                    onClick={() => handleProfileChange('showStats', !profileSettings.showStats)}
                    className={`settings-toggle ${profileSettings.showStats ? 'active' : ''}`}
                  >
                    <div className="settings-toggle-thumb"></div>
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <div className="settings-toggle-item">
                  <label className="settings-label">Public Profile</label>
                  <button
                    onClick={() => handleProfileChange('publicProfile', !profileSettings.publicProfile)}
                    className={`settings-toggle ${profileSettings.publicProfile ? 'active' : ''}`}
                  >
                    <div className="settings-toggle-thumb"></div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;