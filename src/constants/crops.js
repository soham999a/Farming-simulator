export const crops = {
  wheat: {
    name: "Wheat",
    growTime: 12000, // 12 seconds
    sellPrice: 40,
    image: "/assets/crops/wheat.png",
    emoji: "🌾",
    description: "Fast-growing grain crop",
    color: "#D4A574"
  },
  corn: {
    name: "Corn",
    growTime: 18000, // 18 seconds
    sellPrice: 70,
    image: "/assets/crops/corn.png",
    emoji: "🌽",
    description: "High-value yellow corn",
    color: "#FFD700"
  },
  potato: {
    name: "Potato",
    growTime: 20000, // 20 seconds
    sellPrice: 100,
    image: "/assets/crops/potato.png",
    emoji: "🥔",
    description: "Premium root vegetable",
    color: "#8B4513"
  },
  carrot: {
    name: "Carrot",
    growTime: 15000, // 15 seconds
    sellPrice: 55,
    image: "/assets/crops/carrot.png",
    emoji: "🥕",
    description: "Crunchy orange vegetable",
    color: "#FF8C00"
  },
  tomato: {
    name: "Tomato",
    growTime: 16000, // 16 seconds
    sellPrice: 85,
    image: "/assets/crops/tomato.png",
    emoji: "🍅",
    description: "Juicy red tomatoes",
    color: "#FF6347"
  },
  lettuce: {
    name: "Lettuce",
    growTime: 10000, // 10 seconds (fastest)
    sellPrice: 30,
    image: "/assets/crops/lettuce.png",
    emoji: "🥬",
    description: "Fresh green lettuce",
    color: "#90EE90"
  }
};

// Helper function to get crop by key
export const getCrop = (cropKey) => crops[cropKey];

// Helper function to get all crop keys
export const getCropKeys = () => Object.keys(crops);

// Helper function to format time
export const formatGrowTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

// Helper function to calculate remaining time
export const getRemainingTime = (plantedAt, growTime) => {
  const elapsed = Date.now() - plantedAt;
  const remaining = growTime - elapsed;
  return Math.max(0, remaining);
};

// Helper function to check if crop is ready
export const isCropReady = (plantedAt, growTime) => {
  return Date.now() - plantedAt >= growTime;
};

// Helper function to get growth percentage
export const getGrowthPercentage = (plantedAt, growTime) => {
  const elapsed = Date.now() - plantedAt;
  const percentage = (elapsed / growTime) * 100;
  return Math.min(100, Math.max(0, percentage));
};
