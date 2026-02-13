
import { db, serverTimestamp } from './firebase-core.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * Get the OJT week number based on a start date
 * For simplicity, we can also store the week number or calculate it relative to a project start date.
 */
export function calculateWeekNumber(dateStr) {
    // This is a placeholder logic. You might want to define a specific start date for the OJT term.
    const date = new Date(dateStr);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

/**
 * Create or Update a journal entry
 */
export async function saveJournal(userId, date, content, submitted = false) {
    const journalId = `${userId}_${date}`;
    const week = calculateWeekNumber(date);

    const journalData = {
        userId,
        date,
        week,
        content,
        submitted,
        reviewed: false,
        remarks: "",
        updatedAt: serverTimestamp()
    };

    if (submitted) {
        journalData.timestamp = serverTimestamp();
    }

    try {
        const journalRef = doc(db, "journals", journalId);
        const journalDoc = await getDoc(journalRef);

        if (journalDoc.exists() && journalDoc.data().reviewed) {
            throw new Error("Cannot edit a journal that has already been reviewed.");
        }

        await setDoc(journalRef, journalData, { merge: true });
        return { id: journalId, ...journalData };
    } catch (error) {
        console.error("Save Journal Error:", error);
        throw error;
    }
}

/**
 * Fetch all journals for a specific student
 */
export async function getStudentJournals(userId) {
    try {
        const q = query(
            collection(db, "journals"),
            where("userId", "==", userId),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Get Student Journals Error:", error);
        throw error;
    }
}

/**
 * Fetch a specific journal entry
 */
export async function getJournal(userId, date) {
    const journalId = `${userId}_${date}`;
    const docRef = doc(db, "journals", journalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}
