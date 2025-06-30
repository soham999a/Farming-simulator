import { formatMoney } from '../utils/time.js';

const MarketPanel = ({ gameState, gameController, onNotification }) => {
  const crops = ['wheat', 'corn', 'potato', 'carrot', 'tomato', 'lettuce'];
  const marketEvents = gameController.market.getActiveEvents();

  const getCropEmoji = (crop) => {
    const emojis = {
      wheat: '🌾',
      corn: '🌽',
      potato: '🥔',
      carrot: '🥕',
      tomato: '🍅',
      lettuce: '🥬'
    };
    return emojis[crop] || '🌱';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'rising': return 'text-green-600';
      case 'falling': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Market Prices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map(crop => {
            const analysis = gameController.market.getMarketAnalysis(crop);
            const forecast = gameController.market.getPriceForecast(crop, 3);
            const optimalTime = gameController.market.getOptimalSellTime(crop);

            return (
              <div key={crop} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCropEmoji(crop)}</span>
                    <span className="font-bold capitalize">{crop}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatMoney(analysis.price)}</div>
                    <div className={`text-xs flex items-center ${getTrendColor(analysis.trend)}`}>
                      <span className="mr-1">{getTrendIcon(analysis.trend)}</span>
                      {analysis.change > 0 ? '+' : ''}{analysis.change}%
                    </div>
                  </div>
                </div>

                {/* Price vs Base */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>vs Base Price:</span>
                    <span className={analysis.price > analysis.basePrice ? 'text-green-600' : 'text-red-600'}>
                      {analysis.price > analysis.basePrice ? '+' : ''}
                      {Math.round(((analysis.price - analysis.basePrice) / analysis.basePrice) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        analysis.price > analysis.basePrice ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.abs((analysis.price - analysis.basePrice) / analysis.basePrice) * 200)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Supply & Demand */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <div className="text-gray-600">Supply</div>
                    <div className="font-bold">{analysis.supply}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Demand</div>
                    <div className="font-bold">{analysis.demand}</div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`text-xs p-2 rounded ${
                  analysis.recommendation === 'sell' ? 'bg-green-100 text-green-800' :
                  analysis.recommendation === 'buy' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <div className="font-bold">
                    {analysis.recommendation === 'sell' ? '💰 SELL' :
                     analysis.recommendation === 'buy' ? '🛒 BUY' : '⏳ HOLD'}
                  </div>
                  <div>Best time: {optimalTime}</div>
                </div>

                {/* 3-Day Forecast */}
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-gray-600 mb-1">3-Day Forecast:</div>
                  <div className="flex justify-between text-xs">
                    {forecast.map((price, index) => (
                      <div key={index} className="text-center">
                        <div>Day {index + 1}</div>
                        <div className="font-bold">{formatMoney(price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Events */}
      {marketEvents.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📰</span>
            Active Market Events
          </h3>
          
          <div className="space-y-4">
            {marketEvents.map((event, index) => (
              <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-blue-800 flex items-center">
                    <span className="mr-2">{event.emoji}</span>
                    {event.name}
                  </h4>
                  <span className="text-sm text-blue-600">{event.timeLeft}</span>
                </div>
                <p className="text-blue-700 text-sm mb-3">{event.description}</p>
                
                {/* Affected Crops */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(event.effects).map(([crop, multiplier]) => (
                    <span
                      key={crop}
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        multiplier > 1 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {getCropEmoji(crop)} {crop}: {multiplier > 1 ? '+' : ''}{Math.round((multiplier - 1) * 100)}%
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Market Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Most Profitable */}
          <div className="text-center">
            <h4 className="font-bold text-green-800 mb-3">💰 Most Profitable</h4>
            {(() => {
              const mostProfitable = crops.reduce((best, crop) => {
                const analysis = gameController.market.getMarketAnalysis(crop);
                return analysis.price > best.price ? { crop, price: analysis.price } : best;
              }, { crop: 'wheat', price: 0 });
              
              return (
                <div>
                  <div className="text-4xl mb-2">{getCropEmoji(mostProfitable.crop)}</div>
                  <div className="font-bold capitalize">{mostProfitable.crop}</div>
                  <div className="text-green-600 font-bold">{formatMoney(mostProfitable.price)}</div>
                </div>
              );
            })()}
          </div>

          {/* Biggest Gainer */}
          <div className="text-center">
            <h4 className="font-bold text-blue-800 mb-3">📈 Biggest Gainer</h4>
            {(() => {
              const biggestGainer = crops.reduce((best, crop) => {
                const analysis = gameController.market.getMarketAnalysis(crop);
                return analysis.change > best.change ? { crop, change: analysis.change } : best;
              }, { crop: 'wheat', change: -100 });
              
              return (
                <div>
                  <div className="text-4xl mb-2">{getCropEmoji(biggestGainer.crop)}</div>
                  <div className="font-bold capitalize">{biggestGainer.crop}</div>
                  <div className="text-green-600 font-bold">+{biggestGainer.change.toFixed(1)}%</div>
                </div>
              );
            })()}
          </div>

          {/* Biggest Loser */}
          <div className="text-center">
            <h4 className="font-bold text-red-800 mb-3">📉 Biggest Loser</h4>
            {(() => {
              const biggestLoser = crops.reduce((worst, crop) => {
                const analysis = gameController.market.getMarketAnalysis(crop);
                return analysis.change < worst.change ? { crop, change: analysis.change } : worst;
              }, { crop: 'wheat', change: 100 });
              
              return (
                <div>
                  <div className="text-4xl mb-2">{getCropEmoji(biggestLoser.crop)}</div>
                  <div className="font-bold capitalize">{biggestLoser.crop}</div>
                  <div className="text-red-600 font-bold">{biggestLoser.change.toFixed(1)}%</div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Trading Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
        <h4 className="font-bold text-yellow-800 mb-3">💡 Trading Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
          <div>
            <div className="font-bold mb-1">📈 Buy Low, Sell High</div>
            <div>Watch for price dips to plant crops, then sell when prices peak.</div>
          </div>
          <div>
            <div className="font-bold mb-1">🌦️ Weather Affects Prices</div>
            <div>Droughts increase prices, while good weather can lower them.</div>
          </div>
          <div>
            <div className="font-bold mb-1">📅 Seasonal Patterns</div>
            <div>Some crops are more valuable in certain seasons.</div>
          </div>
          <div>
            <div className="font-bold mb-1">📰 Watch Market Events</div>
            <div>Special events can dramatically affect crop prices.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPanel;
