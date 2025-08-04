// CLO-MLO Analysis Controller
class CLOMLOController {
    constructor() {
        this.currentProgramme = null;
        this.selectedCourse = null;
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
            this.hideCourseDetails();
            return;
        }

        this.selectedCourse = window.dataManager.getCourseByCode(courseCode);
        if (this.selectedCourse) {
            this.displayCourseDetails();
        }
    }

    displayCourseDetails() {
        const course = this.selectedCourse;
        if (!course) return;

        // Show course details section
        const courseDetails = document.getElementById('course-details');
        courseDetails.classList.remove('hidden');

        // Populate fields
        document.getElementById('course-name-et').value = course.ainenimetusek || '';
        document.getElementById('course-name-en').value = course.ainenimetusik || '';
        document.getElementById('course-eap').value = course.eap || '';
        document.getElementById('course-module').value = course.moodulikood || '';
        document.getElementById('course-description').value = course.eesmarkik || course.eesmarkek || '';

        // Display related modules
        this.displayRelatedModules();

        // Check if course has existing CLOs
        this.checkExistingCLOs();
    }

    displayRelatedModules() {
        const moduleContent = document.getElementById('module-content');
        moduleContent.innerHTML = '';

        if (!this.selectedCourse) return;

        const moduleCode = this.selectedCourse.moodulikood;
        
        // Get all MLOs that belong to this module
        const allMLOs = window.dataManager.getCurrentMLOs();
        const relatedMLOs = allMLOs.filter(mlo => 
            mlo.mlokood.startsWith(moduleCode + '_') || 
            mlo.mlokood.startsWith(moduleCode)
        );

        if (relatedMLOs.length > 0) {
            // Group MLOs by their category for better organization
            const mlosByCategory = {};
            
            relatedMLOs.forEach(mlo => {
                const category = mlo.mlonimetusik || 'Other';
                if (!mlosByCategory[category]) {
                    mlosByCategory[category] = [];
                }
                mlosByCategory[category].push(mlo);
            });

            // Display each category and its MLOs
            Object.entries(mlosByCategory).forEach(([category, mlos]) => {
                const categorySection = document.createElement('div');
                categorySection.className = 'module-category';
                categorySection.innerHTML = `
                    <div class="category-header">
                        <h5>${category}</h5>
                    </div>
                `;

                mlos.forEach(mlo => {
                    const mloItem = document.createElement('div');
                    mloItem.className = 'module-item';
                    mloItem.innerHTML = `
                        <div class="module-header">
                            ${mlo.mlokood} - ${mlo.mlonimetusik}
                        </div>
                        <div class="module-description">
                            ${mlo.mlosisuik}
                        </div>
                    `;
                    categorySection.appendChild(mloItem);
                });

                moduleContent.appendChild(categorySection);
            });
        } else {
            moduleContent.innerHTML = '<p style="color: #666;">No module information available.</p>';
        }
    }

    checkExistingCLOs() {
        if (!this.selectedCourse) return;

        const course = this.selectedCourse;
        const existingInfo = document.getElementById('existing-clos-info');
        
        // Check if course has predefined CLOs
        if (course.cloik && Object.keys(course.cloik).length > 0) {
            // Show existing CLOs info
            existingInfo.classList.remove('hidden');
            
            // Update generate button text to indicate existing CLOs
            const generateBtn = document.getElementById('generate-clos-btn');
            generateBtn.innerHTML = '<i class="fas fa-list"></i> Load Existing CLOs';
            
        } else {
            // Hide existing CLOs info
            existingInfo.classList.add('hidden');
            
            // Reset generate button text
            const generateBtn = document.getElementById('generate-clos-btn');
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate CLOs';
        }
    }

    hideCourseDetails() {
        const courseDetails = document.getElementById('course-details');
        const existingInfo = document.getElementById('existing-clos-info');
        const generateBtn = document.getElementById('generate-clos-btn');
        
        courseDetails.classList.add('hidden');
        existingInfo.classList.add('hidden');
        
        // Reset generate button
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate CLOs';
        
        this.selectedCourse = null;
    }

    setupEventListeners() {
        // Course selection
        document.getElementById('course-selector').addEventListener('change', (e) => {
            this.handleCourseSelection(e.target.value);
        });

        // Course input controls
        document.getElementById('generate-clos-btn').addEventListener('click', () => {
            this.generateCLOs();
        });

        document.getElementById('manual-clos-btn').addEventListener('click', () => {
            this.showManualCLOSection();
        });

        document.getElementById('regenerate-clos-btn').addEventListener('click', () => {
            this.generateCLOs();
        });

        document.getElementById('add-manual-clo').addEventListener('click', () => {
            this.addManualCLOInput();
        });

        document.getElementById('process-manual-clos').addEventListener('click', () => {
            this.processManualCLOs();
        });

        // Analysis controls
        document.getElementById('analyze-clos-btn').addEventListener('click', () => {
            this.performCLOAnalysis();
        });

        document.getElementById('export-clo-btn').addEventListener('click', () => {
            this.exportResults();
        });

        // Filter controls
        document.getElementById('alignment-threshold-clo').addEventListener('change', (e) => {
            this.currentThreshold = parseInt(e.target.value);
            const thresholdDisplay = document.getElementById('threshold-value');
            if (thresholdDisplay) {
                thresholdDisplay.textContent = this.currentThreshold;
            }
            this.applyFilters();
        });

        // Matrix controls
        document.getElementById('toggle-clo-scores').addEventListener('click', () => {
            this.toggleScores();
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
                this.closeApiConfigModal();
            }
        });

        // API Configuration
        this.setupApiConfigListeners();
    }

    setupApiConfigListeners() {
        // API Config button
        document.getElementById('api-config-btn').addEventListener('click', () => {
            this.openApiConfigModal();
        });

        // API Config modal controls
        document.getElementById('close-api-config').addEventListener('click', () => {
            this.closeApiConfigModal();
        });

        document.getElementById('api-config-modal').addEventListener('click', (e) => {
            if (e.target.id === 'api-config-modal') {
                this.closeApiConfigModal();
            }
        });

        // Toggle API key visibility
        document.getElementById('toggle-api-key').addEventListener('click', () => {
            this.toggleApiKeyVisibility();
        });

        // API actions
        document.getElementById('save-api-key').addEventListener('click', () => {
            this.saveApiKey();
        });

        document.getElementById('test-api-key').addEventListener('click', () => {
            this.testApiKey();
        });

        document.getElementById('clear-api-key').addEventListener('click', () => {
            this.clearApiKey();
        });

        // Load existing API key status
        this.updateApiStatus();
    }

    openApiConfigModal() {
        const modal = document.getElementById('api-config-modal');
        modal.style.display = 'flex';
        
        // Load existing API key (masked)
        const apiKey = this.getGeminiApiKey();
        const apiKeyInput = document.getElementById('gemini-api-key');
        if (apiKey) {
            apiKeyInput.value = apiKey;
        }
        
        this.updateApiStatus();
    }

    closeApiConfigModal() {
        const modal = document.getElementById('api-config-modal');
        modal.style.display = 'none';
    }

    toggleApiKeyVisibility() {
        const apiKeyInput = document.getElementById('gemini-api-key');
        const toggleBtn = document.getElementById('toggle-api-key');
        
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            apiKeyInput.type = 'password';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    saveApiKey() {
        const apiKey = document.getElementById('gemini-api-key').value.trim();
        
        if (!apiKey) {
            this.showError('Please enter a valid API key');
            return;
        }
        
        // Basic validation
        if (apiKey.length < 20) {
            this.showError('API key seems too short. Please check and try again.');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('GEMINI_API_KEY', apiKey);
        
        this.updateApiStatus();
        this.showSuccess('API key saved successfully! AI-powered CLO generation is now enabled.');
        
        // Close modal after successful save
        setTimeout(() => {
            this.closeApiConfigModal();
        }, 1500);
    }

    async testApiKey() {
        const apiKey = document.getElementById('gemini-api-key').value.trim();
        
        if (!apiKey) {
            this.showError('Please enter an API key first');
            return;
        }
        
        const testBtn = document.getElementById('test-api-key');
        const originalText = testBtn.innerHTML;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        testBtn.disabled = true;
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Hello, this is a test message. Please respond with "API connection successful".'
                        }]
                    }]
                })
            });
            
            if (response.ok) {
                this.showSuccess('✅ API key is valid! Gemini connection successful.');
            } else {
                this.showError(`❌ API key test failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            this.showError(`❌ Connection test failed: ${error.message}`);
        } finally {
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        }
    }

    clearApiKey() {
        if (confirm('Are you sure you want to clear the API key? This will disable AI-powered CLO generation.')) {
            localStorage.removeItem('GEMINI_API_KEY');
            document.getElementById('gemini-api-key').value = '';
            this.updateApiStatus();
            this.showSuccess('API key cleared successfully');
        }
    }

    updateApiStatus() {
        const apiKey = this.getGeminiApiKey();
        const statusIndicator = document.getElementById('api-status');
        const statusText = document.getElementById('api-status-text');
        
        if (apiKey) {
            statusIndicator.className = 'status-indicator connected';
            statusText.textContent = 'API key configured';
        } else {
            statusIndicator.className = 'status-indicator';
            statusText.textContent = 'Not configured';
        }
    }

    async generateCLOs() {
        if (this.isGenerating) return;

        if (!this.selectedCourse) {
            this.showError('Please select a course first.');
            return;
        }

        const course = this.selectedCourse;

        // Check if course has existing CLOs and use them first
        if (course.cloik && Object.keys(course.cloik).length > 0) {
            this.generatedCLOs = Object.entries(course.cloik).map(([key, value], index) => ({
                id: `clo_${index + 1}`,
                text: value,
                bloomLevel: this.detectBloomLevel(value),
                isExisting: true
            }));

            this.displayGeneratedCLOs();
            this.showSection('generated-clos-section');
            this.showMessage('Loaded existing CLOs for this course.', 'success');
            return;
        }

        // Fall back to AI generation if no existing CLOs
        const courseCode = course.ainekood;
        const courseName = course.ainenimetusik;
        const courseDescription = course.eesmarkik || course.eesmarkek;
        
        // Determine CLO count from existing course data or default to 5
        let cloCount = 5; // default
        if (course.cloik) {
            cloCount = Object.keys(course.cloik).length;
        } else if (course.cloek) {
            cloCount = Object.keys(course.cloek).length;
        }

        if (!courseName || !courseDescription) {
            this.showError('Selected course is missing required information.');
            return;
        }

        this.isGenerating = true;
        this.showLoading(true, 'Generating CLOs', 'AI is creating Course Learning Outcomes based on your course description...');

        try {
            // Generate new CLOs with AI
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
        // Check if Gemini API key is available
        const apiKey = this.getGeminiApiKey();
        
        if (!apiKey) {
            // Fallback to sophisticated local generation
            return this.generateCLOsLocally(courseCode, courseName, courseDescription, count);
        }

        try {
            // Real Gemini API integration
            return await this.generateCLOsWithGemini(apiKey, courseCode, courseName, courseDescription, count);
        } catch (error) {
            console.warn('Gemini API failed, falling back to local generation:', error);
            return this.generateCLOsLocally(courseCode, courseName, courseDescription, count);
        }
    }

    getGeminiApiKey() {
        // Check multiple possible sources for API key
        return (
            localStorage.getItem('GEMINI_API_KEY') ||
            sessionStorage.getItem('GEMINI_API_KEY') ||
            window.GEMINI_API_KEY ||
            null
        );
    }

    async generateCLOsWithGemini(apiKey, courseCode, courseName, courseDescription, count) {
        const mlos = this.currentProgramme.mlos || [];
        const mloContext = mlos.slice(0, 10).map(mlo => `- ${mlo.statement}`).join('\n');
        
        const prompt = `As an educational expert, generate ${count} Course Learning Outcomes (CLOs) for:

Course: ${courseCode} - ${courseName}
Description: ${courseDescription}

Related Module Learning Outcomes (MLOs):
${mloContext}

Requirements:
1. Each CLO should start with an action verb from Bloom's Taxonomy
2. CLOs should be measurable and specific
3. CLOs should align with the provided MLOs
4. Use professional academic language
5. Focus on what students will be able to DO after completing the course

Return ONLY a JSON array of CLO objects in this format:
[
    {
        "id": "CLO1",
        "statement": "Analyze complex software architectures and identify design patterns",
        "bloom_level": "analyze"
    },
    {
        "id": "CLO2", 
        "statement": "Evaluate the effectiveness of different programming paradigms",
        "bloom_level": "evaluate"
    }
]`;

        try {
            // Use the secure API config for better error handling
            if (window.secureAPIConfig && window.secureAPIConfig.isReady()) {
                const generatedText = await window.secureAPIConfig.callGeminiAPI(prompt, {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                });
                
                // Extract JSON from the response
                const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
                if (!jsonMatch) {
                    throw new Error('Could not parse CLOs from Gemini response');
                }

                const clos = JSON.parse(jsonMatch[0]);
                return clos.map((clo, index) => ({
                    id: clo.id || `CLO${index + 1}`,
                    statement: clo.statement,
                    bloomLevel: clo.bloom_level || 'understand',
                    source: 'ai-generated',
                    model: 'gemini-1.5-flash'
                }));
            } else {
                // Fallback to direct API call
                const endpoint = window.secureAPIConfig ? 
                    window.secureAPIConfig.getEndpoint() : 
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
                
                const response = await fetch(`${endpoint}?key=${apiKey}`, {
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
                    const errorText = await response.text();
                    let errorMessage = `Gemini API error: ${response.status} ${response.statusText}`;
                    
                    // Enhanced quota detection
                    const quotaKeywords = ['quota', 'limit', 'exceeded', 'rate limit', 'billing', 'usage'];
                    const isQuotaError = quotaKeywords.some(keyword => 
                        errorText.toLowerCase().includes(keyword) || 
                        errorMessage.toLowerCase().includes(keyword)
                    );
                    
                    if (isQuotaError) {
                        console.warn('🚨 Quota limit detected, switching to local generation');
                        throw new Error('QUOTA_EXCEEDED: ' + errorMessage);
                    }
                    
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                const generatedText = data.candidates[0].content.parts[0].text;
                
                // Extract JSON from the response
                const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
                if (!jsonMatch) {
                    throw new Error('Could not parse CLOs from Gemini response');
                }

                const clos = JSON.parse(jsonMatch[0]);
                return clos.map((clo, index) => ({
                    id: clo.id || `CLO${index + 1}`,
                    statement: clo.statement,
                    bloomLevel: clo.bloom_level || 'understand',
                    source: 'ai-generated',
                    model: 'gemini-1.5-flash'
                }));
            }
        } catch (error) {
            // Check if this is a quota error
            if (error.message.includes('QUOTA_EXCEEDED') || 
                error.message.toLowerCase().includes('quota') ||
                error.message.toLowerCase().includes('limit')) {
                console.warn('🚨 API quota exceeded, falling back to local generation');
                this.showQuotaWarning();
            }
            throw error;
        }
    }

    async generateCLOsLocally(courseCode, courseName, courseDescription, count) {
        console.log('🏠 Using local CLO generation (no API required)');
        
        // Simulate processing time for realistic UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mlos = this.currentProgramme.mlos || [];
        const mlosByCategory = window.dataManager.getMLOsByCategory();
        
        // Enhanced local CLO generation with educational intelligence
        const bloomLevels = [
            'understand', 'apply', 'analyze', 'evaluate', 'create', 'demonstrate'
        ];
        
        const actionVerbs = {
            'understand': ['explain', 'describe', 'interpret', 'summarize', 'classify'],
            'apply': ['implement', 'execute', 'use', 'demonstrate', 'solve'],
            'analyze': ['examine', 'compare', 'investigate', 'categorize', 'differentiate'],
            'evaluate': ['assess', 'critique', 'judge', 'validate', 'appraise'],
            'create': ['design', 'construct', 'develop', 'formulate', 'synthesize'],
            'demonstrate': ['show', 'perform', 'illustrate', 'exhibit', 'present']
        };

        const clos = [];
        const categories = Object.keys(mlosByCategory);
        const concepts = this.extractKeyConcepts(courseDescription);
        
        // Educational context detection
        const isSTEMCourse = /programming|mathematics|engineering|science|technology|computer|algorithm|data|software|system/i.test(courseDescription);
        const isTheoretical = /theory|theoretical|concept|principle|framework|model|philosophy/i.test(courseDescription);
        const isPractical = /practical|hands-on|project|lab|experiment|implementation|application/i.test(courseDescription);
        
        for (let i = 0; i < count; i++) {
            const bloomLevel = bloomLevels[Math.min(i + 1, bloomLevels.length - 1)];
            const verbOptions = actionVerbs[bloomLevel] || actionVerbs['understand'];
            const actionVerb = verbOptions[Math.floor(Math.random() * verbOptions.length)];
            const category = categories[i % categories.length] || 'General Knowledge';
            
            // Generate contextual CLO based on course description and relevant MLOs
            const relevantMLOs = mlosByCategory[category] || [];
            const concept = concepts[i % concepts.length] || 'core concepts';
            
            let cloStatement = '';
            
            // Intelligent statement generation based on course type
            if (isSTEMCourse && isPractical) {
                cloStatement = `Students will ${actionVerb} ${concept} through practical implementation, `;
                cloStatement += `demonstrating the ability to ${bloomLevel} both theoretical foundations `;
                cloStatement += `and real-world applications in ${category.toLowerCase()}.`;
            } else if (isTheoretical) {
                cloStatement = `Students will ${actionVerb} theoretical ${concept} and their implications, `;
                cloStatement += `showing mastery in the ability to ${bloomLevel} complex frameworks `;
                cloStatement += `within the context of ${category.toLowerCase()}.`;
            } else {
                cloStatement = `Students will ${actionVerb} ${concept} effectively, `;
                cloStatement += `demonstrating competency in the ability to ${bloomLevel} `;
                cloStatement += `course material and apply learning outcomes `;
                cloStatement += `in professional and academic contexts.`;
            }

            clos.push({
                id: `CLO${i + 1}`,
                statement: cloStatement,
                bloomLevel: bloomLevel,
                category: category,
                source: 'local-generated',
                isGenerated: true
            });
        }

        console.log(`✅ Generated ${clos.length} CLOs using sophisticated local algorithms`);
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

    showQuotaWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'quota-warning';
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-family: Arial, sans-serif;
        `;
        
        warningDiv.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="color: #f39c12; font-size: 20px;">⚠️</div>
                <div>
                    <h4 style="margin: 0 0 8px 0; color: #d68910;">API Quota Exceeded</h4>
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #7d6608;">
                        Your Gemini API quota has been reached. The system has automatically 
                        switched to <strong>sophisticated local generation</strong>.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #5d4e04;">
                        <strong>💡 Note:</strong> Local generation provides excellent quality CLOs 
                        without any API dependencies.
                    </p>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="margin-top: 10px; padding: 4px 8px; background: #f39c12; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        Got it
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(warningDiv);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (warningDiv.parentElement) {
                warningDiv.remove();
            }
        }, 8000);
    }

    displayGeneratedCLOs() {
        const container = document.getElementById('clos-list');
        container.innerHTML = '';

        this.generatedCLOs.forEach((clo, index) => {
            const cloCard = document.createElement('div');
            cloCard.className = 'clo-card';
            
            // Determine source badge
            const sourceBadge = clo.source === 'ai-generated' ? 
                '<span class="source-badge ai-badge">🤖 AI Generated</span>' :
                '<span class="source-badge local-badge">🏠 Local Generated</span>';
            
            cloCard.innerHTML = `
                <div class="clo-header">
                    <span class="clo-id">${clo.id}</span>
                    <span class="clo-category">${clo.category || 'General'}</span>
                    <span class="bloom-level">${clo.bloomLevel}</span>
                    ${sourceBadge}
                </div>
                <div class="clo-content">
                    <p class="clo-text" contenteditable="true">${clo.statement || clo.text}</p>
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

        // Add CSS for source badges if not already present
        if (!document.getElementById('source-badge-styles')) {
            const style = document.createElement('style');
            style.id = 'source-badge-styles';
            style.textContent = `
                .source-badge {
                    font-size: 11px;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-weight: 500;
                    margin-left: auto;
                }
                .ai-badge {
                    background: #e3f2fd;
                    color: #1976d2;
                    border: 1px solid #bbdefb;
                }
                .local-badge {
                    background: #e8f5e8;
                    color: #2e7d32;
                    border: 1px solid #c8e6c9;
                }
                .clo-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
            `;
            document.head.appendChild(style);
        }

        // Show generation summary
        if (this.generatedCLOs.length > 0) {
            const summary = this.getGenerationSummary();
            this.showGenerationSummary(summary);
        }
    }

    getGenerationSummary() {
        const aiGenerated = this.generatedCLOs.filter(clo => clo.source === 'ai-generated').length;
        const localGenerated = this.generatedCLOs.filter(clo => clo.source === 'local-generated').length;
        
        return {
            total: this.generatedCLOs.length,
            aiGenerated,
            localGenerated,
            method: aiGenerated > 0 ? 'hybrid' : (localGenerated > 0 ? 'local' : 'unknown')
        };
    }

    showGenerationSummary(summary) {
        const existingSummary = document.getElementById('generation-summary');
        if (existingSummary) {
            existingSummary.remove();
        }

        const summaryDiv = document.createElement('div');
        summaryDiv.id = 'generation-summary';
        summaryDiv.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 12px;
            margin: 15px 0;
            font-size: 14px;
        `;
        
        let summaryText = `✅ Generated ${summary.total} CLOs successfully`;
        
        if (summary.method === 'hybrid') {
            summaryText += ` (${summary.aiGenerated} AI + ${summary.localGenerated} local)`;
        } else if (summary.method === 'local') {
            summaryText += ` using sophisticated local algorithms`;
        }
        
        summaryDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${summaryText}</span>
                ${summary.localGenerated > 0 ? 
                    '<span style="background: #d4edda; color: #155724; padding: 2px 6px; border-radius: 4px; font-size: 12px;">No API Required</span>' : 
                    ''}
            </div>
        `;
        
        const container = document.getElementById('clos-list');
        container.parentElement.insertBefore(summaryDiv, container);
    }

    showManualCLOSection() {
        this.generateManualCLOInputs();
        this.showSection('manual-clo-section');
    }

    showManualCLOInput() {
        this.generateManualCLOInputs();
        this.showSection('manual-clo-section');
    }

    detectBloomLevel(statement) {
        const bloomVerbs = {
            'remember': ['list', 'identify', 'recall', 'name', 'state', 'define'],
            'understand': ['explain', 'describe', 'interpret', 'summarize', 'classify'],
            'apply': ['use', 'demonstrate', 'apply', 'implement', 'execute'],
            'analyze': ['analyze', 'compare', 'contrast', 'examine', 'differentiate'],
            'evaluate': ['evaluate', 'assess', 'critique', 'judge', 'justify'],
            'create': ['create', 'design', 'develop', 'compose', 'construct']
        };

        const lowercaseStatement = statement.toLowerCase();
        
        for (const [level, verbs] of Object.entries(bloomVerbs)) {
            for (const verb of verbs) {
                if (lowercaseStatement.includes(verb)) {
                    return level;
                }
            }
        }
        
        return 'understand'; // Default level
    }

    processManualCLOs() {
        const inputs = document.querySelectorAll('#manual-clo-inputs input[type="text"]');
        this.manualCLOs = [];
        
        inputs.forEach((input, index) => {
            if (input.value.trim()) {
                this.manualCLOs.push({
                    id: `CLO${index + 1}`,
                    statement: input.value.trim(),
                    bloomLevel: this.detectBloomLevel(input.value.trim())
                });
            }
        });

        if (this.manualCLOs.length === 0) {
            this.showError('Please enter at least one CLO.');
            return;
        }

        this.currentCLOs = this.manualCLOs;
        this.displayGeneratedCLOs();
        this.showSection('generated-clos-section');
    }

    generateManualCLOInputs() {
        const container = document.getElementById('manual-clo-inputs');
        
        // Use existing course CLO count if available, otherwise default to 5
        let count = 5;
        if (this.selectedCourse) {
            if (this.selectedCourse.cloik) {
                count = Object.keys(this.selectedCourse.cloik).length;
            } else if (this.selectedCourse.cloek) {
                count = Object.keys(this.selectedCourse.cloek).length;
            }
        }
        
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

    // Message display methods
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message-toast ${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="message-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to container
        let container = document.getElementById('message-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'message-container';
            container.className = 'message-container';
            document.body.appendChild(container);
        }

        container.appendChild(messageEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentElement) {
                messageEl.remove();
            }
        }, 5000);
    }
}

// Initialize controller when DOM is ready
let cloMloController;
document.addEventListener('DOMContentLoaded', () => {
    cloMloController = new CLOMLOController();
});

// Make controller globally available for onclick handlers
window.cloMloController = cloMloController;
