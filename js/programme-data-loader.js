/**
 * Data Loader Service for Programmes JSON
 * Provides methods to load and access PLO, MLO, and CLO data
 */

class ProgrammeDataLoader {
    constructor() {
        this.data = null;
        this.isLoaded = false;
        this.loadingPromise = null;
    }

    /**
     * Load programmes data from JSON file
     */
    async loadData() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this._fetchData();
        return this.loadingPromise;
    }

    async _fetchData() {
        try {
            const response = await fetch('data/programmes.json');
            if (!response.ok) {
                throw new Error(`Failed to load programmes data: ${response.status}`);
            }
            this.data = await response.json();
            this.isLoaded = true;
            console.log('✅ Programmes data loaded successfully');
            return this.data;
        } catch (error) {
            console.error('❌ Error loading programmes data:', error);
            throw error;
        }
    }

    /**
     * Get all available programmes
     */
    getProgrammes() {
        if (!this.isLoaded) {
            throw new Error('Data not loaded. Call loadData() first.');
        }
        
        return Object.keys(this.data).map(programmeCode => ({
            code: programmeCode,
            nameEn: this.data[programmeCode].kavanimetusik,
            nameEt: this.data[programmeCode].kavanimetusek
        }));
    }

    /**
     * Get PLOs for a specific programme
     */
    getPLOs(programmeCode) {
        if (!this.isLoaded) {
            throw new Error('Data not loaded. Call loadData() first.');
        }

        const programme = this.data[programmeCode];
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
            throw new Error('Data not loaded. Call loadData() first.');
        }

        const programme = this.data[programmeCode];
        if (!programme) {
            throw new Error(`Programme ${programmeCode} not found`);
        }

        return programme.mlos || [];
    }

    /**
     * Get courses for a specific programme
     */
    getCourses(programmeCode) {
        if (!this.isLoaded) {
            throw new Error('Data not loaded. Call loadData() first.');
        }

        const programme = this.data[programmeCode];
        if (!programme) {
            throw new Error(`Programme ${programmeCode} not found`);
        }

        return programme.courses || [];
    }

    /**
     * Get CLOs for a specific course
     */
    getCLOs(programmeCode, courseCode) {
        const courses = this.getCourses(programmeCode);
        const course = courses.find(c => c.ainekood === courseCode);
        
        if (!course) {
            throw new Error(`Course ${courseCode} not found in programme ${programmeCode}`);
        }

        return {
            courseInfo: {
                code: course.ainekood,
                nameEn: course.ainenimetusik,
                nameEt: course.ainenimetusek,
                credits: course.eap,
                assessmentType: course.kontrollivorm
            },
            closEn: course.cloik || {},
            closEt: course.cloek || {}
        };
    }

    /**
     * Search courses by name or code
     */
    searchCourses(programmeCode, searchTerm) {
        const courses = this.getCourses(programmeCode);
        const term = searchTerm.toLowerCase();
        
        return courses.filter(course => 
            course.ainekood.toLowerCase().includes(term) ||
            course.ainenimetusik.toLowerCase().includes(term) ||
            course.ainenimetusek.toLowerCase().includes(term)
        );
    }

    /**
     * Get programme info
     */
    getProgrammeInfo(programmeCode) {
        if (!this.isLoaded) {
            throw new Error('Data not loaded. Call loadData() first.');
        }

        const programme = this.data[programmeCode];
        if (!programme) {
            throw new Error(`Programme ${programmeCode} not found`);
        }

        return {
            code: programmeCode,
            nameEn: programme.kavanimetusik,
            nameEt: programme.kavanimetusek,
            ploCount: (programme.plos || []).length,
            mloCount: (programme.mlos || []).length,
            courseCount: (programme.courses || []).length
        };
    }

    /**
     * Check if data is loaded
     */
    isDataLoaded() {
        return this.isLoaded;
    }
}

// Create global instance
window.programmeDataLoader = new ProgrammeDataLoader();

// Auto-load data when script loads
window.programmeDataLoader.loadData().catch(error => {
    console.error('Failed to auto-load programmes data:', error);
});
