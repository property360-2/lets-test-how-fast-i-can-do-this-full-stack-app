
import { auth, db } from './firebase-core.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * Login user and fetch their details/role from Firestore
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            return { user, ...userDoc.data() };
        } else {
            throw new Error("User data not found in database.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

/**
 * Redirect user based on their role
 */
export function redirectUserByRole(role) {
    if (role === 'admin') {
        window.location.href = '/admin-pages/admin-dashboard.html';
    } else if (role === 'student') {
        window.location.href = '/student-pages/dashboard.html';
    } else {
        window.location.href = '/index.html';
    }
}

/**
 * Handle user logout
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = '/index.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

/**
 * Guard page access based on auth state and required role
 */
export function guardPage(requiredRole = null) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
                window.location.href = '/index.html';
            }
            return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (requiredRole && userData.role !== requiredRole) {
                redirectUserByRole(userData.role);
            }
            // If we are on the login page but already logged in, redirect
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                redirectUserByRole(userData.role);
            }
        } else {
            // User authenticated but no data - log them out or send to setup
            logoutUser();
        }
    });
}
