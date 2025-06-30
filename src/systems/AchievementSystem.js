// 🏆 ADVANCED ACHIEVEMENT & LEVELING SYSTEM

export const achievements = {
  // FARMING ACHIEVEMENTS
  firstHarvest: {
    id: 'firstHarvest',
    name: 'First Harvest',
    emoji: '🌾',
    description: 'Harvest your first crop',
    category: 'farming',
    requirement: { type: 'harvest', count: 1 },
    reward: { xp: 50, money: 100 },
    rarity: 'common'
  },
  speedFarmer: {
    id: 'speedFarmer',
    name: 'Speed Farmer',
    emoji: '⚡',
    description: 'Harvest 10 crops in under 5 minutes',
    category: 'farming',
    requirement: { type: 'speedHarvest', count: 10, timeLimit: 300000 },
    reward: { xp: 200, money: 500 },
    rarity: 'rare'
  },
  masterFarmer: {
    id: 'masterFarmer',
    name: 'Master Farmer',
    emoji: '👑',
    description: 'Harvest 1000 crops total',
    category: 'farming',
    requirement: { type: 'harvest', count: 1000 },
    reward: { xp: 1000, money: 5000, unlock: 'masterSeeds' },
    rarity: 'legendary'
  },

  // ECONOMIC ACHIEVEMENTS
  firstMillionaire: {
    id: 'firstMillionaire',
    name: 'Millionaire',
    emoji: '💰',
    description: 'Accumulate ₹1,000,000',
    category: 'economic',
    requirement: { type: 'money', count: 1000000 },
    reward: { xp: 500, unlock: 'goldTractor' },
    rarity: 'epic'
  },
  marketMaster: {
    id: 'marketMaster',
    name: 'Market Master',
    emoji: '📈',
    description: 'Make a profit of ₹10,000 in a single sale',
    category: 'economic',
    requirement: { type: 'singleSale', count: 10000 },
    reward: { xp: 300, money: 2000 },
    rarity: 'rare'
  },

  // EXPANSION ACHIEVEMENTS
  landBaron: {
    id: 'landBaron',
    name: 'Land Baron',
    emoji: '🏞️',
    description: 'Own 20 fields',
    category: 'expansion',
    requirement: { type: 'fields', count: 20 },
    reward: { xp: 800, money: 10000 },
    rarity: 'epic'
  },

  // EQUIPMENT ACHIEVEMENTS
  mechanized: {
    id: 'mechanized',
    name: 'Mechanized Farmer',
    emoji: '🚜',
    description: 'Own 5 different types of equipment',
    category: 'equipment',
    requirement: { type: 'equipmentTypes', count: 5 },
    reward: { xp: 400, money: 3000 },
    rarity: 'rare'
  },

  // SPECIAL ACHIEVEMENTS
  weatherSurvivor: {
    id: 'weatherSurvivor',
    name: 'Weather Survivor',
    emoji: '⛈️',
    description: 'Survive 10 storms without losing crops',
    category: 'special',
    requirement: { type: 'weatherSurvival', count: 10 },
    reward: { xp: 600, unlock: 'weatherStation' },
    rarity: 'epic'
  },
  diseaseDoctor: {
    id: 'diseaseDoctor',
    name: 'Disease Doctor',
    emoji: '🩺',
    description: 'Successfully treat 50 crop diseases',
    category: 'special',
    requirement: { type: 'diseaseTreatment', count: 50 },
    reward: { xp: 500, unlock: 'advancedTreatments' },
    rarity: 'rare'
  },

  // COLLECTION ACHIEVEMENTS
  cropCollector: {
    id: 'cropCollector',
    name: 'Crop Collector',
    emoji: '🌱',
    description: 'Grow all 6 types of crops',
    category: 'collection',
    requirement: { type: 'cropTypes', count: 6 },
    reward: { xp: 300, money: 1500 },
    rarity: 'uncommon'
  },

  // TIME-BASED ACHIEVEMENTS
  earlyBird: {
    id: 'earlyBird',
    name: 'Early Bird',
    emoji: '🐦',
    description: 'Plant crops at 6 AM for 7 consecutive days',
    category: 'time',
    requirement: { type: 'earlyPlanting', count: 7 },
    reward: { xp: 250, money: 800 },
    rarity: 'uncommon'
  },

  // EFFICIENCY ACHIEVEMENTS
  efficient: {
    id: 'efficient',
    name: 'Efficiency Expert',
    emoji: '⚙️',
    description: 'Achieve 95% field utilization for 30 days',
    category: 'efficiency',
    requirement: { type: 'fieldUtilization', count: 30, threshold: 0.95 },
    reward: { xp: 700, unlock: 'efficiencyBonus' },
    rarity: 'epic'
  }
};

export const levels = {
  1: { xpRequired: 0, unlocks: ['basicTractor'], title: 'Novice Farmer' },
  2: { xpRequired: 500, unlocks: ['fertilizerSpreader'], title: 'Apprentice Farmer' },
  3: { xpRequired: 1200, unlocks: ['sprinklerSystem'], title: 'Skilled Farmer' },
  4: { xpRequired: 2000, unlocks: ['cultivator'], title: 'Experienced Farmer' },
  5: { xpRequired: 3000, unlocks: ['advancedTractor'], title: 'Expert Farmer' },
  6: { xpRequired: 4500, unlocks: ['greenhouse'], title: 'Master Farmer' },
  7: { xpRequired: 6500, unlocks: ['dripIrrigation'], title: 'Agricultural Engineer' },
  8: { xpRequired: 9000, unlocks: ['precisionSpreader'], title: 'Farm Manager' },
  9: { xpRequired: 12000, unlocks: ['weatherStation'], title: 'Agricultural Scientist' },
  10: { xpRequired: 16000, unlocks: ['combineHarvester'], title: 'Agricultural Mogul' },
  11: { xpRequired: 21000, unlocks: ['automatedFarm'], title: 'Tech Pioneer' },
  12: { xpRequired: 27000, unlocks: ['geneticLab'], title: 'Biotech Innovator' },
  13: { xpRequired: 34000, unlocks: ['spaceSeeds'], title: 'Space Farmer' },
  14: { xpRequired: 42000, unlocks: ['quantumGrowth'], title: 'Quantum Agriculturalist' },
  15: { xpRequired: 52000, unlocks: ['timeMachine'], title: 'Temporal Farmer' }
};

export class AchievementSystem {
  constructor() {
    this.unlockedAchievements = new Set();
    this.achievementProgress = new Map(); // achievementId -> progress
    this.playerStats = {
      totalHarvests: 0,
      totalMoney: 0,
      fieldsOwned: 0,
      equipmentOwned: new Set(),
      cropsGrown: new Set(),
      diseaseTreated: 0,
      weatherSurvived: 0,
      speedHarvests: [],
      earlyPlantings: 0,
      fieldUtilizationDays: 0
    };
    this.currentLevel = 1;
    this.currentXP = 0;
    this.pendingRewards = [];
  }

  // Add XP and check for level up
  addXP(amount, source = 'general') {
    this.currentXP += amount;
    
    // Check for level up
    const newLevel = this.calculateLevel(this.currentXP);
    if (newLevel > this.currentLevel) {
      const levelUps = newLevel - this.currentLevel;
      this.currentLevel = newLevel;
      
      // Add level up rewards
      for (let i = this.currentLevel - levelUps + 1; i <= this.currentLevel; i++) {
        if (levels[i]) {
          this.pendingRewards.push({
            type: 'levelUp',
            level: i,
            title: levels[i].title,
            unlocks: levels[i].unlocks || []
          });
        }
      }
    }

    return {
      xpGained: amount,
      newLevel: newLevel > this.currentLevel - 1,
      currentXP: this.currentXP,
      currentLevel: this.currentLevel
    };
  }

  // Calculate level from XP
  calculateLevel(xp) {
    let level = 1;
    for (const [lvl, data] of Object.entries(levels)) {
      if (xp >= data.xpRequired) {
        level = parseInt(lvl);
      } else {
        break;
      }
    }
    return level;
  }

  // Update player stats and check achievements
  updateStats(statType, value, metadata = {}) {
    switch (statType) {
      case 'harvest':
        this.playerStats.totalHarvests += value;
        this.playerStats.cropsGrown.add(metadata.cropType);
        
        // Check speed harvest
        if (metadata.harvestTime) {
          this.playerStats.speedHarvests.push(metadata.harvestTime);
          this.checkSpeedHarvest();
        }
        break;
        
      case 'money':
        this.playerStats.totalMoney = Math.max(this.playerStats.totalMoney, value);
        break;
        
      case 'fields':
        this.playerStats.fieldsOwned = value;
        break;
        
      case 'equipment':
        this.playerStats.equipmentOwned.add(value);
        break;
        
      case 'diseaseTreatment':
        this.playerStats.diseaseTreated += value;
        break;
        
      case 'weatherSurvival':
        this.playerStats.weatherSurvived += value;
        break;
        
      case 'earlyPlanting':
        this.playerStats.earlyPlantings += value;
        break;
        
      case 'fieldUtilization':
        if (value >= 0.95) {
          this.playerStats.fieldUtilizationDays += 1;
        } else {
          this.playerStats.fieldUtilizationDays = 0; // Reset streak
        }
        break;
    }

    // Check all achievements
    this.checkAchievements();
  }

  // Check speed harvest achievement
  checkSpeedHarvest() {
    const recentHarvests = this.playerStats.speedHarvests.filter(
      time => Date.now() - time < 300000 // 5 minutes
    );
    
    if (recentHarvests.length >= 10) {
      this.unlockAchievement('speedFarmer');
    }
  }

  // Check all achievements
  checkAchievements() {
    Object.values(achievements).forEach(achievement => {
      if (this.unlockedAchievements.has(achievement.id)) return;
      
      if (this.checkAchievementRequirement(achievement)) {
        this.unlockAchievement(achievement.id);
      }
    });
  }

  // Check if achievement requirement is met
  checkAchievementRequirement(achievement) {
    const req = achievement.requirement;
    
    switch (req.type) {
      case 'harvest':
        return this.playerStats.totalHarvests >= req.count;
        
      case 'money':
        return this.playerStats.totalMoney >= req.count;
        
      case 'fields':
        return this.playerStats.fieldsOwned >= req.count;
        
      case 'equipmentTypes':
        return this.playerStats.equipmentOwned.size >= req.count;
        
      case 'cropTypes':
        return this.playerStats.cropsGrown.size >= req.count;
        
      case 'diseaseTreatment':
        return this.playerStats.diseaseTreated >= req.count;
        
      case 'weatherSurvival':
        return this.playerStats.weatherSurvived >= req.count;
        
      case 'earlyPlanting':
        return this.playerStats.earlyPlantings >= req.count;
        
      case 'fieldUtilization':
        return this.playerStats.fieldUtilizationDays >= req.count;
        
      case 'speedHarvest':
        const recentHarvests = this.playerStats.speedHarvests.filter(
          time => Date.now() - time < req.timeLimit
        );
        return recentHarvests.length >= req.count;
        
      default:
        return false;
    }
  }

  // Unlock achievement
  unlockAchievement(achievementId) {
    if (this.unlockedAchievements.has(achievementId)) return;
    
    const achievement = achievements[achievementId];
    if (!achievement) return;
    
    this.unlockedAchievements.add(achievementId);
    
    // Add rewards
    this.pendingRewards.push({
      type: 'achievement',
      achievement,
      reward: achievement.reward
    });
    
    // Apply XP reward
    if (achievement.reward.xp) {
      this.addXP(achievement.reward.xp, 'achievement');
    }
  }

  // Get achievement progress
  getAchievementProgress(achievementId) {
    const achievement = achievements[achievementId];
    if (!achievement) return 0;
    
    if (this.unlockedAchievements.has(achievementId)) return 100;
    
    const req = achievement.requirement;
    let current = 0;
    
    switch (req.type) {
      case 'harvest':
        current = this.playerStats.totalHarvests;
        break;
      case 'money':
        current = this.playerStats.totalMoney;
        break;
      case 'fields':
        current = this.playerStats.fieldsOwned;
        break;
      case 'equipmentTypes':
        current = this.playerStats.equipmentOwned.size;
        break;
      case 'cropTypes':
        current = this.playerStats.cropsGrown.size;
        break;
      case 'diseaseTreatment':
        current = this.playerStats.diseaseTreated;
        break;
      case 'weatherSurvival':
        current = this.playerStats.weatherSurvived;
        break;
      case 'earlyPlanting':
        current = this.playerStats.earlyPlantings;
        break;
      case 'fieldUtilization':
        current = this.playerStats.fieldUtilizationDays;
        break;
    }
    
    return Math.min(100, (current / req.count) * 100);
  }

  // Get pending rewards
  getPendingRewards() {
    const rewards = [...this.pendingRewards];
    this.pendingRewards = [];
    return rewards;
  }

  // Get player level info
  getLevelInfo() {
    const currentLevelData = levels[this.currentLevel];
    const nextLevelData = levels[this.currentLevel + 1];
    
    return {
      level: this.currentLevel,
      xp: this.currentXP,
      title: currentLevelData?.title || 'Farmer',
      xpToNext: nextLevelData ? nextLevelData.xpRequired - this.currentXP : 0,
      xpForNext: nextLevelData?.xpRequired || 0,
      unlocks: currentLevelData?.unlocks || []
    };
  }

  // Get achievements by category
  getAchievementsByCategory(category) {
    return Object.values(achievements)
      .filter(a => a.category === category)
      .map(a => ({
        ...a,
        unlocked: this.unlockedAchievements.has(a.id),
        progress: this.getAchievementProgress(a.id)
      }));
  }

  // Get all unlocked achievements
  getUnlockedAchievements() {
    return Array.from(this.unlockedAchievements).map(id => achievements[id]);
  }
}

// Global achievement system instance
export const achievementSystem = new AchievementSystem();
