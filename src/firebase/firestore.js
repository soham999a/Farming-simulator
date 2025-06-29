import { db } from './config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const getUserFarm = async (userId) => {
  const ref = doc(db, 'farms', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const setUserFarm = async (userId, data) => {
  const ref = doc(db, 'farms', userId);
  await setDoc(ref, data, { merge: true });
};

export const updateUserFarm = async (userId, data) => {
  const ref = doc(db, 'farms', userId);
  await updateDoc(ref, data);
}; 