// CLO-MLO Analysis Controller - New Workflow
class CLOMLOController {
    constructor() {
        this.currentProgramme = null;
        this.selectedCourse = null;
        this.currentCLOs = [];
        this.alignmentResults = [];
        this.showScores = true;
        this.editMode = null; // 'edit', 'manual', 'generate'
        
        this.init();
    }

    async init() {
        try {
            // Ensure data manager is initialized
            if (!window.dataManager) {
                console.warn('DataManager not found, initializing...');
                window.dataManager = new DataManager();
            }

            // Wait for data manager to be ready
            await this.waitForDataManager();
            
            // Check for URL parameter first
            const urlParams = new URLSearchParams(window.location.search);
            const kavakood = urlParams.get('kavakood');
            
            if (kavakood) {
                try {
                    console.log('Setting programme from URL parameter:', kavakood);
                    this.currentProgramme = window.dataManager.setCurrentProgramme(kavakood);
                } catch (error) {
                    console.warn('Failed to set programme from URL:', error);
                }
            }
            
            // Check if we have a current programme
            this.currentProgramme = window.dataManager.getCurrentProgramme();
            
            if (!this.currentProgramme) {
                console.warn('No programme selected, allowing manual selection...');
                // Instead of redirecting, allow user to work without programme selection
                this.showInfo('No programme selected. You can still use the CLO generation tools, but alignment analysis will be limited.');
                // Set a default programme name
                const programmeNameEl = document.getElementById('current-programme-name');
                if (programmeNameEl) {
                    programmeNameEl.textContent = 'No Programme Selected';
                }
            } else {
                console.log('Current programme:', this.currentProgramme);
            }
            
            this.displayProgrammeInfo();
            await this.populateCourseSelector();
            this.setupEventListeners();
            
            console.log('CLO-MLO Controller initialized successfully');
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize CLO-MLO analysis. Please refresh the page or return to home.');
        }
    }

    async waitForDataManager(maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            if (window.dataManager && typeof window.dataManager.getCurrentProgramme === 'function') {
                return true;
            }
            console.log(`Waiting for DataManager... attempt ${i + 1}/${maxAttempts}`);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw new Error('DataManager not available after waiting');
    }

    displayProgrammeInfo() {
        const programmeNameEl = document.getElementById('current-programme-name');
        if (programmeNameEl && this.currentProgramme) {
            programmeNameEl.textContent = this.currentProgramme.kavanimetusik || 'Unknown Programme';
        }
    }

    async populateCourseSelector() {
        const courseSelector = document.getElementById('course-selector');
        
        if (!courseSelector) {
            console.error('Course selector element not found');
            return;
        }

        try {
            // Clear existing options except the default
            courseSelector.innerHTML = '<option value="">Choose a course...</option>';
            
            // Check if we have a programme selected
            if (!this.currentProgramme) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'Please select a programme first or use manual CLO entry';
                option.disabled = true;
                courseSelector.appendChild(option);
                return;
            }
            
            // Get courses and ensure they exist
            const courses = window.dataManager.getCurrentCourses();
            console.log('Available courses:', courses.length);
            
            if (!courses || courses.length === 0) {
                console.warn('No courses available for current programme');
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No courses available for this programme';
                option.disabled = true;
                courseSelector.appendChild(option);
                return;
            }
            
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.ainekood;
                option.textContent = `${course.ainekood} - ${course.ainenimetusik}`;
                courseSelector.appendChild(option);
            });
            
            console.log(`Populated course selector with ${courses.length} courses`);
            
        } catch (error) {
            console.error('Error populating course selector:', error);
            courseSelector.innerHTML = '<option value="">Error loading courses</option>';
        }
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

        // Display module content
        this.displayModuleContent();
        
        // Display existing CLOs
        this.displayExistingCLOs();

        // Show sections in order
        this.showSection('module-content-section');
        this.showSection('existing-clos-section');
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

    displayModuleContent() {
        const moduleContentList = document.getElementById('module-content-list');
        const course = this.selectedCourse;

        if (!course) return;

        const moduleCode = course.moodulikood;
        const allMLOs = window.dataManager.getCurrentMLOs();
        
        // Find MLOs related to this course's module
        const relatedMLOs = allMLOs.filter(mlo => 
            mlo.mlokood.startsWith(moduleCode + '_') || 
            mlo.mlokood.startsWith(moduleCode)
        );

        if (relatedMLOs.length > 0) {
            let moduleHTML = '';
            relatedMLOs.forEach(mlo => {
                moduleHTML += `
                    <div class="mlo-item">
                        <div class="mlo-header"><strong>[${mlo.mlokood}]</strong> ${mlo.mlonimetusik || ''}</div>
                        <div class="mlo-description">${mlo.mlosisuik || mlo.mlosisuek || ''}</div>
                    </div>
                `;
            });
            moduleContentList.innerHTML = moduleHTML;
        } else {
            moduleContentList.innerHTML = '<p style="color: #666; text-align: center; padding: 1rem;"><em>No module learning outcomes found for this course.</em></p>';
        }
    }

    hideCourseInformation() {
        this.hideSection('course-information-section');
        this.hideSection('module-content-section');
        this.hideSection('existing-clos-section');
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
            this.showError('AI service not available. Please ensure your API configuration is set up correctly.');
            return;
        }

        // Validate course selection
        if (!this.selectedCourse) {
            this.showError('Please select a course before generating CLOs.');
            return;
        }

        // Show CLO editor section
        this.showSection('clo-editor-section');
        this.hideSection('clo-management-section');

        // Set editor title with course context
        const courseTitle = this.selectedCourse.ainenimetusik || this.selectedCourse.ainekood;
        document.getElementById('clo-editor-title').textContent = `AI Generated CLOs - ${courseTitle}`;

        try {
            // Show enhanced loading state with context information
            this.showEnhancedLoading();

            // Generate CLOs using enhanced AI
            const generatedCLOs = await this.generateCLOsWithAI();
            
            // Populate editor with generated CLOs
            this.populateCLOEditor(generatedCLOs);
            
            this.hideLoading();
            
            // Show success message with AI insights
            const cloCount = Object.keys(generatedCLOs).length;
            this.showMessage(
                `🎓 Successfully generated ${cloCount} CLOs using AI! The outcomes are aligned with your course context and programme objectives. Review and edit as needed before saving.`, 
                'success'
            );
            
        } catch (error) {
            this.hideLoading();
            console.error('AI generation error:', error);
            
            // Check if this is a quota error and try local fallback
            if (error.message.toLowerCase().includes('quota') || 
                error.message.toLowerCase().includes('limit') || 
                error.message.toLowerCase().includes('exceeded')) {
                
                console.log('🏠 Quota exceeded, switching to local generation fallback');
                this.showQuotaWarning();
                
                try {
                    // Try local generation as fallback
                    this.showLoading('🏠 Switching to local CLO generation...');
                    const localCLOs = await this.generateCLOsLocally(this.selectedCourse);
                    
                    // Populate editor with locally generated CLOs
                    this.populateCLOEditor(localCLOs);
                    
                    this.hideLoading();
                    
                    // Show success message with local generation info
                    const cloCount = Object.keys(localCLOs).length;
                    this.showMessage(
                        `🏠 Successfully generated ${cloCount} CLOs using local algorithms! These outcomes use sophisticated educational analysis and are ready for use. No API required.`, 
                        'success'
                    );
                    return; // Successfully handled with fallback
                    
                } catch (localError) {
                    console.error('Local generation also failed:', localError);
                    this.hideLoading();
                    this.showError('Both AI and local generation failed. Please try manual entry.');
                    return;
                }
            }
            
            // For non-quota errors, show standard error messages
            let errorMessage = 'Failed to generate CLOs with AI. ';
            if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage += 'Network connection issue. Please check your internet connection and try again.';
            } else {
                errorMessage += 'Please try again or use manual entry. If the problem persists, check your API configuration.';
            }
            
            this.showError(errorMessage);
        }
    }

    // Enhanced loading display with context
    showEnhancedLoading() {
        const course = this.selectedCourse;
        const programme = this.currentProgramme;
        
        let loadingMessage = '🤖 AI is analyzing your course and generating CLOs...\n\n';
        loadingMessage += `📚 Course: ${course?.ainenimetusik || 'Unknown'}\n`;
        loadingMessage += `🎓 Programme: ${programme?.kavanimetusik || 'Unknown'}\n`;
        loadingMessage += `⚡ Using: Gemini 1.5 Flash\n\n`;
        loadingMessage += 'This may take 3-5 seconds...';
        
        this.showLoading(loadingMessage);
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

        // Hide editor and show ready-for-analysis section
        this.hideSection('clo-editor-section');
        this.showSection('clo-management-section');

        // Update the display of existing CLOs
        this.displayExistingCLOs();

        // Show the analysis section with analyze button
        this.showAnalysisReadySection();

        this.showMessage('CLOs saved successfully! You can now analyze their alignment with MLOs.', 'success');
    }

    // Show section with analyze alignment button
    showAnalysisReadySection() {
        // Create or update a section that shows the analyze button
        const managementSection = document.getElementById('clo-management-section');
        
        // Remove any existing analysis prompt
        const existingPrompt = managementSection.querySelector('.analysis-prompt');
        if (existingPrompt) {
            existingPrompt.remove();
        }

        // Add analysis prompt section
        const analysisPrompt = document.createElement('div');
        analysisPrompt.className = 'analysis-prompt';
        analysisPrompt.innerHTML = `
            <div class="prompt-card">
                <div class="prompt-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="prompt-content">
                    <h3>Ready for Analysis</h3>
                    <p>Your CLOs have been saved. Click below to analyze their alignment with Module Learning Outcomes (MLOs).</p>
                    <div class="clo-summary">
                        <span class="clo-count">${this.currentCLOs.length} CLOs ready for analysis</span>
                    </div>
                </div>
                <button id="start-analysis-btn" class="btn btn-primary analysis-btn">
                    <i class="fas fa-chart-line"></i> Analyze CLO-MLO Alignment
                </button>
            </div>
        `;

        managementSection.appendChild(analysisPrompt);

        // Add event listener for the new analysis button
        document.getElementById('start-analysis-btn').addEventListener('click', () => {
            this.performCLOAnalysis();
        });
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
            this.showLoading('🔍 Analyzing CLO-MLO alignment...');

            // Debug API configuration
            console.log('🔑 API Configuration Check:', {
                enhancedAI: window.enhancedAIFeatures?.isReady() || false,
                secureAPI: window.secureAPIConfig?.isReady() || false,
                localStorageKey: !!localStorage.getItem('gemini_api_key')
            });

            // Perform analysis with retry logic
            this.alignmentResults = await this.analyzeCLOMLOAlignment();

            // Show results section
            this.showSection('analysis-results-section');
            this.hideSection('clo-management-section');

            // Display results
            this.displayAlignmentResults();

            this.hideLoading();
            this.showMessage('✅ Alignment analysis completed successfully!', 'success');

        } catch (error) {
            this.hideLoading();
            console.error('Analysis error:', error);
            
            // More specific error messages
            let errorMessage = 'Failed to analyze CLO-MLO alignment. ';
            if (error.message.includes('MODEL_OVERLOADED')) {
                errorMessage += '🔄 The AI service is currently busy. We tried multiple times but the service is still overloaded. Please try again in a few minutes.';
            } else if (error.message.includes('400')) {
                errorMessage += 'API request error (400). Please check your API key configuration.';
            } else if (error.message.includes('quota')) {
                errorMessage += 'API quota exceeded. Please try again later.';
            } else if (error.message.includes('No related MLOs')) {
                errorMessage += 'No related Module Learning Outcomes found for this course.';
            } else {
                errorMessage += `Error: ${error.message}`;
            }
            
            this.showError(errorMessage);
        }
    }

    backToCLOManagement() {
        this.hideSection('analysis-results-section');
        this.showSection('clo-management-section');
    }

    async generateCLOsWithAI() {
        const course = this.selectedCourse;
        if (!course) throw new Error('No course selected');

        try {
            // Use the enhanced AI features with secure configuration
            if (!window.enhancedAIFeatures || !window.enhancedAIFeatures.isReady()) {
                // Fallback to direct API call if enhanced features not available
                return await this.generateCLOsDirectAPI(course);
            }

            const prompt = this.buildEnhancedCLOGenerationPrompt(course);
            
            // Show what context we're using to the user
            console.log('🎓 Generating CLOs with enhanced context:', {
                course: course.ainenimetusik,
                module: course.moodulikood,
                programme: this.currentProgramme?.kavanimetusik
            });

            const result = await window.enhancedAIFeatures.executeCustomPrompt(prompt, {
                courseData: course,
                programmeData: this.currentProgramme,
                mloData: this.getRelatedMLOs(course)
            }, {
                temperature: 0.7,
                maxTokens: 1500  // Increased for detailed CLOs
            });

            if (!result.success) {
                throw new Error(result.error || 'AI generation failed');
            }

            return this.parseCLOResponse(result.response);

        } catch (error) {
            console.error('Enhanced AI generation failed, trying fallback:', error);
            // Check if this is a quota/API error - if so, use local generation
            if (error.message.toLowerCase().includes('quota') || 
                error.message.toLowerCase().includes('limit') || 
                error.message.toLowerCase().includes('exceeded') || 
                !window.secureAPIConfig || !window.secureAPIConfig.isReady()) {
                console.log('🏠 Switching to local generation due to API issues');
                return await this.generateCLOsLocally(course);
            }
            // Otherwise try direct API fallback
            return await this.generateCLOsDirectAPI(course);
        }
    }

    // Enhanced fallback method using secure API directly
    async generateCLOsDirectAPI(course) {
        try {
            if (!window.secureAPIConfig || !window.secureAPIConfig.isReady()) {
                console.log('🏠 No API configuration available, using local generation');
                return await this.generateCLOsLocally(course);
            }

            const prompt = this.buildEnhancedCLOGenerationPrompt(course);
            
            return await this.retryAPICall(async () => {
                const response = await window.secureAPIConfig.callGeminiAPI(prompt, {
                    temperature: 0.7,
                    maxOutputTokens: 1200  // Slightly reduced for efficiency
                });

                return this.parseCLOResponse(response);
            });
        } catch (error) {
            console.warn('🚨 Direct API also failed, falling back to local generation:', error);
            this.showQuotaWarning();
            return await this.generateCLOsLocally(course);
        }
    }

    // Local CLO generation fallback (sophisticated algorithms)
    async generateCLOsLocally(course) {
        console.log('🏠 Using local CLO generation (no API required)');
        
        // Simulate processing time for realistic UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        const courseCode = course.ainekood;
        const courseName = course.ainenimetusik;
        const courseDescription = course.eesmarkik || course.eesmarkek;
        const count = 5; // Default number of CLOs

        const mlos = this.currentProgramme.mlos || [];
        const mlosByCategory = window.dataManager?.getMLOsByCategory() || {};
        
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

        const clos = {};
        const categories = Object.keys(mlosByCategory);
        const concepts = this.extractKeyConcepts(courseDescription);
        
        // Educational context detection
        const isSTEMCourse = /programming|mathematics|engineering|science|technology|computer|algorithm|data|software|system/i.test(courseDescription);
        const isTheoretical = /theory|theoretical|concept|principle|framework|model|philosophy/i.test(courseDescription);
        const isPractical = /practical|hands-on|project|lab|experiment|implementation|application/i.test(courseDescription);
        
        for (let i = 0; i < count; i++) {
            const cloKey = `clo_${i + 1}`;
            const bloomLevel = bloomLevels[Math.min(i + 1, bloomLevels.length - 1)];
            const verbOptions = actionVerbs[bloomLevel] || actionVerbs['understand'];
            const actionVerb = verbOptions[Math.floor(Math.random() * verbOptions.length)];
            const category = categories[i % categories.length] || 'General Knowledge';
            
            // Generate contextual CLO based on course description and relevant MLOs
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

            clos[cloKey] = cloStatement;
        }

        console.log(`✅ Generated ${Object.keys(clos).length} CLOs using sophisticated local algorithms`);
        return clos;
    }

    // Extract key concepts from course description
    extractKeyConcepts(description) {
        if (!description) return ['fundamental concepts', 'core principles', 'theoretical frameworks', 'practical applications'];
        
        const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
        
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

    // Show quota warning to user
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

    // Get related MLOs for the course's module
    getRelatedMLOs(course) {
        try {
            const allMLOs = window.dataManager.getCurrentMLOs();
            const moduleCode = course.moodulikood;
            
            // Get MLOs related to this course's module
            const relatedMLOs = allMLOs.filter(mlo => 
                mlo.mlokood.includes(moduleCode) || 
                mlo.mlonimetusik?.toLowerCase().includes(moduleCode?.toLowerCase())
            );

            return relatedMLOs.slice(0, 5); // Limit to 5 most relevant MLOs
        } catch (error) {
            console.warn('Could not get related MLOs:', error);
            return [];
        }
    }

    buildEnhancedCLOGenerationPrompt(course) {
        const programme = this.currentProgramme;
        const relatedMLOs = this.getRelatedMLOs(course);
        const relatedPLOs = programme?.plos?.slice(0, 3) || []; // Top 3 PLOs for context

        let prompt = `As an expert in educational curriculum design, generate 5-7 Course Learning Outcomes (CLOs) for the following course.

COURSE INFORMATION:
Course Code: ${course.ainekood}
Course Name (English): ${course.ainenimetusik}
Course Name (Estonian): ${course.ainenimetusek || 'N/A'}
EAP Credits: ${course.eap}
Module: ${course.moodulikood}
Course Aims: ${course.eesmarkik || course.eesmarkek || 'N/A'}
Course Description: ${course.kirjeldiksik || course.kirjeldikek || 'N/A'}`;

        // Add programme context if available
        if (programme) {
            prompt += `\n\nPROGRAMME CONTEXT:
Programme: ${programme.kavanimetusik}`;
            
            if (relatedPLOs.length > 0) {
                prompt += `\nKey Programme Learning Outcomes (PLOs) to consider:`;
                relatedPLOs.forEach((plo, index) => {
                    prompt += `\n${index + 1}. ${plo.plosisuik}`;
                });
            }
        }

        // Add module context if available
        if (relatedMLOs.length > 0) {
            prompt += `\n\nRELATED MODULE LEARNING OUTCOMES (MLOs):`;
            relatedMLOs.forEach((mlo, index) => {
                prompt += `\n${index + 1}. [${mlo.mlokood}] ${mlo.mlosisuik}`;
            });
        }

        prompt += `\n\nINSTRUCTIONS:
Generate CLOs that:
1. Are specific, measurable, and achievable within the ${course.eap} EAP credit scope
2. Use action verbs from Bloom's taxonomy (analyze, synthesize, evaluate, create, etc.)
3. Align well with the course aims and programme objectives
4. Progress logically from foundational to advanced cognitive levels
5. Are professionally written and assessment-friendly
6. Consider the ${course.moodulikood} module context`;

        if (relatedMLOs.length > 0) {
            prompt += `\n7. Support and complement the related Module Learning Outcomes listed above`;
        }

        prompt += `\n\nRESPONSE FORMAT:
Format your response exactly as follows (start each line with "CLO" followed by number and colon):

CLO1: [Clear, measurable learning outcome using appropriate Bloom's taxonomy verb]
CLO2: [Another learning outcome, slightly more advanced]
CLO3: [Continue progression...]
CLO4: [...]
CLO5: [...]

IMPORTANT: Generate exactly 5 CLOs. Each CLO must start with "CLO" followed by a number and colon. Be specific and avoid generic language.`;

        return prompt;
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
        
        // Get related MLOs for this course's module (limit to top 3 for efficiency)
        const relatedMLOs = allMLOs.filter(mlo => 
            mlo.mlokood.includes(moduleCode)
        ).slice(0, 3); // Limit MLOs to reduce prompt size

        if (relatedMLOs.length === 0) {
            throw new Error('No related MLOs found for this course module');
        }

        // Limit CLOs to first 5 for analysis efficiency
        const limitedCLOs = this.currentCLOs.slice(0, 5);

        const alignmentPrompt = this.buildOptimizedAlignmentPrompt(limitedCLOs, relatedMLOs);
        
        // Debug logging
        console.log('🔍 Analysis Debug Info:', {
            cloCount: limitedCLOs.length,
            mloCount: relatedMLOs.length,
            promptLength: alignmentPrompt.length,
            moduleCode: moduleCode
        });
        
        return await this.retryAnalysisWithParsing(limitedCLOs, relatedMLOs, alignmentPrompt);
    }

    async retryAnalysisWithParsing(limitedCLOs, relatedMLOs, alignmentPrompt, maxAttempts = 5) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                this.showProgressiveLoading('Analyzing alignment and parsing results', attempt, maxAttempts);
                
                const analysisText = await this.retryAPICall(async () => {
                    // Use secure API configuration if available
                    if (window.secureAPIConfig && window.secureAPIConfig.isReady()) {
                        return await window.secureAPIConfig.callGeminiAPI(alignmentPrompt, {
                            temperature: 0.3,
                            maxOutputTokens: 1024
                        });
                    }
                    
                    // Fallback to direct API call
                    const apiKey = localStorage.getItem('gemini_api_key');
                    if (!apiKey) {
                        throw new Error('No API key configured');
                    }

                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
                                temperature: 0.4,
                                topK: 20,
                                topP: 0.9,
                                maxOutputTokens: 1024,
                            }
                        })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('API Error Response:', errorText);
                        
                        if (response.status === 503 || errorText.includes('overloaded')) {
                            throw new Error('MODEL_OVERLOADED');
                        }
                        
                        throw new Error(`Analysis API request failed: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();
                    
                    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                        throw new Error('Invalid API response format');
                    }
                    
                    return data.candidates[0].content.parts[0].text;
                });

                console.log('🤖 AI Analysis Response:', analysisText);
                
                // Try to parse the results
                this.showLoading(`Validating analysis quality... (Attempt ${attempt}/${maxAttempts})`, true, 75);
                
                const parsedResults = this.parseAnalysisResponse(analysisText, limitedCLOs, relatedMLOs);
                
                // Check if parsing was successful (got actual scores, not all defaults)
                const hasActualScores = this.validateParsedResults(parsedResults, limitedCLOs, relatedMLOs);
                
                if (hasActualScores) {
                    console.log(`✅ Parsing successful on attempt ${attempt}`);
                    this.showLoading('Analysis complete! Preparing results...', true, 100);
                    await new Promise(resolve => setTimeout(resolve, 500)); // Brief success display
                    return parsedResults;
                }
                
                console.warn(`⚠️ Parsing failed on attempt ${attempt} - retrying with different approach`);
                
                // If this isn't the last attempt, try with a modified prompt
                if (attempt < maxAttempts) {
                    this.showLoading(`Parsing quality insufficient, trying different format... (${attempt}/${maxAttempts})`, true, 25);
                    alignmentPrompt = this.buildEnhancedAlignmentPrompt(limitedCLOs, relatedMLOs, attempt);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
                }
                
            } catch (error) {
                console.error(`Analysis attempt ${attempt} failed:`, error);
                
                if (error.message === 'MODEL_OVERLOADED' && attempt < maxAttempts) {
                    const delay = Math.pow(2, attempt - 1) * 1000;
                    this.showLoading(`Service busy, retrying in ${delay/1000} seconds... (Attempt ${attempt}/${maxAttempts})`, true, (attempt / maxAttempts) * 50);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                if (attempt === maxAttempts) {
                    throw new Error(`Analysis failed after ${maxAttempts} attempts: ${error.message}`);
                }
            }
        }
        
        throw new Error('Unable to complete analysis with reliable parsing');
    }

    // Retry API calls with exponential backoff
    async retryAPICall(apiCallFunction, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await apiCallFunction();
            } catch (error) {
                if (error.message === 'MODEL_OVERLOADED' && attempt < maxRetries) {
                    const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
                    console.log(`🔄 Attempt ${attempt} failed (model overloaded). Retrying in ${delay/1000}s...`);
                    
                    // Update loading message to show retry
                    this.showLoading(`Service busy, retrying in ${delay/1000} seconds... (Attempt ${attempt}/${maxRetries})`);
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                // If not overloaded or max retries reached, throw the error
                throw error;
            }
        }
    }

    // Optimized prompt builder for better efficiency
    buildOptimizedAlignmentPrompt(clos, mlos) {
        let prompt = `Analyze CLO-MLO alignment. Rate each pair 1-5:
1=Minimal, 2=Weak, 3=Moderate, 4=Strong, 5=Very Strong

CLOs:`;

        clos.forEach(clo => {
            prompt += `\n${clo.id.toUpperCase()}: ${clo.text}`;
        });

        prompt += `\n\nMLOs:`;

        mlos.forEach(mlo => {
            prompt += `\n${mlo.mlokood}: ${mlo.mlosisuik}`;
        });

        prompt += `\n\nFormat: CLO1-MLO_CODE: score (brief reason)
Example: CLO1-TI1.1: 4 (both focus on problem-solving skills)`;

        return prompt;
    }

    buildAlignmentAnalysisPrompt(clos, mlos) {
        let prompt = `Analyze the alignment between the following Course Learning Outcomes (CLOs) and Module Learning Outcomes (MLOs). Rate each CLO-MLO pair on a scale of 1-5:

1 = Minimal alignment
2 = Weak alignment  
3 = Moderate alignment
4 = Strong alignment
5 = Very strong alignment

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

    validateParsedResults(results, expectedCLOs, expectedMLOs) {
        if (!results || results.length === 0) {
            console.warn('No results parsed');
            return false;
        }
        
        const expectedCount = expectedCLOs.length * expectedMLOs.length;
        if (results.length !== expectedCount) {
            console.warn(`Expected ${expectedCount} results, got ${results.length}`);
            return false;
        }
        
        // Check if we have varied scores (not all defaults)
        const scores = results.map(r => r.score);
        const uniqueScores = [...new Set(scores)];
        
        // If all scores are 2 (default), it's likely parsing failed
        if (uniqueScores.length === 1 && uniqueScores[0] === 2) {
            console.warn('All results have default score 2 - likely parsing failure');
            return false;
        }
        
        // Check if justifications are meaningful (not just defaults)
        const defaultJustifications = results.filter(r => 
            r.justification.includes('Default alignment') || 
            r.justification.includes('parsing may have failed')
        ).length;
        
        const successRate = (results.length - defaultJustifications) / results.length;
        console.log(`✅ Parsing validation: ${(successRate * 100).toFixed(1)}% success rate`);
        
        // Require at least 70% successful parsing
        return successRate >= 0.7;
    }

    buildEnhancedAlignmentPrompt(clos, mlos, attempt) {
        const variations = [
            // Attempt 1: Original optimized format
            this.buildOptimizedAlignmentPrompt(clos, mlos),
            
            // Attempt 2: More explicit format
            this.buildExplicitFormatPrompt(clos, mlos),
            
            // Attempt 3: JSON-like format
            this.buildJSONLikePrompt(clos, mlos),
            
            // Attempt 4: Table format
            this.buildTableFormatPrompt(clos, mlos),
            
            // Attempt 5: Simple list format
            this.buildSimpleListPrompt(clos, mlos)
        ];
        
        return variations[attempt - 1] || variations[0];
    }

    buildExplicitFormatPrompt(clos, mlos) {
        let prompt = `INSTRUCTION: Rate each CLO-MLO alignment pair exactly as shown in the format below.

RATING SCALE:
1 = Minimal alignment
2 = Weak alignment  
3 = Moderate alignment
4 = Strong alignment
5 = Very strong alignment

COURSE LEARNING OUTCOMES:`;

        clos.forEach(clo => {
            prompt += `\n${clo.id.toUpperCase()}: ${clo.text}`;
        });

        prompt += `\n\nMODULE LEARNING OUTCOMES:`;
        mlos.forEach(mlo => {
            prompt += `\n${mlo.mlokood}: ${mlo.mlosisuik}`;
        });

        prompt += `\n\nFORMAT REQUIRED - Rate each pair EXACTLY like this:
${clos[0].id.toUpperCase()}-${mlos[0].mlokood}: [1-5] (brief reason)

COMPLETE ALL PAIRS:`;

        clos.forEach(clo => {
            mlos.forEach(mlo => {
                prompt += `\n${clo.id.toUpperCase()}-${mlo.mlokood}: `;
            });
        });

        return prompt;
    }

    buildJSONLikePrompt(clos, mlos) {
        let prompt = `Rate CLO-MLO alignment pairs. Respond in this exact JSON-like format:

CLOs: ${clos.map(c => `${c.id.toUpperCase()}: ${c.text}`).join(' | ')}
MLOs: ${mlos.map(m => `${m.mlokood}: ${m.mlosisuik}`).join(' | ')}

Ratings (1=Minimal, 2=Weak, 3=Moderate, 4=Strong, 5=Very Strong):
`;

        clos.forEach(clo => {
            mlos.forEach(mlo => {
                prompt += `\n"${clo.id.toUpperCase()}-${mlo.mlokood}": `;
            });
        });

        return prompt;
    }

    buildTableFormatPrompt(clos, mlos) {
        let prompt = `Create alignment table. Rate 1-5 scale:

CLO | MLO | Score | Reason
----|-----|-------|-------`;

        clos.forEach(clo => {
            mlos.forEach(mlo => {
                prompt += `\n${clo.id.toUpperCase()} | ${mlo.mlokood} | [1-5] | [reason]`;
            });
        });

        prompt += `\n\nCLO Details:`;
        clos.forEach(clo => {
            prompt += `\n${clo.id.toUpperCase()}: ${clo.text}`;
        });

        prompt += `\n\nMLO Details:`;
        mlos.forEach(mlo => {
            prompt += `\n${mlo.mlokood}: ${mlo.mlosisuik}`;
        });

        return prompt;
    }

    buildSimpleListPrompt(clos, mlos) {
        let prompt = `Rate each CLO-MLO pair (1-5 scale):

CLOs:`;
        clos.forEach(clo => {
            prompt += `\n• ${clo.id.toUpperCase()}: ${clo.text}`;
        });

        prompt += `\n\nMLOs:`;
        mlos.forEach(mlo => {
            prompt += `\n• ${mlo.mlokood}: ${mlo.mlosisuik}`;
        });

        prompt += `\n\nRatings:`;
        clos.forEach(clo => {
            mlos.forEach(mlo => {
                prompt += `\n${clo.id.toUpperCase()}_${mlo.mlokood} = `;
            });
        });

        return prompt;
    }

    parseAnalysisResponse(analysisText, clos, mlos) {
        // Only return CLO-MLO pairs with a real parsed score (not default)
        const parsedResults = [];
        const lines = analysisText.split('\n');
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            // Look for patterns like CLOIK1-e1_mlo1: 1 or CLO1-MLO_CODE: score
            const pairMatch = trimmedLine.match(/(CLO[A-Z]*\d+)[^:]*([a-zA-Z0-9_.-]+)[^:]*:\s*([1-5])/i);
            if (pairMatch) {
                const cloIdFromResponse = pairMatch[1].toLowerCase();
                const mloCodeFromResponse = pairMatch[2].toLowerCase();
                const score = parseInt(pairMatch[3]);
                // Find the corresponding CLO and MLO objects
                const clo = clos.find(c => c.id.toLowerCase() === cloIdFromResponse || c.id.toLowerCase().includes(cloIdFromResponse.replace(/clo[a-z]*/, '')));
                const mlo = mlos.find(m => m.mlokood.toLowerCase() === mloCodeFromResponse || m.mlokood.toLowerCase().includes(mloCodeFromResponse));
                if (clo && mlo && score >= 1 && score <= 5) {
                    parsedResults.push({
                        clo,
                        mlo,
                        score,
                        justification: this.extractJustification(trimmedLine)
                    });
                }
            }
        });
        // If no real results parsed, return null to indicate failure
        if (parsedResults.length === 0) return null;
        return parsedResults;
    }
    
    extractJustification(line) {
        // Extract text after score, removing common patterns
        const cleanLine = line.replace(/CLO\d+/i, '').replace(/[a-z_]+\d+[a-z_]*/i, '').replace(/[0-4]/, '');
        
        // Look for text in parentheses or after colon/dash
        let justification = cleanLine.match(/\(([^)]+)\)/)?.[1] ||
                           cleanLine.match(/[:\-–]\s*(.+)$/)?.[1] ||
                           cleanLine.trim();
                           
        return justification.trim() || 'Alignment assessment provided';
    }

    displayAlignmentResults() {
        const resultsContainer = document.getElementById('alignment-matrix-container');
        
        if (!this.alignmentResults || this.alignmentResults.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No alignment results to display.</p>';
            return;
        }
        // If all results are default (parsing failed), show error instead of table
        const allDefault = !this.alignmentResults.some(r => r && r.score && !r.justification?.includes('parsing may have failed') && !r.justification?.includes('Default alignment'));
        if (allDefault) {
            resultsContainer.innerHTML = '<div class="ai-error">❌ Unable to parse any valid CLO-MLO alignments from the AI response. Please try again or adjust your CLOs/MLOs for clearer results.</div>';
            return;
        }
        // Create the new layout following PLO-MLO design, but only for real parsed results
        const filteredResults = this.alignmentResults.filter(r => r && r.score && !r.justification?.includes('parsing may have failed') && !r.justification?.includes('Default alignment'));
        const resultHTML = this.createPLOMLOStyleLayout(filteredResults);
        resultsContainer.innerHTML = resultHTML;
        // Update summary statistics
        this.updateAlignmentSummary();
        // Add event listeners for the new layout
        this.setupDetailedLayoutEvents();
    }

    createPLOMLOStyleLayout(filteredResults) {
        // Use only filteredResults (real parsed results)
        const results = filteredResults || [];
        if (!results.length) {
            return '<div class="ai-error">❌ No valid CLO-MLO alignments could be parsed from the AI response.</div>';
        }
        // Calculate statistics
        const totalPairs = results.length;
        const veryStrongAlignments = results.filter(r => r.score === 5).length;
        const strongAlignments = results.filter(r => r.score === 4).length;
        const moderateAlignments = results.filter(r => r.score === 3).length;
        const weakAlignments = results.filter(r => r.score === 2).length;
        const minimalAlignments = results.filter(r => r.score === 1).length;
        const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalPairs;
        // Matrix
        const uniqueMLOs = [...new Set(results.map(r => r.mlo.mlokood))];
        const uniqueCLOs = [...new Set(results.map(r => r.clo.id))];
        let matrixHTML = `<div class="compact-matrix"><table class="alignment-matrix-table"><thead><tr><th class="matrix-corner">CLO \\ MLO</th>` +
            uniqueMLOs.map(mlo => `<th class="mlo-header">${mlo}</th>`).join('') +
            `</tr></thead><tbody>`;
        uniqueCLOs.forEach(cloId => {
            matrixHTML += `<tr><td class="clo-header">${cloId.toUpperCase()}</td>`;
            uniqueMLOs.forEach(mloCode => {
                const cell = results.find(r => r.clo.id === cloId && r.mlo.mlokood === mloCode);
                matrixHTML += `<td class="score-cell score-${cell?.score || 0}">${cell ? cell.score : '-'}</td>`;
            });
            matrixHTML += '</tr>';
        });
        matrixHTML += '</tbody></table></div>';
        // Detailed breakdown
        let breakdownRows = '';
        results.forEach(r => {
            breakdownRows += `<tr><td>${r.clo.id.toUpperCase()}</td><td>${r.clo.text}</td><td>${r.mlo.mlokood}</td><td class="score-cell score-${r.score}">${r.score}</td><td>${r.justification}</td></tr>`;
        });
        return `
            <div class="alignment-overview">
                <div class="overview-header">
                    <h4><i class="fas fa-chart-line"></i> Alignment Analysis Summary</h4>
                    <div class="summary-metrics">
                        <div class="metric-card very-strong"><div class="metric-value">${veryStrongAlignments}</div><div class="metric-label">Very Strong (5)</div></div>
                        <div class="metric-card strong"><div class="metric-value">${strongAlignments}</div><div class="metric-label">Strong (4)</div></div>
                        <div class="metric-card moderate"><div class="metric-value">${moderateAlignments}</div><div class="metric-label">Moderate (3)</div></div>
                        <div class="metric-card weak"><div class="metric-value">${weakAlignments}</div><div class="metric-label">Weak (2)</div></div>
                        <div class="metric-card minimal"><div class="metric-value">${minimalAlignments}</div><div class="metric-label">Minimal (1)</div></div>
                        <div class="metric-card avg"><div class="metric-value">${averageScore.toFixed(2)}</div><div class="metric-label">Average Score</div></div>
                    </div>
                </div>
            </div>
            <div class="matrix-section">
                <h4><i class="fas fa-table"></i> Alignment Matrix</h4>
                ${matrixHTML}
            </div>
            <div class="detailed-breakdown">
                <h4><i class="fas fa-list-alt"></i> Detailed Alignment Analysis</h4>
                <div class="breakdown-table-container">
                    <table class="breakdown-table"><thead><tr><th>CLO</th><th>CLO Content</th><th>MLO</th><th>Score</th><th>Analysis & Recommendations</th></tr></thead><tbody>${breakdownRows}</tbody></table>
                </div>
            </div>
        `;
    }

    createCompactMatrix() {
        // Get unique MLOs and CLOs from results
        const uniqueMLOs = [...new Set(this.alignmentResults.map(r => r.mlo.mlokood))];
        const uniqueCLOs = [...new Set(this.alignmentResults.map(r => r.clo.id))];

        let matrixHTML = `
            <div class="compact-matrix">
                <table class="alignment-matrix-table">
                    <thead>
                        <tr>
                            <th class="matrix-corner">CLO \\ MLO</th>
                            ${uniqueMLOs.map(mlo => `<th class="mlo-header">${mlo}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        uniqueCLOs.forEach(cloId => {
            matrixHTML += `<tr>`;
            matrixHTML += `<td class="clo-header">${cloId.toUpperCase()}</td>`;
            
            uniqueMLOs.forEach(mloCode => {
                const result = this.alignmentResults.find(r => 
                    r.clo.id === cloId && r.mlo.mlokood === mloCode
                );

                if (result) {
                    const scoreClass = this.getScoreClass(result.score);
                    matrixHTML += `<td class="matrix-cell ${scoreClass}" title="${result.justification}">${result.score}</td>`;
                } else {
                    matrixHTML += `<td class="matrix-cell no-data">-</td>`;
                }
            });
            
            matrixHTML += `</tr>`;
        });

        matrixHTML += `
                    </tbody>
                </table>
            </div>
        `;

        return matrixHTML;
    }

    createDetailedBreakdownRows() {
        return this.alignmentResults.map(result => {
            const scoreClass = this.getScoreClass(result.score);
            const filterClass = this.getFilterClass(result.score);
            const recommendations = this.generateRecommendations(result);
            
            return `
                <tr class="breakdown-row ${filterClass}" data-filter="${filterClass}">
                    <td class="clo-code">${result.clo.id.toUpperCase()}</td>
                    <td class="clo-content">
                        <div class="content-text">${result.clo.text}</div>
                    </td>
                    <td class="mlo-code">
                        <div class="mlo-info">
                            <strong>${result.mlo.mlokood}</strong>
                            <div class="mlo-content">${result.mlo.mlosisuik}</div>
                        </div>
                    </td>
                    <td class="score-cell">
                        <div class="score-badge ${scoreClass}">
                            ${result.score}
                            <div class="score-label">${this.getScoreLabel(result.score)}</div>
                        </div>
                    </td>
                    <td class="analysis-cell">
                        <div class="justification">${result.justification}</div>
                        ${recommendations ? `<div class="recommendations">${recommendations}</div>` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    getScoreClass(score) {
        if (score === 5) return 'score-very-strong';
        if (score === 4) return 'score-strong';
        if (score === 3) return 'score-moderate';
        if (score === 2) return 'score-weak';
        if (score === 1) return 'score-minimal';
        return 'score-none';
    }

    getFilterClass(score) {
        if (score === 5) return 'very-strong';
        if (score === 4) return 'strong';
        if (score === 3) return 'moderate';
        if (score === 2) return 'weak';
        if (score === 1) return 'minimal';
        return 'none';
    }

    getScoreLabel(score) {
        const labels = {
            5: 'Very Strong',
            4: 'Strong',
            3: 'Moderate',
            2: 'Weak',
            1: 'Minimal',
            0: 'None'
        };
        return labels[score] || 'Unknown';
    }

    generateRecommendations(result) {
        if (result.score >= 3) return null; // No recommendations needed for moderate or better alignments
        const recommendations = [];
        if (result.score === 2) {
            recommendations.push("• Consider revising CLO to better match MLO cognitive level");
            recommendations.push("• Review content overlap and strengthen connection");
            recommendations.push("• Ensure assessment methods align with both outcomes");
        } else if (result.score === 1) {
            recommendations.push("• Minimal alignment detected - significant revision needed");
            recommendations.push("• Consider if this CLO-MLO pairing is necessary");
            recommendations.push("• Review learning objectives and content mapping");
        }
        return recommendations.length > 0 ? `
            <div class="recommendation-list">
                <strong>Improvement Suggestions:</strong>
                ${recommendations.map(rec => `<div class="rec-item">${rec}</div>`).join('')}
            </div>
        ` : null;
    }

    setupDetailedLayoutEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter rows
                const filter = e.target.dataset.filter;
                document.querySelectorAll('.breakdown-row').forEach(row => {
                    if (filter === 'all' || row.dataset.filter === filter) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
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

        document.getElementById('manual-clos-btn').addEventListener('click', () => {
            this.startManualEntryCLOs();
        });

        document.getElementById('generate-clos-btn').addEventListener('click', () => {
            this.startAIGenerateCLOs();
        });

        // CLO Editor actions
        const saveCLOsBtn = document.getElementById('save-clos-btn');
        if (saveCLOsBtn) {
            saveCLOsBtn.addEventListener('click', () => {
                this.saveCLOs();
            });
        }

        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.cancelEdit();
            });
        }

        // Analysis actions
        const analyzeAlignmentBtn = document.getElementById('analyze-alignment-btn');
        if (analyzeAlignmentBtn) {
            analyzeAlignmentBtn.addEventListener('click', () => {
                this.performCLOAnalysis();
            });
        }

        const backToCLOBtn = document.getElementById('back-to-clo-management');
        if (backToCLOBtn) {
            backToCLOBtn.addEventListener('click', () => {
                this.backToCLOManagement();
            });
        }

        // Matrix controls
        const toggleScoresBtn = document.getElementById('toggle-clo-scores');
        if (toggleScoresBtn) {
            toggleScoresBtn.addEventListener('click', () => {
                this.toggleScores();
            });
        }

        const exportCLOBtn = document.getElementById('export-clo-btn');
        if (exportCLOBtn) {
            exportCLOBtn.addEventListener('click', () => {
                this.exportResults();
            });
        }

        // Modal controls
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal();
            });
        });

        // API Configuration
        const apiConfigBtn = document.getElementById('api-config-btn');
        if (apiConfigBtn) {
            apiConfigBtn.addEventListener('click', () => {
                this.showAPIConfig();
            });
        }

        const closeApiConfig = document.getElementById('close-api-config');
        if (closeApiConfig) {
            closeApiConfig.addEventListener('click', () => {
                this.hideAPIConfig();
            });
        }

        const saveApiKey = document.getElementById('save-api-key');
        if (saveApiKey) {
            saveApiKey.addEventListener('click', () => {
                this.saveAPIKey();
            });
        }

        const testApiKey = document.getElementById('test-api-key');
        if (testApiKey) {
            testApiKey.addEventListener('click', () => {
                this.testAPIKey();
            });
        }

        const clearApiKey = document.getElementById('clear-api-key');
        if (clearApiKey) {
            clearApiKey.addEventListener('click', () => {
                this.clearAPIKey();
            });
        }
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

    showLoading(message, showProgress = false, progress = 0) {
        const modal = document.getElementById('loading-modal');
        const messageEl = document.getElementById('loading-message');
        if (modal && messageEl) {
            // Enhanced loading message with progress
            if (showProgress) {
                messageEl.innerHTML = `
                    <div class="loading-content">
                        <div class="spinner"></div>
                        <div class="loading-text">${message}</div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-text">${progress}% complete</div>
                        </div>
                        <div class="patience-message">
                            <i class="fas fa-hourglass-half"></i>
                            Please be patient while we analyze alignment and parse results...
                        </div>
                    </div>
                `;
            } else {
                messageEl.innerHTML = `
                    <div class="loading-content">
                        <div class="spinner"></div>
                        <div class="loading-text">${message}</div>
                    </div>
                `;
            }
            modal.classList.remove('hidden');
        }
    }

    showProgressiveLoading(baseMessage, attempt, maxAttempts) {
        const progress = Math.round((attempt / maxAttempts) * 100);
        const message = `${baseMessage} (Attempt ${attempt}/${maxAttempts})`;
        this.showLoading(message, true, progress);
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

    showInfo(message) {
        this.showMessage(message, 'info');
    }

    hideModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // API Configuration methods
    isAPIConfigured() {
        // Check if enhanced AI features are available and ready
        if (window.enhancedAIFeatures && window.enhancedAIFeatures.isReady()) {
            return true;
        }
        
        // Check if secure API config is available and ready
        if (window.secureAPIConfig && window.secureAPIConfig.isReady()) {
            return true;
        }
        
        // Fallback to old localStorage method
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

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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

    // Enhanced parsing validation
    validateParsedResults(results, expectedCLOs, expectedMLOs) {
        if (!results || results.length === 0) {
            console.warn('No results parsed');
            return false;
        }
        
        const expectedCount = expectedCLOs.length * expectedMLOs.length;
        if (results.length !== expectedCount) {
            console.warn(`Expected ${expectedCount} results, got ${results.length}`);
            return false;
        }
        
        // Check if we have varied scores (not all defaults)
        const scores = results.map(r => r.score);
        const uniqueScores = [...new Set(scores)];
        
        // If all scores are 2 (default), it's likely parsing failed
        if (uniqueScores.length === 1 && uniqueScores[0] === 2) {
            console.warn('All results have default score 2 - likely parsing failure');
            return false;
        }
        
        // Check if justifications are meaningful (not just defaults)
        const defaultJustifications = results.filter(r => 
            r.justification.includes('Default alignment') || 
            r.justification.includes('parsing may have failed')
        ).length;
        
        const successRate = (results.length - defaultJustifications) / results.length;
        console.log(`✅ Parsing validation: ${(successRate * 100).toFixed(1)}% success rate`);
        
        // Require at least 70% successful parsing
        return successRate >= 0.7;
    }

    buildEnhancedAlignmentPrompt(clos, mlos, attempt) {
        const variations = [
            // Attempt 1: Original optimized format
            this.buildOptimizedAlignmentPrompt(clos, mlos),
            
            // Attempt 2: More explicit format
            this.buildExplicitFormatPrompt(clos, mlos),
            
            // Attempt 3: JSON-like format
            this.buildJSONLikePrompt(clos, mlos),
            
            // Attempt 4: Table format
            this.buildTableFormatPrompt(clos, mlos),
            
            // Attempt 5: Simple list format
            this.buildSimpleListPrompt(clos, mlos)
        ];
        
        return variations[attempt - 1] || variations[0];
    }

    buildExplicitFormatPrompt(clos, mlos) {
        let prompt = `INSTRUCTION: Rate each CLO-MLO alignment pair exactly as shown in the format below.

RATING SCALE:
0 = No alignment
1 = Weak alignment  
2 = Moderate alignment
3 = Strong alignment
4 = Very strong alignment

COURSE LEARNING OUTCOMES:`;

        clos.forEach(clo => {
            prompt += `\n${clo.id.toUpperCase()}: ${clo.text}`;
        });

        prompt += `\n\nMODULE LEARNING OUTCOMES:`;
        mlos.forEach(mlo => {
            prompt += `\n${mlo.mlokood}: ${mlo.mlosisuik}`;
        });

        prompt += `\n\nFORMAT REQUIRED - Rate each pair EXACTLY like this:
${clos[0].id.toUpperCase()}-${mlos[0].mlokood}: [0-4] (brief reason)

COMPLETE ALL PAIRS:`;

        clos.forEach(clo => {
            mlos.forEach(mlo => {
                prompt += `\n${clo.id.toUpperCase()}-${mlo.mlokood}: `;
            });
        });

        return prompt;
    }

    buildJSONLikePrompt(clos, mlos) {
        let prompt = `Rate CLO-MLO alignment pairs. Respond in this exact JSON-like format:

CLOs: ${clos.map(c => `${c.id.toUpperCase()}: ${c.text}`).join(' | ')}
MLOs: ${mlos.map(m => `${m.mlokood}: ${m.mlosisuik}`).join(' | ')}

Ratings (0=None, 1=Weak, 2=Moderate, 3=Strong, 4=Very Strong):
`;

        clos.forEach(clo => {
            mlos.forEach(mlo => {
                prompt += `\n"${clo.id.toUpperCase()}-${mlo.mlokood}": `;
            });
        });

        return prompt;
    }

    buildTableFormatPrompt(clos, mlos) {
        let prompt = `Create alignment table. Rate 0-4 scale:

CLO | MLO | Score | Reason
----|-----|-------|-------`;

        clos.forEach(clo => {
            mlos.forEach(mlo => {
                prompt += `\n${clo.id.toUpperCase()} | ${mlo.mlokood} | [score] | [reason]`;
            });
        });

        prompt += `\n\nCLO Details:`;
        clos.forEach(clo => {
            prompt += `\n${clo.id.toUpperCase()}: ${clo.text}`;
        });

        prompt += `\n\nMLO Details:`;
        mlos.forEach(mlo => {
            prompt += `\n${mlo.mlokood}: ${mlo.mlosisuik}`;
        });

        return prompt;
    }

    buildSimpleListPrompt(clos, mlos) {
        let prompt = `Rate each CLO-MLO pair (0-4 scale):

CLOs:`;
        clos.forEach(clo => {
            prompt += `\n• ${clo.id.toUpperCase()}: ${clo.text}`;
        });

        prompt += `\n\nMLOs:`;
        mlos.forEach(mlo => {
            prompt += `\n• ${mlo.mlokood}: ${mlo.mlosisuik}`;
        });

        prompt += `\n\nRatings:`;
        clos.forEach(clo => {
            mlos.forEach(mlo => {
                prompt += `\n${clo.id.toUpperCase()}_${mlo.mlokood} = `;
            });
        });

        return prompt;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cloController = new CLOMLOController();
});
