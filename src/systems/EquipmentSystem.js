// 🚜 ADVANCED EQUIPMENT & VEHICLE SYSTEM

export const equipment = {
  // TRACTORS
  basicTractor: {
    id: 'basicTractor',
    name: 'Basic Tractor',
    emoji: '🚜',
    type: 'tractor',
    description: 'Speeds up planting and harvesting',
    cost: 2000,
    effects: {
      plantingSpeed: 1.5,
      harvestingSpeed: 1.5,
      fuelConsumption: 10 // per use
    },
    durability: 100,
    maintenanceCost: 50,
    unlockLevel: 1
  },
  advancedTractor: {
    id: 'advancedTractor',
    name: 'Advanced Tractor',
    emoji: '🚜',
    type: 'tractor', 
    description: 'High-efficiency farming machine',
    cost: 5000,
    effects: {
      plantingSpeed: 2.0,
      harvestingSpeed: 2.0,
      fuelConsumption: 8
    },
    durability: 150,
    maintenanceCost: 100,
    unlockLevel: 5
  },
  
  // IRRIGATION SYSTEMS
  sprinklerSystem: {
    id: 'sprinklerSystem',
    name: 'Sprinkler System',
    emoji: '💧',
    type: 'irrigation',
    description: 'Automatic watering for fields',
    cost: 1500,
    effects: {
      autoWatering: true,
      waterEfficiency: 1.3,
      growthBonus: 1.2
    },
    durability: 80,
    maintenanceCost: 30,
    unlockLevel: 3
  },
  dripIrrigation: {
    id: 'dripIrrigation',
    name: 'Drip Irrigation',
    emoji: '💧',
    type: 'irrigation',
    description: 'Efficient water delivery system',
    cost: 3000,
    effects: {
      autoWatering: true,
      waterEfficiency: 1.8,
      growthBonus: 1.4,
      diseaseReduction: 0.3
    },
    durability: 120,
    maintenanceCost: 60,
    unlockLevel: 7
  },

  // FERTILIZER EQUIPMENT
  fertilizerSpreader: {
    id: 'fertilizerSpreader',
    name: 'Fertilizer Spreader',
    emoji: '🌿',
    type: 'fertilizer',
    description: 'Evenly distributes fertilizer',
    cost: 1200,
    effects: {
      fertilizerEfficiency: 1.5,
      yieldBonus: 1.3,
      applicationSpeed: 2.0
    },
    durability: 90,
    maintenanceCost: 40,
    unlockLevel: 2
  },
  precisionSpreader: {
    id: 'precisionSpreader',
    name: 'Precision Spreader',
    emoji: '🌿',
    type: 'fertilizer',
    description: 'GPS-guided fertilizer application',
    cost: 4000,
    effects: {
      fertilizerEfficiency: 2.2,
      yieldBonus: 1.6,
      applicationSpeed: 3.0,
      soilHealthBonus: 1.2
    },
    durability: 140,
    maintenanceCost: 80,
    unlockLevel: 8
  },

  // HARVESTING EQUIPMENT
  combineHarvester: {
    id: 'combineHarvester',
    name: 'Combine Harvester',
    emoji: '🌾',
    type: 'harvester',
    description: 'Automated crop harvesting',
    cost: 8000,
    effects: {
      harvestingSpeed: 3.0,
      yieldBonus: 1.4,
      autoHarvest: true,
      fuelConsumption: 15
    },
    durability: 200,
    maintenanceCost: 150,
    unlockLevel: 10
  },

  // SOIL EQUIPMENT
  cultivator: {
    id: 'cultivator',
    name: 'Soil Cultivator',
    emoji: '🔨',
    type: 'soil',
    description: 'Improves soil quality',
    cost: 1800,
    effects: {
      soilImprovement: 2.0,
      preparationSpeed: 1.8,
      durabilityBonus: 1.1
    },
    durability: 100,
    maintenanceCost: 45,
    unlockLevel: 4
  },

  // PROTECTION EQUIPMENT
  greenhouse: {
    id: 'greenhouse',
    name: 'Greenhouse',
    emoji: '🏠',
    type: 'protection',
    description: 'Weather-protected growing',
    cost: 6000,
    effects: {
      weatherProtection: true,
      growthBonus: 1.5,
      diseaseReduction: 0.5,
      yearRoundGrowing: true
    },
    durability: 300,
    maintenanceCost: 100,
    unlockLevel: 6
  }
};

export const consumables = {
  fuel: {
    id: 'fuel',
    name: 'Diesel Fuel',
    emoji: '⛽',
    description: 'Powers tractors and machinery',
    costPerUnit: 5,
    stackSize: 100
  },
  fertilizer: {
    id: 'fertilizer',
    name: 'Premium Fertilizer',
    emoji: '🌿',
    description: 'Boosts crop growth and yield',
    costPerUnit: 8,
    stackSize: 50,
    effects: {
      growthBonus: 1.3,
      yieldBonus: 1.2
    }
  },
  pesticide: {
    id: 'pesticide',
    name: 'Pesticide',
    emoji: '💨',
    description: 'Prevents and treats pest infestations',
    costPerUnit: 12,
    stackSize: 30
  },
  seeds: {
    id: 'seeds',
    name: 'Premium Seeds',
    emoji: '🌱',
    description: 'High-quality crop seeds',
    costPerUnit: 3,
    stackSize: 200,
    effects: {
      growthSpeed: 1.1,
      diseaseResistance: 0.2
    }
  }
};

export class EquipmentSystem {
  constructor() {
    this.ownedEquipment = new Map(); // equipmentId -> { quantity, condition, lastMaintenance }
    this.fieldEquipment = new Map(); // fieldId -> [equipmentIds]
    this.inventory = new Map(); // consumableId -> quantity
    this.totalMaintenanceCost = 0;
  }

  // Purchase equipment
  buyEquipment(equipmentId, playerMoney, playerLevel) {
    const item = equipment[equipmentId];
    if (!item) return { success: false, message: "Equipment not found" };

    if (playerLevel < item.unlockLevel) {
      return { success: false, message: `Unlock at level ${item.unlockLevel}` };
    }

    if (playerMoney < item.cost) {
      return { success: false, message: `Need ₹${item.cost}` };
    }

    // Add to owned equipment
    if (this.ownedEquipment.has(equipmentId)) {
      const current = this.ownedEquipment.get(equipmentId);
      current.quantity += 1;
    } else {
      this.ownedEquipment.set(equipmentId, {
        quantity: 1,
        condition: 100,
        lastMaintenance: Date.now()
      });
    }

    return {
      success: true,
      cost: item.cost,
      message: `Purchased ${item.name}!`
    };
  }

  // Install equipment on field
  installEquipment(equipmentId, fieldId) {
    if (!this.ownedEquipment.has(equipmentId)) {
      return { success: false, message: "Equipment not owned" };
    }

    const owned = this.ownedEquipment.get(equipmentId);
    if (owned.quantity <= 0) {
      return { success: false, message: "No available equipment" };
    }

    // Add to field
    if (!this.fieldEquipment.has(fieldId)) {
      this.fieldEquipment.set(fieldId, []);
    }
    
    const fieldEq = this.fieldEquipment.get(fieldId);
    if (!fieldEq.includes(equipmentId)) {
      fieldEq.push(equipmentId);
      owned.quantity -= 1;
    }

    return {
      success: true,
      message: `Installed ${equipment[equipmentId].name} on field ${fieldId}`
    };
  }

  // Get equipment effects for a field
  getFieldEffects(fieldId) {
    const fieldEq = this.fieldEquipment.get(fieldId) || [];
    const effects = {
      plantingSpeed: 1,
      harvestingSpeed: 1,
      growthBonus: 1,
      yieldBonus: 1,
      waterEfficiency: 1,
      fertilizerEfficiency: 1,
      diseaseReduction: 0,
      weatherProtection: false,
      autoWatering: false,
      autoHarvest: false
    };

    fieldEq.forEach(equipmentId => {
      const item = equipment[equipmentId];
      const condition = this.getEquipmentCondition(equipmentId);
      const efficiency = condition / 100; // Reduced efficiency when damaged

      if (item.effects.plantingSpeed) {
        effects.plantingSpeed *= (item.effects.plantingSpeed * efficiency);
      }
      if (item.effects.harvestingSpeed) {
        effects.harvestingSpeed *= (item.effects.harvestingSpeed * efficiency);
      }
      if (item.effects.growthBonus) {
        effects.growthBonus *= (item.effects.growthBonus * efficiency);
      }
      if (item.effects.yieldBonus) {
        effects.yieldBonus *= (item.effects.yieldBonus * efficiency);
      }
      if (item.effects.waterEfficiency) {
        effects.waterEfficiency *= (item.effects.waterEfficiency * efficiency);
      }
      if (item.effects.fertilizerEfficiency) {
        effects.fertilizerEfficiency *= (item.effects.fertilizerEfficiency * efficiency);
      }
      if (item.effects.diseaseReduction) {
        effects.diseaseReduction += (item.effects.diseaseReduction * efficiency);
      }
      if (item.effects.weatherProtection) {
        effects.weatherProtection = true;
      }
      if (item.effects.autoWatering) {
        effects.autoWatering = true;
      }
      if (item.effects.autoHarvest) {
        effects.autoHarvest = true;
      }
    });

    return effects;
  }

  // Get equipment condition (0-100)
  getEquipmentCondition(equipmentId) {
    const owned = this.ownedEquipment.get(equipmentId);
    if (!owned) return 0;
    return Math.max(0, owned.condition);
  }

  // Degrade equipment over time
  degradeEquipment() {
    for (const [equipmentId, owned] of this.ownedEquipment) {
      const item = equipment[equipmentId];
      const degradeRate = 100 / item.durability; // Condition lost per use
      owned.condition = Math.max(0, owned.condition - degradeRate);
    }
  }

  // Maintain equipment
  maintainEquipment(equipmentId, playerMoney) {
    const owned = this.ownedEquipment.get(equipmentId);
    const item = equipment[equipmentId];
    
    if (!owned || !item) return { success: false, message: "Equipment not found" };

    const cost = item.maintenanceCost;
    if (playerMoney < cost) {
      return { success: false, message: `Need ₹${cost} for maintenance` };
    }

    owned.condition = 100;
    owned.lastMaintenance = Date.now();

    return {
      success: true,
      cost,
      message: `Maintained ${item.name}`
    };
  }

  // Buy consumables
  buyConsumable(consumableId, quantity, playerMoney) {
    const item = consumables[consumableId];
    if (!item) return { success: false, message: "Item not found" };

    const cost = item.costPerUnit * quantity;
    if (playerMoney < cost) {
      return { success: false, message: `Need ₹${cost}` };
    }

    const current = this.inventory.get(consumableId) || 0;
    this.inventory.set(consumableId, current + quantity);

    return {
      success: true,
      cost,
      message: `Bought ${quantity} ${item.name}`
    };
  }

  // Use consumable
  useConsumable(consumableId, quantity = 1) {
    const current = this.inventory.get(consumableId) || 0;
    if (current < quantity) {
      return { success: false, message: "Not enough items" };
    }

    this.inventory.set(consumableId, current - quantity);
    return { success: true };
  }

  // Get owned equipment list
  getOwnedEquipment() {
    return Array.from(this.ownedEquipment.entries()).map(([id, data]) => ({
      ...equipment[id],
      id,
      ...data
    }));
  }

  // Get inventory
  getInventory() {
    return Array.from(this.inventory.entries()).map(([id, quantity]) => ({
      ...consumables[id],
      id,
      quantity
    }));
  }
}

// Global equipment system instance
export const equipmentSystem = new EquipmentSystem();
