
/**
 * UI Utilities for custom Toast notifications and confirmation modals.
 */

// Initialize Containers
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
 * Show a toast notification
 * @param {string} message 
 * @param {string} type - 'success', 'error', 'info'
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
 * Show a custom confirmation modal
 * @param {string} title 
 * @param {string} message 
 * @param {string} type - 'warning', 'danger', 'info'
 * @returns {Promise<boolean>}
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
