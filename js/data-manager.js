/**
 * Data Manager for Learning Outcome Alignment System
 * Handles programme data loading and management from programmes.json
 */

class DataManager {
    constructor() {
        this.programmes = null;
        this.currentProgramme = null;
        this.currentCourse = null;
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
     * Get courses for current programme
     */
    getCurrentCourses() {
        const programme = this.getCurrentProgramme();
        return programme ? programme.courses : [];
    }

    /**
     * Get course by code
     */
    getCourseByCode(courseCode) {
        const courses = this.getCurrentCourses();
        return courses.find(course => course.ainekood === courseCode);
    }

    /**
     * Get courses grouped by module
     */
    getCoursesByModule() {
        const courses = this.getCurrentCourses();
        const grouped = {};
        
        courses.forEach(course => {
            const moduleCode = course.moodulikood;
            if (!grouped[moduleCode]) {
                grouped[moduleCode] = [];
            }
            grouped[moduleCode].push(course);
        });
        
        return grouped;
    }

    /**
     * Get MLO information for a module code
     */
    getMLOForModule(moduleCode) {
        const mlos = this.getCurrentMLOs();
        return mlos.find(mlo => mlo.mlokood.startsWith(moduleCode));
    }

    /**
     * Set current course by code
     */
    setCurrentCourse(courseCode) {
        if (!courseCode) {
            this.currentCourse = null;
            sessionStorage.removeItem('currentCourse');
            return null;
        }
        
        const course = this.getCourseByCode(courseCode);
        if (course) {
            this.currentCourse = course;
            sessionStorage.setItem('currentCourse', courseCode);
            return course;
        } else {
            console.warn(`Course with code ${courseCode} not found`);
            return null;
        }
    }

    /**
     * Get current selected course
     */
    getCurrentCourse() {
        if (this.currentCourse) {
            return this.currentCourse;
        }
        
        // Try to restore from session storage
        const savedCourseCode = sessionStorage.getItem('currentCourse');
        if (savedCourseCode) {
            return this.setCurrentCourse(savedCourseCode);
        }
        
        return null;
    }

    /**
     * Clear current course selection
     */
    clearCurrentCourse() {
        this.currentCourse = null;
        sessionStorage.removeItem('currentCourse');
    }

    /**
     * Clear current programme selection
     */
    clearCurrentProgramme() {
        this.currentProgramme = null;
        this.currentCourse = null; // Clear course when programme changes
        sessionStorage.removeItem('currentProgramme');
        sessionStorage.removeItem('currentCourse');
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
