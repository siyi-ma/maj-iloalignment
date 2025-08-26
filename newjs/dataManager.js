/**
 * Unified DataManager for Learning Outcome Alignment System
 * Combines programme data loading, management, and access methods
 * Source: Merged from data-manager.js and programme-data-loader.js
 */

class DataManager {
    constructor() {
        this.programmes = null;
        this.currentProgramme = null;
        this.currentCourse = null;
        this.isLoaded = false;
        this.loadingPromise = null;
    }

    /**
     * Load programmes data from JSON file (with promise caching)
     */
    async loadProgrammes() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        this.loadingPromise = this._fetchProgrammes();
        return this.loadingPromise;
    }

    async _fetchProgrammes() {
        try {
            const response = await fetch('../data/programmes.json');
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
        return Object.keys(this.programmes).map(code => ({
            code,
            nameEn: this.programmes[code].kavanimetusik,
            nameEt: this.programmes[code].kavanimetusek,
            data: this.programmes[code]
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
        const stored = sessionStorage.getItem('currentProgramme');
        if (stored) {
            this.currentProgramme = JSON.parse(stored);
            return this.currentProgramme;
        }
        return null;
    }

    /**
     * Get PLOs for a specific programme
     */
    getPLOs(programmeCode) {
        if (!this.isLoaded) {
            throw new Error('Programmes not loaded. Call loadProgrammes() first.');
        }
        const programme = this.programmes[programmeCode];
        if (!programme) {
            throw new Error(`Programme ${programmeCode} not found`);
        }
        return programme.plos || [];
    }

    /**
     * Get MLOs for a specific programme
     */
    getMLOs(programmeCode) {
        if (!this.isLoaded) {
            throw new Error('Programmes not loaded. Call loadProgrammes() first.');
        }
        const programme = this.programmes[programmeCode];
        if (!programme) {
            throw new Error(`Programme ${programmeCode} not found`);
        }
        return programme.mlos || [];
    }

    /**
     * Get CLOs for a specific course in a programme
     */
    getCLOs(programmeCode, courseCode) {
        if (!this.isLoaded) {
            throw new Error('Programmes not loaded. Call loadProgrammes() first.');
        }
        const programme = this.programmes[programmeCode];
        if (!programme || !programme.courses || !programme.courses[courseCode]) {
            throw new Error(`Course ${courseCode} not found in programme ${programmeCode}`);
        }
        return programme.courses[courseCode].clos || [];
    }
}

// Usage: const dataManager = new DataManager();
