// 🎮 MASTER GAME CONTROLLER - INTEGRATES ALL SYSTEMS

import { weatherSystem } from './WeatherSystem.js';
import { diseaseSystem } from './DiseaseSystem.js';
import { equipmentSystem } from './EquipmentSystem.js';
import { marketSystem } from './MarketSystem.js';
import { achievementSystem } from './AchievementSystem.js';
import { fieldManagementSystem } from './FieldManagementSystem.js';
import { createMultiplayerSystem } from './MultiplayerSystem.js';
import { visualEffectsSystem } from './VisualEffectsSystem.js';

export class GameController {
  constructor(playerId = 'player1') {
    this.playerId = playerId;
    this.isInitialized = false;
    this.gameSpeed = 1;
    this.isPaused = false;
    this.lastUpdate = Date.now();
    this.updateInterval = null;
    
    // Initialize all systems
    this.weather = weatherSystem;
    this.diseases = diseaseSystem;
    this.equipment = equipmentSystem;
    this.market = marketSystem;
    this.achievements = achievementSystem;
    this.fieldManagement = fieldManagementSystem;
    this.multiplayer = createMultiplayerSystem(playerId);
    this.visualEffects = visualEffectsSystem;
    
    // Game state
    this.gameState = {
      player: {
        id: playerId,
        name: `Farmer ${playerId}`,
        level: 1,
        xp: 0,
        money: 500,
        reputation: 0
      },
      farm: {
        name: "My Farm",
        fields: [],
        totalHarvests: 0,
        totalEarnings: 0
      },
      settings: {
        soundEnabled: true,
        effectsEnabled: true,
        autoSave: true,
        notifications: true
      }
    };
  }

  // Initialize the game
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🚜 Initializing Ultimate Farming Simulator...');
      
      // Initialize visual effects system
      this.visualEffects.initialize();
      
      // Initialize fields with advanced properties
      this.initializeFields();
      
      // Start game loop
      this.startGameLoop();
      
      // Initialize multiplayer (with error handling)
      try {
        await this.multiplayer.updateLeaderboard(this.gameState.player);
      } catch (error) {
        console.warn('Multiplayer initialization failed:', error);
      }
      
      this.isInitialized = true;
      console.log('✅ Game initialized successfully!');
      
      // Trigger welcome effect
      this.visualEffects.triggerParticleEffect('levelUp', { x: window.innerWidth / 2, y: window.innerHeight / 2 });
      
    } catch (error) {
      console.error('❌ Error initializing game:', error);
    }
  }

  // Initialize fields with advanced field management
  initializeFields() {
    for (let i = 1; i <= 3; i++) {
      const baseField = {
        fieldId: i,
        cropType: null,
        plantedAt: null,
        growthStage: null
      };
      
      const advancedField = this.fieldManagement.initializeField(i, baseField);
      this.gameState.farm.fields.push(advancedField);
    }
  }

  // Main game loop
  startGameLoop() {
    this.updateInterval = setInterval(() => {
      if (!this.isPaused) {
        this.update();
      }
    }, 1000 / this.gameSpeed); // Update based on game speed
  }

  // Update all game systems
  update() {
    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;

    try {
      // Update weather system
      this.weather.update();
      
      // Update market prices
      this.market.updatePrices(this.weather.currentSeason, {
        harvested: this.getRecentHarvests()
      });
      
      // Update crop growth with all modifiers
      this.updateCropGrowth();
      
      // Check for diseases
      this.checkForDiseases();
      
      // Spread existing diseases
      this.diseases.spreadDisease(this.gameState.farm.fields);
      
      // Degrade equipment
      this.equipment.degradeEquipment();
      
      // Update achievements
      this.updateAchievements();
      
      // Clean up expired data
      this.diseases.cleanup();
      this.multiplayer.cleanup();
      
      // Auto-save every 30 seconds
      if (this.gameState.settings.autoSave && now % 30000 < 1000) {
        this.saveGame();
      }
      
    } catch (error) {
      console.error('Error in game update:', error);
    }
  }

  // Update crop growth with all system modifiers
  updateCropGrowth() {
    this.gameState.farm.fields.forEach(field => {
      if (!field.cropType || !field.plantedAt) return;

      // Get all modifiers
      const weatherEffects = this.weather.getCurrentEffects();
      const fieldEffects = this.fieldManagement.getFieldEffectsOnCrop(field.fieldId, field.cropType);
      const equipmentEffects = this.equipment.getFieldEffects(field.fieldId);
      const diseaseEffects = this.diseases.getDiseaseEffects(field.fieldId);

      // Calculate combined growth multiplier
      let growthMultiplier = 1;
      growthMultiplier *= weatherEffects.weather.growthMultiplier;
      growthMultiplier *= fieldEffects.growthMultiplier;
      growthMultiplier *= equipmentEffects.growthBonus;
      growthMultiplier *= diseaseEffects.growthMultiplier;

      // Apply seasonal crop bonus
      if (weatherEffects.season.cropBonus && weatherEffects.season.cropBonus[field.cropType]) {
        growthMultiplier *= weatherEffects.season.cropBonus[field.cropType];
      }

      // Update growth progress
      const baseGrowTime = this.getCropGrowTime(field.cropType);
      const adjustedGrowTime = baseGrowTime / growthMultiplier;
      const elapsed = Date.now() - field.plantedAt;
      const progress = Math.min(100, (elapsed / adjustedGrowTime) * 100);

      // Update growth stage
      let stage = 'planted';
      if (progress >= 100) stage = 'ready';
      else if (progress >= 90) stage = 'ripening';
      else if (progress >= 75) stage = 'flowering';
      else if (progress >= 50) stage = 'growing';
      else if (progress >= 20) stage = 'sprouting';

      field.growthStage = {
        stage,
        progress,
        timeRemaining: Math.max(0, adjustedGrowTime - elapsed)
      };

      // Trigger visual growth animation
      const fieldElement = document.querySelector(`[data-field-id="${field.fieldId}"] .crop-emoji`);
      if (fieldElement) {
        const stageIndex = ['planted', 'sprouting', 'growing', 'flowering', 'ripening', 'ready'].indexOf(stage);
        this.visualEffects.animateCropGrowth(fieldElement, stageIndex);
      }
    });
  }

  // Check for diseases
  checkForDiseases() {
    this.gameState.farm.fields.forEach(field => {
      if (!field.cropType) return;

      // Skip if field is protected
      if (this.diseases.isProtected(field.fieldId)) return;

      const disease = this.diseases.checkForDisease(field.fieldId, field.cropType, this.weather);
      if (disease) {
        // Trigger disease notification and effects
        this.showNotification(`⚠️ ${disease.name} detected in Field ${field.fieldId}!`, 'warning');
        
        const fieldElement = document.querySelector(`[data-field-id="${field.fieldId}"]`);
        if (fieldElement) {
          this.visualEffects.triggerParticleEffect('disease', 
            this.visualEffects.getElementPosition(fieldElement)
          );
        }
      }
    });
  }

  // Plant crop with all system integration
  async plantCrop(fieldId, cropType) {
    try {
      const field = this.gameState.farm.fields.find(f => f.fieldId === fieldId);
      if (!field || field.cropType) return { success: false, message: "Field unavailable" };

      // Check if crop is suitable for current season
      const weatherEffects = this.weather.getCurrentEffects();
      const crop = this.getCropData(cropType);
      
      // Check soil compatibility
      const fieldEffects = this.fieldManagement.getFieldEffectsOnCrop(fieldId, cropType);
      if (fieldEffects.growthMultiplier < 0.5) {
        return { success: false, message: "Soil not suitable for this crop" };
      }

      // Plant the crop
      field.cropType = cropType;
      field.plantedAt = Date.now();
      field.growthStage = {
        stage: 'planted',
        progress: 0,
        timeRemaining: this.getCropGrowTime(cropType)
      };

      // Update achievements
      this.achievements.updateStats('harvest', 0, { cropType, plantTime: Date.now() });

      // Trigger visual effects
      const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
      if (fieldElement) {
        this.visualEffects.triggerParticleEffect('plant', 
          this.visualEffects.getElementPosition(fieldElement)
        );
      }

      this.showNotification(`🌱 Planted ${crop.name} in Field ${fieldId}!`, 'success');
      
      return { success: true, message: `Planted ${crop.name}` };
      
    } catch (error) {
      console.error('Error planting crop:', error);
      return { success: false, message: "Error planting crop" };
    }
  }

  // Harvest crop with all system integration
  async harvestCrop(fieldId) {
    try {
      const field = this.gameState.farm.fields.find(f => f.fieldId === fieldId);
      if (!field || !field.cropType || field.growthStage?.stage !== 'ready') {
        return { success: false, message: "Crop not ready for harvest" };
      }

      const crop = this.getCropData(field.cropType);
      
      // Calculate yield with all modifiers
      const fieldEffects = this.fieldManagement.getFieldEffectsOnCrop(fieldId, field.cropType);
      const equipmentEffects = this.equipment.getFieldEffects(fieldId);
      const diseaseEffects = this.diseases.getDiseaseEffects(fieldId);
      const marketPrice = this.market.getPrice(field.cropType);

      let yieldMultiplier = 1;
      yieldMultiplier *= fieldEffects.yieldMultiplier;
      yieldMultiplier *= equipmentEffects.yieldBonus;
      yieldMultiplier *= diseaseEffects.yieldMultiplier;

      const finalYield = Math.round(crop.sellPrice * yieldMultiplier);
      const marketEarnings = Math.round(marketPrice * yieldMultiplier);

      // Add money
      this.gameState.player.money += marketEarnings;
      this.gameState.farm.totalEarnings += marketEarnings;
      this.gameState.farm.totalHarvests += 1;

      // Update field after harvest
      this.fieldManagement.updateFieldAfterHarvest(
        fieldId, 
        field.cropType, 
        finalYield, 
        this.diseases.getDiseaseEffects(fieldId).disease !== undefined
      );

      // Clear field
      field.cropType = null;
      field.plantedAt = null;
      field.growthStage = null;

      // Update achievements
      this.achievements.updateStats('harvest', 1, { 
        cropType: field.cropType, 
        yield: finalYield,
        harvestTime: Date.now()
      });
      this.achievements.updateStats('money', this.gameState.player.money);

      // Trigger visual effects
      const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
      if (fieldElement) {
        this.visualEffects.triggerParticleEffect('harvest', 
          this.visualEffects.getElementPosition(fieldElement)
        );
        
        this.visualEffects.createFloatingText(
          `+₹${marketEarnings}`, 
          this.visualEffects.getElementPosition(fieldElement),
          '#10b981',
          '20px'
        );
      }

      // Animate money counter
      const moneyElement = document.querySelector('.money-display');
      if (moneyElement) {
        this.visualEffects.animateMoneyChange(moneyElement, 
          this.gameState.player.money - marketEarnings, 
          this.gameState.player.money
        );
      }

      this.showNotification(`🌾 Harvested ${crop.name} for ₹${marketEarnings}!`, 'success');
      
      return { success: true, earnings: marketEarnings };
      
    } catch (error) {
      console.error('Error harvesting crop:', error);
      return { success: false, message: "Error harvesting crop" };
    }
  }

  // Helper methods
  getCropData(cropType) {
    const crops = {
      wheat: { name: "Wheat", sellPrice: 40 },
      corn: { name: "Corn", sellPrice: 70 },
      potato: { name: "Potato", sellPrice: 100 },
      carrot: { name: "Carrot", sellPrice: 55 },
      tomato: { name: "Tomato", sellPrice: 85 },
      lettuce: { name: "Lettuce", sellPrice: 30 }
    };
    return crops[cropType];
  }

  getCropGrowTime(cropType) {
    const growTimes = {
      wheat: 12000,
      corn: 18000,
      potato: 20000,
      carrot: 15000,
      tomato: 16000,
      lettuce: 10000
    };
    return growTimes[cropType];
  }

  getRecentHarvests() {
    // Return recent harvest data for market system
    return {};
  }

  updateAchievements() {
    // Check and update achievements based on current game state
    this.achievements.updateStats('money', this.gameState.player.money);
    this.achievements.updateStats('fields', this.gameState.farm.fields.length);
  }

  showNotification(message, type = 'info') {
    if (!this.gameState.settings.notifications) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Save game state
  saveGame() {
    try {
      const saveData = {
        ...this.gameState,
        weather: this.weather.getCurrentEffects(),
        achievements: this.achievements.getUnlockedAchievements(),
        equipment: this.equipment.getOwnedEquipment(),
        savedAt: Date.now()
      };
      
      localStorage.setItem('farmingSimulatorSave', JSON.stringify(saveData));
      console.log('💾 Game saved successfully');
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }

  // Load game state
  loadGame() {
    try {
      const saveData = localStorage.getItem('farmingSimulatorSave');
      if (saveData) {
        const parsed = JSON.parse(saveData);
        this.gameState = { ...this.gameState, ...parsed };
        console.log('📁 Game loaded successfully');
        return true;
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
    return false;
  }

  // Game controls
  pauseGame() {
    this.isPaused = true;
  }

  resumeGame() {
    this.isPaused = false;
  }

  setGameSpeed(speed) {
    this.gameSpeed = speed;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.startGameLoop();
    }
  }

  // Get current game state
  getGameState() {
    return {
      ...this.gameState,
      weather: this.weather.getCurrentEffects(),
      market: {
        prices: Object.keys(this.getCropData('wheat')).reduce((acc, crop) => {
          acc[crop] = this.market.getPrice(crop);
          return acc;
        }, {}),
        events: this.market.getActiveEvents()
      },
      achievements: this.achievements.getLevelInfo(),
      diseases: this.diseases.getActiveDiseases()
    };
  }
}

// Global game controller instance
export const gameController = new GameController();
