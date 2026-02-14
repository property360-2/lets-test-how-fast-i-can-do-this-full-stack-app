/**
 * Firebase Core Configuration and Initialization.
 * Centralizes the initialization of Firebase app, auth, and firestore services.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * Firebase configuration object.
 * API Key and other credentials should be kept secure in a production environment.
 */
export const firebaseConfig = {
    apiKey: "AIzaSyDE-xxxxxxxxxxxxxxxxxxxx", // Placeholder
    authDomain: "ojt-journal-sys.firebaseapp.com",
    projectId: "ojt-journal-sys",
    storageBucket: "ojt-journal-sys.firebasestorage.app",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/** 
 * Firebase Authentication instance 
 */
export const auth = getAuth(app);

/** 
 * Firestore Database instance 
 */
export const db = getFirestore(app);

/** 
 * Helper for Firestore server-side timestamps 
 */
export { serverTimestamp };
