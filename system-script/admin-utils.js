
import { db } from './firebase-core.js';
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * Fetch all students
 */
export async function getAllStudents(isActive = true) {
    try {
        const q = query(
            collection(db, "users"),
            where("role", "==", "student"),
            where("isActive", "==", isActive),
            orderBy("lastName", "asc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Get All Students Error:", error);
        throw error;
    }
}

/**
 * Update user active status
 */
export async function updateUserStatus(userId, isActive) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { isActive });
        return true;
    } catch (error) {
        console.error("Update User Status Error:", error);
        throw error;
    }
}

/**
 * Fetch all journals for admin review, optionally filtered by status
 */
export async function getAllJournals(status = 'all') {
    try {
        let q = query(collection(db, "journals"), orderBy("timestamp", "desc"));

        if (status === 'pending') {
            q = query(collection(db, "journals"), where("submitted", "==", true), where("reviewed", "==", false), orderBy("timestamp", "desc"));
        } else if (status === 'reviewed') {
            q = query(collection(db, "journals"), where("reviewed", "==", true), orderBy("timestamp", "desc"));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Get All Journals Error:", error);
        throw error;
    }
}

/**
 * Review a journal entry
 */
export async function reviewJournal(journalId, remarks, reviewed = true) {
    try {
        const journalRef = doc(db, "journals", journalId);
        await updateDoc(journalRef, {
            remarks,
            reviewed,
            reviewedAt: new Date() // JS Date for simplified review tracking
        });
        return true;
    } catch (error) {
        console.error("Review Journal Error:", error);
        throw error;
    }
}

/**
 * Get stats summary for admin dashboard
 */
export async function getAdminStats() {
    try {
        const students = await getAllStudents();
        const journals = await getAllJournals();

        const pending = journals.filter(j => j.submitted && !j.reviewed).length;
        const totalJournals = journals.length;

        return {
            totalStudents: students.length,
            totalJournals,
            pendingReviews: pending
        };
    } catch (error) {
        console.error("Get Admin Stats Error:", error);
        throw error;
    }
}
