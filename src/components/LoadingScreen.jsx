import { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing...');

  const loadingTasks = [
    'Preparing soil...',
    'Planting seeds...',
    'Setting up weather systems...',
    'Loading farm equipment...',
    'Initializing market prices...',
    'Connecting to multiplayer...',
    'Loading achievements...',
    'Starting game engine...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Update current task based on progress
        const taskIndex = Math.floor((newProgress / 100) * loadingTasks.length);
        setCurrentTask(loadingTasks[Math.min(taskIndex, loadingTasks.length - 1)]);
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-green-700 to-emerald-600 flex items-center justify-center">
      <div className="text-center text-white max-w-md mx-auto px-6">
        {/* Farm Icon Animation */}
        <div className="mb-8 relative">
          <div className="text-8xl animate-bounce">🚜</div>
          <div className="absolute -top-4 -right-4 text-4xl animate-pulse">🌾</div>
          <div className="absolute -bottom-2 -left-4 text-3xl animate-pulse delay-300">🌱</div>
          <div className="absolute -top-2 -left-6 text-2xl animate-pulse delay-500">☀️</div>
          <div className="absolute -bottom-4 -right-2 text-2xl animate-pulse delay-700">💧</div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          Ultimate Farming Simulator
        </h1>
        <p className="text-green-100 mb-8 text-lg">Professional Agricultural Experience</p>

        {/* Progress Bar */}
        <div className="w-full bg-green-800 rounded-full h-4 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Progress Text */}
        <div className="text-green-100">
          <p className="text-lg font-semibold">{Math.round(progress)}%</p>
          <p className="text-sm opacity-80 mt-2">{currentTask}</p>
        </div>

        {/* Feature List */}
        <div className="mt-8 grid grid-cols-2 gap-2 text-xs text-green-200">
          <div className="flex items-center space-x-1">
            <span>🌦️</span>
            <span>Weather System</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🐛</span>
            <span>Disease Control</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🚜</span>
            <span>Equipment System</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📈</span>
            <span>Market Trading</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🏆</span>
            <span>Achievements</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>👥</span>
            <span>Multiplayer</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
