import React, { useState } from 'react';
import { formatMoney } from '../../utils/time.js';

const UI3D = ({ gameState, onPlantCrop, onHarvestCrop, onNotification }) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [view3D, setView3D] = useState(true);

  const crops = [
    { key: 'lettuce', name: 'Lettuce', price: 20, time: '10s', emoji: '🥬', sellPrice: 30 },
    { key: 'wheat', name: 'Wheat', price: 25, time: '12s', emoji: '🌾', sellPrice: 40 },
    { key: 'carrot', name: 'Carrot', price: 30, time: '15s', emoji: '🥕', sellPrice: 55 },
    { key: 'tomato', name: 'Tomato', price: 40, time: '16s', emoji: '🍅', sellPrice: 85 },
    { key: 'corn', name: 'Corn', price: 45, time: '18s', emoji: '🌽', sellPrice: 70 },
    { key: 'potato', name: 'Potato', price: 50, time: '20s', emoji: '🥔', sellPrice: 100 }
  ];

  const handlePlantCrop = (cropKey) => {
    if (selectedField && gameState.player.money >= crops.find(c => c.key === cropKey)?.price) {
      onPlantCrop(selectedField, cropKey);
      setShowCropModal(false);
      setSelectedField(null);
    } else {
      onNotification('Not enough money to plant this crop!');
    }
  };

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 shadow-lg">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Farm Info */}
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold">🚜 {gameState.farm.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                  <span className="text-sm font-bold">💰 ₹{gameState.player.money}</span>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                  <span className="text-sm">⭐ Level {gameState.player.level}</span>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                  <span className="text-sm">🌾 {gameState.farm.totalHarvests} Harvests</span>
                </div>
              </div>
            </div>

            {/* Weather Info */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl">{gameState.weather?.weather?.emoji || '☀️'}</div>
                <div className="text-xs">{gameState.weather?.weather?.name || 'Sunny'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">{gameState.weather?.season?.emoji || '🌱'}</div>
                <div className="text-xs">{gameState.weather?.season?.name || 'Spring'}</div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView3D(!view3D)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
              >
                {view3D ? '📱 2D View' : '🎮 3D View'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Field Action Buttons */}
      <div className="absolute bottom-4 left-4 right-4 z-50">
        <div className="flex justify-center space-x-4">
          {gameState.farm.fields.map((field) => {
            const canHarvest = field.cropType && field.growthStage?.stage === 'ready';
            const isEmpty = !field.cropType;
            
            return (
              <div key={field.fieldId} className="bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-sm">Field {field.fieldId}</h3>
                  {field.cropType ? (
                    <div>
                      <p className="text-xs">{field.cropType}</p>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{ width: `${field.growthStage?.progress || 0}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1">{Math.round(field.growthStage?.progress || 0)}%</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Empty</p>
                  )}
                </div>
                
                {canHarvest && (
                  <button
                    onClick={() => onHarvestCrop(field.fieldId)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold transition-all"
                  >
                    🌾 Harvest
                  </button>
                )}
                
                {isEmpty && (
                  <button
                    onClick={() => {
                      setSelectedField(field.fieldId);
                      setShowCropModal(true);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold transition-all"
                  >
                    🌱 Plant
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Crop Selection Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">🌱 Select Crop for Field {selectedField}</h2>
              <button
                onClick={() => setShowCropModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {crops.map((crop) => {
                const canAfford = gameState.player.money >= crop.price;
                
                return (
                  <button
                    key={crop.key}
                    onClick={() => handlePlantCrop(crop.key)}
                    disabled={!canAfford}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      canAfford
                        ? 'border-green-300 hover:border-green-500 hover:bg-green-50'
                        : 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{crop.emoji}</div>
                      <h3 className="font-bold text-lg">{crop.name}</h3>
                      <p className="text-sm text-gray-600">Cost: {formatMoney(crop.price)}</p>
                      <p className="text-sm text-gray-600">Sell: {formatMoney(crop.sellPrice)}</p>
                      <p className="text-sm text-gray-600">Time: {crop.time}</p>
                      <p className="text-xs text-green-600 font-bold">
                        Profit: {formatMoney(crop.sellPrice - crop.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                💰 Your Money: {formatMoney(gameState.player.money)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls Help */}
      <div className="absolute top-20 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm max-w-xs">
        <h3 className="font-bold mb-2">🎮 3D Controls</h3>
        <p>🖱️ Left click + drag: Rotate camera</p>
        <p>🔍 Mouse wheel: Zoom in/out</p>
        <p>🌾 Click fields: Select field</p>
        <p>⌨️ Right click + drag: Pan camera</p>
      </div>

      {/* Performance Stats */}
      <div className="absolute top-20 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm">
        <h3 className="font-bold mb-2">📊 Farm Stats</h3>
        <p>🌾 Total Harvests: {gameState.farm.totalHarvests}</p>
        <p>💰 Total Earnings: {formatMoney(gameState.farm.totalEarnings)}</p>
        <p>🏆 Fields Owned: {gameState.farm.fields.length}</p>
        <p>⭐ Experience: {gameState.player.xp} XP</p>
      </div>
    </>
  );
};

export default UI3D;
