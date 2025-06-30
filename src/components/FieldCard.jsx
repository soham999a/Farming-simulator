import { useState, useEffect } from 'react';
import { crops, isCropReady, getGrowthPercentage, getRemainingTime } from '../constants/crops.js';
import { formatCountdown, formatMoney } from '../utils/time.js';

const FieldCard = ({
  field,
  onPlantCrop,
  onHarvestCrop,
  gameState = null,
  gameController = null,
  onNotification = () => {}
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showFieldDetails, setShowFieldDetails] = useState(false);

  // Update timer every second using game state
  useEffect(() => {
    if (!field.cropType || !field.plantedAt || !field.growthStage) return;

    setTimeLeft(field.growthStage.timeRemaining || 0);
    setProgress(field.growthStage.progress || 0);
    setIsReady(field.growthStage.stage === 'ready');
  }, [field.cropType, field.plantedAt, field.growthStage]);

  const handlePlant = async () => {
    const result = await gameController.plantCrop(field.fieldId, 'wheat'); // Will be selected from modal
    if (result.success) {
      onNotification('success', result.message);
    } else {
      onNotification('error', result.message);
    }
  };

  const handleHarvest = async () => {
    if (gameController) {
      const result = await gameController.harvestCrop(field.fieldId);
      if (result.success) {
        onNotification(`🌾 Harvested for ₹${result.earnings}!`);
      } else {
        onNotification(result.message);
      }
    } else {
      // Use the simple harvest function passed from Dashboard
      onHarvestCrop(field.fieldId);
    }
  };

  const handleTreatDisease = async () => {
    // Get available treatments and show modal
    onNotification('info', 'Disease treatment system coming soon!');
  };

  const handleUpgradeField = () => {
    setShowFieldDetails(true);
  };

  const crop = field.cropType ? crops[field.cropType] : null;

  // Get field data from advanced field management (with fallbacks)
  const fieldData = gameController?.fieldManagement?.getFieldData(field.fieldId) || { soilQuality: 7, moisture: 60 };
  const soilInfo = gameController?.fieldManagement?.getSoilTypeInfo(field.fieldId) || { name: 'Loam Soil', emoji: '🟫', bestCrops: ['wheat', 'corn'] };
  const productivity = gameController?.fieldManagement?.getFieldProductivity(field.fieldId) || 75;
  const recommendations = gameController?.fieldManagement?.getFieldRecommendations(field.fieldId) || [];

  // Get active diseases
  const activeDiseases = gameController?.diseases?.getActiveDiseases()?.filter(disease => disease.fieldId === field.fieldId) || [];

  // Get equipment effects
  const equipmentEffects = gameController?.equipment?.getFieldEffects(field.fieldId) || { growthBonus: 1, yieldBonus: 1 };

  // Get market price
  const marketPrice = gameController?.market?.getPrice(field.cropType) || (crop?.sellPrice || 0);
  const priceChange = gameController?.market?.getPriceChange(field.cropType) || 0;

  return (
    <div
      className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-xl relative"
      data-field-id={field.fieldId}
    >
      {/* Field Header */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-t-xl relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="mr-2">{soilInfo?.emoji || '🌾'}</span>
            Field #{field.fieldId}
          </h3>
          <div className="flex items-center space-x-2">
            {/* Productivity Score */}
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              productivity >= 80 ? 'bg-green-500 text-white' :
              productivity >= 60 ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {Math.round(productivity)}%
            </div>

            {/* Field Details Button */}
            <button
              onClick={handleUpgradeField}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              title="Field Details"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Soil Type */}
        <div className="text-sm text-gray-600 mt-1">
          {soilInfo?.name || 'Unknown Soil'} • Quality: {Math.round(fieldData?.soilQuality || 5)}/10
        </div>

        {/* Active Diseases */}
        {activeDiseases.length > 0 && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-red-500 text-sm font-bold">⚠️ Disease:</span>
            {activeDiseases.map(disease => (
              <span key={disease.id} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                {disease.emoji} {disease.name}
              </span>
            ))}
            <button
              onClick={handleTreatDisease}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Treat
            </button>
          </div>
        )}

        {/* Equipment Effects */}
        {(equipmentEffects.growthBonus > 1 || equipmentEffects.yieldBonus > 1) && (
          <div className="mt-2 flex items-center space-x-2 text-xs">
            {equipmentEffects.growthBonus > 1 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                🚜 +{Math.round((equipmentEffects.growthBonus - 1) * 100)}% Growth
              </span>
            )}
            {equipmentEffects.yieldBonus > 1 && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                📈 +{Math.round((equipmentEffects.yieldBonus - 1) * 100)}% Yield
              </span>
            )}
          </div>
        )}
      </div>

      {/* Field Content */}
      <div className="p-6">
        {!field.cropType ? (
          // Empty Field
          <div className="text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h4 className="text-xl font-bold text-gray-700 mb-2">Empty Field</h4>
            <p className="text-gray-500 mb-2">Ready for planting</p>

            {/* Soil Recommendations */}
            {soilInfo && (
              <div className="text-xs text-gray-600 mb-4">
                Best for: {soilInfo.bestCrops.map(crop =>
                  crops[crop]?.emoji || '🌱'
                ).join(' ')}
              </div>
            )}

            <button
              onClick={() => onPlantCrop(field.fieldId)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors w-full"
            >
              🌱 Plant Crop
            </button>
          </div>
        ) : (
          // Field with Crop
          <div className="text-center">
            {/* Crop Display */}
            <div className="text-6xl mb-4 crop-emoji">{crop.emoji}</div>
            <h4 className="text-xl font-bold text-gray-800 mb-1">{crop.name}</h4>

            {/* Growth Stage */}
            <div className="text-sm text-gray-600 mb-2 capitalize">
              Stage: {field.growthStage?.stage || 'planted'}
            </div>

            {/* Growth Status */}
            {isReady ? (
              <div className="mb-4">
                <div className="text-green-600 font-bold text-lg mb-2 animate-bounce">
                  ✨ Ready to Harvest! ✨
                </div>
                <div className="text-gray-600 mb-2">
                  Market Price: {formatMoney(marketPrice || crop.sellPrice)}
                  {priceChange !== 0 && (
                    <span className={`ml-2 text-xs ${priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {priceChange > 0 ? '📈' : '📉'} {priceChange.toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* Disease Warning */}
                {activeDiseases.length > 0 && (
                  <div className="text-red-600 text-sm mb-2">
                    ⚠️ Yield reduced by disease
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <div className="text-blue-600 font-bold mb-2">
                  🌱 Growing... {formatCountdown(timeLeft)}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      activeDiseases.length > 0
                        ? 'bg-gradient-to-r from-red-400 to-red-600'
                        : 'bg-gradient-to-r from-green-400 to-green-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="text-sm text-gray-600">
                  {Math.round(progress)}% Complete
                </div>

                {/* Weather Effects */}
                {gameState?.weather?.weather && (
                  <div className="text-xs text-gray-500 mt-2">
                    {gameState.weather.weather.emoji} {gameState.weather.weather.description}
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            {isReady ? (
              <button
                onClick={handleHarvest}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold transition-colors w-full animate-pulse"
              >
                🌾 Harvest (+{formatMoney(marketPrice || crop.sellPrice)})
              </button>
            ) : (
              <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-bold w-full">
                ⏰ Growing... {field.growthStage?.stage || 'planted'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Field Footer */}
      <div className="bg-gray-50 p-3 rounded-b-xl">
        <div className="text-center text-sm text-gray-600">
          {field.cropType ? (
            <div className="flex justify-between items-center">
              <span>🌱 {crop.name}</span>
              <span>💰 {formatMoney(marketPrice || crop.sellPrice)}</span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span>🌾 Ready to plant</span>
              <span>{soilInfo?.name || 'Unknown Soil'}</span>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-2 text-xs">
            <div className="font-semibold text-gray-700 mb-1">💡 Recommendations:</div>
            {recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className={`text-${rec.type === 'critical' ? 'red' : rec.type === 'warning' ? 'yellow' : 'blue'}-600`}>
                • {rec.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field Details Modal */}
      {showFieldDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">🌾 Field #{field.fieldId} Details</h2>
                <button
                  onClick={() => setShowFieldDetails(false)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Soil Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">🌱 Soil Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Soil Type</div>
                    <div className="font-bold">{soilInfo?.emoji} {soilInfo?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Quality</div>
                    <div className="font-bold">{Math.round(fieldData?.soilQuality || 5)}/10</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Moisture</div>
                    <div className="font-bold">{Math.round(fieldData?.moisture || 50)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">pH Level</div>
                    <div className="font-bold">{(fieldData?.pH || 7).toFixed(1)}</div>
                  </div>
                </div>
              </div>

              {/* Nutrients */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">🌿 Nutrients</h3>
                <div className="space-y-2">
                  {fieldData?.nutrients && Object.entries(fieldData.nutrients).map(([nutrient, value]) => (
                    <div key={nutrient} className="flex items-center justify-between">
                      <span className="capitalize">{nutrient.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              value >= 70 ? 'bg-green-500' :
                              value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, value)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">{Math.round(value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3">💡 Recommendations</h3>
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        rec.type === 'critical' ? 'bg-red-50 border-red-500' :
                        rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        'bg-blue-50 border-blue-500'
                      }`}>
                        <div className="font-semibold capitalize">{rec.type}</div>
                        <div className="text-sm">{rec.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    gameController.fieldManagement.tillField(field.fieldId, gameState.player.money);
                    onNotification('success', 'Field tilled successfully!');
                  }}
                  className="bg-brown-500 hover:bg-brown-600 text-white px-4 py-2 rounded-lg font-bold"
                >
                  🔨 Till Field (₹100)
                </button>
                <button
                  onClick={() => {
                    gameController.fieldManagement.applyFertilizer(field.fieldId, 'basic', gameState.player.money);
                    onNotification('success', 'Fertilizer applied!');
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                >
                  🌿 Fertilize (₹50)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldCard;
