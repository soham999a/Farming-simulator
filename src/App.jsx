import { useState, useEffect } from 'react';
import App3D from './App3D.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';

// Simple notification component
const SimpleNotification = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">✕</button>
    </div>
  </div>
);

function App() {
  const [use3D, setUse3D] = useState(true);
  const [notification, setNotification] = useState('');
  const [gameState, setGameState] = useState({
    player: {
      money: 500,
      level: 1,
      xp: 0,
      reputation: 0
    },
    farm: {
      name: "My Farm",
      fields: [
        { fieldId: 1, cropType: null, plantedAt: null, growthStage: null },
        { fieldId: 2, cropType: null, plantedAt: null, growthStage: null },
        { fieldId: 3, cropType: null, plantedAt: null, growthStage: null }
      ],
      totalHarvests: 0,
      totalEarnings: 0
    },
    weather: {
      weather: { name: 'Sunny', emoji: '☀️', description: 'Perfect weather' },
      season: { name: 'Spring', emoji: '🌸', day: 1 }
    }
  });

  // Simple notification system
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Simple crop growth simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => {
        const newState = { ...prevState };
        let hasChanges = false;

        newState.farm.fields.forEach(field => {
          if (field.cropType && field.plantedAt) {
            const elapsed = Date.now() - field.plantedAt;
            const growTime = getCropGrowTime(field.cropType);
            const progress = Math.min(100, (elapsed / growTime) * 100);

            if (progress >= 100 && field.growthStage?.stage !== 'ready') {
              field.growthStage = { stage: 'ready', progress: 100 };
              hasChanges = true;
            } else if (progress < 100) {
              field.growthStage = {
                stage: progress >= 75 ? 'flowering' : progress >= 50 ? 'growing' : 'sprouting',
                progress
              };
              hasChanges = true;
            }
          }
        });

        return hasChanges ? newState : prevState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Helper function for crop grow times
  const getCropGrowTime = (cropType) => {
    const growTimes = {
      wheat: 12000,   // 12 seconds
      corn: 18000,    // 18 seconds
      potato: 20000,  // 20 seconds
      carrot: 15000,  // 15 seconds
      tomato: 16000,  // 16 seconds
      lettuce: 10000  // 10 seconds
    };
    return growTimes[cropType] || 15000;
  };

  // Toggle between 2D and 3D views
  if (use3D) {
    return <App3D onSwitch2D={() => setUse3D(false)} />;
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* View Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setUse3D(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
        >
          🎮 Switch to 3D View
        </button>
      </div>

      <Header
        gameState={gameState}
        onNotification={showNotification}
      />
      <Dashboard
        gameState={gameState}
        setGameState={setGameState}
        onNotification={showNotification}
      />
      {notification && (
        <SimpleNotification
          message={notification}
          onClose={() => setNotification('')}
        />
      )}
    </div>
  );
}

export default App;
