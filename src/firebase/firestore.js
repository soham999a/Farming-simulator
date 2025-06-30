import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "./config.js";

const PLAYER_ID = "player1"; // For demo purposes, using a fixed player ID

// Initialize player data if it doesn't exist
export const initializePlayer = async () => {
  const playerRef = doc(db, "players", PLAYER_ID);
  const playerSnap = await getDoc(playerRef);
  
  if (!playerSnap.exists()) {
    const initialData = {
      money: 500,
      fieldCount: 3,
      fields: [
        { fieldId: 1, cropType: null, plantedAt: null },
        { fieldId: 2, cropType: null, plantedAt: null },
        { fieldId: 3, cropType: null, plantedAt: null }
      ],
      totalHarvests: 0,
      totalEarnings: 0,
      createdAt: Date.now(),
      lastPlayed: Date.now()
    };
    
    await setDoc(playerRef, initialData);
    return initialData;
  }
  
  // Update last played time
  await updateDoc(playerRef, { lastPlayed: Date.now() });
  return playerSnap.data();
};

// Get player data
export const getPlayerData = async () => {
  const playerRef = doc(db, "players", PLAYER_ID);
  const playerSnap = await getDoc(playerRef);
  
  if (playerSnap.exists()) {
    return playerSnap.data();
  }
  
  return await initializePlayer();
};

// Update player money
export const updatePlayerMoney = async (newMoney) => {
  const playerRef = doc(db, "players", PLAYER_ID);
  await updateDoc(playerRef, { 
    money: newMoney,
    lastPlayed: Date.now()
  });
};

// Plant a crop
export const plantCrop = async (fieldId, cropType) => {
  const playerData = await getPlayerData();
  const updatedFields = playerData.fields.map(field => 
    field.fieldId === fieldId 
      ? { ...field, cropType, plantedAt: Date.now() }
      : field
  );
  
  const playerRef = doc(db, "players", PLAYER_ID);
  await updateDoc(playerRef, { 
    fields: updatedFields,
    lastPlayed: Date.now()
  });
};

// Harvest a crop
export const harvestCrop = async (fieldId, earnings) => {
  const playerData = await getPlayerData();
  const updatedFields = playerData.fields.map(field => 
    field.fieldId === fieldId 
      ? { ...field, cropType: null, plantedAt: null }
      : field
  );
  
  const playerRef = doc(db, "players", PLAYER_ID);
  await updateDoc(playerRef, { 
    fields: updatedFields,
    money: playerData.money + earnings,
    totalHarvests: (playerData.totalHarvests || 0) + 1,
    totalEarnings: (playerData.totalEarnings || 0) + earnings,
    lastPlayed: Date.now()
  });
};

// Buy a new field
export const buyNewField = async (cost) => {
  const playerData = await getPlayerData();
  const newFieldId = playerData.fieldCount + 1;
  const updatedFields = [
    ...playerData.fields,
    { fieldId: newFieldId, cropType: null, plantedAt: null }
  ];
  
  const playerRef = doc(db, "players", PLAYER_ID);
  await updateDoc(playerRef, {
    fields: updatedFields,
    fieldCount: newFieldId,
    money: playerData.money - cost,
    lastPlayed: Date.now()
  });
};

// Listen to player data changes in real-time
export const subscribeToPlayerData = (callback) => {
  const playerRef = doc(db, "players", PLAYER_ID);
  return onSnapshot(playerRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

// Get field purchase cost (increases with each field)
export const getFieldCost = (currentFieldCount) => {
  return 250 + (currentFieldCount - 3) * 100; // ₹250 for 4th field, ₹350 for 5th, etc.
};
