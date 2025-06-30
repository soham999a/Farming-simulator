// 👥 ADVANCED MULTIPLAYER SYSTEM

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  where,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from '../firebase/config.js';

export const cooperativeContracts = {
  bulkOrder: {
    id: 'bulkOrder',
    name: 'Bulk Produce Order',
    emoji: '📦',
    description: 'Fulfill large orders together',
    minPlayers: 2,
    maxPlayers: 5,
    duration: 7, // days
    rewards: {
      xp: 500,
      money: 2000,
      reputation: 10
    }
  },
  seedSharing: {
    id: 'seedSharing',
    name: 'Seed Sharing Program',
    emoji: '🌱',
    description: 'Share rare seeds with other farmers',
    minPlayers: 3,
    maxPlayers: 8,
    duration: 3,
    rewards: {
      xp: 200,
      rareSeeds: 5,
      reputation: 5
    }
  },
  weatherResponse: {
    id: 'weatherResponse',
    name: 'Weather Emergency Response',
    emoji: '⛈️',
    description: 'Help each other during severe weather',
    minPlayers: 2,
    maxPlayers: 10,
    duration: 1,
    rewards: {
      xp: 300,
      money: 1000,
      reputation: 15
    }
  },
  researchProject: {
    id: 'researchProject',
    name: 'Agricultural Research',
    emoji: '🔬',
    description: 'Collaborate on crop research',
    minPlayers: 4,
    maxPlayers: 6,
    duration: 14,
    rewards: {
      xp: 1000,
      money: 5000,
      unlocks: ['advancedSeeds'],
      reputation: 25
    }
  }
};

export const tradeOffers = {
  crops: {
    categories: ['wheat', 'corn', 'potato', 'carrot', 'tomato', 'lettuce'],
    priceMultiplier: 0.9 // 10% discount from market price
  },
  equipment: {
    categories: ['tractor', 'irrigation', 'fertilizer', 'harvester'],
    priceMultiplier: 0.85 // 15% discount
  },
  resources: {
    categories: ['fertilizer', 'seeds', 'fuel', 'pesticide'],
    priceMultiplier: 0.8 // 20% discount
  }
};

export class MultiplayerSystem {
  constructor(playerId) {
    this.playerId = playerId;
    this.friends = new Set();
    this.activeContracts = new Map();
    this.tradeHistory = [];
    this.reputation = 0;
    this.leaderboardPosition = null;
    this.onlineStatus = 'online';
    this.lastSeen = Date.now();
  }

  // LEADERBOARD SYSTEM
  async updateLeaderboard(playerData) {
    try {
      const leaderboardRef = doc(db, 'leaderboard', this.playerId);
      await updateDoc(leaderboardRef, {
        playerId: this.playerId,
        playerName: playerData.name || `Farmer ${this.playerId}`,
        level: playerData.level || 1,
        totalMoney: playerData.money || 0,
        totalHarvests: playerData.totalHarvests || 0,
        fieldsOwned: playerData.fieldCount || 3,
        reputation: this.reputation,
        lastUpdated: serverTimestamp(),
        achievements: playerData.achievements || []
      });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  // Get global leaderboard
  async getLeaderboard(category = 'totalMoney', limitCount = 50) {
    try {
      const leaderboardRef = collection(db, 'leaderboard');
      const q = query(
        leaderboardRef,
        orderBy(category, 'desc'),
        limit(limitCount)
      );

      return new Promise((resolve) => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const leaderboard = [];
          snapshot.forEach((doc, index) => {
            leaderboard.push({
              rank: index + 1,
              ...doc.data()
            });
          });
          resolve(leaderboard);
        });
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // TRADING SYSTEM
  async createTradeOffer(offerData) {
    try {
      const tradeRef = collection(db, 'trades');
      const offer = {
        sellerId: this.playerId,
        sellerName: offerData.sellerName,
        itemType: offerData.itemType, // 'crop', 'equipment', 'resource'
        itemId: offerData.itemId,
        quantity: offerData.quantity,
        pricePerUnit: offerData.pricePerUnit,
        totalPrice: offerData.pricePerUnit * offerData.quantity,
        description: offerData.description || '',
        createdAt: serverTimestamp(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'active',
        interestedBuyers: []
      };

      const docRef = await addDoc(tradeRef, offer);
      return { success: true, tradeId: docRef.id };
    } catch (error) {
      console.error('Error creating trade offer:', error);
      return { success: false, error: error.message };
    }
  }

  // Get available trade offers
  async getTradeOffers(itemType = null, maxPrice = null) {
    try {
      const tradesRef = collection(db, 'trades');
      let q = query(
        tradesRef,
        where('status', '==', 'active'),
        where('sellerId', '!=', this.playerId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (itemType) {
        q = query(q, where('itemType', '==', itemType));
      }

      return new Promise((resolve) => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const offers = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (!maxPrice || data.pricePerUnit <= maxPrice) {
              offers.push({
                id: doc.id,
                ...data
              });
            }
          });
          resolve(offers);
        });
      });
    } catch (error) {
      console.error('Error getting trade offers:', error);
      return [];
    }
  }

  // Purchase from trade offer
  async purchaseTradeOffer(tradeId, buyerData) {
    try {
      const tradeRef = doc(db, 'trades', tradeId);
      
      // Update trade status
      await updateDoc(tradeRef, {
        status: 'sold',
        buyerId: this.playerId,
        buyerName: buyerData.name,
        soldAt: serverTimestamp()
      });

      // Add to trade history
      this.tradeHistory.push({
        type: 'purchase',
        tradeId,
        timestamp: Date.now(),
        ...buyerData
      });

      // Update reputation
      this.reputation += 2;

      return { success: true };
    } catch (error) {
      console.error('Error purchasing trade offer:', error);
      return { success: false, error: error.message };
    }
  }

  // COOPERATIVE CONTRACTS
  async createCooperativeContract(contractType, contractData) {
    try {
      const contractTemplate = cooperativeContracts[contractType];
      if (!contractTemplate) {
        return { success: false, error: 'Invalid contract type' };
      }

      const contractRef = collection(db, 'contracts');
      const contract = {
        type: contractType,
        ...contractTemplate,
        creatorId: this.playerId,
        creatorName: contractData.creatorName,
        participants: [this.playerId],
        participantNames: [contractData.creatorName],
        status: 'recruiting',
        createdAt: serverTimestamp(),
        expiresAt: Date.now() + (contractTemplate.duration * 24 * 60 * 60 * 1000),
        requirements: contractData.requirements || {},
        progress: {},
        chatMessages: []
      };

      const docRef = await addDoc(contractRef, contract);
      this.activeContracts.set(docRef.id, contract);
      
      return { success: true, contractId: docRef.id };
    } catch (error) {
      console.error('Error creating contract:', error);
      return { success: false, error: error.message };
    }
  }

  // Join cooperative contract
  async joinContract(contractId, playerData) {
    try {
      const contractRef = doc(db, 'contracts', contractId);
      
      await updateDoc(contractRef, {
        participants: [...this.activeContracts.get(contractId)?.participants || [], this.playerId],
        participantNames: [...this.activeContracts.get(contractId)?.participantNames || [], playerData.name],
        [`progress.${this.playerId}`]: {
          joined: true,
          contribution: 0,
          lastActive: serverTimestamp()
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error joining contract:', error);
      return { success: false, error: error.message };
    }
  }

  // Update contract progress
  async updateContractProgress(contractId, progressData) {
    try {
      const contractRef = doc(db, 'contracts', contractId);
      
      await updateDoc(contractRef, {
        [`progress.${this.playerId}.contribution`]: increment(progressData.contribution),
        [`progress.${this.playerId}.lastActive`]: serverTimestamp(),
        [`progress.${this.playerId}.details`]: progressData.details || {}
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating contract progress:', error);
      return { success: false, error: error.message };
    }
  }

  // FRIEND SYSTEM
  async sendFriendRequest(targetPlayerId, playerName) {
    try {
      const requestRef = collection(db, 'friendRequests');
      const request = {
        fromId: this.playerId,
        fromName: playerName,
        toId: targetPlayerId,
        status: 'pending',
        sentAt: serverTimestamp()
      };

      await addDoc(requestRef, request);
      return { success: true };
    } catch (error) {
      console.error('Error sending friend request:', error);
      return { success: false, error: error.message };
    }
  }

  // Accept friend request
  async acceptFriendRequest(requestId, friendData) {
    try {
      // Update request status
      const requestRef = doc(db, 'friendRequests', requestId);
      await updateDoc(requestRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });

      // Add to friends list
      this.friends.add(friendData.playerId);

      // Update reputation
      this.reputation += 1;

      return { success: true };
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return { success: false, error: error.message };
    }
  }

  // CHAT SYSTEM
  async sendMessage(contractId, message) {
    try {
      const contractRef = doc(db, 'contracts', contractId);
      const messageData = {
        senderId: this.playerId,
        senderName: message.senderName,
        content: message.content,
        timestamp: serverTimestamp(),
        type: message.type || 'text' // text, system, achievement
      };

      await updateDoc(contractRef, {
        chatMessages: [...this.activeContracts.get(contractId)?.chatMessages || [], messageData]
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  // GIFT SYSTEM
  async sendGift(recipientId, giftData) {
    try {
      const giftRef = collection(db, 'gifts');
      const gift = {
        senderId: this.playerId,
        senderName: giftData.senderName,
        recipientId,
        itemType: giftData.itemType,
        itemId: giftData.itemId,
        quantity: giftData.quantity,
        message: giftData.message || '',
        sentAt: serverTimestamp(),
        status: 'pending'
      };

      await addDoc(giftRef, gift);
      
      // Update reputation
      this.reputation += 3;

      return { success: true };
    } catch (error) {
      console.error('Error sending gift:', error);
      return { success: false, error: error.message };
    }
  }

  // Get pending gifts
  async getPendingGifts() {
    try {
      const giftsRef = collection(db, 'gifts');
      const q = query(
        giftsRef,
        where('recipientId', '==', this.playerId),
        where('status', '==', 'pending'),
        orderBy('sentAt', 'desc')
      );

      return new Promise((resolve) => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const gifts = [];
          snapshot.forEach((doc) => {
            gifts.push({
              id: doc.id,
              ...doc.data()
            });
          });
          resolve(gifts);
        });
      });
    } catch (error) {
      console.error('Error getting gifts:', error);
      return [];
    }
  }

  // Accept gift
  async acceptGift(giftId) {
    try {
      const giftRef = doc(db, 'gifts', giftId);
      await updateDoc(giftRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error accepting gift:', error);
      return { success: false, error: error.message };
    }
  }

  // REPUTATION SYSTEM
  calculateReputationLevel() {
    if (this.reputation >= 1000) return { level: 'Legendary', emoji: '👑', color: '#FFD700' };
    if (this.reputation >= 500) return { level: 'Master', emoji: '🏆', color: '#C0C0C0' };
    if (this.reputation >= 200) return { level: 'Expert', emoji: '⭐', color: '#CD7F32' };
    if (this.reputation >= 100) return { level: 'Skilled', emoji: '🌟', color: '#4169E1' };
    if (this.reputation >= 50) return { level: 'Experienced', emoji: '✨', color: '#32CD32' };
    if (this.reputation >= 20) return { level: 'Apprentice', emoji: '🌱', color: '#FFA500' };
    return { level: 'Novice', emoji: '🌿', color: '#808080' };
  }

  // Get player's multiplayer stats
  getMultiplayerStats() {
    return {
      reputation: this.reputation,
      reputationLevel: this.calculateReputationLevel(),
      friendsCount: this.friends.size,
      activeContractsCount: this.activeContracts.size,
      tradesCompleted: this.tradeHistory.filter(t => t.type === 'purchase').length,
      tradesSold: this.tradeHistory.filter(t => t.type === 'sale').length,
      onlineStatus: this.onlineStatus,
      lastSeen: this.lastSeen
    };
  }

  // Update online status
  updateOnlineStatus(status = 'online') {
    this.onlineStatus = status;
    this.lastSeen = Date.now();
    
    // Update in Firestore
    const playerRef = doc(db, 'players', this.playerId);
    updateDoc(playerRef, {
      onlineStatus: status,
      lastSeen: serverTimestamp()
    }).catch(console.error);
  }

  // Clean up expired data
  async cleanup() {
    const now = Date.now();
    
    // Remove expired contracts
    for (const [contractId, contract] of this.activeContracts) {
      if (contract.expiresAt < now) {
        this.activeContracts.delete(contractId);
      }
    }

    // Clean trade history (keep last 100)
    if (this.tradeHistory.length > 100) {
      this.tradeHistory = this.tradeHistory.slice(-100);
    }
  }
}

// Global multiplayer system instance
export const createMultiplayerSystem = (playerId) => new MultiplayerSystem(playerId);
