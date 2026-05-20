/**
 * @file ui-utils.js
 * @description UI Utilities for the OJT Daily Journal System.
 * Centrally manages non-intrusive Toast notifications, customizable blocking confirmation modals,
 * utility functions for XSS prevention (HTML escaping), mobile hamburger navigation controls,
 * and secure automated email drafts for missing daily journal submissions.
 * 
 * Part of the shared system utilities, consumed by both student and administrative modules.
 * Fits into the global client-side infrastructure to provide premium design interactions.
 */

/**
 * Initializes required UI containers for toasts and modals if they don't exist.
 * This is called internally by showToast and showConfirm.
 */
function initUI() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    if (!document.getElementById('prompt-modal')) {
        const modal = document.createElement('div');
        modal.id = 'prompt-modal';
        modal.innerHTML = `
            <div class="prompt-card animate-fade">
                <i id="prompt-icon" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <h3 id="prompt-title" style="margin-bottom: 0.5rem;">Confirm Action</h3>
                <p id="prompt-message" style="color: var(--text-muted); margin-bottom: 2rem;"></p>
                <div style="display: flex; gap: 1rem;">
                    <button id="prompt-cancel" class="btn btn-outline" style="flex: 1;">Cancel</button>
                    <button id="prompt-confirm" class="btn btn-primary" style="flex: 1;">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

/**
 * Displays a non-intrusive toast notification.
 * @param {string} message - The text to display.
 * @param {string} type - Notification style ('success', 'error', 'info').
 */
export function showToast(message, type = 'info') {
    initUI();
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div style="font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Displays a blocking confirmation modal and returns the user's choice.
 * @param {string} title - Modal heading.
 * @param {string} message - Description of the action requiring confirmation.
 * @param {string} type - Visual indicator ('warning', 'danger', 'info').
 * @returns {Promise<boolean>} - True if confirmed, false otherwise.
 */
export function showConfirm(title, message, type = 'info') {
    initUI();
    const modal = document.getElementById('prompt-modal');
    const titleEl = document.getElementById('prompt-title');
    const msgEl = document.getElementById('prompt-message');
    const iconEl = document.getElementById('prompt-icon');
    const confirmBtn = document.getElementById('prompt-confirm');
    const cancelBtn = document.getElementById('prompt-cancel');

    titleEl.textContent = title;
    msgEl.textContent = message;

    // Set icon & colors based on type
    if (type === 'danger') {
        iconEl.className = 'fas fa-exclamation-triangle';
        iconEl.style.color = 'var(--danger)';
        confirmBtn.style.background = 'var(--danger)';
    } else if (type === 'warning') {
        iconEl.className = 'fas fa-exclamation-circle';
        iconEl.style.color = 'var(--warning)';
        confirmBtn.style.background = 'var(--warning)';
    } else {
        iconEl.className = 'fas fa-question-circle';
        iconEl.style.color = 'var(--primary)';
        confirmBtn.style.background = 'var(--primary)';
    }

    modal.style.display = 'flex';

    return new Promise((resolve) => {
        confirmBtn.onclick = () => {
            modal.style.display = 'none';
            resolve(true);
        };
        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            resolve(false);
        };
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                resolve(false);
            }
        };
    });
}
/**
 * Simple HTML Escaping for XSS prevention
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
    if (!str) return "";
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
}

/**
 * Centrally manages the hamburger menu toggle functionality.
 * Expects #menu-toggle button and .nav-links container in the DOM.
 */
export function setupHamburgerMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.onclick = () => {
            navLinks.classList.toggle('active');
        };

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

/**
 * Generates and triggers a native mailto email draft addressed to the student
 * containing detailed information about their missing OJT journal dates.
 * Utilizes safe URL encoding to pre-fill recipient, subject, and professional message body.
 *
 * @param {Object} student - The student information object.
 * @param {string} student.email - The unique email address of the student.
 * @param {string} student.firstName - The first name of the student.
 * @param {string} student.lastName - The last name of the student.
 * @param {Array<string>} [student.missingDates] - Array of YYYY-MM-DD strings representing missing journal dates.
 * @returns {void} - Opens the default local mail client.
 */
export function sendReminderEmail(student) {
    if (!student || !student.email) {
        showToast("Error: Student email not found.", "error");
        return;
    }

    const name = `${student.firstName} ${student.lastName}`;
    const missing = student.missingDates || [];
    const formattedDates = missing.length > 0
        ? missing.map(d => `• ${d}`).join('\n')
        : 'multiple daily journals';

    const subject = encodeURIComponent("OJT Daily Journal Submission Reminder");
    
    // Construct a friendly, professional email body in English
    let body = `Hi ${student.firstName},\n\n`;
    body += `This is a reminder from your OJT Coordinator regarding your OJT Daily Journal submissions.\n\n`;
    if (missing.length > 0) {
        body += `We noticed that you have not submitted journals for the following scheduled work day(s):\n`;
        body += `${formattedDates}\n\n`;
    } else {
        body += `We noticed that you have some missing daily journals in your OJT schedule.\n\n`;
    }
    body += `Please log in to the OJT Daily Journal System and submit them as soon as possible to keep your progress updated and ensure compliance.\n\n`;
    body += `Link: ${window.location.origin}\n\n`;
    body += `Best regards,\n`;
    body += `OJT Coordinator`;
    
    const encodedBody = encodeURIComponent(body);
    // Programmatic anchor click is the reliable cross-browser way to trigger a mailto.
    // window.location.href silently fails for mailto: on many browsers.
    const singleLink = document.createElement('a');
    singleLink.href = mailtoUrl;
    singleLink.style.display = 'none';
    document.body.appendChild(singleLink);
    singleLink.click();
    document.body.removeChild(singleLink);

    showToast(`Drafted email reminder for ${student.firstName}!`, "success");
}

/**
 * Generates and triggers a native mailto email addressed to multiple students as BCC recipients.
 * This maintains privacy between recipients (each student cannot see other emails).
 * Composes a generic but professional body instructing all recipients to submit missing journals.
 *
 * @param {Array<Object>} students - Array of student objects who have missing journal entries.
 * @param {string} students[].email - The unique email address of each student to BCC.
 * @param {number} students[].totalMissing - Total count of missing journal entries per student.
 * @returns {void} - Opens the default local mail client with pre-filled BCC, subject, and body.
 */
export function sendBulkReminderEmail(students) {
    if (!students || students.length === 0) {
        showToast("No students to send reminders to.", "info");
        return;
    }

    // Collect all valid student emails for BCC — filter out any empty/undefined values
    const bccEmails = students
        .map(s => s.email)
        .filter(Boolean)
        .join(',');

    if (!bccEmails) {
        showToast("No valid email addresses found.", "error");
        return;
    }

    const subject = encodeURIComponent("OJT Daily Journal Submission Reminder");

    // Compose a generic professional reminder body suitable for all recipients
    let body = `Dear OJT Student,\n\n`;
    body += `This is a reminder from your OJT Coordinator regarding your OJT Daily Journal submissions.\n\n`;
    body += `Our records indicate that you have one or more missing journal entries. `;
    body += `Please log in to the OJT Daily Journal System and submit them as soon as possible `;
    body += `to keep your progress updated and ensure compliance with your OJT requirements.\n\n`;
    body += `Link: ${window.location.origin}\n\n`;
    body += `Best regards,\n`;
    body += `OJT Coordinator`;

    const encodedBody = encodeURIComponent(body);

    // NOTE: Using BCC so recipients cannot see each other's addresses.
    // Build the mailto URL with BCC — no "to" field so it opens a blank compose window.
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bccEmails)}&subject=${subject}&body=${encodedBody}`;

    // Show the toast first so it's visible while the mail client is launching
    showToast(
        `Opening email client for ${students.length} student${students.length !== 1 ? 's' : ''}...`,
        "info"
    );

    // Programmatic anchor click is the reliable cross-browser way to trigger a mailto.
    // window.location.href silently fails for long mailto URLs (many BCC recipients).
    const bulkLink = document.createElement('a');
    bulkLink.href = mailtoUrl;
    bulkLink.style.display = 'none';
    document.body.appendChild(bulkLink);
    bulkLink.click();
    document.body.removeChild(bulkLink);
}

