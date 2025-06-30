// 🐛 ADVANCED DISEASE & PEST SYSTEM

export const diseases = {
  aphids: {
    id: 'aphids',
    name: 'Aphid Infestation',
    emoji: '🐛',
    description: 'Small insects sucking plant juices',
    growthPenalty: 0.3,
    yieldPenalty: 0.2,
    spreadChance: 0.15,
    affectedCrops: ['lettuce', 'tomato', 'carrot'],
    treatment: 'pesticide',
    treatmentCost: 50,
    severity: 'mild'
  },
  blight: {
    id: 'blight',
    name: 'Crop Blight',
    emoji: '🦠',
    description: 'Fungal disease causing brown spots',
    growthPenalty: 0.5,
    yieldPenalty: 0.4,
    spreadChance: 0.25,
    affectedCrops: ['potato', 'tomato'],
    treatment: 'fungicide',
    treatmentCost: 75,
    severity: 'severe'
  },
  rust: {
    id: 'rust',
    name: 'Crop Rust',
    emoji: '🟤',
    description: 'Orange-brown fungal infection',
    growthPenalty: 0.4,
    yieldPenalty: 0.3,
    spreadChance: 0.2,
    affectedCrops: ['wheat', 'corn'],
    treatment: 'fungicide',
    treatmentCost: 60,
    severity: 'moderate'
  },
  rootRot: {
    id: 'rootRot',
    name: 'Root Rot',
    emoji: '🪱',
    description: 'Soil-borne disease affecting roots',
    growthPenalty: 0.6,
    yieldPenalty: 0.5,
    spreadChance: 0.1,
    affectedCrops: ['carrot', 'potato'],
    treatment: 'soilTreatment',
    treatmentCost: 100,
    severity: 'severe'
  },
  locusts: {
    id: 'locusts',
    name: 'Locust Swarm',
    emoji: '🦗',
    description: 'Devastating swarm eating crops',
    growthPenalty: 0.8,
    yieldPenalty: 0.7,
    spreadChance: 0.3,
    affectedCrops: ['wheat', 'corn', 'lettuce'],
    treatment: 'pesticide',
    treatmentCost: 150,
    severity: 'catastrophic'
  },
  mildew: {
    id: 'mildew',
    name: 'Powdery Mildew',
    emoji: '☁️',
    description: 'White powdery fungal growth',
    growthPenalty: 0.25,
    yieldPenalty: 0.15,
    spreadChance: 0.12,
    affectedCrops: ['lettuce', 'tomato'],
    treatment: 'fungicide',
    treatmentCost: 40,
    severity: 'mild'
  }
};

export const treatments = {
  pesticide: {
    id: 'pesticide',
    name: 'Pesticide Spray',
    emoji: '💨',
    description: 'Eliminates insect pests',
    baseCost: 50,
    effectiveness: 0.9,
    preventionDuration: 5, // days
    sideEffects: {
      soilQuality: -0.1,
      environmentalImpact: 0.2
    }
  },
  fungicide: {
    id: 'fungicide', 
    name: 'Fungicide Treatment',
    emoji: '🧪',
    description: 'Treats fungal infections',
    baseCost: 75,
    effectiveness: 0.85,
    preventionDuration: 7,
    sideEffects: {
      soilQuality: -0.05,
      environmentalImpact: 0.1
    }
  },
  soilTreatment: {
    id: 'soilTreatment',
    name: 'Soil Treatment',
    emoji: '🌱',
    description: 'Improves soil health',
    baseCost: 100,
    effectiveness: 0.8,
    preventionDuration: 10,
    sideEffects: {
      soilQuality: 0.2, // Actually improves soil
      environmentalImpact: -0.1
    }
  },
  organicSpray: {
    id: 'organicSpray',
    name: 'Organic Spray',
    emoji: '🍃',
    description: 'Eco-friendly pest control',
    baseCost: 80,
    effectiveness: 0.7,
    preventionDuration: 3,
    sideEffects: {
      soilQuality: 0.05,
      environmentalImpact: -0.05
    }
  }
};

export class DiseaseSystem {
  constructor() {
    this.activeDiseases = new Map(); // fieldId -> disease info
    this.treatmentHistory = new Map(); // fieldId -> treatment info
    this.environmentalHealth = 100; // 0-100 scale
  }

  // Check if a field should get a disease
  checkForDisease(fieldId, cropType, weatherSystem) {
    // Skip if field already has disease
    if (this.activeDiseases.has(fieldId)) return null;

    // Base disease chance from weather
    let diseaseChance = weatherSystem.getDiseaseChance();
    
    // Increase chance based on environmental health
    diseaseChance *= (101 - this.environmentalHealth) / 100;
    
    // Check if disease occurs
    if (Math.random() > diseaseChance) return null;

    // Find diseases that can affect this crop
    const possibleDiseases = Object.values(diseases).filter(disease => 
      disease.affectedCrops.includes(cropType)
    );

    if (possibleDiseases.length === 0) return null;

    // Select random disease
    const disease = possibleDiseases[Math.floor(Math.random() * possibleDiseases.length)];
    
    // Add disease to field
    this.activeDiseases.set(fieldId, {
      ...disease,
      infectedAt: Date.now(),
      severity: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
    });

    return disease;
  }

  // Spread disease to nearby fields
  spreadDisease(fields) {
    const newInfections = [];
    
    for (const [fieldId, diseaseInfo] of this.activeDiseases) {
      const disease = diseases[diseaseInfo.id];
      
      // Check each other field for spread
      fields.forEach(field => {
        if (field.fieldId === parseInt(fieldId)) return;
        if (this.activeDiseases.has(field.fieldId.toString())) return;
        if (!field.cropType) return;
        if (!disease.affectedCrops.includes(field.cropType)) return;
        
        // Calculate spread chance (closer fields = higher chance)
        const spreadChance = disease.spreadChance * diseaseInfo.severity;
        
        if (Math.random() < spreadChance) {
          newInfections.push({
            fieldId: field.fieldId,
            disease: { ...disease }
          });
        }
      });
    }

    // Apply new infections
    newInfections.forEach(infection => {
      this.activeDiseases.set(infection.fieldId.toString(), {
        ...infection.disease,
        infectedAt: Date.now(),
        severity: Math.random() * 0.3 + 0.4 // Spread diseases are usually milder
      });
    });

    return newInfections;
  }

  // Treat a disease
  treatDisease(fieldId, treatmentType, playerMoney) {
    const diseaseInfo = this.activeDiseases.get(fieldId.toString());
    if (!diseaseInfo) return { success: false, message: "No disease to treat" };

    const treatment = treatments[treatmentType];
    if (!treatment) return { success: false, message: "Invalid treatment" };

    const cost = treatment.baseCost;
    if (playerMoney < cost) {
      return { success: false, message: `Need ₹${cost} for treatment` };
    }

    // Apply treatment
    const success = Math.random() < treatment.effectiveness;
    
    if (success) {
      this.activeDiseases.delete(fieldId.toString());
      
      // Add prevention period
      this.treatmentHistory.set(fieldId.toString(), {
        treatment: treatmentType,
        appliedAt: Date.now(),
        duration: treatment.preventionDuration * 24 * 60 * 60 * 1000 // Convert days to ms
      });

      // Apply environmental effects
      this.environmentalHealth = Math.max(0, Math.min(100, 
        this.environmentalHealth + (treatment.sideEffects.environmentalImpact * -10)
      ));
    }

    return {
      success,
      cost,
      message: success ? 
        `Successfully treated ${diseaseInfo.name}!` : 
        `Treatment failed, but disease weakened`
    };
  }

  // Get disease effects for a field
  getDiseaseEffects(fieldId) {
    const diseaseInfo = this.activeDiseases.get(fieldId.toString());
    if (!diseaseInfo) return { growthMultiplier: 1, yieldMultiplier: 1 };

    return {
      growthMultiplier: 1 - (diseaseInfo.growthPenalty * diseaseInfo.severity),
      yieldMultiplier: 1 - (diseaseInfo.yieldPenalty * diseaseInfo.severity),
      disease: diseaseInfo
    };
  }

  // Check if field is protected by recent treatment
  isProtected(fieldId) {
    const treatment = this.treatmentHistory.get(fieldId.toString());
    if (!treatment) return false;

    const elapsed = Date.now() - treatment.appliedAt;
    return elapsed < treatment.duration;
  }

  // Get all active diseases
  getActiveDiseases() {
    return Array.from(this.activeDiseases.entries()).map(([fieldId, disease]) => ({
      fieldId: parseInt(fieldId),
      ...disease
    }));
  }

  // Clean up expired treatments
  cleanup() {
    const now = Date.now();
    for (const [fieldId, treatment] of this.treatmentHistory) {
      if (now - treatment.appliedAt > treatment.duration) {
        this.treatmentHistory.delete(fieldId);
      }
    }
  }
}

// Global disease system instance
export const diseaseSystem = new DiseaseSystem();
