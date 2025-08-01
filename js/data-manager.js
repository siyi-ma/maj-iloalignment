/**
 * Data Manager for Learning Outcome Alignment System
 * Handles programme data loading and management from programmes.json
 */

class DataManager {
    constructor() {
        this.programmes = null;
        this.currentProgramme = null;
        this.isLoaded = false;
    }

    /**
     * Load programmes data from JSON file
     */
    async loadProgrammes() {
        try {
            const response = await fetch('./data/programmes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.programmes = await response.json();
            this.isLoaded = true;
            return this.programmes;
        } catch (error) {
            console.error('Error loading programmes:', error);
            throw new Error('Failed to load programmes data');
        }
    }

    /**
     * Get all available programmes
     */
    getProgrammes() {
        if (!this.isLoaded) {
            throw new Error('Programmes not loaded. Call loadProgrammes() first.');
        }
        return Object.keys(this.programmes).map(key => ({
            code: key,
            nameEn: this.programmes[key].kavanimetusik,
            nameEt: this.programmes[key].kavanimetusek,
            data: this.programmes[key]
        }));
    }

    /**
     * Set current programme by code
     */
    setCurrentProgramme(programmeCode) {
        if (!this.programmes || !this.programmes[programmeCode]) {
            throw new Error(`Programme ${programmeCode} not found`);
        }
        this.currentProgramme = {
            code: programmeCode,
            ...this.programmes[programmeCode]
        };
        
        // Store in sessionStorage for cross-page access
        sessionStorage.setItem('currentProgramme', JSON.stringify(this.currentProgramme));
        
        return this.currentProgramme;
    }

    /**
     * Get current programme (from memory or sessionStorage)
     */
    getCurrentProgramme() {
        if (this.currentProgramme) {
            return this.currentProgramme;
        }
        
        // Try to load from sessionStorage
        const stored = sessionStorage.getItem('currentProgramme');
        if (stored) {
            this.currentProgramme = JSON.parse(stored);
            return this.currentProgramme;
        }
        
        return null;
    }

    /**
     * Get PLOs for current programme
     */
    getCurrentPLOs() {
        const programme = this.getCurrentProgramme();
        return programme ? programme.plos : [];
    }

    /**
     * Get MLOs for current programme
     */
    getCurrentMLOs() {
        const programme = this.getCurrentProgramme();
        return programme ? programme.mlos : [];
    }

    /**
     * Get MLOs grouped by category/module
     */
    getMLOsByCategory() {
        const mlos = this.getCurrentMLOs();
        const grouped = {};
        
        mlos.forEach(mlo => {
            const category = mlo.mlokood.split('_')[0]; // Extract category from code like 'yl_mlo1'
            if (!grouped[category]) {
                grouped[category] = {
                    name: mlo.mlonimetusik,
                    nameEt: mlo.mlonimetusek,
                    mlos: []
                };
            }
            grouped[category].mlos.push(mlo);
        });
        
        return grouped;
    }

    /**
     * Clear current programme selection
     */
    clearCurrentProgramme() {
        this.currentProgramme = null;
        sessionStorage.removeItem('currentProgramme');
    }

    /**
     * Get programme display name (bilingual support)
     */
    getProgrammeDisplayName(lang = 'en') {
        const programme = this.getCurrentProgramme();
        if (!programme) return '';
        
        return lang === 'et' ? programme.kavanimetusek : programme.kavanimetusik;
    }
}

// Create global instance
window.dataManager = new DataManager();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
