// Enhanced AI Features with Custom Prompt Support
// Supports both predefined analysis functions and custom user prompts

class EnhancedAIFeatures {
    constructor() {
        this.apiConfig = window.secureAPIConfig;
        this.isInitialized = false;
    }

    // Initialize the AI features
    async init() {
        try {
            if (this.apiConfig && !this.apiConfig.initialized) {
                await this.apiConfig.init();
            }
            this.isInitialized = this.apiConfig && this.apiConfig.isReady();
            return this.isInitialized;
        } catch (error) {
            console.error('Failed to initialize AI features:', error);
            return false;
        }
    }

    // Check if AI features are ready
    isReady() {
        return this.isInitialized && this.apiConfig && this.apiConfig.isReady();
    }

    // ========== CUSTOM PROMPT FEATURE ==========
    
    /**
     * Execute a custom user prompt with optional context
     * @param {string} userPrompt - The user's custom prompt
     * @param {Object} context - Optional context data to include
     * @param {Object} options - Optional AI parameters
     */
    async executeCustomPrompt(userPrompt, context = {}, options = {}) {
        try {
            if (!this.isReady()) {
                throw new Error('AI features not initialized. Please wait for setup to complete.');
            }

            // Validate input
            if (!userPrompt || userPrompt.trim().length === 0) {
                throw new Error('Please provide a valid prompt');
            }

            // Build the complete prompt with context
            let completePrompt = this.buildPromptWithContext(userPrompt, context);

            // Set default options for Gemini 1.5 Flash
            const aiOptions = {
                temperature: options.temperature || 0.7,
                maxOutputTokens: options.maxTokens || 4096, // Increased default for paid tier
                topP: options.topP || 0.8,
                topK: options.topK || 40,
                ...options
            };

            console.log('🤖 Executing custom prompt with Gemini 1.5 Flash...');
            const response = await this.apiConfig.callGeminiAPI(completePrompt, aiOptions);

            return {
                success: true,
                response: response,
                prompt: userPrompt,
                tokensUsed: this.estimateTokens(completePrompt + response)
            };

        } catch (error) {
            console.error('Custom prompt failed:', error);
            return {
                success: false,
                error: error.message,
                prompt: userPrompt
            };
        }
    }

    /**
     * Build a prompt with educational context for better results
     */
    buildPromptWithContext(userPrompt, context) {
        let contextualPrompt = '';

        // Add educational context if available
        if (context.ploData || context.mloData || context.courseData) {
            contextualPrompt += 'EDUCATIONAL CONTEXT:\n';
            
            if (context.ploData) {
                contextualPrompt += `Programme Learning Outcomes: ${JSON.stringify(context.ploData, null, 2)}\n`;
            }
            
            if (context.mloData) {
                contextualPrompt += `Module Learning Outcomes: ${JSON.stringify(context.mloData, null, 2)}\n`;
            }
            
            if (context.courseData) {
                contextualPrompt += `Course Information: ${JSON.stringify(context.courseData, null, 2)}\n`;
            }
            
            contextualPrompt += '\n';
        }

        // Add the user's prompt
        contextualPrompt += 'USER REQUEST:\n' + userPrompt;

        // Add helpful instruction for educational analysis
        contextualPrompt += '\n\nPlease provide a comprehensive response that considers educational best practices, curriculum design principles, and learning outcome alignment where relevant.';

        return contextualPrompt;
    }

    // ========== PREDEFINED ANALYSIS FUNCTIONS ==========

    /**
     * Generate improvement suggestions for PLO-MLO alignment
     */
    async generateImprovementSuggestions(ploText, mloText, currentScore) {
    const context = {
        ploData: { text: ploText, type: 'Programme Learning Outcome' },
        mloData: { text: mloText, type: 'Module Learning Outcome' },
        alignmentScore: currentScore
    };

    const prompt = `For the following Programme Learning Outcome (PLO) and Module Learning Outcome (MLO), provide:
1. A brief alignment summary for this PLO-MLO pair (highlight strengths and weaknesses)
2. 3-5 improvement suggestions specific to this PLO and MLO (address vocabulary, cognitive level, competency, and progression)

PLO: "${ploText}"
MLO: "${mloText}"
Current Alignment Score: ${currentScore}/5

Format your response with clear section headings for summary and suggestions. Do NOT use the word 'Actionable' in any heading.`;

    return await this.executeCustomPrompt(prompt, context);
    }

    /**
     * Analyze course content for CLO-MLO mapping
     */
    async analyzeCourseContent(courseDescription, learningOutcomes) {
        const context = {
            courseData: { description: courseDescription },
            mloData: learningOutcomes
        };

        const prompt = `Analyze this course for optimal CLO-MLO mapping:

Course: "${courseDescription}"
Learning Outcomes: ${learningOutcomes.map((lo, i) => `${i+1}. ${lo}`).join('\n')}

Provide mapping recommendations and identify gaps.`;

        return await this.executeCustomPrompt(prompt, context);
    }

    /**
     * Quick alignment check between two learning outcomes
     */
    async quickAlignmentCheck(outcome1, outcome2, type1 = 'PLO', type2 = 'MLO') {
        const prompt = `Quickly analyze the alignment between these learning outcomes:

${type1}: "${outcome1}"
${type2}: "${outcome2}"

Provide:
1. Alignment score (1-5)
2. Key strengths
3. Main concerns
4. One quick improvement suggestion`;

        return await this.executeCustomPrompt(prompt);
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Estimate token usage (rough approximation)
     */
    estimateTokens(text) {
        // Rough estimate: 1 token ≈ 4 characters for English text
        return Math.ceil(text.length / 4);
    }

    /**
     * Check remaining quota (approximate)
     */
    checkQuotaStatus() {
        // This is informational - actual quota tracking would need server-side implementation
        return {
            model: 'Gemini 1.5 Flash',
            paidQuota: {
                requestsPerMinute: 50,
                tokensPerDay: 1000000,
                requestsPerDay: 30 // Increased to 30 daily requests for paid tier
            },
            recommendations: [
                'Monitor your usage in Google AI Studio console',
                'Paid tier provides higher limits for extensive usage',
                'Use detailed prompts for comprehensive analysis'
            ]
        };
    }

    /**
     * Get API status information
     */
    getAPIStatus() {
        if (!this.apiConfig) {
            return 'Not configured';
        } else if (!this.apiConfig.initialized) {
            return 'Initializing...';
        } else if (this.apiConfig.isReady()) {
            return 'Ready (Gemini 1.5 Flash)';
        } else {
            return 'Configuration error';
        }
    }

    // ========== FALLBACK FUNCTIONS ==========

    getFallbackSuggestions(score) {
        const suggestions = [
            'Review vocabulary alignment between outcomes',
            'Check cognitive level progression using Bloom\'s taxonomy',
            'Ensure measurable and specific language',
            'Consider assessment method alignment',
            'Review competency development pathways'
        ];
        
        return {
            success: false,
            response: suggestions.slice(0, Math.max(2, 5 - score)).join('\n• '),
            fallback: true
        };
    }
}

// Create global instance
window.enhancedAIFeatures = new EnhancedAIFeatures();

// Auto-initialize when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🤖 Initializing Enhanced AI Features...');
    const success = await window.enhancedAIFeatures.init();
    if (success) {
        console.log('✅ Enhanced AI Features ready with Gemini 1.5 Flash!');
    } else {
        console.warn('⚠️ AI Features initialization failed - check API configuration');
    }
});

// Add this function to render MLOs as checkboxes with a Select All button next to the label
function renderMLOCheckboxes(programmeCode) {
    const mloCheckboxesContainer = document.getElementById('mlo-checkboxes');
    if (!mloCheckboxesContainer) return;
    mloCheckboxesContainer.innerHTML = '';

    // Create label row with Select All button
    const mloLabelRow = document.createElement('div');
    mloLabelRow.style.display = 'flex';
    mloLabelRow.style.alignItems = 'center';
    mloLabelRow.style.marginBottom = '8px';

    const mloLabel = document.createElement('label');
    mloLabel.textContent = '🔍 Select Module Learning Outcomes (MLOs) for Analysis';
    mloLabel.style.marginRight = '12px';
    mloLabelRow.appendChild(mloLabel);

    const selectAllMloBtn = document.createElement('button');
    selectAllMloBtn.textContent = 'Select All';
    selectAllMloBtn.className = 'btn';
    selectAllMloBtn.style.marginRight = '0';
    selectAllMloBtn.onclick = function() {
        const checkboxes = mloCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => { cb.checked = true; });
        updateSelectedMLOs();
    };
    mloLabelRow.appendChild(selectAllMloBtn);

    const deselectAllMloBtn = document.createElement('button');
    deselectAllMloBtn.textContent = 'Deselect All';
    deselectAllMloBtn.className = 'btn';
    deselectAllMloBtn.style.marginRight = '0';
    deselectAllMloBtn.onclick = function() {
        const checkboxes = mloCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => { cb.checked = false; });
        updateSelectedMLOs();
    };
    mloLabelRow.appendChild(deselectAllMloBtn);

    mloCheckboxesContainer.appendChild(mloLabelRow);

    // Get MLOs for the selected programme
    const mlos = window.programmeDataLoader.getMLOs(programmeCode);
    if (!mlos || mlos.length === 0) {
        const noMloMsg = document.createElement('p');
        noMloMsg.style.color = '#666';
        noMloMsg.style.fontStyle = 'italic';
        noMloMsg.textContent = 'No MLOs found for this programme.';
        mloCheckboxesContainer.appendChild(noMloMsg);
        return;
    }
    mlos.forEach((mlo, index) => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.style.display = 'flex';
        checkboxDiv.style.alignItems = 'center';
        checkboxDiv.style.marginBottom = '6px';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `mlo-${index}`;
        checkbox.value = mlo.mlosisuik;
        checkbox.onchange = updateSelectedMLOs;
        checkbox.style.marginRight = '8px';
        
        const label = document.createElement('label');
        label.htmlFor = `mlo-${index}`;
        label.style.cursor = 'pointer';
        label.textContent = `${mlo.mlokood}: ${mlo.mlosisuik.substring(0, 80)}...`;
        
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        mloCheckboxesContainer.appendChild(checkboxDiv);
    });
}

// Update selected MLOs textarea
function updateSelectedMLOs() {
    const mloCheckboxesContainer = document.getElementById('mlo-checkboxes');
    const checked = mloCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
    const programmeCode = document.getElementById('programme-select').value;
    const mlos = window.programmeDataLoader.getMLOs(programmeCode);
    const selected = Array.from(checked).map(function(cb) {
        // Get index from id
        const idx = cb.id.split('-')[1];
        if (mlos && mlos[idx]) {
            return `${mlos[idx].mlokood}: ${mlos[idx].mlosisuik}`;
        }
        // Fallback to label or value
        const label = mloCheckboxesContainer.querySelector('label[for="' + cb.id + '"]');
        return label ? label.textContent : cb.value;
    });
    document.getElementById('mlo-text').value = selected.join('\n');
}

// Call renderMLOCheckboxes when a PLO is selected
window.loadSelectedPLO = function() {
    const programmeCode = document.getElementById('programme-select').value;
    const ploIndex = document.getElementById('plo-select').value;
    if (!programmeCode || !ploIndex) return;
    try {
        const plos = window.programmeDataLoader.getPLOs(programmeCode);
        const selectedPlo = plos[parseInt(ploIndex)];
        const ploText = document.getElementById('plo-text');
        if (ploText && selectedPlo) {
            ploText.value = selectedPlo.plosisuik;
        }
        // Render MLO checkboxes for the selected programme
        renderMLOCheckboxes(programmeCode);
    } catch (error) {
        console.error('Error loading PLO:', error);
    }
}

// Ensure MLOs are updated when programme changes
function onProgrammeChange() {
    const programmeCode = document.getElementById('programme-select').value;
    if (programmeCode) {
        renderPLOCheckboxes(programmeCode);
        renderMLOCheckboxes(programmeCode);
        document.getElementById('plo-text').value = '';
        document.getElementById('mlo-text').value = '';
    } else {
        // Clear PLOs and MLOs if no programme selected
        const ploCheckboxesContainer = document.getElementById('plo-checkboxes');
        if (ploCheckboxesContainer) ploCheckboxesContainer.innerHTML = '<p style="color: #666; font-style: italic;">Select a programme to see available PLOs...</p>';
        const mloCheckboxesContainer = document.getElementById('mlo-checkboxes');
        if (mloCheckboxesContainer) mloCheckboxesContainer.innerHTML = '<p style="color: #666; font-style: italic;">Select a programme to see available MLOs...</p>';
        document.getElementById('plo-text').value = '';
        document.getElementById('mlo-text').value = '';
    }
}
window.onProgrammeChange = onProgrammeChange;

// Render PLOs as checkboxes
function renderPLOCheckboxes(programmeCode) {
    const ploCheckboxesContainer = document.getElementById('plo-checkboxes');
    if (!ploCheckboxesContainer) return;
    ploCheckboxesContainer.innerHTML = '';
    // Get PLOs for the selected programme
    const plos = window.programmeDataLoader.getPLOs(programmeCode);
    if (!plos || plos.length === 0) {
        const noPloMsg = document.createElement('p');
        noPloMsg.style.color = '#666';
        noPloMsg.style.fontStyle = 'italic';
        noPloMsg.textContent = 'No PLOs found for this programme.';
        ploCheckboxesContainer.appendChild(noPloMsg);
        return;
    }
    plos.forEach((plo, index) => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.style.display = 'flex';
        checkboxDiv.style.alignItems = 'center';
        checkboxDiv.style.marginBottom = '6px';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `plo-${index}`;
        checkbox.value = plo.plosisuik;
        checkbox.onchange = updateSelectedPLOs;
        checkbox.style.marginRight = '8px';
        const label = document.createElement('label');
        label.htmlFor = `plo-${index}`;
        label.style.cursor = 'pointer';
        label.textContent = `${plo.plokood}: ${plo.plosisuik.substring(0, 80)}...`;
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        ploCheckboxesContainer.appendChild(checkboxDiv);
    });
}

// Update selected PLOs textarea
function updateSelectedPLOs() {
    const ploCheckboxesContainer = document.getElementById('plo-checkboxes');
    const checked = ploCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
    const programmeCode = document.getElementById('programme-select').value;
    const plos = window.programmeDataLoader.getPLOs(programmeCode);
    const selected = Array.from(checked).map(function(cb) {
        // Get index from id
        const idx = cb.id.split('-')[1];
        if (plos && plos[idx]) {
            return `${plos[idx].plokood}: ${plos[idx].plosisuik}`;
        }
        // Fallback to label or value
        const label = ploCheckboxesContainer.querySelector('label[for="' + cb.id + '"]');
        return label ? label.textContent : cb.value;
    });
    document.getElementById('plo-text').value = selected.join('\n');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAIFeatures;
}

// Generate PLO-MLO alignment matrix and display in results
window.generatePloMloAlignmentMatrix = async function() {
    const programmeCode = document.getElementById('programme-select').value;
    // Get selected PLOs
    const ploCheckboxes = document.getElementById('plo-checkboxes').querySelectorAll('input[type="checkbox"]:checked');
    const selectedPLOs = Array.from(ploCheckboxes).map(cb => cb.value);
    // Get selected MLOs
    const mloCheckboxes = document.getElementById('mlo-checkboxes').querySelectorAll('input[type="checkbox"]:checked');
    const selectedMLOs = Array.from(mloCheckboxes).map(cb => cb.value);
    if (selectedPLOs.length === 0 || selectedMLOs.length === 0) {
        alert('Please select at least one PLO and one MLO for analysis.');
        return;
    }
    // Build matrix table HTML
    let tableHtml = '<h3>PLO-MLO Alignment Matrix</h3>';
    tableHtml += '<table border="1" style="border-collapse:collapse;width:100%;"><thead><tr><th>PLO \ MLO</th>';
    selectedMLOs.forEach((mlo, j) => {
        tableHtml += `<th>MLO ${j+1}</th>`;
    });
    tableHtml += '<th>Subtotal (Avg)</th></tr></thead><tbody>';
    let rowAverages = [];
    for (let i = 0; i < selectedPLOs.length; i++) {
        tableHtml += `<tr><td>PLO ${i+1}</td>`;
        let rowScores = [];
        for (let j = 0; j < selectedMLOs.length; j++) {
            // Call quickAlignmentCheck for each PLO-MLO pair
            let result = await window.enhancedAIFeatures.quickAlignmentCheck(selectedPLOs[i], selectedMLOs[j], 'PLO', 'MLO');
            let score = 0;
            if (result && result.success && result.response) {
                // Try to extract score from response (assume response contains 'Alignment score (1-5): X')
                const match = result.response.match(/Alignment score.*?(\d+(\.\d+)?)/);
                score = match ? parseFloat(match[1]) : 0;
            }
            rowScores.push(score);
            tableHtml += `<td>${score ? score.toFixed(2) : '-'}</td>`;
        }
        // Row average
        const avg = rowScores.length ? (rowScores.reduce((a,b)=>a+b,0)/rowScores.length) : 0;
        rowAverages.push(avg);
        tableHtml += `<td style="font-weight:bold;background:#f0f8ff;">${avg ? avg.toFixed(2) : '-'}</td></tr>`;
    }
    // Add column averages
    tableHtml += '<tr style="background:#f8f9fa;font-weight:bold;"><td>Subtotal (Avg)</td>';
    for (let j = 0; j < selectedMLOs.length; j++) {
        let colScores = [];
        for (let i = 0; i < selectedPLOs.length; i++) {
            let result = await window.enhancedAIFeatures.quickAlignmentCheck(selectedPLOs[i], selectedMLOs[j], 'PLO', 'MLO');
            let score = 0;
            if (result && result.success && result.response) {
                const match = result.response.match(/Alignment score.*?(\d+(\.\d+)?)/);
                score = match ? parseFloat(match[1]) : 0;
            }
            colScores.push(score);
        }
        const avg = colScores.length ? (colScores.reduce((a,b)=>a+b,0)/colScores.length) : 0;
        tableHtml += `<td>${avg ? avg.toFixed(2) : '-'}</td>`;
    }
    // Grand average
    const grandAvg = rowAverages.length ? (rowAverages.reduce((a,b)=>a+b,0)/rowAverages.length) : 0;
    tableHtml += `<td style="background:#e0ffe0;">${grandAvg ? grandAvg.toFixed(2) : '-'}</td></tr>`;
    tableHtml += '</tbody></table>';
    // Display in result-content
    document.getElementById('result-content').innerHTML = tableHtml;
};

// Add event listeners for Select All and Deselect All buttons for MLO checkboxes
window.addEventListener('DOMContentLoaded', function() {
    const selectAllBtn = document.getElementById('select-all-mlo');
    const deselectAllBtn = document.getElementById('deselect-all-mlo');
    const mloCheckboxesContainer = document.getElementById('mlo-checkboxes');
    if (selectAllBtn && mloCheckboxesContainer) {
        selectAllBtn.onclick = function() {
            const checkboxes = mloCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => { cb.checked = true; });
            updateSelectedMLOs();
        };
    }
    if (deselectAllBtn && mloCheckboxesContainer) {
        deselectAllBtn.onclick = function() {
            const checkboxes = mloCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => { cb.checked = false; });
            updateSelectedMLOs();
        };
    }
});
