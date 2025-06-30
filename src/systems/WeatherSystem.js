// 🌦️ ADVANCED WEATHER SYSTEM

export const weatherTypes = {
  sunny: {
    name: "Sunny",
    emoji: "☀️",
    growthMultiplier: 1.2,
    diseaseChance: 0.05,
    description: "Perfect growing conditions",
    color: "#FFD700"
  },
  cloudy: {
    name: "Cloudy", 
    emoji: "☁️",
    growthMultiplier: 1.0,
    diseaseChance: 0.03,
    description: "Mild weather conditions",
    color: "#87CEEB"
  },
  rainy: {
    name: "Rainy",
    emoji: "🌧️", 
    growthMultiplier: 1.5,
    diseaseChance: 0.15,
    description: "Crops grow faster but disease risk increases",
    color: "#4682B4"
  },
  stormy: {
    name: "Stormy",
    emoji: "⛈️",
    growthMultiplier: 0.7,
    diseaseChance: 0.25,
    description: "Harsh conditions slow growth",
    color: "#2F4F4F"
  },
  drought: {
    name: "Drought",
    emoji: "🌵",
    growthMultiplier: 0.5,
    diseaseChance: 0.02,
    description: "Very slow growth, crops need water",
    color: "#CD853F"
  },
  heatwave: {
    name: "Heat Wave",
    emoji: "🔥",
    growthMultiplier: 0.8,
    diseaseChance: 0.08,
    description: "Hot weather stresses crops",
    color: "#FF4500"
  }
};

export const seasons = {
  spring: {
    name: "Spring",
    emoji: "🌸",
    duration: 30, // days
    weatherProbabilities: {
      sunny: 0.4,
      cloudy: 0.3,
      rainy: 0.25,
      stormy: 0.05
    },
    cropBonus: {
      lettuce: 1.3,
      carrot: 1.2,
      wheat: 1.1
    },
    description: "Perfect planting season"
  },
  summer: {
    name: "Summer", 
    emoji: "☀️",
    duration: 30,
    weatherProbabilities: {
      sunny: 0.5,
      heatwave: 0.2,
      cloudy: 0.2,
      drought: 0.1
    },
    cropBonus: {
      corn: 1.4,
      tomato: 1.3,
      potato: 1.1
    },
    description: "Hot growing season"
  },
  fall: {
    name: "Fall",
    emoji: "🍂", 
    duration: 30,
    weatherProbabilities: {
      cloudy: 0.4,
      sunny: 0.3,
      rainy: 0.2,
      stormy: 0.1
    },
    cropBonus: {
      potato: 1.3,
      carrot: 1.2,
      wheat: 1.1
    },
    description: "Harvest season"
  },
  winter: {
    name: "Winter",
    emoji: "❄️",
    duration: 30, 
    weatherProbabilities: {
      cloudy: 0.5,
      stormy: 0.3,
      sunny: 0.2
    },
    cropBonus: {
      // Most crops grow slower in winter
    },
    description: "Challenging growing season"
  }
};

export class WeatherSystem {
  constructor() {
    this.currentWeather = 'sunny';
    this.currentSeason = 'spring';
    this.dayOfYear = 1;
    this.weatherDuration = 0;
    this.seasonProgress = 0;
  }

  // Generate random weather based on season
  generateWeather(season = this.currentSeason) {
    const seasonData = seasons[season];
    const probabilities = seasonData.weatherProbabilities;
    
    const random = Math.random();
    let cumulative = 0;
    
    for (const [weather, probability] of Object.entries(probabilities)) {
      cumulative += probability;
      if (random <= cumulative) {
        return weather;
      }
    }
    
    return 'sunny'; // fallback
  }

  // Update weather system (call every game tick)
  update() {
    this.weatherDuration++;
    this.dayOfYear++;
    
    // Change weather every 2-5 minutes (in game time)
    if (this.weatherDuration >= Math.random() * 180 + 120) {
      this.currentWeather = this.generateWeather();
      this.weatherDuration = 0;
    }
    
    // Change seasons every 30 days
    this.seasonProgress = Math.floor(this.dayOfYear / 30) % 4;
    const seasonNames = ['spring', 'summer', 'fall', 'winter'];
    this.currentSeason = seasonNames[this.seasonProgress];
  }

  // Get current weather effects
  getCurrentEffects() {
    const weather = weatherTypes[this.currentWeather];
    const season = seasons[this.currentSeason];
    
    return {
      weather: {
        ...weather,
        type: this.currentWeather
      },
      season: {
        ...season,
        type: this.currentSeason,
        day: this.dayOfYear % 30 + 1
      }
    };
  }

  // Calculate growth multiplier for a specific crop
  getCropGrowthMultiplier(cropType) {
    const effects = this.getCurrentEffects();
    let multiplier = effects.weather.growthMultiplier;
    
    // Apply seasonal bonus
    if (effects.season.cropBonus && effects.season.cropBonus[cropType]) {
      multiplier *= effects.season.cropBonus[cropType];
    }
    
    return multiplier;
  }

  // Get disease chance for current conditions
  getDiseaseChance() {
    return weatherTypes[this.currentWeather].diseaseChance;
  }

  // Get weather forecast (next 3 weather periods)
  getForecast() {
    const forecast = [];
    for (let i = 0; i < 3; i++) {
      const weather = this.generateWeather();
      forecast.push({
        weather: weatherTypes[weather],
        type: weather
      });
    }
    return forecast;
  }
}

// Global weather system instance
export const weatherSystem = new WeatherSystem();
