// js/shared-utils.js
// Shared utility functions for score class mapping and formatting

/**
 * Maps a numeric score to a standardized score class for coloring.
 * @param {number|string} score - The numeric score (e.g., 1.0-5.0)
 * @returns {string} - The score class name (e.g., 'score-poor', 'score-weak', ...)
 */
function getScoreClass(score) {
    const num = typeof score === 'string' ? parseFloat(score) : score;
    if (isNaN(num)) return 'score-poor';
    if (num >= 4.5) return 'score-excellent';
    if (num >= 3.5) return 'score-good';
    if (num >= 2.5) return 'score-moderate';
    if (num >= 1.5) return 'score-weak';
    return 'score-poor';
}

/**
 * Formats a score to one decimal place for display.
 * @param {number|string} score
 * @returns {string}
 */
function formatScore(score) {
    const num = typeof score === 'string' ? parseFloat(score) : score;
    if (isNaN(num)) return '';
    return num.toFixed(1);
}

// Export for module usage (if needed)
if (typeof module !== 'undefined') {
    module.exports = { getScoreClass, formatScore };
}

/**
 * Injects floating Home and Back-to-Top buttons into the page if not already present.
 * Adds event listeners for navigation and smooth scroll.
 */
function injectFloatingNavButtons() {
    // Home button
    if (!document.getElementById('home-btn-float')) {
        const homeBtn = document.createElement('button');
        homeBtn.id = 'home-btn-float';
        homeBtn.className = 'floating-btn home-btn-float';
        homeBtn.title = 'Go to Home';
        homeBtn.innerHTML = '<i class="fas fa-home"></i>';
        homeBtn.style.position = 'fixed';
        homeBtn.style.bottom = '32px';
        homeBtn.style.right = '32px';
        homeBtn.style.zIndex = '1000';
        document.body.appendChild(homeBtn);
        homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Back-to-top button
    if (!document.getElementById('back-to-top')) {
        const topBtn = document.createElement('button');
        topBtn.id = 'back-to-top';
        topBtn.className = 'floating-btn back-to-top';
        topBtn.title = 'Back to top';
        topBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        topBtn.style.position = 'fixed';
        topBtn.style.bottom = '80px';
        topBtn.style.right = '32px';
        topBtn.style.zIndex = '1000';
        document.body.appendChild(topBtn);
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Export for module usage (if needed)
if (typeof module !== 'undefined') {
    module.exports = { getScoreClass, formatScore, injectFloatingNavButtons };
}

/**
 * Displays the study programme code (capitalized) followed by kavanimetusik in the target element.
 * Displays PLO-MLO page title and subtitle.
 * Title: Capitalized programme code followed by kavanimetusek
 * Subtitle: kavanimetusik followed by 'PLO-MLO Alignment Analysis'
 * @param {string} code - The programme code (e.g., 'majm')
 * @param {string} kavanimetusik - The programme name in English
 * @param {string} kavanimetusek - The programme name in Estonian
 * @param {string} targetId - The id of the element to update
 * @param {string} titleId - Element id for the title
 * @param {string} subtitleId - Element id for the subtitle
 */
function displayProgrammeTitle(code, kavanimetusik, targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const codeStr = (code || '').toUpperCase();
    el.textContent = codeStr + (kavanimetusik ? ' ' + kavanimetusik : '');
}

function displayProgrammeBilingualInfo(code, kavanimetusik, kavanimetusek, targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const codeStr = (code || '').toUpperCase();
    el.textContent = codeStr + (kavanimetusik ? ' ' + kavanimetusik : '') + (kavanimetusek ? ' (' + kavanimetusek + ')' : '');
}

function displayPloMloPageTitle(code, kavanimetusek, kavanimetusik, titleId, subtitleId) {
    const titleEl = document.getElementById(titleId);
    const subtitleEl = document.getElementById(subtitleId);
    if (titleEl) {
        const codeStr = (code || '').toUpperCase();
        titleEl.textContent = codeStr + (kavanimetusek ? ' ' + kavanimetusek : '');
    }
    if (subtitleEl) {
        subtitleEl.textContent = (kavanimetusik ? kavanimetusik + ' – ' : '') + 'PLO-MLO Alignment Analysis';
    }
}

// Export for module usage (if needed)
if (typeof module !== 'undefined') {
    module.exports = { getScoreClass, formatScore, injectFloatingNavButtons, displayProgrammeTitle };
}
