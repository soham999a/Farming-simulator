import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdSmECM1DqzV1BzYIPk-6KzTjFFZEJc5A",
  authDomain: "seed-project-a1aaf.firebaseapp.com",
  projectId: "seed-project-a1aaf",
  storageBucket: "seed-project-a1aaf.firebasestorage.app",
  messagingSenderId: "28346216296",
  appId: "1:28346216296:web:975f72033bf2e7b0f970dd",
  measurementId: "G-DSLN3S2S9H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;
