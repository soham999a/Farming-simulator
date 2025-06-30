const WeatherPanel = ({ weather, gameController }) => {
  if (!weather) return null;

  const forecast = gameController.weather.getForecast();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🌦️</span>
        Weather & Season
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Weather */}
        <div className="text-center">
          <div className="text-6xl mb-2">{weather.weather?.emoji || '☀️'}</div>
          <h3 className="text-lg font-bold">{weather.weather?.name || 'Sunny'}</h3>
          <p className="text-sm text-gray-600">{weather.weather?.description || 'Perfect weather'}</p>
          
          {/* Weather Effects */}
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Growth:</span>
              <span className={`font-bold ${
                weather.weather?.growthMultiplier > 1 ? 'text-green-600' : 
                weather.weather?.growthMultiplier < 1 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {weather.weather?.growthMultiplier ? 
                  `${Math.round((weather.weather.growthMultiplier - 1) * 100)}%` : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Disease Risk:</span>
              <span className={`font-bold ${
                (weather.weather?.diseaseChance || 0) > 0.1 ? 'text-red-600' : 'text-green-600'
              }`}>
                {Math.round((weather.weather?.diseaseChance || 0) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Current Season */}
        <div className="text-center">
          <div className="text-6xl mb-2">{weather.season?.emoji || '🌱'}</div>
          <h3 className="text-lg font-bold">{weather.season?.name || 'Spring'}</h3>
          <p className="text-sm text-gray-600">Day {weather.season?.day || 1} of 30</p>
          <p className="text-xs text-gray-500 mt-1">{weather.season?.description || 'Growing season'}</p>
          
          {/* Season Progress */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((weather.season?.day || 1) / 30) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {30 - (weather.season?.day || 1)} days remaining
            </div>
          </div>
        </div>

        {/* Crop Bonuses */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">🌱 Seasonal Bonuses</h4>
          <div className="space-y-2">
            {weather.season?.cropBonus ? 
              Object.entries(weather.season.cropBonus).map(([crop, bonus]) => (
                <div key={crop} className="flex justify-between items-center text-sm">
                  <span className="capitalize">{crop}:</span>
                  <span className="font-bold text-green-600">
                    +{Math.round((bonus - 1) * 100)}%
                  </span>
                </div>
              )) : (
                <div className="text-sm text-gray-500">No bonuses this season</div>
              )
            }
          </div>
        </div>

        {/* Weather Forecast */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3">📅 3-Day Forecast</h4>
          <div className="space-y-2">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>Day {index + 1}:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{day.weather?.emoji || '☀️'}</span>
                  <span className="text-xs">{day.weather?.name || 'Sunny'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Tips */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h4 className="font-bold text-blue-800 mb-2">💡 Weather Tips</h4>
        <div className="text-sm text-blue-700">
          {weather.weather?.name === 'Rainy' && (
            <p>🌧️ Rainy weather boosts growth but increases disease risk. Consider treating crops preventively.</p>
          )}
          {weather.weather?.name === 'Drought' && (
            <p>🌵 Drought slows growth significantly. Install irrigation systems to mitigate effects.</p>
          )}
          {weather.weather?.name === 'Sunny' && (
            <p>☀️ Perfect growing conditions! Great time to plant new crops.</p>
          )}
          {weather.weather?.name === 'Stormy' && (
            <p>⛈️ Storms can damage crops and increase disease. Protect valuable fields with greenhouses.</p>
          )}
          {weather.weather?.name === 'Cloudy' && (
            <p>☁️ Mild conditions with balanced growth. Good for most crops.</p>
          )}
          {weather.weather?.name === 'Heat Wave' && (
            <p>🔥 High temperatures stress crops. Ensure adequate watering and shade.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
