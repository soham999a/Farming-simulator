// 🌱 ADVANCED FIELD MANAGEMENT SYSTEM

export const soilTypes = {
  clay: {
    id: 'clay',
    name: 'Clay Soil',
    emoji: '🟤',
    description: 'Heavy soil, retains water well',
    waterRetention: 1.4,
    drainageRate: 0.6,
    nutrientRetention: 1.3,
    workability: 0.7,
    bestCrops: ['potato', 'wheat'],
    color: '#8B4513'
  },
  sandy: {
    id: 'sandy',
    name: 'Sandy Soil',
    emoji: '🟨',
    description: 'Light soil, drains quickly',
    waterRetention: 0.6,
    drainageRate: 1.5,
    nutrientRetention: 0.7,
    workability: 1.3,
    bestCrops: ['carrot', 'lettuce'],
    color: '#F4A460'
  },
  loam: {
    id: 'loam',
    name: 'Loam Soil',
    emoji: '🟫',
    description: 'Perfect balanced soil',
    waterRetention: 1.0,
    drainageRate: 1.0,
    nutrientRetention: 1.0,
    workability: 1.0,
    bestCrops: ['tomato', 'corn'],
    color: '#8B4513'
  },
  silt: {
    id: 'silt',
    name: 'Silt Soil',
    emoji: '🟩',
    description: 'Fine particles, good fertility',
    waterRetention: 1.2,
    drainageRate: 0.8,
    nutrientRetention: 1.4,
    workability: 0.9,
    bestCrops: ['wheat', 'corn'],
    color: '#556B2F'
  }
};

export const fieldUpgrades = {
  drainage: {
    id: 'drainage',
    name: 'Drainage System',
    emoji: '🚰',
    description: 'Improves water management',
    cost: 1500,
    effects: {
      drainageRate: 1.3,
      diseaseReduction: 0.2,
      waterloggingPrevention: true
    },
    unlockLevel: 3
  },
  soilAmendment: {
    id: 'soilAmendment',
    name: 'Soil Amendment',
    emoji: '🌿',
    description: 'Improves soil structure',
    cost: 2000,
    effects: {
      soilQuality: 2,
      nutrientRetention: 1.2,
      workability: 1.1
    },
    unlockLevel: 4
  },
  windbreak: {
    id: 'windbreak',
    name: 'Windbreak Trees',
    emoji: '🌳',
    description: 'Protects from wind damage',
    cost: 1200,
    effects: {
      windProtection: true,
      microclimateBonus: 1.1,
      erosionPrevention: true
    },
    unlockLevel: 2
  },
  terracing: {
    id: 'terracing',
    name: 'Terracing',
    emoji: '🏔️',
    description: 'Prevents erosion on slopes',
    cost: 3000,
    effects: {
      erosionPrevention: true,
      waterRetention: 1.4,
      usableArea: 1.2
    },
    unlockLevel: 6
  },
  compostBin: {
    id: 'compostBin',
    name: 'Compost System',
    emoji: '♻️',
    description: 'Recycles organic matter',
    cost: 800,
    effects: {
      organicMatter: 1.5,
      soilHealth: 1.3,
      costReduction: 0.8
    },
    unlockLevel: 1
  }
};

export const cropRotationPlans = {
  threeYear: {
    id: 'threeYear',
    name: 'Three-Year Rotation',
    description: 'Legumes → Grains → Root crops',
    cycles: [
      { crops: ['soybean'], benefits: { nitrogen: 2, soilHealth: 1.2 } },
      { crops: ['wheat', 'corn'], benefits: { yield: 1.3 } },
      { crops: ['potato', 'carrot'], benefits: { soilStructure: 1.2 } }
    ],
    bonus: { soilQuality: 1.5, diseaseReduction: 0.3 }
  },
  fourYear: {
    id: 'fourYear',
    name: 'Four-Year Rotation',
    description: 'Advanced sustainable rotation',
    cycles: [
      { crops: ['legumes'], benefits: { nitrogen: 2.5 } },
      { crops: ['leafy'], benefits: { organicMatter: 1.3 } },
      { crops: ['grains'], benefits: { structure: 1.2 } },
      { crops: ['root'], benefits: { deepTillage: 1.4 } }
    ],
    bonus: { soilQuality: 2.0, diseaseReduction: 0.4, yieldBonus: 1.2 }
  }
};

export class FieldManagementSystem {
  constructor() {
    this.fieldData = new Map(); // fieldId -> detailed field data
    this.rotationPlans = new Map(); // fieldId -> rotation plan
    this.soilHistory = new Map(); // fieldId -> soil quality history
    this.lastCropHistory = new Map(); // fieldId -> [last 5 crops]
  }

  // Initialize field with detailed properties
  initializeField(fieldId, baseField) {
    const soilTypeKeys = Object.keys(soilTypes);
    const randomSoilType = soilTypeKeys[Math.floor(Math.random() * soilTypeKeys.length)];
    
    const fieldData = {
      ...baseField,
      soilType: randomSoilType,
      soilQuality: Math.random() * 3 + 5, // 5-8 initial quality
      moisture: Math.random() * 30 + 40, // 40-70% initial moisture
      nutrients: {
        nitrogen: Math.random() * 40 + 30, // 30-70
        phosphorus: Math.random() * 40 + 30,
        potassium: Math.random() * 40 + 30,
        organicMatter: Math.random() * 20 + 10 // 10-30%
      },
      pH: Math.random() * 2 + 6, // 6-8 pH
      compaction: Math.random() * 30, // 0-30% compaction
      erosion: 0,
      upgrades: [],
      lastTilled: null,
      lastFertilized: null,
      lastWatered: null,
      cropHistory: [],
      diseaseHistory: [],
      yieldHistory: []
    };

    this.fieldData.set(fieldId, fieldData);
    this.soilHistory.set(fieldId, [fieldData.soilQuality]);
    this.lastCropHistory.set(fieldId, []);
    
    return fieldData;
  }

  // Get detailed field information
  getFieldData(fieldId) {
    return this.fieldData.get(fieldId);
  }

  // Update field after crop cycle
  updateFieldAfterHarvest(fieldId, cropType, cropYield, diseaseOccurred = false) {
    const field = this.fieldData.get(fieldId);
    if (!field) return;

    // Update crop history
    field.cropHistory.push({
      crop: cropType,
      harvestedAt: Date.now(),
      yield: cropYield,
      diseaseOccurred
    });
    
    // Keep only last 10 crops
    if (field.cropHistory.length > 10) {
      field.cropHistory.shift();
    }

    // Update last crop history for rotation
    const lastCrops = this.lastCropHistory.get(fieldId);
    lastCrops.push(cropType);
    if (lastCrops.length > 5) lastCrops.shift();

    // Degrade soil quality based on crop
    const degradation = this.calculateSoilDegradation(cropType, field);
    field.soilQuality = Math.max(1, field.soilQuality - degradation);

    // Reduce nutrients
    field.nutrients.nitrogen = Math.max(0, field.nutrients.nitrogen - Math.random() * 15 - 10);
    field.nutrients.phosphorus = Math.max(0, field.nutrients.phosphorus - Math.random() * 10 - 5);
    field.nutrients.potassium = Math.max(0, field.nutrients.potassium - Math.random() * 10 - 5);
    field.nutrients.organicMatter = Math.max(0, field.nutrients.organicMatter - Math.random() * 3 - 1);

    // Increase compaction
    field.compaction = Math.min(100, field.compaction + Math.random() * 5 + 2);

    // Update soil history
    const soilHistory = this.soilHistory.get(fieldId);
    soilHistory.push(field.soilQuality);
    if (soilHistory.length > 50) soilHistory.shift();

    // Check for rotation benefits
    this.applyRotationBenefits(fieldId);
  }

  // Calculate soil degradation based on crop
  calculateSoilDegradation(cropType, field) {
    const baseDegradation = {
      wheat: 0.3,
      corn: 0.4,
      potato: 0.5,
      carrot: 0.3,
      tomato: 0.4,
      lettuce: 0.2
    };

    let degradation = baseDegradation[cropType] || 0.3;

    // Soil type affects degradation
    const soilType = soilTypes[field.soilType];
    if (soilType.bestCrops.includes(cropType)) {
      degradation *= 0.7; // Less degradation for suitable crops
    }

    // Compaction increases degradation
    degradation *= (1 + field.compaction / 200);

    return degradation;
  }

  // Apply crop rotation benefits
  applyRotationBenefits(fieldId) {
    const lastCrops = this.lastCropHistory.get(fieldId);
    const field = this.fieldData.get(fieldId);
    
    if (lastCrops.length < 3) return;

    // Check for beneficial rotations
    const recent3 = lastCrops.slice(-3);
    
    // Legume → Grain rotation (nitrogen fixation)
    if (recent3[0] === 'soybean' && ['wheat', 'corn'].includes(recent3[1])) {
      field.nutrients.nitrogen += 20;
      field.soilQuality += 0.2;
    }

    // Avoid monoculture penalty
    const uniqueCrops = new Set(recent3);
    if (uniqueCrops.size === 1) {
      // Monoculture penalty
      field.soilQuality -= 0.5;
      field.nutrients.nitrogen -= 10;
      field.nutrients.phosphorus -= 5;
    } else if (uniqueCrops.size === 3) {
      // Diversity bonus
      field.soilQuality += 0.3;
      field.nutrients.organicMatter += 2;
    }
  }

  // Install field upgrade
  installUpgrade(fieldId, upgradeId, playerMoney, playerLevel) {
    const field = this.fieldData.get(fieldId);
    const upgrade = fieldUpgrades[upgradeId];
    
    if (!field || !upgrade) {
      return { success: false, message: "Invalid field or upgrade" };
    }

    if (playerLevel < upgrade.unlockLevel) {
      return { success: false, message: `Unlock at level ${upgrade.unlockLevel}` };
    }

    if (playerMoney < upgrade.cost) {
      return { success: false, message: `Need ₹${upgrade.cost}` };
    }

    if (field.upgrades.includes(upgradeId)) {
      return { success: false, message: "Upgrade already installed" };
    }

    // Install upgrade
    field.upgrades.push(upgradeId);

    // Apply immediate effects
    if (upgrade.effects.soilQuality) {
      field.soilQuality += upgrade.effects.soilQuality;
    }

    return {
      success: true,
      cost: upgrade.cost,
      message: `Installed ${upgrade.name}`
    };
  }

  // Till field
  tillField(fieldId, playerMoney) {
    const field = this.fieldData.get(fieldId);
    if (!field) return { success: false, message: "Field not found" };

    const cost = 100;
    if (playerMoney < cost) {
      return { success: false, message: `Need ₹${cost}` };
    }

    // Reduce compaction
    field.compaction = Math.max(0, field.compaction - 30);
    
    // Slight soil quality improvement
    field.soilQuality += 0.1;
    
    // Mix nutrients
    const avgNutrient = (field.nutrients.nitrogen + field.nutrients.phosphorus + field.nutrients.potassium) / 3;
    field.nutrients.nitrogen = (field.nutrients.nitrogen + avgNutrient) / 2;
    field.nutrients.phosphorus = (field.nutrients.phosphorus + avgNutrient) / 2;
    field.nutrients.potassium = (field.nutrients.potassium + avgNutrient) / 2;

    field.lastTilled = Date.now();

    return {
      success: true,
      cost,
      message: "Field tilled successfully"
    };
  }

  // Apply fertilizer
  applyFertilizer(fieldId, fertilizerType, playerMoney) {
    const field = this.fieldData.get(fieldId);
    if (!field) return { success: false, message: "Field not found" };

    const fertilizers = {
      basic: { cost: 50, nitrogen: 15, phosphorus: 10, potassium: 10 },
      premium: { cost: 100, nitrogen: 25, phosphorus: 20, potassium: 20, organicMatter: 3 },
      organic: { cost: 80, nitrogen: 12, phosphorus: 8, potassium: 8, organicMatter: 8, soilHealth: 0.2 }
    };

    const fertilizer = fertilizers[fertilizerType];
    if (!fertilizer) return { success: false, message: "Invalid fertilizer type" };

    if (playerMoney < fertilizer.cost) {
      return { success: false, message: `Need ₹${fertilizer.cost}` };
    }

    // Apply nutrients
    field.nutrients.nitrogen = Math.min(100, field.nutrients.nitrogen + fertilizer.nitrogen);
    field.nutrients.phosphorus = Math.min(100, field.nutrients.phosphorus + fertilizer.phosphorus);
    field.nutrients.potassium = Math.min(100, field.nutrients.potassium + fertilizer.potassium);
    
    if (fertilizer.organicMatter) {
      field.nutrients.organicMatter = Math.min(50, field.nutrients.organicMatter + fertilizer.organicMatter);
    }
    
    if (fertilizer.soilHealth) {
      field.soilQuality += fertilizer.soilHealth;
    }

    field.lastFertilized = Date.now();

    return {
      success: true,
      cost: fertilizer.cost,
      message: `Applied ${fertilizerType} fertilizer`
    };
  }

  // Get field productivity score
  getFieldProductivity(fieldId) {
    const field = this.fieldData.get(fieldId);
    if (!field) return 0;

    let score = 0;

    // Soil quality (40% of score)
    score += (field.soilQuality / 10) * 40;

    // Nutrient levels (30% of score)
    const avgNutrients = (field.nutrients.nitrogen + field.nutrients.phosphorus + field.nutrients.potassium) / 3;
    score += (avgNutrients / 100) * 30;

    // Moisture (15% of score)
    const optimalMoisture = 70;
    const moistureScore = 100 - Math.abs(field.moisture - optimalMoisture);
    score += (moistureScore / 100) * 15;

    // Compaction penalty (10% of score)
    score += ((100 - field.compaction) / 100) * 10;

    // pH bonus/penalty (5% of score)
    const optimalPH = 7;
    const pHScore = 100 - Math.abs(field.pH - optimalPH) * 20;
    score += (pHScore / 100) * 5;

    return Math.max(0, Math.min(100, score));
  }

  // Get field recommendations
  getFieldRecommendations(fieldId) {
    const field = this.fieldData.get(fieldId);
    if (!field) return [];

    const recommendations = [];

    // Soil quality recommendations
    if (field.soilQuality < 5) {
      recommendations.push({
        type: 'critical',
        message: 'Soil quality is very poor. Consider soil amendment or letting field rest.',
        action: 'soilAmendment'
      });
    }

    // Nutrient recommendations
    if (field.nutrients.nitrogen < 30) {
      recommendations.push({
        type: 'warning',
        message: 'Nitrogen levels are low. Apply nitrogen-rich fertilizer.',
        action: 'fertilize'
      });
    }

    // Compaction recommendations
    if (field.compaction > 60) {
      recommendations.push({
        type: 'warning',
        message: 'Soil is heavily compacted. Till the field to improve structure.',
        action: 'till'
      });
    }

    // Moisture recommendations
    if (field.moisture < 40) {
      recommendations.push({
        type: 'info',
        message: 'Soil moisture is low. Consider watering or installing irrigation.',
        action: 'water'
      });
    }

    // Crop rotation recommendations
    const lastCrops = this.lastCropHistory.get(fieldId);
    if (lastCrops.length >= 2) {
      const recent = lastCrops.slice(-2);
      if (recent[0] === recent[1]) {
        recommendations.push({
          type: 'info',
          message: 'Consider crop rotation to improve soil health and prevent disease.',
          action: 'rotate'
        });
      }
    }

    return recommendations;
  }

  // Get soil type information
  getSoilTypeInfo(fieldId) {
    const field = this.fieldData.get(fieldId);
    if (!field) return null;

    return soilTypes[field.soilType];
  }

  // Calculate field effects on crop growth
  getFieldEffectsOnCrop(fieldId, cropType) {
    const field = this.fieldData.get(fieldId);
    if (!field) return { growthMultiplier: 1, yieldMultiplier: 1 };

    const soilType = soilTypes[field.soilType];
    let growthMultiplier = 1;
    let yieldMultiplier = 1;

    // Soil type compatibility
    if (soilType.bestCrops.includes(cropType)) {
      growthMultiplier *= 1.2;
      yieldMultiplier *= 1.3;
    }

    // Soil quality effects
    growthMultiplier *= (0.5 + (field.soilQuality / 20)); // 0.5x to 1.0x
    yieldMultiplier *= (0.6 + (field.soilQuality / 25)); // 0.6x to 1.0x

    // Nutrient effects
    const avgNutrients = (field.nutrients.nitrogen + field.nutrients.phosphorus + field.nutrients.potassium) / 3;
    yieldMultiplier *= (0.7 + (avgNutrients / 200)); // 0.7x to 1.2x

    // Moisture effects
    const moistureEffect = Math.max(0.3, Math.min(1.2, field.moisture / 60));
    growthMultiplier *= moistureEffect;

    // Compaction penalty
    const compactionPenalty = 1 - (field.compaction / 200);
    growthMultiplier *= compactionPenalty;
    yieldMultiplier *= compactionPenalty;

    // Upgrade bonuses
    field.upgrades.forEach(upgradeId => {
      const upgrade = fieldUpgrades[upgradeId];
      if (upgrade.effects.soilQuality) {
        yieldMultiplier *= 1.1;
      }
      if (upgrade.effects.nutrientRetention) {
        yieldMultiplier *= upgrade.effects.nutrientRetention;
      }
    });

    return {
      growthMultiplier: Math.max(0.1, growthMultiplier),
      yieldMultiplier: Math.max(0.1, yieldMultiplier)
    };
  }
}

// Global field management system instance
export const fieldManagementSystem = new FieldManagementSystem();
