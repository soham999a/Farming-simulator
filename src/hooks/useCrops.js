import { useEffect, useState, useRef } from 'react';
import { getUserFarm, setUserFarm, updateUserFarm } from '../firebase/firestore';
import { crops } from '../constants/crops';

const DEFAULT_FARM = {
  money: 100,
  fields: [
    { fieldId: 1, cropType: null, plantedAt: null }
  ]
};

export function useCrops(userId = 'demo-user') {
  const [farm, setFarm] = useState(DEFAULT_FARM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef();

  // Load farm from Firestore
  useEffect(() => {
    let mounted = true;
    getUserFarm(userId)
      .then(data => {
        if (mounted) {
          setFarm(data || DEFAULT_FARM);
          setLoading(false);
        }
      })
      .catch(e => {
        setError(e.message || 'Failed to load farm');
        setLoading(false);
        console.error('Firestore error:', e);
      });
    return () => { mounted = false; };
  }, [userId]);

  // Timer for crop growth
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFarm(farm => ({ ...farm })); // trigger re-render
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Plant a crop
  const plantCrop = async (fieldId, cropType) => {
    try {
      const now = Date.now();
      const newFields = farm.fields.map(f =>
        f.fieldId === fieldId ? { ...f, cropType, plantedAt: now } : f
      );
      const newFarm = { ...farm, fields: newFields };
      setFarm(newFarm);
      await setUserFarm(userId, newFarm);
    } catch (e) {
      setError(e.message || 'Failed to plant crop');
      console.error('Plant error:', e);
    }
  };

  // Harvest a crop
  const harvestCrop = async (fieldId) => {
    try {
      const field = farm.fields.find(f => f.fieldId === fieldId);
      if (!field || !field.cropType) return;
      const crop = crops[field.cropType];
      const timeSincePlanted = Date.now() - field.plantedAt;
      if (timeSincePlanted < crop.growTime) return;
      const newFields = farm.fields.map(f =>
        f.fieldId === fieldId ? { ...f, cropType: null, plantedAt: null } : f
      );
      const newFarm = { ...farm, money: farm.money + crop.sellPrice, fields: newFields };
      setFarm(newFarm);
      await setUserFarm(userId, newFarm);
    } catch (e) {
      setError(e.message || 'Failed to harvest crop');
      console.error('Harvest error:', e);
    }
  };

  // Buy a new field
  const buyField = async () => {
    try {
      const cost = 100 * (farm.fields.length + 1);
      if (farm.money < cost) return;
      const newField = { fieldId: farm.fields.length + 1, cropType: null, plantedAt: null };
      const newFarm = {
        ...farm,
        money: farm.money - cost,
        fields: [...farm.fields, newField]
      };
      setFarm(newFarm);
      await setUserFarm(userId, newFarm);
    } catch (e) {
      setError(e.message || 'Failed to buy field');
      console.error('Buy field error:', e);
    }
  };

  // Crop status helpers
  const getFieldStatus = (field) => {
    if (!field.cropType) return { status: 'Empty' };
    const crop = crops[field.cropType];
    const timeSincePlanted = Date.now() - field.plantedAt;
    if (timeSincePlanted >= crop.growTime) return { status: 'Ready', crop };
    return { status: 'Growing', crop, timeLeft: crop.growTime - timeSincePlanted };
  };

  return {
    farm,
    loading,
    error,
    plantCrop,
    harvestCrop,
    buyField,
    getFieldStatus
  };
} 