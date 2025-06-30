import { crops, formatGrowTime } from '../constants/crops.js';
import { formatMoney } from '../utils/time.js';

const CropSelectModal = ({ isOpen, onClose, onSelectCrop, playerMoney, gameState, gameController }) => {
  if (!isOpen) return null;

  const handleCropSelect = (cropKey) => {
    onSelectCrop(cropKey);
    onClose();
  };

  const playSound = (soundFile) => {
    try {
      const audio = new Audio(`/assets/sounds/${soundFile}`);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio errors if files don't exist
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🌱 Choose Your Crop</h2>
              <p className="text-green-100">Select a crop to plant in your field</p>
            </div>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Current Money Display */}
        <div className="p-4 bg-yellow-50 border-b">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">💰</span>
            <span className="text-xl font-bold text-green-700">
              Available: {formatMoney(playerMoney)}
            </span>
          </div>
        </div>

        {/* Crops Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(crops).map(([cropKey, crop]) => {
              const canAfford = playerMoney >= 0; // Crops are free to plant, just need seeds
              const marketPrice = gameController?.market?.getPrice(cropKey) || crop.sellPrice;
              const priceChange = gameController?.market?.getPriceChange(cropKey) || 0;
              const weatherEffects = gameController?.weather?.getCurrentEffects();
              const seasonalBonus = weatherEffects?.season?.cropBonus?.[cropKey] || 1;
              
              return (
                <div
                  key={cropKey}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    canAfford 
                      ? 'border-green-300 hover:border-green-500 hover:bg-green-50' 
                      : 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => {
                    if (canAfford) {
                      playSound('plant.mp3');
                      handleCropSelect(cropKey);
                    }
                  }}
                >
                  {/* Crop Image/Emoji */}
                  <div className="text-center mb-3">
                    <div className="text-6xl mb-2">{crop.emoji}</div>
                    <h3 className="text-xl font-bold text-gray-800">{crop.name}</h3>
                    <p className="text-sm text-gray-600">{crop.description}</p>
                  </div>

                  {/* Crop Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Grow Time:</span>
                      <span className="font-bold text-blue-600">
                        {formatGrowTime(crop.growTime)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Market Price:</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600">
                          {formatMoney(marketPrice)}
                        </span>
                        {priceChange !== 0 && (
                          <div className={`text-xs ${priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {priceChange > 0 ? '📈' : '📉'} {priceChange.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>

                    {seasonalBonus > 1 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Season Bonus:</span>
                        <span className="font-bold text-blue-600">
                          +{Math.round((seasonalBonus - 1) * 100)}%
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profit/Min:</span>
                      <span className="font-bold text-purple-600">
                        {formatMoney(Math.round((crop.sellPrice / (crop.growTime / 60000)) * 100) / 100)}
                      </span>
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    className={`w-full mt-4 py-2 px-4 rounded-lg font-bold transition-colors ${
                      canAfford
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={!canAfford}
                  >
                    {canAfford ? '🌱 Plant This Crop' : '💰 Need More Money'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 rounded-b-xl">
          <div className="text-center text-sm text-gray-600">
            💡 <strong>Tip:</strong> Faster crops give quicker returns, but slower crops are more profitable!
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropSelectModal;
