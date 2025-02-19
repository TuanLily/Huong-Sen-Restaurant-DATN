import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCmwskfloA_osrDvKy_J7oDNHI3iVu5bPU",
    authDomain: "huong-sen-restaurant.firebaseapp.com",
    projectId: "huong-sen-restaurant",
    storageBucket: "huong-sen-restaurant.appspot.com",
    messagingSenderId: "293477909059",
    appId: "1:293477909059:web:8f97e9dea82f5702a5caf6",
    measurementId: "G-QF876EG003"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);