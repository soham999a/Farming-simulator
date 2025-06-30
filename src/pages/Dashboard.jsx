import { useState, useEffect } from 'react';
import FieldCard from '../components/FieldCard.jsx';
import CropSelectModal from '../components/CropSelectModal.jsx';
import MoneyBar from '../components/MoneyBar.jsx';
import { formatMoney } from '../utils/time.js';

const Dashboard = ({ gameState, setGameState, gameController = null, onNotification }) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const [showBuyFieldModal, setShowBuyFieldModal] = useState(false);

  // Handle planting crop
  const handlePlantCrop = (fieldId) => {
    setSelectedFieldId(fieldId);
    setShowCropModal(true);
  };

  // Handle crop selection
  const handleCropSelect = async (cropKey) => {
    try {
      if (gameController) {
        const result = await gameController.plantCrop(selectedFieldId, cropKey);
        if (result.success) {
          onNotification(result.message);
        } else {
          onNotification(result.message);
        }
      } else {
        // Simple mock planting for now
        setGameState(prevState => {
          const newState = { ...prevState };
          const field = newState.farm.fields.find(f => f.fieldId === selectedFieldId);
          if (field) {
            field.cropType = cropKey;
            field.plantedAt = Date.now();
            field.growthStage = { stage: 'planted', progress: 0 };
          }
          return newState;
        });
        onNotification(`🌱 Planted ${cropKey} in Field ${selectedFieldId}!`);
      }
    } catch (error) {
      console.error('Error planting crop:', error);
      onNotification('Error planting crop. Please try again.');
    }
  };

  // Handle harvesting
  const handleHarvestCrop = (fieldId) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      const field = newState.farm.fields.find(f => f.fieldId === fieldId);

      if (field && field.cropType && field.growthStage?.stage === 'ready') {
        const cropPrices = {
          wheat: 40, corn: 70, potato: 100, carrot: 55, tomato: 85, lettuce: 30
        };

        const earnings = cropPrices[field.cropType] || 50;
        newState.player.money += earnings;
        newState.farm.totalHarvests += 1;
        newState.farm.totalEarnings += earnings;

        // Clear field
        field.cropType = null;
        field.plantedAt = null;
        field.growthStage = null;

        onNotification(`🌾 Harvested for ₹${earnings}!`);
      }

      return newState;
    });
  };

  // Handle buying new field
  const handleBuyField = async () => {
    try {
      const currentFields = gameState.farm.fields.length;
      const cost = 1000 * Math.pow(2, currentFields - 3); // Exponential cost

      if (gameState.player.money < cost) {
        onNotification('error', `Need ${formatMoney(cost)} to buy a new field!`);
        return;
      }

      // Add new field through game controller
      const newFieldId = currentFields + 1;
      const baseField = {
        fieldId: newFieldId,
        cropType: null,
        plantedAt: null,
        growthStage: null
      };

      const advancedField = gameController.fieldManagement.initializeField(newFieldId, baseField);
      gameState.farm.fields.push(advancedField);
      gameState.player.money -= cost;

      onNotification('success', `🌾 New field purchased for ${formatMoney(cost)}!`);
      setShowBuyFieldModal(false);

    } catch (error) {
      console.error('Error buying field:', error);
      onNotification('error', 'Error buying field. Please try again.');
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-2xl font-bold text-red-800">Game State Not Available</div>
          <div className="text-red-600">Please refresh the page</div>
        </div>
      </div>
    );
  }

  const currentFields = gameState.farm.fields.length;
  const nextFieldCost = 1000 * Math.pow(2, currentFields - 3);
  const canBuyField = gameState.player.money >= nextFieldCost;

  const growingCrops = gameState.farm.fields.filter(field => field.cropType).length;
  const readyCrops = gameState.farm.fields.filter(field =>
    field.growthStage?.stage === 'ready'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Money Bar */}
        <MoneyBar
          money={gameState.player.money}
          fieldCount={currentFields}
          totalHarvests={gameState.farm.totalHarvests}
          totalEarnings={gameState.farm.totalEarnings}
          level={gameState.player.level}
          xp={gameState.player.xp}
          reputation={gameState.player.reputation}
        />



        {/* Simple Weather Display */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🌦️</span>
            Current Weather
          </h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-6xl mb-2">{gameState.weather?.weather?.emoji || '☀️'}</div>
              <h3 className="text-lg font-bold">{gameState.weather?.weather?.name || 'Sunny'}</h3>
              <p className="text-sm text-gray-600">{gameState.weather?.weather?.description || 'Perfect weather'}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">{gameState.weather?.season?.emoji || '🌱'}</div>
              <h3 className="text-lg font-bold">{gameState.weather?.season?.name || 'Spring'}</h3>
              <p className="text-sm text-gray-600">Day {gameState.weather?.season?.day || 1} of 30</p>
            </div>
          </div>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gameState.farm.fields.map((field) => (
            <FieldCard
              key={field.fieldId}
              field={field}
              onPlantCrop={handlePlantCrop}
              onHarvestCrop={handleHarvestCrop}
              gameState={gameState}
              gameController={gameController}
              onNotification={onNotification}
            />
          ))}
        </div>

        {/* Buy New Field Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowBuyFieldModal(true)}
            disabled={!canBuyField}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              canBuyField
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {canBuyField ? (
              <>🌾 Buy New Field ({formatMoney(nextFieldCost)})</>
            ) : (
              <>💰 Need {formatMoney(nextFieldCost - gameState.player.money)} more</>
            )}
          </button>
        </div>

        {/* Game Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">🏆 Farm Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-800">{currentFields}</div>
              <div className="text-green-600">Total Fields</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-800">{gameState.farm.totalHarvests || 0}</div>
              <div className="text-blue-600">Harvests</div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <div className="text-3xl font-bold text-purple-800">{formatMoney(gameState.farm.totalEarnings || 0)}</div>
              <div className="text-purple-600">Total Earned</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="text-3xl font-bold text-yellow-800">
                {gameState.farm.totalEarnings > 0 ? Math.round((gameState.farm.totalEarnings / (gameState.farm.totalHarvests || 1))) : 0}
              </div>
              <div className="text-yellow-600">Avg per Harvest</div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Selection Modal */}
      <CropSelectModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        onSelectCrop={handleCropSelect}
        playerMoney={gameState.player.money}
        gameState={gameState}
        gameController={gameController}
      />

      {/* Buy Field Modal */}
      {showBuyFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold">🌾 Buy New Field</h2>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏞️</div>
                <h3 className="text-xl font-bold mb-2">Expand Your Farm</h3>
                <p className="text-gray-600">Purchase a new field to grow more crops</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>Cost:</span>
                  <span className="font-bold text-2xl">{formatMoney(nextFieldCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Your Money:</span>
                  <span className="font-bold">{formatMoney(gameState.player.money)}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBuyFieldModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyField}
                  disabled={!canBuyField}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold ${
                    canBuyField
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {canBuyField ? 'Buy Field' : 'Not Enough Money'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
