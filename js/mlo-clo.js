// CLO-MLO Analysis Controller
class CLOMLOController {
    constructor() {
        this.currentProgramme = null;
        this.generatedCLOs = [];
        this.manualCLOs = [];
        this.currentCLOs = [];
        this.alignmentResults = [];
        this.filteredResults = [];
        this.showScores = true;
        this.showColors = true;
        this.currentThreshold = 2;
        this.isGenerating = false;
        
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
            this.populateMLOCategories();
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

    populateMLOCategories() {
        const categoryFilter = document.getElementById('mlo-category-filter');
        const mlosByCategory = window.dataManager.getMLOsByCategory();
        
        // Clear existing options except "All Categories"
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        Object.keys(mlosByCategory).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    setupEventListeners() {
        // Course input controls
        document.getElementById('generate-clos-btn').addEventListener('click', () => {
            this.generateCLOs();
        });

        document.getElementById('manual-clos-btn').addEventListener('click', () => {
            this.showManualCLOInput();
        });

        document.getElementById('regenerate-clos-btn').addEventListener('click', () => {
            this.generateCLOs();
        });

        document.getElementById('proceed-analysis-btn').addEventListener('click', () => {
            this.proceedToAnalysis();
        });

        document.getElementById('proceed-manual-btn').addEventListener('click', () => {
            this.proceedToAnalysisManual();
        });

        // Manual CLO controls
        document.getElementById('add-clo-btn').addEventListener('click', () => {
            this.addManualCLOInput();
        });

        // Analysis controls
        document.getElementById('analyze-clo-btn').addEventListener('click', () => {
            this.performCLOAnalysis();
        });

        document.getElementById('export-clo-btn').addEventListener('click', () => {
            this.exportResults();
        });

        // Filter controls
        document.getElementById('alignment-threshold-clo').addEventListener('change', (e) => {
            this.currentThreshold = parseInt(e.target.value);
            this.applyFilters();
        });

        // Matrix controls
        document.getElementById('toggle-clo-scores').addEventListener('click', () => {
            this.toggleScores();
        });

        document.getElementById('toggle-clo-colors').addEventListener('click', () => {
            this.toggleColors();
        });

        // Details sorting
        document.getElementById('sort-clo-details').addEventListener('change', () => {
            this.sortDetails();
        });

        // Modal controls
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('detail-modal').addEventListener('click', (e) => {
            if (e.target.id === 'detail-modal') {
                this.closeModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    async generateCLOs() {
        if (this.isGenerating) return;

        const courseCode = document.getElementById('course-code').value.trim();
        const courseName = document.getElementById('course-name').value.trim();
        const courseDescription = document.getElementById('course-description').value.trim();
        const cloCount = parseInt(document.getElementById('clo-count').value);

        if (!courseName || !courseDescription) {
            this.showError('Please provide course name and description.');
            return;
        }

        this.isGenerating = true;
        this.showLoading(true, 'Generating CLOs', 'AI is creating Course Learning Outcomes based on your course description...');

        try {
            // Simulate AI generation with sophisticated algorithm
            this.generatedCLOs = await this.generateCLOsWithAI(courseCode, courseName, courseDescription, cloCount);
            
            this.displayGeneratedCLOs();
            this.showSection('generated-clos-section');
            this.showLoading(false);

        } catch (error) {
            console.error('CLO generation error:', error);
            this.showError('Failed to generate CLOs: ' + error.message);
            this.showLoading(false);
        } finally {
            this.isGenerating = false;
        }
    }

    async generateCLOsWithAI(courseCode, courseName, courseDescription, count) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mlos = this.currentProgramme.mlos || [];
        const mlosByCategory = window.dataManager.getMLOsByCategory();
        
        // Sophisticated CLO generation based on MLOs and course description
        const bloomLevels = [
            'understand', 'apply', 'analyze', 'evaluate', 'create', 'demonstrate'
        ];
        
        const actionVerbs = [
            'analyze', 'apply', 'assess', 'calculate', 'compare', 'compile', 'compute',
            'construct', 'create', 'demonstrate', 'design', 'develop', 'evaluate',
            'explain', 'identify', 'implement', 'interpret', 'investigate', 'model',
            'predict', 'solve', 'synthesize', 'validate'
        ];

        const clos = [];
        const categories = Object.keys(mlosByCategory);
        
        for (let i = 0; i < count; i++) {
            const bloomLevel = bloomLevels[i % bloomLevels.length];
            const actionVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
            const category = categories[i % categories.length];
            
            // Generate contextual CLO based on course description and relevant MLOs
            const relevantMLOs = mlosByCategory[category] || [];
            const sampleMLO = relevantMLOs[Math.floor(Math.random() * relevantMLOs.length)];
            
            let cloText = `Students will ${actionVerb} `;
            
            // Extract key concepts from course description
            const concepts = this.extractKeyConcepts(courseDescription);
            const concept = concepts[i % concepts.length] || 'core concepts';
            
            if (sampleMLO) {
                cloText += `${concept} in the context of ${category.toLowerCase()}, `;
                cloText += `demonstrating the ability to ${bloomLevel} `;
                cloText += `practical applications and theoretical foundations `;
                cloText += `as outlined in the course curriculum.`;
            } else {
                cloText += `${concept} through practical application and theoretical analysis, `;
                cloText += `demonstrating mastery of course objectives and `;
                cloText += `the ability to ${bloomLevel} learned principles effectively.`;
            }

            clos.push({
                id: `CLO${i + 1}`,
                text: cloText,
                bloomLevel: bloomLevel,
                category: category,
                isGenerated: true
            });
        }

        return clos;
    }

    extractKeyConcepts(description) {
        // Simple keyword extraction - in a real system, this could use NLP
        const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
        
        const words = description.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !commonWords.has(word));
        
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        const concepts = Object.keys(wordFreq)
            .sort((a, b) => wordFreq[b] - wordFreq[a])
            .slice(0, 8);
        
        return concepts.length > 0 ? concepts : ['fundamental concepts', 'core principles', 'theoretical frameworks', 'practical applications'];
    }

    displayGeneratedCLOs() {
        const container = document.getElementById('clos-list');
        container.innerHTML = '';

        this.generatedCLOs.forEach((clo, index) => {
            const cloCard = document.createElement('div');
            cloCard.className = 'clo-card';
            cloCard.innerHTML = `
                <div class="clo-header">
                    <span class="clo-id">${clo.id}</span>
                    <span class="clo-category">${clo.category}</span>
                    <span class="bloom-level">${clo.bloomLevel}</span>
                </div>
                <div class="clo-content">
                    <p class="clo-text" contenteditable="true">${clo.text}</p>
                </div>
                <div class="clo-actions">
                    <button class="edit-btn" onclick="cloMloController.editCLO(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="cloMloController.deleteCLO(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(cloCard);
        });
    }

    showManualCLOInput() {
        this.generateManualCLOInputs();
        this.showSection('manual-clo-section');
    }

    generateManualCLOInputs() {
        const container = document.getElementById('manual-clo-inputs');
        const count = parseInt(document.getElementById('clo-count').value);
        
        container.innerHTML = '';
        this.manualCLOs = [];

        for (let i = 0; i < count; i++) {
            this.addManualCLOInput(i + 1);
        }
    }

    addManualCLOInput(cloNumber = null) {
        const container = document.getElementById('manual-clo-inputs');
        const index = cloNumber || container.children.length + 1;
        
        const inputGroup = document.createElement('div');
        inputGroup.className = 'manual-clo-input';
        inputGroup.innerHTML = `
            <div class="clo-input-header">
                <label>CLO ${index}</label>
                <button class="remove-clo-btn" onclick="cloMloController.removeManualCLO(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <textarea class="manual-clo-textarea" placeholder="Enter Course Learning Outcome ${index}..." rows="3"></textarea>
        `;
        
        container.appendChild(inputGroup);
    }

    removeManualCLO(button) {
        const inputGroup = button.closest('.manual-clo-input');
        inputGroup.remove();
        this.renumberManualCLOs();
    }

    renumberManualCLOs() {
        const inputs = document.querySelectorAll('.manual-clo-input');
        inputs.forEach((input, index) => {
            const label = input.querySelector('label');
            const textarea = input.querySelector('textarea');
            label.textContent = `CLO ${index + 1}`;
            textarea.placeholder = `Enter Course Learning Outcome ${index + 1}...`;
        });
    }

    proceedToAnalysis() {
        // Update CLOs with any edits
        this.currentCLOs = this.generatedCLOs.map((clo, index) => {
            const textElement = document.querySelectorAll('.clo-text')[index];
            return {
                ...clo,
                text: textElement ? textElement.textContent : clo.text
            };
        });

        this.showAnalysisControls();
    }

    proceedToAnalysisManual() {
        const textareas = document.querySelectorAll('.manual-clo-textarea');
        this.currentCLOs = [];

        textareas.forEach((textarea, index) => {
            const text = textarea.value.trim();
            if (text) {
                this.currentCLOs.push({
                    id: `CLO${index + 1}`,
                    text: text,
                    isGenerated: false
                });
            }
        });

        if (this.currentCLOs.length === 0) {
            this.showError('Please enter at least one Course Learning Outcome.');
            return;
        }

        this.showAnalysisControls();
    }

    showAnalysisControls() {
        this.showSection('analysis-controls-section');
        // Also show the previous sections for context
        document.getElementById('generated-clos-section').classList.remove('hidden');
        document.getElementById('manual-clo-section').classList.remove('hidden');
    }

    async performCLOAnalysis() {
        this.showLoading(true, 'Analyzing CLO-MLO Alignment', 'Computing alignment scores between Course and Module Learning Outcomes...');
        
        try {
            const mlos = this.currentProgramme.mlos || [];
            
            if (this.currentCLOs.length === 0 || mlos.length === 0) {
                throw new Error('No CLOs or MLOs found for analysis');
            }

            this.alignmentResults = [];

            // Perform analysis for each CLO-MLO combination
            let processedCount = 0;
            const totalCombinations = this.currentCLOs.length * mlos.length;

            for (const clo of this.currentCLOs) {
                for (const mlo of mlos) {
                    // Update progress
                    const progress = (processedCount / totalCombinations) * 100;
                    this.updateProgress(progress);

                    // Calculate alignment score
                    const alignmentData = window.alignmentEngine.calculateAlignmentScore(
                        clo.text, 
                        mlo.tulem,
                        {
                            cloIndex: clo.id,
                            mloIndex: mlo.nr || mlos.indexOf(mlo) + 1,
                            mloCategory: mlo.aine || 'Unknown',
                            mloCode: mlo.kood || ''
                        }
                    );

                    this.alignmentResults.push({
                        clo: clo,
                        mlo: mlo,
                        score: alignmentData.overallScore,
                        breakdown: alignmentData.breakdown,
                        justification: alignmentData.justification,
                        improvements: alignmentData.improvements || []
                    });

                    processedCount++;
                    
                    // Small delay to prevent UI blocking
                    if (processedCount % 5 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 1));
                    }
                }
            }

            this.applyFilters();
            this.displayCLOResults();
            this.generateRecommendations();
            this.showLoading(false);

        } catch (error) {
            console.error('CLO analysis error:', error);
            this.showError('Analysis failed: ' + error.message);
            this.showLoading(false);
        }
    }

    applyFilters() {
        if (this.alignmentResults.length === 0) return;
        
        this.filteredResults = this.alignmentResults.filter(result => {
            return result.score >= this.currentThreshold;
        });

        this.updateCLOSummary();
        this.updateCLOMatrix();
        this.updateCLODetails();
    }

    displayCLOResults() {
        // Show all result sections
        document.getElementById('clo-summary-section').classList.remove('hidden');
        document.getElementById('clo-matrix-section').classList.remove('hidden');
        document.getElementById('clo-details-section').classList.remove('hidden');
        document.getElementById('recommendations-section').classList.remove('hidden');
        
        // Enable export button
        document.getElementById('export-clo-btn').disabled = false;
        
        this.updateCLOSummary();
        this.updateCLOMatrix();
        this.updateCLODetails();
    }

    updateCLOSummary() {
        const totalAlignments = this.filteredResults.length;
        const avgScore = totalAlignments > 0 ? 
            (this.filteredResults.reduce((sum, r) => sum + r.score, 0) / totalAlignments).toFixed(1) : 
            '0.0';
        const strongAlignments = this.filteredResults.filter(r => r.score >= 4).length;
        
        // Calculate MLO coverage
        const coveredMLOs = new Set(this.filteredResults.filter(r => r.score >= 3).map(r => r.mlo.tulem));
        const totalMLOs = this.currentProgramme.mlos.length;
        const coverageScore = totalMLOs > 0 ? Math.round((coveredMLOs.size / totalMLOs) * 100) : 0;

        document.getElementById('total-clo-alignments').textContent = totalAlignments;
        document.getElementById('avg-clo-score').textContent = avgScore;
        document.getElementById('strong-clo-alignments').textContent = strongAlignments;
        document.getElementById('coverage-score').textContent = `${coverageScore}%`;
    }

    updateCLOMatrix() {
        const matrix = document.getElementById('clo-alignment-matrix');
        const tbody = matrix.querySelector('tbody');
        const thead = matrix.querySelector('thead tr');
        
        // Clear existing content
        tbody.innerHTML = '';
        
        // Remove existing MLO headers (keep corner cell)
        while (thead.children.length > 1) {
            thead.removeChild(thead.lastChild);
        }

        // Get unique MLOs and CLOs from filtered results
        const uniqueMLOs = [...new Set(this.filteredResults.map(r => r.mlo.tulem))];
        const uniqueCLOs = [...new Set(this.filteredResults.map(r => r.clo.text))];

        if (uniqueMLOs.length === 0 || uniqueCLOs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="100%" class="no-data">No alignments match current filters</td></tr>';
            return;
        }

        // Add MLO headers
        uniqueMLOs.forEach(mloText => {
            const th = document.createElement('th');
            th.className = 'mlo-header';
            th.innerHTML = `<div class="header-text">${this.truncateText(mloText, 50)}</div>`;
            th.title = mloText;
            thead.appendChild(th);
        });

        // Add rows for each CLO
        uniqueCLOs.forEach(cloText => {
            const row = document.createElement('tr');
            
            // CLO header cell
            const cloHeader = document.createElement('td');
            cloHeader.className = 'plo-header'; // Reuse PLO header styling
            cloHeader.innerHTML = `<div class="header-text">${this.truncateText(cloText, 80)}</div>`;
            cloHeader.title = cloText;
            row.appendChild(cloHeader);

            // Alignment cells
            uniqueMLOs.forEach(mloText => {
                const cell = document.createElement('td');
                cell.className = 'alignment-cell';
                
                // Find alignment result
                const alignment = this.filteredResults.find(r => 
                    r.clo.text === cloText && r.mlo.tulem === mloText
                );

                if (alignment) {
                    const score = alignment.score;
                    const scoreClass = `score-${Math.floor(score)}`;
                    
                    cell.className += ` ${scoreClass}`;
                    cell.dataset.score = score;
                    
                    if (this.showScores) {
                        cell.textContent = score.toFixed(1);
                    }
                    
                    if (!this.showColors) {
                        cell.classList.remove(scoreClass);
                    }

                    // Add click handler for details
                    cell.addEventListener('click', () => {
                        this.showCLOAlignmentDetail(alignment);
                    });
                    
                    cell.style.cursor = 'pointer';
                    cell.title = `Click for details\nScore: ${score.toFixed(1)}`;
                } else {
                    cell.textContent = '-';
                    cell.className += ' no-alignment';
                }

                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });
    }

    updateCLODetails() {
        const container = document.getElementById('clo-details-container');
        container.innerHTML = '';

        if (this.filteredResults.length === 0) {
            container.innerHTML = '<div class="no-data">No alignments match current filters</div>';
            return;
        }

        // Sort results
        this.sortDetails();

        // Create detail cards
        this.filteredResults.forEach(alignment => {
            const card = this.createCLODetailCard(alignment);
            container.appendChild(card);
        });
    }

    createCLODetailCard(alignment) {
        const card = document.createElement('div');
        card.className = 'detail-card';
        
        const scoreClass = `score-${Math.floor(alignment.score)}`;
        card.classList.add(scoreClass);

        card.innerHTML = `
            <div class="card-header">
                <div class="score-badge">
                    <span class="score-value">${alignment.score.toFixed(1)}</span>
                    <span class="score-label">Score</span>
                </div>
                <div class="alignment-info">
                    <span class="plo-indicator">${alignment.clo.id}</span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="mlo-indicator">MLO ${alignment.mlo.nr || ''}</span>
                    <span class="category-tag">${alignment.mlo.aine || 'Unknown'}</span>
                </div>
            </div>
            <div class="card-content">
                <div class="outcome-texts">
                    <div class="plo-text">
                        <strong>CLO:</strong> ${this.truncateText(alignment.clo.text, 100)}
                    </div>
                    <div class="mlo-text">
                        <strong>MLO:</strong> ${this.truncateText(alignment.mlo.tulem, 100)}
                    </div>
                </div>
                <div class="justification">
                    <strong>Analysis:</strong> ${this.truncateText(alignment.justification, 150)}
                </div>
            </div>
        `;

        // Add click handler for details
        card.addEventListener('click', () => {
            this.showCLOAlignmentDetail(alignment);
        });

        return card;
    }

    showCLOAlignmentDetail(alignment) {
        const modal = document.getElementById('detail-modal');
        
        // Populate modal content
        document.getElementById('modal-clo-text').textContent = alignment.clo.text;
        document.getElementById('modal-mlo-text').textContent = alignment.mlo.tulem;
        document.querySelector('.mlo-category').textContent = alignment.mlo.aine || 'Unknown';
        document.querySelector('.mlo-code').textContent = alignment.mlo.kood || '';
        
        // Scoring breakdown
        document.getElementById('modal-overall-score').textContent = alignment.score.toFixed(1);
        document.getElementById('modal-keyword-score').textContent = 
            (alignment.breakdown.keywordScore || 0).toFixed(1);
        document.getElementById('modal-semantic-score').textContent = 
            (alignment.breakdown.semanticScore || 0).toFixed(1);
        document.getElementById('modal-bloom-score').textContent = 
            (alignment.breakdown.bloomScore || 0).toFixed(1);
        
        // Justification
        document.getElementById('modal-justification').textContent = alignment.justification;
        
        // Improvements
        const improvementsList = document.getElementById('modal-improvements');
        improvementsList.innerHTML = '';
        
        if (alignment.improvements && alignment.improvements.length > 0) {
            alignment.improvements.forEach(improvement => {
                const li = document.createElement('li');
                li.textContent = improvement;
                improvementsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No specific improvements suggested for this alignment.';
            improvementsList.appendChild(li);
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    generateRecommendations() {
        const container = document.getElementById('recommendations-content');
        const recommendations = this.analyzeAndGenerateRecommendations();
        
        container.innerHTML = '';
        
        recommendations.forEach(rec => {
            const recCard = document.createElement('div');
            recCard.className = `recommendation-card ${rec.type}`;
            recCard.innerHTML = `
                <div class="rec-header">
                    <i class="fas ${rec.icon}"></i>
                    <h4>${rec.title}</h4>
                    <span class="priority ${rec.priority}">${rec.priority}</span>
                </div>
                <div class="rec-content">
                    <p>${rec.description}</p>
                    <ul>
                        ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            `;
            container.appendChild(recCard);
        });
    }

    analyzeAndGenerateRecommendations() {
        const recommendations = [];
        
        // Analyze coverage gaps
        const coveredMLOs = new Set(this.filteredResults.filter(r => r.score >= 3).map(r => r.mlo.aine));
        const allCategories = new Set(this.currentProgramme.mlos.map(m => m.aine));
        const uncoveredCategories = [...allCategories].filter(cat => !coveredMLOs.has(cat));
        
        if (uncoveredCategories.length > 0) {
            recommendations.push({
                type: 'coverage',
                icon: 'fa-exclamation-triangle',
                title: 'Coverage Gap Identified',
                priority: 'high',
                description: `Your CLOs do not adequately cover ${uncoveredCategories.length} MLO categories.`,
                actions: [
                    `Consider adding CLOs that address: ${uncoveredCategories.join(', ')}`,
                    'Review module requirements to ensure comprehensive coverage',
                    'Align course objectives with uncovered learning outcomes'
                ]
            });
        }
        
        // Analyze weak alignments
        const weakAlignments = this.alignmentResults.filter(r => r.score >= 1 && r.score < 3);
        if (weakAlignments.length > 0) {
            recommendations.push({
                type: 'improvement',
                icon: 'fa-chart-line',
                title: 'Strengthen Weak Alignments',
                priority: 'medium',
                description: `${weakAlignments.length} alignments could be improved with targeted revisions.`,
                actions: [
                    'Review CLO wording to use more specific action verbs',
                    'Align CLO complexity with corresponding MLO cognitive levels',
                    'Consider breaking complex CLOs into smaller, focused outcomes'
                ]
            });
        }
        
        // Analyze strong alignments
        const strongAlignments = this.alignmentResults.filter(r => r.score >= 4);
        if (strongAlignments.length > 0) {
            recommendations.push({
                type: 'strength',
                icon: 'fa-thumbs-up',
                title: 'Strong Alignments Identified',
                priority: 'low',
                description: `${strongAlignments.length} excellent alignments show well-designed course outcomes.`,
                actions: [
                    'Maintain the quality of these well-aligned CLOs',
                    'Use these as templates for improving other outcomes',
                    'Consider highlighting these alignments in course documentation'
                ]
            });
        }
        
        return recommendations;
    }

    // Utility methods (similar to PLO-MLO controller)
    sortDetails() {
        const sortBy = document.getElementById('sort-clo-details').value;
        
        this.filteredResults.sort((a, b) => {
            switch (sortBy) {
                case 'score-desc':
                    return b.score - a.score;
                case 'score-asc':
                    return a.score - b.score;
                case 'clo':
                    return a.clo.id.localeCompare(b.clo.id);
                case 'mlo':
                    return (a.mlo.nr || 0) - (b.mlo.nr || 0);
                default:
                    return b.score - a.score;
            }
        });
    }

    toggleScores() {
        this.showScores = !this.showScores;
        const btn = document.getElementById('toggle-clo-scores');
        btn.classList.toggle('active', this.showScores);
        this.updateCLOMatrix();
    }

    toggleColors() {
        this.showColors = !this.showColors;
        const btn = document.getElementById('toggle-clo-colors');
        btn.classList.toggle('active', this.showColors);
        this.updateCLOMatrix();
    }

    closeModal() {
        document.getElementById('detail-modal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    showSection(sectionId) {
        // Only show the specific section, don't hide others unless specified
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('hidden');
        }
    }

    showLoading(show, title = 'Processing...', description = 'Please wait...') {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            document.getElementById('loading-title').textContent = title;
            document.getElementById('loading-description').textContent = description;
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    updateProgress(percentage) {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    showError(message) {
        alert(message);
    }

    exportResults() {
        // Export implementation similar to PLO-MLO controller
        if (this.filteredResults.length === 0) {
            this.showError('No results to export');
            return;
        }

        try {
            const exportData = this.prepareCLOExportData();
            const blob = new Blob([exportData], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `clo-mlo-alignment-${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showError('Failed to export results');
        }
    }

    prepareCLOExportData() {
        const headers = ['CLO ID', 'CLO Text', 'MLO Number', 'MLO Text', 'MLO Category', 'MLO Code', 'Alignment Score', 'Justification'];
        const csvContent = [headers.join(',')];

        this.filteredResults.forEach(alignment => {
            const row = [
                `"${alignment.clo.id}"`,
                `"${alignment.clo.text.replace(/"/g, '""')}"`,
                `"${alignment.mlo.nr || ''}"`,
                `"${alignment.mlo.tulem.replace(/"/g, '""')}"`,
                `"${alignment.mlo.aine || ''}"`,
                `"${alignment.mlo.kood || ''}"`,
                alignment.score.toFixed(1),
                `"${alignment.justification.replace(/"/g, '""')}"`
            ];
            csvContent.push(row.join(','));
        });

        return csvContent.join('\n');
    }

    // CLO editing methods
    editCLO(index) {
        const textElement = document.querySelectorAll('.clo-text')[index];
        if (textElement) {
            textElement.focus();
        }
    }

    deleteCLO(index) {
        if (confirm('Are you sure you want to delete this CLO?')) {
            this.generatedCLOs.splice(index, 1);
            this.displayGeneratedCLOs();
        }
    }
}

// Initialize controller when DOM is ready
let cloMloController;
document.addEventListener('DOMContentLoaded', () => {
    cloMloController = new CLOMLOController();
});

// Make controller globally available for onclick handlers
window.cloMloController = cloMloController;
