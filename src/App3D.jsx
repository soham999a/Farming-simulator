import React, { useState, useEffect, Suspense } from 'react';
import SimpleFarm3D from './components/3d/SimpleFarm3D';
import UI3D from './components/3d/UI3D';

// Loading component for 3D scene
const LoadingScreen3D = () => (
  <div className="w-full h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
    <div className="text-center text-white">
      <div className="text-8xl mb-4 animate-bounce">🚜</div>
      <h1 className="text-4xl font-bold mb-2">Loading 3D Farm...</h1>
      <p className="text-xl">Preparing your ultimate farming experience</p>
      <div className="mt-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  </div>
);

// Simple notification component
const SimpleNotification = ({ message, onClose }) => (
  <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">✕</button>
    </div>
  </div>
);

function App3D({ onSwitch2D }) {
  const [notification, setNotification] = useState('');
  const [gameState, setGameState] = useState({
    player: {
      money: 500,
      level: 1,
      xp: 0,
      reputation: 0
    },
    farm: {
      name: "🌟 3D Dream Farm",
      fields: [
        { fieldId: 1, cropType: null, plantedAt: null, growthStage: null },
        { fieldId: 2, cropType: null, plantedAt: null, growthStage: null },
        { fieldId: 3, cropType: null, plantedAt: null, growthStage: null },
        { fieldId: 4, cropType: null, plantedAt: null, growthStage: null },
        { fieldId: 5, cropType: null, plantedAt: null, growthStage: null },
        { fieldId: 6, cropType: null, plantedAt: null, growthStage: null }
      ],
      totalHarvests: 0,
      totalEarnings: 0
    },
    weather: {
      weather: { name: 'Sunny', emoji: '☀️', description: 'Perfect farming weather' },
      season: { name: 'Spring', emoji: '🌸', day: 1 }
    }
  });

  // Simple notification system
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Crop prices
  const cropPrices = {
    lettuce: { cost: 20, sell: 30 },
    wheat: { cost: 25, sell: 40 },
    carrot: { cost: 30, sell: 55 },
    tomato: { cost: 40, sell: 85 },
    corn: { cost: 45, sell: 70 },
    potato: { cost: 50, sell: 100 }
  };

  // Plant crop function
  const handlePlantCrop = (fieldId, cropKey) => {
    const cropCost = cropPrices[cropKey]?.cost || 0;
    
    if (gameState.player.money < cropCost) {
      showNotification(`💰 Need ₹${cropCost} to plant ${cropKey}!`);
      return;
    }

    setGameState(prevState => {
      const newState = { ...prevState };
      const field = newState.farm.fields.find(f => f.fieldId === fieldId);
      
      if (field && !field.cropType) {
        field.cropType = cropKey;
        field.plantedAt = Date.now();
        field.growthStage = { stage: 'planted', progress: 0 };
        newState.player.money -= cropCost;
        newState.player.xp += 5;
      }
      
      return newState;
    });
    
    showNotification(`🌱 Planted ${cropKey} in Field ${fieldId}!`);
  };

  // Harvest crop function
  const handleHarvestCrop = (fieldId) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      const field = newState.farm.fields.find(f => f.fieldId === fieldId);
      
      if (field && field.cropType && field.growthStage?.stage === 'ready') {
        const earnings = cropPrices[field.cropType]?.sell || 50;
        newState.player.money += earnings;
        newState.farm.totalHarvests += 1;
        newState.farm.totalEarnings += earnings;
        newState.player.xp += 10;
        
        // Level up check
        if (newState.player.xp >= newState.player.level * 100) {
          newState.player.level += 1;
          showNotification(`🎉 Level Up! You are now level ${newState.player.level}!`);
        }
        
        // Clear field
        field.cropType = null;
        field.plantedAt = null;
        field.growthStage = null;
        
        showNotification(`🌾 Harvested for ₹${earnings}! (+10 XP)`);
      }
      
      return newState;
    });
  };

  // Handle field clicks from 3D scene
  const handleFieldClick = (fieldId) => {
    const field = gameState.farm.fields.find(f => f.fieldId === fieldId);
    
    if (field?.cropType && field.growthStage?.stage === 'ready') {
      handleHarvestCrop(fieldId);
    } else if (!field?.cropType) {
      // Field is empty, UI will handle crop selection
      console.log(`Field ${fieldId} selected for planting`);
    } else {
      // Crop is growing
      const progress = Math.round(field.growthStage?.progress || 0);
      showNotification(`🌱 ${field.cropType} is ${progress}% grown`);
    }
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
              showNotification(`🌾 ${field.cropType} in Field ${field.fieldId} is ready to harvest!`);
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
      lettuce: 10000,  // 10 seconds
      wheat: 12000,    // 12 seconds
      carrot: 15000,   // 15 seconds
      tomato: 16000,   // 16 seconds
      corn: 18000,     // 18 seconds
      potato: 20000    // 20 seconds
    };
    return growTimes[cropType] || 15000;
  };

  // Weather simulation
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weathers = [
        { name: 'Sunny', emoji: '☀️', description: 'Perfect farming weather' },
        { name: 'Cloudy', emoji: '☁️', description: 'Good for crops' },
        { name: 'Rainy', emoji: '🌧️', description: 'Crops grow faster' },
        { name: 'Windy', emoji: '💨', description: 'Breezy conditions' }
      ];
      
      setGameState(prevState => ({
        ...prevState,
        weather: {
          ...prevState.weather,
          weather: weathers[Math.floor(Math.random() * weathers.length)]
        }
      }));
    }, 30000); // Change weather every 30 seconds

    return () => clearInterval(weatherInterval);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<LoadingScreen3D />}>
        {/* 3D Farm Scene */}
        <SimpleFarm3D
          gameState={gameState}
          onFieldClick={handleFieldClick}
        />
        
        {/* 3D UI Overlay */}
        <UI3D
          gameState={gameState}
          onPlantCrop={handlePlantCrop}
          onHarvestCrop={handleHarvestCrop}
          onNotification={showNotification}
          onSwitch2D={onSwitch2D}
        />

        {/* 2D View Toggle Button */}
        {onSwitch2D && (
          <div className="fixed top-4 right-20 z-50">
            <button
              onClick={onSwitch2D}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
            >
              📱 Switch to 2D View
            </button>
          </div>
        )}
        
        {/* Notification System */}
        {notification && (
          <SimpleNotification 
            message={notification}
            onClose={() => setNotification('')}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App3D;
