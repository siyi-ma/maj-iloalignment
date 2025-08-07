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
