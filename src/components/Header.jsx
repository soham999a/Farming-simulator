import { useState } from 'react';
import { formatMoney } from '../utils/time.js';

const Header = ({ gameState, onNotification, gameController = null }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatTime = (timeOfDay) => {
    const hours = Math.floor(timeOfDay || 12);
    const minutes = Math.floor(((timeOfDay || 12) - hours) * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const getWeatherEmoji = (weather) => {
    if (!weather) return '☀️';
    switch (weather.type) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'stormy': return '⛈️';
      case 'drought': return '🌵';
      case 'heatwave': return '🔥';
      default: return '☀️';
    }
  };

  const getSeasonEmoji = (season) => {
    if (!season) return '🌱';
    switch (season.type) {
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'fall': return '🍂';
      case 'winter': return '❄️';
      default: return '🌱';
    }
  };

  const handleSave = () => {
    if (gameController) {
      gameController.saveGame();
      onNotification('💾 Game saved successfully!');
    } else {
      onNotification('💾 Save feature coming soon!');
    }
    setShowMenu(false);
  };

  const handleSpeedChange = (speed) => {
    if (gameController) {
      gameController.setGameSpeed(speed);
      onNotification(`⚡ Game speed set to ${speed}x`);
    } else {
      onNotification(`⚡ Speed control coming soon!`);
    }
  };

  const togglePause = () => {
    if (gameController) {
      if (gameController.isPaused) {
        gameController.resumeGame();
        onNotification('▶️ Game resumed');
      } else {
        gameController.pauseGame();
        onNotification('⏸️ Game paused');
      }
    } else {
      onNotification('⏸️ Pause feature coming soon!');
    }
  };

  const growingCrops = gameState?.farm?.fields?.filter(field => field.cropType)?.length || 0;
  const readyCrops = gameState?.farm?.fields?.filter(field =>
    field.growthStage?.stage === 'ready'
  )?.length || 0;

  return (
    <header className="bg-gradient-to-r from-green-800 to-emerald-800 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-4">
        {/* Top Row - Main Info */}
        <div className="flex items-center justify-between">
          {/* Logo and Farm Name */}
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 p-3 rounded-full shadow-lg">
              <span className="text-3xl">🚜</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ultimate Farm Simulator</h1>
              <p className="text-green-200">{gameState?.farm?.name || 'My Farm'}</p>
            </div>
          </div>

          {/* Player Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold money-display">
                {formatMoney(gameState?.player?.money || 0)}
              </div>
              <div className="text-xs text-green-100">Money</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                Lv.{gameState?.player?.level || 1}
              </div>
              <div className="text-xs text-green-100">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {gameState?.player?.xp || 0}
              </div>
              <div className="text-xs text-green-100">XP</div>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition-colors"
          >
            ⚙️ Menu
          </button>
        </div>

        {/* Bottom Row - Game Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-500">
          {/* Weather and Season */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getSeasonEmoji(gameState?.weather?.season)}</span>
              <span className="capitalize">{gameState?.weather?.season?.type || 'spring'}</span>
              <span className="text-green-100">Day {gameState?.weather?.season?.day || 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🕐</span>
              <span>{formatTime(12)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getWeatherEmoji(gameState?.weather?.weather)}</span>
              <span className="capitalize">{gameState?.weather?.weather?.name || 'sunny'}</span>
            </div>
          </div>

          {/* Farm Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌾</span>
              <span>{gameState?.farm?.fields?.length || 3} Fields</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌱</span>
              <span>{growingCrops} Growing</span>
            </div>
            {readyCrops > 0 && (
              <div className="flex items-center space-x-2 bg-yellow-500 px-2 py-1 rounded animate-pulse">
                <span className="text-xl">✨</span>
                <span>{readyCrops} Ready!</span>
              </div>
            )}
          </div>

          {/* Game Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">Speed:</span>
            {[0.5, 1, 2, 5].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-1 rounded text-xs ${
                  gameController?.gameSpeed === speed
                    ? 'bg-yellow-500 text-black'
                    : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                {speed}x
              </button>
            ))}
            <button
              onClick={togglePause}
              className="px-3 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700"
            >
              {gameController?.isPaused ? '▶️' : '⏸️'}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-full right-4 mt-2 bg-white text-black rounded-lg shadow-xl z-50 min-w-[200px]">
          <div className="p-2">
            <button
              onClick={handleSave}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center space-x-2"
            >
              <span>💾</span>
              <span>Save Game</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset your farm?')) {
                  localStorage.removeItem('farmingSimulatorSave');
                  window.location.reload();
                }
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center space-x-2 text-red-600"
            >
              <span>🔄</span>
              <span>Reset Game</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
