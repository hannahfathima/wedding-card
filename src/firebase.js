import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyACEZE6nWm4eulVyK4ih7ReYfy01oW9odA",
  authDomain: "wedding-card-b235c.firebaseapp.com",
  projectId: "wedding-card-b235c",
  storageBucket: "wedding-card-b235c.firebasestorage.app",
  messagingSenderId: "828368467186",
  appId: "1:828368467186:web:5157cd107ba25af4914c6b",
  measurementId: "G-Z9XN56T7KJ"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
