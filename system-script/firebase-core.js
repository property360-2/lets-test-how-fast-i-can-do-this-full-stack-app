
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGf06TBKi-wnSoyN1UZijmphts4k8PSzg",
    authDomain: "ojt-journal-static.firebaseapp.com",
    projectId: "ojt-journal-static",
    storageBucket: "ojt-journal-static.firebasestorage.app",
    messagingSenderId: "52274714986",
    appId: "1:52274714986:web:d4387f89c32387d8166d13",
    measurementId: "G-55CHJE9TXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, serverTimestamp };
