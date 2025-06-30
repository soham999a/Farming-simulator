// 📈 ADVANCED MARKET FLUCTUATION SYSTEM

export const marketEvents = {
  drought: {
    id: 'drought',
    name: 'Regional Drought',
    emoji: '🌵',
    description: 'Water shortage increases crop prices',
    duration: 7, // days
    effects: {
      wheat: 1.4,
      corn: 1.5,
      potato: 1.3,
      carrot: 1.2,
      tomato: 1.6,
      lettuce: 1.3
    },
    probability: 0.1
  },
  festival: {
    id: 'festival',
    name: 'Harvest Festival',
    emoji: '🎉',
    description: 'High demand for fresh produce',
    duration: 3,
    effects: {
      tomato: 1.8,
      lettuce: 1.6,
      carrot: 1.4,
      potato: 1.2
    },
    probability: 0.15
  },
  export_boom: {
    id: 'export_boom',
    name: 'Export Boom',
    emoji: '🚢',
    description: 'International demand increases prices',
    duration: 10,
    effects: {
      wheat: 1.6,
      corn: 1.7,
      potato: 1.3
    },
    probability: 0.08
  },
  oversupply: {
    id: 'oversupply',
    name: 'Market Oversupply',
    emoji: '📉',
    description: 'Too much supply lowers prices',
    duration: 5,
    effects: {
      wheat: 0.7,
      corn: 0.6,
      potato: 0.8,
      carrot: 0.7,
      tomato: 0.5,
      lettuce: 0.6
    },
    probability: 0.12
  },
  disease_outbreak: {
    id: 'disease_outbreak',
    name: 'Crop Disease Outbreak',
    emoji: '🦠',
    description: 'Disease reduces supply, increases prices',
    duration: 8,
    effects: {
      tomato: 1.9,
      potato: 1.7,
      lettuce: 1.5
    },
    probability: 0.06
  },
  new_restaurant: {
    id: 'new_restaurant',
    name: 'New Restaurant Chain',
    emoji: '🍽️',
    description: 'Restaurant chain increases vegetable demand',
    duration: 14,
    effects: {
      tomato: 1.4,
      lettuce: 1.5,
      carrot: 1.3
    },
    probability: 0.1
  }
};

export const seasonalTrends = {
  spring: {
    wheat: 1.1,
    corn: 0.9,
    potato: 1.0,
    carrot: 1.2,
    tomato: 0.8,
    lettuce: 1.3
  },
  summer: {
    wheat: 0.9,
    corn: 1.3,
    potato: 0.8,
    carrot: 0.9,
    tomato: 1.4,
    lettuce: 0.7
  },
  fall: {
    wheat: 1.2,
    corn: 1.1,
    potato: 1.4,
    carrot: 1.1,
    tomato: 1.0,
    lettuce: 0.9
  },
  winter: {
    wheat: 1.0,
    corn: 0.8,
    potato: 1.2,
    carrot: 1.0,
    tomato: 1.6,
    lettuce: 1.5
  }
};

export class MarketSystem {
  constructor() {
    this.basePrices = {
      wheat: 40,
      corn: 70,
      potato: 100,
      carrot: 55,
      tomato: 85,
      lettuce: 30
    };
    
    this.currentPrices = { ...this.basePrices };
    this.priceHistory = new Map(); // cropId -> [prices]
    this.activeEvents = [];
    this.marketVolatility = 0.1; // 10% random fluctuation
    this.supplyDemand = new Map(); // cropId -> { supply, demand }
    
    // Initialize price history
    Object.keys(this.basePrices).forEach(crop => {
      this.priceHistory.set(crop, [this.basePrices[crop]]);
      this.supplyDemand.set(crop, { supply: 50, demand: 50 });
    });
  }

  // Update market prices (call every game tick)
  updatePrices(season, playerActions = {}) {
    // Update supply/demand based on player actions
    this.updateSupplyDemand(playerActions);
    
    // Check for new market events
    this.checkForMarketEvents();
    
    // Calculate new prices
    Object.keys(this.basePrices).forEach(crop => {
      let newPrice = this.basePrices[crop];
      
      // Apply seasonal trends
      if (seasonalTrends[season] && seasonalTrends[season][crop]) {
        newPrice *= seasonalTrends[season][crop];
      }
      
      // Apply market events
      this.activeEvents.forEach(event => {
        if (event.effects[crop]) {
          newPrice *= event.effects[crop];
        }
      });
      
      // Apply supply/demand
      const sd = this.supplyDemand.get(crop);
      const sdRatio = sd.demand / Math.max(sd.supply, 1);
      newPrice *= (0.5 + sdRatio * 0.5); // 50% base + 50% supply/demand
      
      // Add random volatility
      const volatility = (Math.random() - 0.5) * 2 * this.marketVolatility;
      newPrice *= (1 + volatility);
      
      // Ensure minimum price
      newPrice = Math.max(newPrice, this.basePrices[crop] * 0.3);
      
      // Update current price
      this.currentPrices[crop] = Math.round(newPrice);
      
      // Update price history
      const history = this.priceHistory.get(crop);
      history.push(this.currentPrices[crop]);
      if (history.length > 50) history.shift(); // Keep last 50 prices
    });
    
    // Update event durations
    this.updateEvents();
  }

  // Update supply and demand based on player actions
  updateSupplyDemand(playerActions) {
    Object.keys(this.basePrices).forEach(crop => {
      const sd = this.supplyDemand.get(crop);
      
      // Increase supply when player harvests
      if (playerActions.harvested && playerActions.harvested[crop]) {
        sd.supply += playerActions.harvested[crop] * 0.1;
      }
      
      // Natural demand fluctuation
      sd.demand += (Math.random() - 0.5) * 2;
      
      // Natural supply decay (market consumption)
      sd.supply *= 0.98;
      
      // Keep values in reasonable range
      sd.supply = Math.max(10, Math.min(100, sd.supply));
      sd.demand = Math.max(10, Math.min(100, sd.demand));
    });
  }

  // Check for new market events
  checkForMarketEvents() {
    // Remove expired events
    this.activeEvents = this.activeEvents.filter(event => event.remainingDays > 0);
    
    // Check for new events (max 2 active at once)
    if (this.activeEvents.length < 2) {
      Object.values(marketEvents).forEach(eventTemplate => {
        if (Math.random() < eventTemplate.probability / 100) { // Daily probability
          // Don't add duplicate events
          if (!this.activeEvents.find(e => e.id === eventTemplate.id)) {
            this.activeEvents.push({
              ...eventTemplate,
              remainingDays: eventTemplate.duration,
              startedAt: Date.now()
            });
          }
        }
      });
    }
  }

  // Update active events
  updateEvents() {
    this.activeEvents.forEach(event => {
      event.remainingDays -= 1;
    });
  }

  // Get current price for a crop
  getPrice(cropId) {
    return this.currentPrices[cropId] || this.basePrices[cropId];
  }

  // Get price trend (rising, falling, stable)
  getPriceTrend(cropId) {
    const history = this.priceHistory.get(cropId);
    if (!history || history.length < 2) return 'stable';
    
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    
    if (current > previous * 1.05) return 'rising';
    if (current < previous * 0.95) return 'falling';
    return 'stable';
  }

  // Get price change percentage
  getPriceChange(cropId) {
    const history = this.priceHistory.get(cropId);
    if (!history || history.length < 2) return 0;
    
    const current = history[history.length - 1];
    const previous = history[history.length - 2];
    
    return ((current - previous) / previous) * 100;
  }

  // Get market analysis for a crop
  getMarketAnalysis(cropId) {
    const price = this.getPrice(cropId);
    const basePrice = this.basePrices[cropId];
    const trend = this.getPriceTrend(cropId);
    const change = this.getPriceChange(cropId);
    const sd = this.supplyDemand.get(cropId);
    
    let recommendation = 'hold';
    if (price > basePrice * 1.2 && trend === 'rising') recommendation = 'sell';
    if (price < basePrice * 0.8 && trend === 'falling') recommendation = 'buy';
    if (trend === 'rising' && change > 5) recommendation = 'sell';
    if (trend === 'falling' && change < -5) recommendation = 'buy';
    
    return {
      price,
      basePrice,
      trend,
      change: Math.round(change * 100) / 100,
      recommendation,
      supply: Math.round(sd.supply),
      demand: Math.round(sd.demand),
      volatility: this.marketVolatility
    };
  }

  // Get active market events
  getActiveEvents() {
    return this.activeEvents.map(event => ({
      ...event,
      timeLeft: `${event.remainingDays} days`
    }));
  }

  // Get price history for charts
  getPriceHistory(cropId, days = 10) {
    const history = this.priceHistory.get(cropId) || [];
    return history.slice(-days);
  }

  // Predict future prices (simple AI)
  getPriceForecast(cropId, days = 3) {
    const history = this.priceHistory.get(cropId) || [];
    if (history.length < 3) return [];
    
    const forecast = [];
    let lastPrice = history[history.length - 1];
    
    for (let i = 0; i < days; i++) {
      // Simple trend continuation with noise
      const trend = this.getPriceTrend(cropId);
      let change = 0;
      
      if (trend === 'rising') change = Math.random() * 0.1;
      else if (trend === 'falling') change = -Math.random() * 0.1;
      else change = (Math.random() - 0.5) * 0.05;
      
      lastPrice = Math.round(lastPrice * (1 + change));
      forecast.push(lastPrice);
    }
    
    return forecast;
  }

  // Calculate optimal selling time
  getOptimalSellTime(cropId) {
    const analysis = this.getMarketAnalysis(cropId);
    const forecast = this.getPriceForecast(cropId, 5);
    
    if (analysis.recommendation === 'sell') return 'now';
    
    // Find peak in forecast
    let peakDay = 0;
    let peakPrice = analysis.price;
    
    forecast.forEach((price, index) => {
      if (price > peakPrice) {
        peakPrice = price;
        peakDay = index + 1;
      }
    });
    
    if (peakDay > 0) return `${peakDay} days`;
    return 'now';
  }
}

// Global market system instance
export const marketSystem = new MarketSystem();
