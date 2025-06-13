import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFLBch5MmQtP0bQZvCKAagC1PEMO0a5SI",
  authDomain: "friendship-diary.firebaseapp.com",
  projectId: "friendship-diary",
  storageBucket: "friendship-diary.firebasestorage.app",
  messagingSenderId: "612076093464",
  appId: "1:612076093464:web:33b216b4eb32d7d46f036d",
  measurementId: "G-W9WR0X06DJ",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
