const AchievementPanel = ({ gameState, gameController, onNotification }) => {
  const levelInfo = gameController.achievements.getLevelInfo();
  const categories = ['farming', 'economic', 'expansion', 'equipment', 'special', 'collection'];
  
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'uncommon': return 'border-green-400 bg-green-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'epic': return 'shadow-purple-500/25';
      case 'legendary': return 'shadow-yellow-500/25';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Player Level & XP */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          Player Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level Info */}
          <div className="text-center">
            <div className="text-6xl mb-2">👑</div>
            <h3 className="text-2xl font-bold">Level {levelInfo.level}</h3>
            <p className="text-gray-600">{levelInfo.title}</p>
            
            {/* XP Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>XP</span>
                <span>{levelInfo.xp} / {levelInfo.xpForNext || 'MAX'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-600 h-3 rounded-full transition-all duration-1000"
                  style={{ 
                    width: levelInfo.xpForNext ? 
                      `${((levelInfo.xp - (levelInfo.xpForNext - levelInfo.xpToNext)) / levelInfo.xpToNext) * 100}%` : 
                      '100%' 
                  }}
                ></div>
              </div>
              {levelInfo.xpToNext > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {levelInfo.xpToNext} XP to next level
                </p>
              )}
            </div>
          </div>

          {/* Current Unlocks */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">🔓 Current Level Unlocks</h4>
            <div className="space-y-2">
              {levelInfo.unlocks.length > 0 ? (
                levelInfo.unlocks.map((unlock, index) => (
                  <div key={index} className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
                    ✨ {unlock.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No unlocks at this level</div>
              )}
            </div>
          </div>

          {/* Next Level Preview */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">🔮 Next Level ({levelInfo.level + 1})</h4>
            <div className="space-y-2">
              {levelInfo.xpToNext > 0 ? (
                <>
                  <div className="text-sm text-gray-600">
                    Unlock new equipment and features!
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
                    🎯 {levelInfo.xpToNext} XP needed
                  </div>
                </>
              ) : (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm">
                  🌟 Maximum Level Reached!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements by Category */}
      {categories.map(category => {
        const categoryAchievements = gameController.achievements.getAchievementsByCategory(category);
        
        return (
          <div key={category} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize flex items-center">
              <span className="mr-2">
                {category === 'farming' && '🌾'}
                {category === 'economic' && '💰'}
                {category === 'expansion' && '🏞️'}
                {category === 'equipment' && '🚜'}
                {category === 'special' && '⭐'}
                {category === 'collection' && '📚'}
              </span>
              {category} Achievements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                    achievement.unlocked 
                      ? `${getRarityColor(achievement.rarity)} shadow-lg ${getRarityGlow(achievement.rarity)}` 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Achievement Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{achievement.emoji}</span>
                      <div>
                        <h4 className={`font-bold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                          {achievement.name}
                        </h4>
                        <div className="text-xs capitalize text-gray-500">
                          {achievement.rarity}
                        </div>
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-green-500 text-xl">✅</div>
                    )}
                  </div>

                  {/* Description */}
                  <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {!achievement.unlocked && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(achievement.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="text-xs">
                    <div className="font-bold text-gray-700 mb-1">Rewards:</div>
                    <div className="flex flex-wrap gap-1">
                      {achievement.reward.xp && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          +{achievement.reward.xp} XP
                        </span>
                      )}
                      {achievement.reward.money && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          +₹{achievement.reward.money}
                        </span>
                      )}
                      {achievement.reward.unlock && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          🔓 {achievement.reward.unlock}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Achievement Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Achievement Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => {
            const categoryAchievements = gameController.achievements.getAchievementsByCategory(category);
            const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;
            const totalCount = categoryAchievements.length;
            const percentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

            return (
              <div key={category} className="text-center">
                <div className="text-2xl mb-2">
                  {category === 'farming' && '🌾'}
                  {category === 'economic' && '💰'}
                  {category === 'expansion' && '🏞️'}
                  {category === 'equipment' && '🚜'}
                  {category === 'special' && '⭐'}
                  {category === 'collection' && '📚'}
                </div>
                <div className="font-bold text-lg">{unlockedCount}/{totalCount}</div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(percentage)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
        <h4 className="font-bold text-purple-800 mb-3">💡 Achievement Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
          <div>
            <div className="font-bold mb-1">🌾 Farming Achievements</div>
            <div>Focus on consistent harvesting and trying different crops.</div>
          </div>
          <div>
            <div className="font-bold mb-1">💰 Economic Achievements</div>
            <div>Watch market prices and time your sales for maximum profit.</div>
          </div>
          <div>
            <div className="font-bold mb-1">🚜 Equipment Achievements</div>
            <div>Invest in different types of equipment to unlock achievements.</div>
          </div>
          <div>
            <div className="font-bold mb-1">⭐ Special Achievements</div>
            <div>These require specific conditions - experiment and explore!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPanel;
