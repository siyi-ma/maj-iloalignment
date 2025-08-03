// CLO-MLO Analysis Controller - New Workflow
class CLOMLOController {
    constructor() {
        this.currentProgramme = null;
        this.selectedCourse = null;
        this.currentCLOs = [];
        this.alignmentResults = [];
        this.showScores = true;
        this.showColors = true;
        this.currentThreshold = 2;
        this.editMode = null; // 'edit', 'manual', 'generate'
        
        this.init();
    }

    async init() {
        try {
            // Check if we have a current programme
            this.currentProgramme = window.dataManager.getCurrentProgramme();
            
            if (!this.currentProgramme) {
                // Redirect to home if no programme selected
                window.location.href = 'index.html';
                return;
            }

            this.displayProgrammeInfo();
            this.populateCourseSelector();
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize CLO-MLO analysis. Please try again.');
        }
    }

    displayProgrammeInfo() {
        const programmeNameEl = document.getElementById('current-programme-name');
        if (programmeNameEl && this.currentProgramme) {
            programmeNameEl.textContent = this.currentProgramme.kavanimetusik || 'Unknown Programme';
        }
    }

    populateCourseSelector() {
        const courseSelector = document.getElementById('course-selector');
        const courses = window.dataManager.getCurrentCourses();
        
        // Clear existing options except the default
        courseSelector.innerHTML = '<option value="">Choose a course...</option>';
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.ainekood;
            option.textContent = `${course.ainekood} - ${course.ainenimetusik}`;
            courseSelector.appendChild(option);
        });
    }

    handleCourseSelection(courseCode) {
        if (!courseCode) {
            this.hideCourseInformation();
            return;
        }

        this.selectedCourse = window.dataManager.getCourseByCode(courseCode);
        if (this.selectedCourse) {
            this.displayCourseInformation();
        }
    }

    displayCourseInformation() {
        const course = this.selectedCourse;
        if (!course) return;

        // Show course information section
        this.showSection('course-information-section');

        // Populate course details
        document.getElementById('info-course-code').textContent = course.ainekood || '-';
        document.getElementById('info-course-name-en').textContent = course.ainenimetusik || '-';
        document.getElementById('info-course-name-et').textContent = course.ainenimetusek || '-';
        document.getElementById('info-course-eap').textContent = course.eap || '-';
        document.getElementById('info-course-modules').textContent = course.moodulikood || '-';
        document.getElementById('info-course-assessment').textContent = course.kontrollivorm || '-';
        document.getElementById('info-course-type').textContent = course.KV || '-';
        
        // Course URL
        const urlLink = document.getElementById('info-course-url');
        if (course.aineurl) {
            urlLink.href = course.aineurl;
            urlLink.style.display = 'inline';
        } else {
            urlLink.style.display = 'none';
        }

        // Course aims
        const aimsContent = document.getElementById('info-course-aims');
        const aims = course.eesmarkik || course.eesmarkek || 'No course aims available.';
        aimsContent.innerHTML = aims.replace(/\n/g, '<br>');

        // Display existing CLOs
        this.displayExistingCLOs();

        // Show CLO management section
        this.showSection('clo-management-section');
    }

    displayExistingCLOs() {
        const closContent = document.getElementById('info-existing-clos');
        const course = this.selectedCourse;

        if (course.cloik && Object.keys(course.cloik).length > 0) {
            let closHTML = '';
            Object.entries(course.cloik).forEach(([key, text]) => {
                closHTML += `
                    <div class="existing-clo-item">
                        <div class="existing-clo-header">${key.toUpperCase()}</div>
                        <div class="existing-clo-text">${text}</div>
                    </div>
                `;
            });
            closContent.innerHTML = closHTML;
        } else if (course.cloek && Object.keys(course.cloek).length > 0) {
            let closHTML = '';
            Object.entries(course.cloek).forEach(([key, text]) => {
                closHTML += `
                    <div class="existing-clo-item">
                        <div class="existing-clo-header">${key.toUpperCase()}</div>
                        <div class="existing-clo-text">${text}</div>
                    </div>
                `;
            });
            closContent.innerHTML = closHTML;
        } else {
            closContent.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No existing CLOs found for this course.</p>';
        }
    }

    hideCourseInformation() {
        this.hideSection('course-information-section');
        this.hideSection('clo-management-section');
        this.hideSection('clo-editor-section');
        this.hideSection('analysis-results-section');
        this.selectedCourse = null;
    }

    startEditExistingCLOs() {
        const course = this.selectedCourse;
        if (!course) return;

        this.editMode = 'edit';
        
        // Check if course has existing CLOs
        const hasCLOs = (course.cloik && Object.keys(course.cloik).length > 0) || 
                       (course.cloek && Object.keys(course.cloek).length > 0);

        if (!hasCLOs) {
            this.showError('No existing CLOs found for this course. Please use manual entry or AI generation.');
            return;
        }

        // Show CLO editor section
        this.showSection('clo-editor-section');
        this.hideSection('clo-management-section');

        // Populate editor with existing CLOs
        this.populateCLOEditor(course.cloik || course.cloek);
        
        // Set editor title
        document.getElementById('clo-editor-title').textContent = 'Edit Existing CLOs';
    }

    startManualEntryCLOs() {
        this.editMode = 'manual';
        
        // Show CLO editor section
        this.showSection('clo-editor-section');
        this.hideSection('clo-management-section');

        // Clear editor
        this.populateCLOEditor({});
        
        // Set editor title
        document.getElementById('clo-editor-title').textContent = 'Manual CLO Entry';
    }

    async startAIGenerateCLOs() {
        this.editMode = 'generate';
        
        // Check if API is configured
        if (!this.isAPIConfigured()) {
            this.showError('Please configure your Gemini API key first.');
            this.showAPIConfig();
            return;
        }

        // Show CLO editor section
        this.showSection('clo-editor-section');
        this.hideSection('clo-management-section');

        // Set editor title
        document.getElementById('clo-editor-title').textContent = 'AI Generated CLOs';

        try {
            // Show loading state
            this.showLoading('Generating CLOs with AI...');

            // Generate CLOs using AI
            const generatedCLOs = await this.generateCLOsWithAI();
            
            // Populate editor with generated CLOs
            this.populateCLOEditor(generatedCLOs);
            
            this.hideLoading();
            this.showMessage('CLOs generated successfully! You can edit them before saving.', 'success');
            
        } catch (error) {
            this.hideLoading();
            console.error('AI generation error:', error);
            this.showError('Failed to generate CLOs with AI. Please try again or use manual entry.');
        }
    }

    populateCLOEditor(clos) {
        const editorContainer = document.getElementById('clo-editor-container');
        editorContainer.innerHTML = '';

        // If no CLOs provided, add empty fields for manual entry
        if (!clos || Object.keys(clos).length === 0) {
            for (let i = 1; i <= 5; i++) {
                this.addCLOField(`clo${i}`, '');
            }
            return;
        }

        // Populate with existing CLOs
        Object.entries(clos).forEach(([key, text]) => {
            this.addCLOField(key, text);
        });
    }

    addCLOField(key, text) {
        const editorContainer = document.getElementById('clo-editor-container');
        
        const fieldHTML = `
            <div class="clo-field" data-clo-key="${key}">
                <label for="clo-${key}" class="clo-label">${key.toUpperCase()}</label>
                <textarea id="clo-${key}" class="clo-textarea" placeholder="Enter course learning outcome...">${text}</textarea>
                <button class="remove-clo-btn" onclick="cloController.removeCLOField('${key}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        editorContainer.insertAdjacentHTML('beforeend', fieldHTML);
    }

    removeCLOField(key) {
        const field = document.querySelector(`[data-clo-key="${key}"]`);
        if (field) {
            field.remove();
        }
    }

    addNewCLOField() {
        const editorContainer = document.getElementById('clo-editor-container');
        const existingFields = editorContainer.querySelectorAll('.clo-field');
        const newKey = `clo${existingFields.length + 1}`;
        
        this.addCLOField(newKey, '');
    }

    saveCLOs() {
        const editorContainer = document.getElementById('clo-editor-container');
        const cloFields = editorContainer.querySelectorAll('.clo-field');
        
        const clos = {};
        let hasContent = false;

        cloFields.forEach(field => {
            const key = field.dataset.cloKey;
            const textarea = field.querySelector('.clo-textarea');
            const text = textarea.value.trim();
            
            if (text) {
                clos[key] = text;
                hasContent = true;
            }
        });

        if (!hasContent) {
            this.showError('Please enter at least one CLO before saving.');
            return;
        }

        // Store CLOs for analysis
        this.currentCLOs = Object.entries(clos).map(([key, text], index) => ({
            id: key,
            text: text,
            bloomLevel: this.detectBloomLevel(text),
            index: index
        }));

        // Hide editor and show management section
        this.hideSection('clo-editor-section');
        this.showSection('clo-management-section');

        // Update the display of existing CLOs
        this.displayExistingCLOs();

        this.showMessage('CLOs saved successfully! You can now analyze their alignment with MLOs.', 'success');
    }

    cancelEdit() {
        this.hideSection('clo-editor-section');
        this.showSection('clo-management-section');
        this.editMode = null;
    }

    async performCLOAnalysis() {
        if (!this.currentCLOs || this.currentCLOs.length === 0) {
            this.showError('Please add CLOs before performing analysis.');
            return;
        }

        if (!this.isAPIConfigured()) {
            this.showError('Please configure your Gemini API key for analysis.');
            this.showAPIConfig();
            return;
        }

        try {
            // Show loading state
            this.showLoading('Analyzing CLO-MLO alignment...');

            // Perform analysis
            this.alignmentResults = await this.analyzeCLOMLOAlignment();

            // Show results section
            this.showSection('analysis-results-section');
            this.hideSection('clo-management-section');

            // Display results
            this.displayAlignmentResults();

            this.hideLoading();
            this.showMessage('Alignment analysis completed successfully!', 'success');

        } catch (error) {
            this.hideLoading();
            console.error('Analysis error:', error);
            this.showError('Failed to analyze CLO-MLO alignment. Please try again.');
        }
    }

    backToCLOManagement() {
        this.hideSection('analysis-results-section');
        this.showSection('clo-management-section');
    }

    async generateCLOsWithAI() {
        const course = this.selectedCourse;
        if (!course) throw new Error('No course selected');

        const prompt = this.buildCLOGenerationPrompt(course);
        const apiKey = localStorage.getItem('gemini_api_key');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from API');
        }

        const generatedText = data.candidates[0].content.parts[0].text;
        return this.parseCLOResponse(generatedText);
    }

    buildCLOGenerationPrompt(course) {
        return `Generate 5-7 Course Learning Outcomes (CLOs) for the following course:

Course Code: ${course.ainekood}
Course Name (English): ${course.ainenimetusik}
Course Name (Estonian): ${course.ainenimetusek || 'N/A'}
EAP: ${course.eap}
Module: ${course.moodulikood}
Course Aims: ${course.eesmarkik || course.eesmarkek || 'N/A'}

Please generate CLOs that:
1. Are specific, measurable, and achievable
2. Use action verbs from Bloom's taxonomy
3. Are relevant to the course content and aims
4. Progress from lower to higher cognitive levels
5. Are written in clear, professional language

Format your response as:
CLO1: [learning outcome text]
CLO2: [learning outcome text]
CLO3: [learning outcome text]
etc.

Make sure each CLO starts with "CLO" followed by a number and colon.`;
    }

    parseCLOResponse(responseText) {
        const clos = {};
        const lines = responseText.split('\n');
        
        lines.forEach(line => {
            const match = line.match(/^CLO(\d+):\s*(.+)$/i);
            if (match) {
                const number = match[1];
                const text = match[2].trim();
                clos[`clo${number}`] = text;
            }
        });

        return clos;
    }

    async analyzeCLOMLOAlignment() {
        const course = this.selectedCourse;
        const allMLOs = window.dataManager.getCurrentMLOs();
        const moduleCode = course.moodulikood;
        
        // Get related MLOs for this course's module
        const relatedMLOs = allMLOs.filter(mlo => 
            mlo.mlokood.includes(moduleCode)
        );

        if (relatedMLOs.length === 0) {
            throw new Error('No related MLOs found for this course module');
        }

        const alignmentPrompt = this.buildAlignmentAnalysisPrompt(this.currentCLOs, relatedMLOs);
        const apiKey = localStorage.getItem('gemini_api_key');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: alignmentPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Analysis API request failed: ${response.status}`);
        }

        const data = await response.json();
        const analysisText = data.candidates[0].content.parts[0].text;
        
        return this.parseAlignmentResults(analysisText, this.currentCLOs, relatedMLOs);
    }

    buildAlignmentAnalysisPrompt(clos, mlos) {
        let prompt = `Analyze the alignment between the following Course Learning Outcomes (CLOs) and Module Learning Outcomes (MLOs). Rate each CLO-MLO pair on a scale of 0-4:

0 = No alignment
1 = Weak alignment  
2 = Moderate alignment
3 = Strong alignment
4 = Very strong alignment

CLOs:
`;

        clos.forEach(clo => {
            prompt += `${clo.id.toUpperCase()}: ${clo.text}\n`;
        });

        prompt += `\nMLOs:
`;

        mlos.forEach(mlo => {
            prompt += `${mlo.mlokood}: ${mlo.mlosisuik}\n`;
        });

        prompt += `\nFor each CLO-MLO pair, provide the alignment score and a brief justification. Format your response as:
CLO1-MLO_CODE: score (justification)
CLO2-MLO_CODE: score (justification)
etc.

Be precise and consider semantic similarity, cognitive levels, and learning objectives overlap.`;

        return prompt;
    }

    parseAlignmentResults(analysisText, clos, mlos) {
        const results = [];
        const lines = analysisText.split('\n');
        
        lines.forEach(line => {
            const match = line.match(/^(CLO\d+)-([\w_]+):\s*(\d+)\s*\((.+)\)$/i);
            if (match) {
                const cloId = match[1].toLowerCase();
                const mloCode = match[2];
                const score = parseInt(match[3]);
                const justification = match[4];
                
                const clo = clos.find(c => c.id === cloId);
                const mlo = mlos.find(m => m.mlokood === mloCode);
                
                if (clo && mlo) {
                    results.push({
                        clo: clo,
                        mlo: mlo,
                        score: score,
                        justification: justification
                    });
                }
            }
        });

        return results;
    }

    displayAlignmentResults() {
        const resultsContainer = document.getElementById('alignment-matrix-container');
        
        if (!this.alignmentResults || this.alignmentResults.length === 0) {
            resultsContainer.innerHTML = '<p>No alignment results to display.</p>';
            return;
        }

        // Create matrix table
        const table = this.createAlignmentMatrix();
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(table);

        // Update summary statistics
        this.updateAlignmentSummary();
    }

    createAlignmentMatrix() {
        const table = document.createElement('table');
        table.className = 'alignment-matrix';

        // Get unique MLOs and CLOs from results
        const uniqueMLOs = [...new Set(this.alignmentResults.map(r => r.mlo.mlokood))];
        const uniqueCLOs = [...new Set(this.alignmentResults.map(r => r.clo.id))];

        // Create header row
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>CLO \\ MLO</th>';
        uniqueMLOs.forEach(mloCode => {
            const th = document.createElement('th');
            th.textContent = mloCode;
            th.className = 'mlo-header';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create data rows
        uniqueCLOs.forEach(cloId => {
            const row = document.createElement('tr');
            
            // CLO header cell
            const cloHeader = document.createElement('td');
            cloHeader.textContent = cloId.toUpperCase();
            cloHeader.className = 'clo-header';
            row.appendChild(cloHeader);

            // Score cells
            uniqueMLOs.forEach(mloCode => {
                const cell = document.createElement('td');
                const result = this.alignmentResults.find(r => 
                    r.clo.id === cloId && r.mlo.mlokood === mloCode
                );

                if (result) {
                    cell.textContent = this.showScores ? result.score : '';
                    cell.className = `score-cell score-${result.score}`;
                    cell.title = result.justification;
                    
                    if (result.score >= this.currentThreshold) {
                        cell.classList.add('above-threshold');
                    }
                } else {
                    cell.textContent = '-';
                    cell.className = 'score-cell no-data';
                }

                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        return table;
    }

    updateAlignmentSummary() {
        if (!this.alignmentResults || this.alignmentResults.length === 0) return;

        const totalPairs = this.alignmentResults.length;
        const strongAlignments = this.alignmentResults.filter(r => r.score >= 3).length;
        const averageScore = this.alignmentResults.reduce((sum, r) => sum + r.score, 0) / totalPairs;

        const summaryContainer = document.getElementById('alignment-summary');
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total Alignments:</span>
                        <span class="stat-value">${totalPairs}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Strong Alignments (≥3):</span>
                        <span class="stat-value">${strongAlignments}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Average Score:</span>
                        <span class="stat-value">${averageScore.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }
    }

    applyFilters() {
        const cells = document.querySelectorAll('.score-cell');
        cells.forEach(cell => {
            const scoreText = cell.textContent;
            if (scoreText && scoreText !== '-') {
                const score = parseInt(scoreText);
                if (score >= this.currentThreshold) {
                    cell.classList.add('above-threshold');
                    cell.style.display = '';
                } else {
                    cell.classList.remove('above-threshold');
                    cell.style.display = this.showColors ? '' : 'none';
                }
            }
        });
    }

    toggleScores() {
        this.showScores = !this.showScores;
        const btn = document.getElementById('toggle-clo-scores');
        btn.textContent = this.showScores ? 'Hide Scores' : 'Show Scores';
        
        const scoreCells = document.querySelectorAll('.score-cell');
        scoreCells.forEach(cell => {
            if (this.showScores) {
                cell.style.opacity = '1';
            } else {
                cell.style.opacity = '0.7';
                if (cell.textContent && cell.textContent !== '-') {
                    cell.textContent = '';
                }
            }
        });
    }

    exportResults() {
        if (!this.alignmentResults || this.alignmentResults.length === 0) {
            this.showError('No results to export.');
            return;
        }

        const exportData = {
            course: {
                code: this.selectedCourse.ainekood,
                name: this.selectedCourse.ainenimetusik,
                module: this.selectedCourse.moodulikood
            },
            clos: this.currentCLOs,
            results: this.alignmentResults,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clo-mlo-alignment-${this.selectedCourse.ainekood}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage('Results exported successfully!', 'success');
    }

    detectBloomLevel(text) {
        const bloomKeywords = {
            1: ['remember', 'recall', 'recognize', 'identify', 'define', 'list'],
            2: ['understand', 'explain', 'describe', 'summarize', 'interpret', 'classify'],
            3: ['apply', 'use', 'implement', 'execute', 'demonstrate', 'solve'],
            4: ['analyze', 'examine', 'compare', 'contrast', 'categorize', 'differentiate'],
            5: ['evaluate', 'assess', 'critique', 'judge', 'justify', 'argue'],
            6: ['create', 'design', 'develop', 'construct', 'formulate', 'compose']
        };

        const lowerText = text.toLowerCase();
        
        for (let level = 6; level >= 1; level--) {
            if (bloomKeywords[level].some(keyword => lowerText.includes(keyword))) {
                return level;
            }
        }
        
        return 2; // Default to understanding level
    }

    setupEventListeners() {
        // Course selection
        document.getElementById('course-selector').addEventListener('change', (e) => {
            this.handleCourseSelection(e.target.value);
        });

        // CLO Management options
        document.getElementById('edit-existing-clos').addEventListener('click', () => {
            this.startEditExistingCLOs();
        });

        document.getElementById('manual-entry-clos').addEventListener('click', () => {
            this.startManualEntryCLOs();
        });

        document.getElementById('ai-generate-clos').addEventListener('click', () => {
            this.startAIGenerateCLOs();
        });

        // CLO Editor actions
        document.getElementById('save-clos-btn').addEventListener('click', () => {
            this.saveCLOs();
        });

        document.getElementById('cancel-edit-btn').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Analysis actions
        document.getElementById('analyze-alignment-btn').addEventListener('click', () => {
            this.performCLOAnalysis();
        });

        document.getElementById('back-to-clo-management').addEventListener('click', () => {
            this.backToCLOManagement();
        });

        // Matrix controls
        document.getElementById('alignment-threshold-clo').addEventListener('change', (e) => {
            this.currentThreshold = parseInt(e.target.value);
            const thresholdDisplay = document.getElementById('threshold-value');
            if (thresholdDisplay) {
                thresholdDisplay.textContent = this.currentThreshold;
            }
            this.applyFilters();
        });

        document.getElementById('toggle-clo-scores').addEventListener('click', () => {
            this.toggleScores();
        });

        document.getElementById('export-clo-btn').addEventListener('click', () => {
            this.exportResults();
        });

        // Modal controls
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal();
            });
        });

        // API Configuration
        document.getElementById('api-config-btn').addEventListener('click', () => {
            this.showAPIConfig();
        });

        document.getElementById('close-api-config').addEventListener('click', () => {
            this.hideAPIConfig();
        });

        document.getElementById('save-api-key').addEventListener('click', () => {
            this.saveAPIKey();
        });

        document.getElementById('test-api-key').addEventListener('click', () => {
            this.testAPIKey();
        });

        document.getElementById('clear-api-key').addEventListener('click', () => {
            this.clearAPIKey();
        });
    }

    // Utility methods
    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('hidden');
        }
    }

    hideSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('hidden');
        }
    }

    showLoading(message) {
        const modal = document.getElementById('loading-modal');
        const messageEl = document.getElementById('loading-message');
        if (modal && messageEl) {
            messageEl.textContent = message;
            modal.classList.remove('hidden');
        }
    }

    hideLoading() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showMessage(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    hideModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // API Configuration methods
    isAPIConfigured() {
        return !!localStorage.getItem('gemini_api_key');
    }

    showAPIConfig() {
        const modal = document.getElementById('api-config-modal');
        const keyInput = document.getElementById('api-key-input');
        
        if (modal) {
            modal.classList.remove('hidden');
        }

        if (keyInput) {
            const existingKey = localStorage.getItem('gemini_api_key');
            keyInput.value = existingKey ? '••••••••••••••••' : '';
        }
    }

    hideAPIConfig() {
        const modal = document.getElementById('api-config-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    saveAPIKey() {
        const keyInput = document.getElementById('api-key-input');
        const key = keyInput.value.trim();

        if (!key || key === '••••••••••••••••') {
            this.showError('Please enter a valid API key.');
            return;
        }

        localStorage.setItem('gemini_api_key', key);
        this.showMessage('API key saved successfully!', 'success');
        this.hideAPIConfig();
    }

    async testAPIKey() {
        const apiKey = localStorage.getItem('gemini_api_key');
        
        if (!apiKey) {
            this.showError('Please save an API key first.');
            return;
        }

        try {
            this.showLoading('Testing API connection...');

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Hello, this is a test. Please respond with "API test successful".'
                        }]
                    }]
                })
            });

            this.hideLoading();

            if (response.ok) {
                this.showMessage('API key is working correctly!', 'success');
            } else {
                this.showError('API key test failed. Please check your key.');
            }

        } catch (error) {
            this.hideLoading();
            this.showError('Failed to test API key. Please check your connection.');
        }
    }

    clearAPIKey() {
        localStorage.removeItem('gemini_api_key');
        const keyInput = document.getElementById('api-key-input');
        if (keyInput) {
            keyInput.value = '';
        }
        this.showMessage('API key cleared.', 'info');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cloController = new CLOMLOController();
});
