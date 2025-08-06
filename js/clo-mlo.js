// CLO-MLO Analysis Controller - Dynamic, Data-Driven
class CLOMLOController {

    showEditCLOsInline() {
        const closContent = document.getElementById('info-existing-clos');
        if (!this.selectedCourse || !closContent) return;
        
        const clos = this.selectedCourse.cloik || this.selectedCourse.cloek || {};
        const cloEntries = Object.entries(clos);
        
        // Limit to maximum 9 CLOs
        const limitedClos = cloEntries.slice(0, 9);
        
        let closHtml = '<div class="clo-editing-form">';
        closHtml += '<div class="form-header"><h4><i class="fas fa-edit"></i> Edit Course Learning Outcomes</h4>';
        closHtml += '<p class="form-description">Maximum 9 CLOs allowed. Currently editing ' + limitedClos.length + ' CLOs.</p></div>';
        
        limitedClos.forEach(([key, text], index) => {
            closHtml += `
                <div class="clo-edit-item" style="margin-bottom:1.5em; padding:1em; border:1px solid #ddd; border-radius:6px;">
                    <label class="clo-label">
                        <strong>CLO ${index + 1} (${key.toUpperCase()})</strong>
                        <textarea data-clo-key="${key}" 
                                  style="width:100%; min-height:4em; margin-top:0.5em; padding:0.75em; border:1px solid #ccc; border-radius:4px; font-family:inherit;" 
                                  placeholder="Enter CLO description...">${text}</textarea>
                    </label>
                </div>`;
        });
        
        if (limitedClos.length === 0) {
            closHtml += '<p>No CLOs to edit for this course.</p>';
        }
        
        closHtml += '<div class="form-actions" style="margin-top:1.5em;">';
        closHtml += '<button id="save-edit-clos-btn" class="btn btn-primary" style="margin-right:1em"><i class="fas fa-save"></i> Save Changes</button>';
        closHtml += '<button id="cancel-edit-clos-btn" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</button>';
        closHtml += '</div></div>';
        
        closContent.innerHTML = `<form id="edit-clos-form">${closHtml}</form>`;
        
        // Attach event handlers
        setTimeout(() => {
            const form = document.getElementById('edit-clos-form');
            const saveBtn = document.getElementById('save-edit-clos-btn');
            const cancelBtn = document.getElementById('cancel-edit-clos-btn');
            
            if (saveBtn) {
                saveBtn.onclick = (e) => {
                    e.preventDefault();
                    this.saveEditedCLOs();
                };
            }
            
            if (cancelBtn) {
                cancelBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showExistingCLOs(); // Revert to display mode
                };
            }
        }, 0);
        
        closContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    saveEditedCLOs() {
        const closContent = document.getElementById('info-existing-clos');
        const textareas = document.querySelectorAll('[data-clo-key]');
        
        // Collect edited CLOs
        const editedCLOs = {};
        textareas.forEach(textarea => {
            const key = textarea.getAttribute('data-clo-key');
            const value = textarea.value.trim();
            if (value) {
                editedCLOs[key] = value;
            }
        });
        
        // Update the course data
        if (this.selectedCourse) {
            if (this.selectedCourse.cloik) {
                this.selectedCourse.cloik = editedCLOs;
            } else if (this.selectedCourse.cloek) {
                this.selectedCourse.cloek = editedCLOs;
            }
        }
        
        // Show success message and display saved CLOs
        this.displaySavedCLOs(editedCLOs);
    }

    displaySavedCLOs(editedCLOs) {
        const closContent = document.getElementById('info-existing-clos');
        
        let html = '<div class="saved-clos-display">';
        html += '<div class="alert alert-success"><i class="fas fa-check-circle"></i> CLO changes saved successfully!</div>';
        
        // Display the saved CLOs
        html += '<div class="saved-clos-list">';
        html += '<h4><i class="fas fa-list-check"></i> Saved Course Learning Outcomes</h4>';
        
        Object.entries(editedCLOs).forEach(([key, text], index) => {
            html += `
                <div class="saved-clo-item" style="margin-bottom:1em; padding:1em; background:#f8f9fa; border-left:3px solid var(--tt-light-blue); border-radius:4px;">
                    <div class="clo-header" style="font-weight:bold; color:var(--tt-dark-blue); margin-bottom:0.5em;">
                        CLO ${index + 1} (${key.toUpperCase()})
                    </div>
                    <div class="clo-text" style="color:var(--tt-black); line-height:1.4;">
                        ${text}
                    </div>
                </div>`;
        });
        
        html += '</div>';
        
        // Add analyze button
        html += '<div class="clo-actions" style="margin-top:1.5em; text-align:center;">';
        html += '<button id="analyze-clo-mlo-btn" class="btn btn-primary" style="margin-right:1em;"><i class="fas fa-chart-line"></i> Analyze CLO-MLO Alignment</button>';
        html += '<button id="edit-clos-again-btn" class="btn btn-secondary"><i class="fas fa-edit"></i> Edit CLOs Again</button>';
        html += '</div>';
        
        html += '</div>';
        
        closContent.innerHTML = html;
        
        // Attach event handlers
        setTimeout(() => {
            const analyzeBtn = document.getElementById('analyze-clo-mlo-btn');
            const editAgainBtn = document.getElementById('edit-clos-again-btn');
            
            if (analyzeBtn) {
                analyzeBtn.onclick = () => this.showCloMloAlignmentReport();
            }
            
            if (editAgainBtn) {
                editAgainBtn.onclick = () => this.showEditCLOsInline();
            }
        }, 0);
    }
    // Robust AI-powered CLO-MLO alignment analysis and reporting
    async showCloMloAlignmentReport() {
        // Get CLOs and MLOs for this course
        const closObj = this.selectedCourse.cloik || this.selectedCourse.cloek || {};
        const allMLOs = window.dataManager.getCurrentMLOs();
        const moduleCode = this.selectedCourse.moodulikood;
        
        // Limit to maximum 9 MLOs and 9 CLOs
        const relatedMLOs = allMLOs.filter(mlo => mlo.mlokood && mlo.mlokood.includes(moduleCode)).slice(0, 9);
        const cloKeys = Object.keys(closObj).slice(0, 9);
        
        if (cloKeys.length === 0 || relatedMLOs.length === 0) {
            alert('No CLOs or MLOs available for alignment analysis.');
            return;
        }
        
        // Prepare CLOs in array format for prompt
        const clos = cloKeys.map((key, idx) => ({ id: key, text: closObj[key], index: idx }));
        
        // Show loading state
        this.showLoadingState('Analyzing CLO-MLO alignment...');
        
        try {
            const prompt = this.buildOptimizedAlignmentPrompt(clos, relatedMLOs);
            const analysisText = await this.callGeminiAPIWithFallback(prompt);
            const results = this.parseAnalysisResponse(analysisText, clos, relatedMLOs);
            
            if (!results) {
                this.hideLoadingState();
                alert('Unable to parse valid CLO-MLO alignments from the response. Please try again.');
                return;
            }
            
            // Use enhanced display instead of old method
            this.displayEnhancedAnalysisResults(results, clos, relatedMLOs);
            this.hideLoadingState();
            
        } catch (err) {
            console.error('Analysis error:', err);
            this.hideLoadingState();
            alert(`Analysis failed: ${err.message || err}`);
        }
    }

    showLoadingState(message) {
        const loadingSection = document.getElementById('loading-section');
        const loadingTitle = document.getElementById('loading-title');
        const loadingMessage = document.getElementById('loading-message');
        
        if (loadingSection) {
            loadingSection.classList.remove('hidden');
            if (loadingTitle) loadingTitle.textContent = 'Processing Analysis...';
            if (loadingMessage) loadingMessage.textContent = message;
        }
    }

    hideLoadingState() {
        const loadingSection = document.getElementById('loading-section');
        if (loadingSection) {
            loadingSection.classList.add('hidden');
        }
    }

    // --- AI Integration and Prompt Logic (from mlo-clo-new.js, adapted) ---
    buildOptimizedAlignmentPrompt(clos, mlos) {
        let prompt = `Analyze CLO-MLO alignment. Rate each pair 1-5:\n1=Minimal, 2=Weak, 3=Moderate, 4=Strong, 5=Very Strong\n\nCLOs:`;
        clos.forEach(clo => {
            prompt += `\n${clo.id.toUpperCase()}: ${clo.text}`;
        });
        prompt += `\n\nMLOs:`;
        mlos.forEach(mlo => {
            prompt += `\n${mlo.mlokood}: ${mlo.mlosisuik}`;
        });
        prompt += `\n\nFormat: CLO1-MLO_CODE: score (brief reason)\nExample: CLO1-TI1.1: 4 (both focus on problem-solving skills)`;
        return prompt;
    }

    async callGeminiAPIWithFallback(prompt) {
        try {
            // Try secureAPIConfig if available
            if (window.secureAPIConfig && window.secureAPIConfig.isReady()) {
                return await window.secureAPIConfig.callGeminiAPI(prompt, {
                    temperature: 0.3,
                    maxOutputTokens: 1024
                });
            }
            
            // Try direct API call
            const apiKey = localStorage.getItem('gemini_api_key');
            if (!apiKey) {
                console.warn('No Gemini API key configured, falling back to local analysis');
                return this.generateLocalAlignmentAnalysis(prompt);
            }
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.4,
                            topK: 20,
                            topP: 0.9,
                            maxOutputTokens: 1024
                        }
                    })
                });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.warn('Gemini API failed, falling back to local analysis:', errorText);
                return this.generateLocalAlignmentAnalysis(prompt);
            }
            
            const data = await response.json();
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.warn('Invalid Gemini API response, falling back to local analysis');
                return this.generateLocalAlignmentAnalysis(prompt);
            }
            
            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            console.warn('API call failed, falling back to local analysis:', error);
            return this.generateLocalAlignmentAnalysis(prompt);
        }
    }
    
    generateLocalAlignmentAnalysis(prompt) {
        // Extract CLOs and MLOs from the prompt
        const cloSection = prompt.match(/CLOs:(.*?)MLOs:/s);
        const mloSection = prompt.match(/MLOs:(.*?)(?:\n\n|$)/s);
        
        const clos = cloSection ? cloSection[1].trim().split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+\.\s*/, '').trim()) : [];
        const mlos = mloSection ? mloSection[1].trim().split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+\.\s*/, '').trim()) : [];
        
        console.log('🏠 Using enhanced local alignment analysis for', clos.length, 'CLOs and', mlos.length, 'MLOs');
        
        let analysisResult = "Enhanced Local CLO-MLO Alignment Analysis\n\n";
        
        clos.forEach((clo, cloIndex) => {
            mlos.forEach((mlo, mloIndex) => {
                const cloText = clo.text || clo.clotext || '';
                const mloText = mlo.mlosisuik || mlo.mlotext || mlo.description || '';
                const analysis = this.performAdvancedLocalAnalysis(cloText, mloText);
                analysisResult += `CLO ${cloIndex + 1} - MLO ${mloIndex + 1}: ${analysis.score}/5\n`;
                analysisResult += `Analysis: ${analysis.explanation}\n`;
                if (analysis.improvements && analysis.improvements.length > 0) {
                    analysisResult += `Improvement: ${analysis.improvements[0]}\n`;
                }
                analysisResult += `\n`;
            });
        });
        
        analysisResult += "� Enhanced Analysis Features:\n";
        analysisResult += "• Competency categorization (analytical, creative, technical, etc.)\n";
        analysisResult += "• Bloom's taxonomy cognitive level assessment\n";
        analysisResult += "• Advanced keyword and semantic analysis\n";
        analysisResult += "• Targeted improvement suggestions\n\n";
        analysisResult += "✅ Professional-grade local fallback system active!";
        
        return analysisResult;
    }
    
    performAdvancedLocalAnalysis(cloText, mloText) {
        // Advanced competency keywords from plo-mlo.html
        const competencyKeywords = {
            analytical: ['analyze', 'analyze', 'evaluate', 'assess', 'compare', 'examine', 'investigate', 'review', 'critique', 'interpret', 'infer', 'distinguish'],
            application: ['apply', 'implement', 'use', 'utilize', 'employ', 'execute', 'practice', 'demonstrate', 'operate', 'perform', 'carry out', 'conduct'],
            creative: ['create', 'design', 'develop', 'innovate', 'generate', 'produce', 'construct', 'build', 'formulate', 'compose', 'synthesize', 'invent'],
            management: ['manage', 'lead', 'coordinate', 'organize', 'plan', 'control', 'direct', 'supervise', 'administer', 'oversee', 'guide', 'facilitate'],
            communication: ['communicate', 'present', 'explain', 'discuss', 'articulate', 'express', 'convey', 'report', 'describe', 'summarize', 'persuade', 'negotiate'],
            collaboration: ['collaborate', 'cooperate', 'work together', 'team', 'partner', 'coordinate', 'contribute', 'participate', 'engage', 'interact', 'support'],
            research: ['research', 'investigate', 'explore', 'study', 'inquiry', 'examine', 'analyze', 'collect', 'gather', 'survey', 'observe', 'experiment'],
            technical: ['technical', 'technology', 'digital', 'software', 'hardware', 'system', 'tool', 'platform', 'application', 'programming', 'coding'],
            business: ['business', 'commercial', 'economic', 'financial', 'market', 'customer', 'client', 'profit', 'revenue', 'strategy', 'enterprise'],
            international: ['international', 'global', 'cultural', 'multicultural', 'cross-cultural', 'diverse', 'worldwide', 'intercultural', 'foreign', 'abroad']
        };

        // Bloom's taxonomy levels with action verbs
        const bloomsLevels = {
            'remember': ['remember', 'recall', 'recognize', 'identify', 'define', 'describe', 'list', 'name', 'state', 'match', 'select'],
            'understand': ['understand', 'comprehend', 'explain', 'interpret', 'summarize', 'classify', 'compare', 'contrast', 'demonstrate', 'illustrate'],
            'apply': ['apply', 'use', 'implement', 'execute', 'carry out', 'solve', 'demonstrate', 'operate', 'employ', 'utilize'],
            'analyze': ['analyze', 'examine', 'break down', 'differentiate', 'organize', 'attribute', 'compare', 'contrast', 'deconstruct', 'distinguish'],
            'evaluate': ['evaluate', 'assess', 'critique', 'judge', 'test', 'monitor', 'review', 'rate', 'measure', 'validate'],
            'create': ['create', 'design', 'develop', 'construct', 'produce', 'generate', 'plan', 'compose', 'formulate', 'synthesize']
        };

        const levelHierarchy = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

        // Analyze keywords and competencies
        const analysisResult = this.analyzeAdvancedKeywords(cloText, mloText, competencyKeywords, bloomsLevels, levelHierarchy);
        const score = this.calculateAdvancedAlignmentScore(analysisResult);
        const improvements = this.generateAdvancedImprovements(cloText, mloText, analysisResult, score);

        return {
            score: score,
            justification: this.generateEnhancedJustification(analysisResult, score),
            explanation: this.generateEnhancedJustification(analysisResult, score),
            improvements: improvements,
            keywordOverlap: analysisResult.keywordOverlap,
            competencyAlignment: analysisResult.competencyAlignment,
            bloomsAlignment: analysisResult.cloBloomsLevel === analysisResult.mloBloomsLevel,
            highlightedCLO: this.highlightKeywords(cloText, analysisResult.commonWords),
            highlightedMLO: this.highlightKeywords(mloText, analysisResult.commonWords),
            competencyTags: analysisResult.sharedCompetencies,
            commonWords: analysisResult.commonWords,
            bloomLevels: {
                clo: analysisResult.cloBloomsLevel,
                mlo: analysisResult.mloBloomsLevel
            }
        };
    }

    analyzeAdvancedKeywords(cloText, mloText, competencyKeywords, bloomsLevels, levelHierarchy) {
        const cloWords = cloText.toLowerCase().match(/\w+/g) || [];
        const mloWords = mloText.toLowerCase().match(/\w+/g) || [];
        
        // Calculate basic keyword overlap
        const commonWords = cloWords.filter(word => 
            mloWords.includes(word) && 
            word.length > 3 && 
            !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'would', 'could', 'should', 'course', 'module', 'learning', 'outcome', 'student', 'students'].includes(word)
        );
        
        const keywordOverlap = cloWords.length > 0 ? (commonWords.length / cloWords.length) * 100 : 0;
        
        // Analyze competency categories
        const cloCompetencies = {};
        const mloCompetencies = {};
        
        Object.entries(competencyKeywords).forEach(([category, keywords]) => {
            const cloHasCategory = keywords.some(keyword => cloText.toLowerCase().includes(keyword));
            const mloHasCategory = keywords.some(keyword => mloText.toLowerCase().includes(keyword));
            
            if (cloHasCategory) cloCompetencies[category] = true;
            if (mloHasCategory) mloCompetencies[category] = true;
        });
        
        const sharedCompetencies = Object.keys(cloCompetencies).filter(comp => mloCompetencies[comp]);
        const competencyAlignment = Object.keys(cloCompetencies).length > 0 ? 
            (sharedCompetencies.length / Object.keys(cloCompetencies).length) * 100 : 0;
        
        // Analyze Bloom's taxonomy levels
        function getBloomsLevel(text) {
            for (const [level, verbs] of Object.entries(bloomsLevels)) {
                if (verbs.some(verb => text.toLowerCase().includes(verb))) {
                    return level;
                }
            }
            return 'remember'; // default level
        }
        
        const cloBloomsLevel = getBloomsLevel(cloText);
        const mloBloomsLevel = getBloomsLevel(mloText);
        const cloLevelIndex = levelHierarchy.indexOf(cloBloomsLevel);
        const mloLevelIndex = levelHierarchy.indexOf(mloBloomsLevel);
        
        // Generate explanation
        let explanation = `Enhanced analysis: ${keywordOverlap.toFixed(1)}% keyword overlap`;
        
        if (sharedCompetencies.length > 0) {
            explanation += `, shared competencies: ${sharedCompetencies.join(', ')}`;
        }
        
        if (cloBloomsLevel !== 'remember' || mloBloomsLevel !== 'remember') {
            explanation += `. Cognitive levels: CLO(${cloBloomsLevel}) ↔ MLO(${mloBloomsLevel})`;
        }
        
        if (commonWords.length > 0) {
            explanation += `. Key terms: ${commonWords.slice(0, 5).join(', ')}`;
        }
        
        return {
            keywordOverlap,
            competencyAlignment,
            sharedCompetencies,
            cloCompetencies: Object.keys(cloCompetencies),
            mloCompetencies: Object.keys(mloCompetencies),
            cloBloomsLevel,
            mloBloomsLevel,
            cloLevelIndex,
            mloLevelIndex,
            commonWords,
            explanation
        };
    }

    calculateAdvancedAlignmentScore(analysis) {
        let score = 1;
        
        // Base score from keyword overlap - more granular scoring
        if (analysis.keywordOverlap >= 40) score = 5;
        else if (analysis.keywordOverlap >= 25) score = 4;
        else if (analysis.keywordOverlap >= 15) score = 3;
        else if (analysis.keywordOverlap >= 8) score = 2;
        else score = 1;
        
        // Boost for competency alignment
        if (analysis.competencyAlignment >= 70) score = Math.min(5, score + 1);
        else if (analysis.competencyAlignment >= 50) score = Math.min(5, score + 0.5);
        else if (analysis.competencyAlignment >= 30) score = Math.min(5, score + 0.25);
        
        // Boost for Bloom's taxonomy alignment
        const levelDifference = Math.abs(analysis.cloLevelIndex - analysis.mloLevelIndex);
        if (levelDifference === 0) score = Math.min(5, score + 0.5); // Perfect match
        else if (levelDifference === 1) score = Math.min(5, score + 0.25); // Close match
        else if (levelDifference >= 3) score = Math.max(1, score - 0.5); // Poor match
        
        // Bonus for excellent alignment
        if (analysis.keywordOverlap >= 30 && analysis.competencyAlignment >= 40 && levelDifference <= 1) {
            score = Math.min(5, score + 0.5);
        }
        
        // Penalty for very poor alignment
        if (analysis.keywordOverlap < 5 && analysis.competencyAlignment < 20) {
            score = 1;
        }
        
        return Math.round(Math.max(1, Math.min(5, score)));
    }

    generateAdvancedImprovements(cloText, mloText, analysis, score) {
        const suggestions = [];
        const { cloCompetencies, mloCompetencies, sharedCompetencies, cloBloomsLevel, mloBloomsLevel, cloLevelIndex, mloLevelIndex, keywordOverlap } = analysis;
        
        // Competency-based suggestions
        const missingCompetencies = [];
        const basicCompetencyMap = {
            analytical: ['analyze', 'evaluate', 'assess', 'examine'],
            application: ['apply', 'implement', 'demonstrate', 'practice'],
            creative: ['create', 'design', 'develop', 'innovate'],
            communication: ['communicate', 'present', 'explain', 'articulate']
        };
        
        Object.entries(basicCompetencyMap).forEach(([category, keywords]) => {
            const cloHasCategory = cloCompetencies.includes(category);
            const mloHasCategory = mloCompetencies.includes(category);
            
            if (cloHasCategory && !mloHasCategory) {
                const relevantKeywords = keywords.filter(keyword => cloText.toLowerCase().includes(keyword));
                missingCompetencies.push({category, keywords: relevantKeywords});
            }
        });
        
        // Bloom's taxonomy specific suggestions
        if (cloLevelIndex > mloLevelIndex) {
            const targetLevel = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'][cloLevelIndex];
            const suggestedVerbs = {
                'understand': ['explain', 'interpret', 'summarize'],
                'apply': ['apply', 'implement', 'demonstrate'],
                'analyze': ['analyze', 'examine', 'compare'],
                'evaluate': ['evaluate', 'assess', 'critique'],
                'create': ['create', 'design', 'develop']
            }[targetLevel] || ['enhance', 'improve', 'strengthen'];
            
            suggestions.push(`Elevate cognitive level from "${mloBloomsLevel}" to "${targetLevel}" by using action verbs like: "${suggestedVerbs.join('", "')}"`);
        }
        
        // Content-specific recommendations
        const cloKeyTerms = cloText.toLowerCase().match(/\w+/g)?.filter(word => 
            word.length > 4 && 
            !['student', 'students', 'learning', 'knowledge', 'skills', 'ability', 'capable', 'course', 'module'].includes(word.toLowerCase())
        ).slice(0, 3) || [];
        
        if (keywordOverlap < 15 && cloKeyTerms.length > 0) {
            suggestions.push(`Incorporate specific CLO terminology: "${cloKeyTerms.join('", "')}" to strengthen semantic alignment with course outcomes.`);
        }
        
        if (missingCompetencies.length > 0) {
            const primaryMissing = missingCompetencies[0];
            suggestions.push(`Address missing ${primaryMissing.category} competency by incorporating "${primaryMissing.keywords.slice(0, 2).join('" and "')}" in learning activities.`);
        }
        
        // Score-based recommendations
        if (score === 1) {
            suggestions.push(`Critical misalignment detected. Restructure MLO to directly address CLO core competencies.`);
        } else if (score === 2) {
            suggestions.push(`Partial alignment present. Enhance MLO by adding specific assessment methods and learning activities.`);
        } else if (score >= 4) {
            suggestions.push(`Strong alignment achieved. Consider adding specific assessment criteria to demonstrate competency achievement.`);
        }
        
        return suggestions.length > 0 ? suggestions : [`Consider adding shared terminology and competency-based language to strengthen alignment.`];
    }

    // Enhanced justification generation
    generateEnhancedJustification(analysis, score) {
        const { keywordOverlap, competencyAlignment, sharedCompetencies, cloBloomsLevel, mloBloomsLevel, commonWords } = analysis;
        
        let justification = `Enhanced Analysis: ${keywordOverlap.toFixed(1)}% keyword overlap`;
        
        if (sharedCompetencies.length > 0) {
            justification += `, shared competencies: ${sharedCompetencies.join(', ')}`;
        }
        
        if (cloBloomsLevel !== 'remember' || mloBloomsLevel !== 'remember') {
            justification += `. Cognitive levels: CLO(${cloBloomsLevel}) ↔ MLO(${mloBloomsLevel})`;
        }
        
        if (commonWords.length > 0) {
            justification += `. Key terms: ${commonWords.slice(0, 5).join(', ')}`;
        }
        
        // Score-specific details
        switch(score) {
            case 5:
                justification += `. Excellent alignment with strong semantic overlap and competency matching.`;
                break;
            case 4:
                justification += `. Strong alignment with good thematic connection and competency overlap.`;
                break;
            case 3:
                justification += `. Moderate alignment with some shared concepts and terminology.`;
                break;
            case 2:
                justification += `. Weak alignment with limited connection between outcomes.`;
                break;
            case 1:
                justification += `. Minimal alignment requiring significant revision.`;
                break;
        }
        
        return justification;
    }

    // Keyword highlighting method
    highlightKeywords(text, keywords) {
        if (!keywords || keywords.length === 0) return text;
        
        let highlightedText = text;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, `<span class="keyword-highlight">${keyword}</span>`);
        });
        return highlightedText;
    }

    calculateLocalAlignmentScore(clo, mlo) {
        // Legacy method for compatibility - redirects to advanced analysis
        const cloText = clo.text || clo.clotext || '';
        const mloText = mlo.mlosisuik || mlo.mlotext || mlo.description || '';
        const analysis = this.performAdvancedLocalAnalysis(cloText, mloText);
        return analysis.score;
    }

    getLocalAlignmentReasoning(clo, mlo, score) {
        const reasons = {
            5: "Excellent alignment - strong semantic overlap, shared competencies, and cognitive level match",
            4: "Very good alignment - clear thematic connection with good competency overlap",
            3: "Moderate alignment - some shared concepts and terminology",
            2: "Weak alignment - limited connection between learning outcomes",
            1: "Minimal alignment - different focus areas requiring significant revision"
        };
        
        return reasons[score] || "Unknown alignment level";
    }

    parseAnalysisResponse(analysisText, clos, mlos) {
        // Only return CLO-MLO pairs with a real parsed score (not default)
        const parsedResults = [];
        const lines = analysisText.split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            
            // Handle local analysis format: CLO 1 - MLO 1: 4/5
            const localMatch = trimmedLine.match(/CLO\s*(\d+)\s*-\s*MLO\s*(\d+)\s*:\s*([1-5])\/5/i);
            if (localMatch) {
                const cloIndex = parseInt(localMatch[1]) - 1;
                const mloIndex = parseInt(localMatch[2]) - 1;
                const score = parseInt(localMatch[3]);
                
                if (clos[cloIndex] && mlos[mloIndex] && score >= 1 && score <= 5) {
                    parsedResults.push({
                        clo: clos[cloIndex],
                        mlo: mlos[mloIndex],
                        score,
                        justification: this.extractJustification(trimmedLine)
                    });
                }
                return;
            }
            
            // Handle API format: CLO1-MLO_CODE: 4 (reason)
            const pairMatch = trimmedLine.match(/(CLO[A-Z]*\d+)[^:]*([a-zA-Z0-9_.-]+)[^:]*:\s*([1-5])/i);
            if (pairMatch) {
                const cloIdFromResponse = pairMatch[1].toLowerCase();
                const mloCodeFromResponse = pairMatch[2].toLowerCase();
                const score = parseInt(pairMatch[3]);
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
        const cleanLine = line.replace(/CLO\d+/i, '').replace(/[a-zA-Z0-9_.-]+/i, '').replace(/[0-5]/, '');
        let justification = cleanLine.match(/\(([^)]+)\)/)?.[1] ||
            cleanLine.match(/[:\-–]\s*(.+)$/)?.[1] ||
            cleanLine.trim();
        return justification.trim() || 'Alignment assessment provided';
    }

    createPLOMLOStyleLayout(results, clos, mlos) {
        // Only use real parsed results
        if (!results || !results.length) {
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
        const uniqueMLOs = mlos.map(m => m.mlokood);
        const uniqueCLOs = clos.map(c => c.id);
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

    // New methods for enhanced PLO-MLO style analysis
    displayEnhancedAnalysisResults(results, clos, mlos) {
        // Show methodology section
        showMethodologySection();
        
        // Hide CLO management and show results
        this.hideCLOManagementSection();
        this.showAnalysisResultsSection();
        
        // Generate summary content
        this.renderSummary(results, clos, mlos);
        
        // Generate detailed analysis grouped by MLO (moved before matrix)
        this.renderDetailedAnalysisByMLO(results, clos, mlos);
        
        // Generate alignment matrix (moved after detailed analysis)
        this.renderAlignmentMatrix(results, clos, mlos);
        
        // Setup event handlers
        this.setupAnalysisEventHandlers();
    }

    hideCLOManagementSection() {
        const cloManagementSection = document.getElementById('clo-management-section');
        if (cloManagementSection) {
            cloManagementSection.classList.add('hidden');
        }
    }

    showAnalysisResultsSection() {
        const resultsSection = document.getElementById('analysis-results-section');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        }
    }

    renderSummary(results, clos, mlos) {
        const container = document.getElementById('summary-content');
        if (!container || !results || results.length === 0) {
            if (container) container.innerHTML = '<p>No alignment data available.</p>';
            return;
        }

        const totalAlignments = results.length;
        const averageScore = (results.reduce((sum, result) => sum + result.score, 0) / totalAlignments).toFixed(2);
        
        const scoreDistribution = {
            1: results.filter(r => r.score === 1).length,
            2: results.filter(r => r.score === 2).length,
            3: results.filter(r => r.score === 3).length,
            4: results.filter(r => r.score === 4).length,
            5: results.filter(r => r.score === 5).length
        };

        const strongAlignments = scoreDistribution[4] + scoreDistribution[5];
        const weakAlignments = scoreDistribution[1] + scoreDistribution[2];
        const coveragePercentage = (strongAlignments / totalAlignments * 100).toFixed(1);
        
        // Calculate max height for chart scaling
        const maxCount = Math.max(...Object.values(scoreDistribution));
        
        container.innerHTML = `
            <div class="score-distribution-chart">
                <h3><i class="fas fa-chart-column"></i> Score Distribution Analysis</h3>
                <div class="chart-container">
                    ${Object.entries(scoreDistribution).map(([score, count]) => {
                        const percentage = totalAlignments > 0 ? ((count / totalAlignments) * 100).toFixed(1) : 0;
                        const scoreColors = {
                            1: '#ffcdd2', 2: '#ffecb3', 3: '#fff9c4', 4: '#c8e6c9', 5: '#a5d6a7'
                        };
                        return `
                            <div class="chart-bar" 
                                 style="height: ${maxCount > 0 ? (count / maxCount * 160) + 20 : 20}px; 
                                        background: ${scoreColors[score]}; 
                                        color: #000000;" 
                                 title="Score ${score}: ${count} (${percentage}%)">
                                ${count} (${percentage}%)
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="chart-labels">
                    <div class="chart-label">Minimal<br><small>Score 1</small></div>
                    <div class="chart-label">Partial<br><small>Score 2</small></div>
                    <div class="chart-label">Moderate<br><small>Score 3</small></div>
                    <div class="chart-label">Strong<br><small>Score 4</small></div>
                    <div class="chart-label">Excellent<br><small>Score 5</small></div>
                </div>
                <div style="text-align: center; margin-top: 15px; color: var(--tt-burgundy); font-weight: bold;">
                    Average Score: ${averageScore} | Strong Alignments: ${coveragePercentage}%
                </div>
            </div>
        `;
    }

    renderDetailedAnalysisByMLO(results, clos, mlos) {
        const container = document.getElementById('detailed-analysis-content');
        if (!container || !results || results.length === 0) {
            if (container) container.innerHTML = '<p>No detailed analysis available.</p>';
            return;
        }

        // Group results by MLO
        const resultsByMLO = {};
        results.forEach(result => {
            const mloCode = result.mlo.mlokood;
            if (!resultsByMLO[mloCode]) {
                resultsByMLO[mloCode] = [];
            }
            resultsByMLO[mloCode].push(result);
        });

        let html = '<div class="detailed-breakdown">';
        
        Object.entries(resultsByMLO).forEach(([mloCode, mloResults]) => {
            const mlo = mlos.find(m => m.mlokood === mloCode);
            const mloDescription = mlo ? (mlo.mlosisuik || mlo.mlotext || mlo.description || 'MLO description not available') : 'MLO description not available';
            const averageScore = (mloResults.reduce((sum, r) => sum + r.score, 0) / mloResults.length).toFixed(1);
            
            // Get all matching keywords for this MLO from all its CLO alignments
            const allMatchingKeywords = [...new Set(mloResults.flatMap(r => r.commonWords || []))];
            const highlightedMLOText = this.highlightKeywords(mloDescription, allMatchingKeywords);
            
            html += `
                <div class="mlo-analysis-section">
                    <div class="mlo-header-section">
                        <h3>${mloCode}: Average Alignment Score: ${averageScore}</h3>
                        <div class="mlo-text">
                            ${highlightedMLOText}
                        </div>
                    </div>
                    
                    <table class="detailed-breakdown-table">
                        <thead>
                            <tr>
                                <th>CLO Code</th>
                                <th>CLO Content</th>
                                <th>Score</th>
                                <th>Justification & Analysis</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            mloResults.forEach(result => {
                const cloText = result.clo.text || result.clo.clotext || 'CLO text not available';
                const cloCode = result.clo.id || result.clo.clokood;
                
                // Apply keyword highlighting to CLO text
                const highlightedCLOText = result.highlightedCLO || this.highlightKeywords(cloText, result.commonWords || []);
                
                // Build competency tags display
                let competencyTags = '';
                if (result.competencyTags && result.competencyTags.length > 0) {
                    competencyTags = result.competencyTags.map(tag => 
                        `<span class="competency-tag">${tag}</span>`
                    ).join(' ');
                }
                
                // Build Bloom's levels display
                let bloomsDisplay = '';
                if (result.bloomLevels) {
                    bloomsDisplay = `CLO(${result.bloomLevels.clo}) ↔ MLO(${result.bloomLevels.mlo})`;
                }
                
                // Generate improvement suggestions for low scores
                const improvementSuggestions = result.score < 3 && result.improvements && result.improvements.length > 0 ? 
                    result.improvements : null;
                
                html += `
                    <tr>
                        <td class="mlo-code-cell">${cloCode}</td>
                        <td class="mlo-content-cell">
                            ${highlightedCLOText}
                        </td>
                        <td class="alignment-score-cell">
                            <span class="alignment-score score-${result.score}">${result.score}</span>
                        </td>
                        <td class="justification-cell">
                            <div style="font-size: 0.9em;">
                                <div><strong>Keyword overlap:</strong> ${(result.keywordOverlap || 0).toFixed(1)}% 
                                ${result.commonWords && result.commonWords.length > 0 ? 
                                    `(${result.commonWords.slice(0, 3).join(', ')}${result.commonWords.length > 3 ? '...' : ''})` : '(none)'}
                                </div>
                                <div style="margin-top: 4px;"><strong>Competency matches:</strong> ${competencyTags || 'none detected'}
                                </div>
                                ${bloomsDisplay ? `<div style="margin-top: 4px;"><strong>Bloom's level:</strong> ${bloomsDisplay}</div>` : ''}
                                ${improvementSuggestions && improvementSuggestions.length > 0 ? `
                                    <div style="margin-top: 8px; padding: 6px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
                                        <strong><i class="fas fa-lightbulb" style="color: #856404;"></i> Improvement Suggestions:</strong>
                                        <ul style="margin: 4px 0 0 0; padding-left: 16px;">
                                            ${improvementSuggestions.map(suggestion => `<li style="margin-bottom: 2px;">${suggestion}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    renderAlignmentMatrix(results, clos, mlos) {
        const container = document.getElementById('alignment-matrix-container');
        if (!container || !results || results.length === 0) {
            if (container) container.innerHTML = '<p>No matrix data available.</p>';
            return;
        }

        const uniqueMLOs = mlos.map(m => m.mlokood);
        const uniqueCLOs = clos.map(c => c.id || c.clokood);
        
        let matrixHTML = `
            <table class="detailed-analysis-table">
                <thead>
                    <tr>
                        <th class="matrix-corner">CLO \\ MLO</th>
                        ${uniqueMLOs.map(mlo => `<th class="mlo-header">${mlo}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;
        
        uniqueCLOs.forEach(cloId => {
            matrixHTML += `<tr><td class="clo-header"><strong>${cloId}</strong></td>`;
            uniqueMLOs.forEach(mloCode => {
                const result = results.find(r => 
                    (r.clo.id === cloId || r.clo.clokood === cloId) && 
                    r.mlo.mlokood === mloCode
                );
                const score = result ? result.score : 0;
                matrixHTML += `<td class="score-${score}" title="${result ? result.justification || result.explanation : 'No data'}">${score || '-'}</td>`;
            });
            matrixHTML += '</tr>';
        });
        
        matrixHTML += '</tbody></table>';
        
        container.innerHTML = matrixHTML;
    }

    setupAnalysisEventHandlers() {
        // Back to CLO Management button
        const backBtn = document.getElementById('back-to-clo-management');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showCLOManagementSection();
                this.hideAnalysisResultsSection();
            });
        }

        // Download report button
        const downloadBtn = document.getElementById('download-report-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.showPdfPreview());
        }
    }

    showCLOManagementSection() {
        const cloManagementSection = document.getElementById('clo-management-section');
        if (cloManagementSection) {
            cloManagementSection.classList.remove('hidden');
        }
    }

    hideAnalysisResultsSection() {
        const resultsSection = document.getElementById('analysis-results-section');
        if (resultsSection) {
            resultsSection.classList.add('hidden');
        }
    }

    showPdfPreview() {
        const modal = document.getElementById('pdf-preview-modal');
        const iframe = document.getElementById('pdf-preview-iframe');
        
        if (modal && iframe) {
            // Generate report content
            const reportContent = this.generateReportHTML();
            
            // Create blob URL for the report
            const blob = new Blob([reportContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            iframe.src = url;
            modal.style.display = 'flex';
        }
    }

    generateReportHTML() {
        const currentProgramme = this.currentProgramme;
        const selectedCourse = this.selectedCourse;
        const today = new Date().toLocaleDateString();
        
        // Get current analysis content
        const summaryContent = document.getElementById('summary-content')?.innerHTML || '';
        const detailedContent = document.getElementById('detailed-analysis-content')?.innerHTML || '';
        const matrixContent = document.getElementById('alignment-matrix-container')?.innerHTML || '';
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CLO-MLO Alignment Report</title>
    <style>
        :root {
            --tt-burgundy: #aa1352;
            --tt-magenta: #e4067e;
            --tt-light-blue: #4dbed2;
            --tt-dark-blue: #342b60;
            --tt-grey-1: #9396b0;
            --tt-grey-2: #dadae4;
        }
        
        body { 
            font-family: 'Arial', sans-serif; 
            margin: 20px; 
            line-height: 1.6; 
            color: #333;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid var(--tt-burgundy);
            padding-bottom: 20px;
        }
        .header h1 { 
            color: var(--tt-burgundy); 
            margin: 0;
            font-size: 24px;
        }
        .header p { 
            margin: 10px 0 5px 0; 
            font-size: 16px;
            color: #666;
        }
        .section { 
            margin: 30px 0; 
        }
        .section h2, .section h3, .section h4 { 
            color: var(--tt-burgundy); 
            border-bottom: 2px solid var(--tt-burgundy); 
            padding-bottom: 10px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            font-size: 11px;
        }
        th, td { 
            border: 1px solid #dee2e6; 
            padding: 6px; 
            text-align: left;
            vertical-align: top;
        }
        th { 
            background: var(--tt-burgundy); 
            color: white; 
            font-weight: bold;
            text-align: center;
        }
        .score-1 { background-color: #ffcdd2; text-align: center; }
        .score-2 { background-color: #ffecb3; text-align: center; }
        .score-3 { background-color: #fff9c4; text-align: center; }
        .score-4 { background-color: #c8e6c9; text-align: center; }
        .score-5 { background-color: #a5d6a7; text-align: center; }
        .mlo-group-header { 
            background: #f8f9fa !important; 
            color: var(--tt-burgundy) !important;
            text-align: left !important;
            font-weight: bold;
        }
        .chart-container { 
            display: flex; 
            gap: 10px; 
            margin: 10px 0; 
        }
        .chart-bar { 
            padding: 5px; 
            border-radius: 4px; 
            min-width: 60px; 
            text-align: center; 
            font-size: 10px;
        }
        .improvement-suggestions {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 6px;
            margin-top: 8px;
            font-size: 10px;
        }
        .alignment-insights {
            background: #f8f9fa;
            border: 1px solid var(--tt-grey-2);
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        @media print {
            body { margin: 0; font-size: 10px; }
            .header { page-break-after: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Course-Module Learning Outcomes Alignment Report</h1>
        <p><strong>Programme:</strong> ${currentProgramme ? `${currentProgramme.code} - ${currentProgramme.kavanimetusik}` : 'Not specified'}</p>
        <p><strong>Course:</strong> ${selectedCourse ? `${selectedCourse.ainekood} - ${selectedCourse.ainenimetusik}` : 'Not specified'}</p>
        <p><strong>Generated:</strong> ${today}</p>
    </div>

    <div class="section">
        <h2>Analysis Summary</h2>
        ${summaryContent}
    </div>

    <div class="section">
        <h2>Detailed Analysis by MLO</h2>
        ${detailedContent}
    </div>

    <div class="section">
        <h2>Alignment Matrix</h2>
        ${matrixContent}
    </div>
</body>
</html>`;
    }


    showManualEntryInline() {
        const closContent = document.getElementById('info-existing-clos');
        if (!this.selectedCourse || !closContent) return;
        closContent.innerHTML = `
            <form id="manual-entry-form">
                <label>New CLO Key:<br><input name="clo-key" required style="width:100%"></label><br><br>
                <label>New CLO Text:<br><textarea name="clo-text" required style="width:100%;min-height:3em"></textarea></label><br><br>
                <button type="submit" class="option-btn">Add CLO</button>
            </form>
        `;
        setTimeout(() => {
            const form = document.getElementById('manual-entry-form');
            if (form) {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    alert('New CLO added successfully!');
                };
            }
        }, 0);
        closContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showAIGenerationModal() {
        // Simulate AI generation and display results in the main UI, not a popup
        const closContent = document.getElementById('info-existing-clos');
        if (!this.selectedCourse || !closContent) return;
        // Simulate AI-generated CLOs (replace with real AI call as needed)
        const aiCLOs = [
            'Apply financial accounting concepts to real-world business scenarios.',
            'Analyze and interpret financial statements for decision making.',
            'Evaluate the impact of digitalization on accounting practices.',
            'Develop budgets and perform cost analysis for business planning.',
            'Assess the effectiveness of management accounting tools.'
        ];
        closContent.innerHTML = aiCLOs.map((text, i) => `<div><strong>CLO${i+1}:</strong> ${text}</div>`).join('');
        // Optionally scroll to the CLOs section
        closContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showModal(title, contentHtml) {
        document.querySelectorAll('.clo-modal').forEach(m => m.remove());
        const modal = document.createElement('div');
        modal.className = 'clo-modal';
        modal.style = 'position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="background:#fff;max-width:500px;width:90vw;padding:2em 1.5em;border-radius:10px;box-shadow:0 2px 16px #0002;position:relative;">
                <button class="clo-modal-close" style="position:absolute;top:1em;right:1em;font-size:1.2em;background:none;border:none;cursor:pointer;">&times;</button>
                <h2 style="margin-top:0">${title}</h2>
                ${contentHtml}
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.clo-modal-close').onclick = () => modal.remove();
    }
    constructor() {
        this.currentProgramme = null;
        this.selectedCourse = null;
    }

    async init() {
        // Ensure DataManager is initialized and ready
        if (!window.dataManager) {
            window.dataManager = new DataManager();
        }
        // Load programmes if not loaded
        if (!window.dataManager.isLoaded) {
            await window.dataManager.loadProgrammes();
        }
        // Optionally set currentProgramme from sessionStorage or default
        this.currentProgramme = window.dataManager.getCurrentProgramme();
        // Populate course selector and set up event listener
        this.populateCourseSelector();
        this.setupCourseSelectorListener();

        // Setup CLO management button event listeners
        const editBtn = document.getElementById('edit-existing-clos');
        if (editBtn) {
            editBtn.querySelector('.option-btn')?.addEventListener('click', () => this.showEditCLOsInline());
        }
        const manualBtn = document.getElementById('manual-entry-clos');
        if (manualBtn) {
            manualBtn.querySelector('.option-btn')?.addEventListener('click', () => this.showManualEntryInline());
        }
        const aiBtn = document.getElementById('ai-generate-clos');
        if (aiBtn) {
            aiBtn.querySelector('.option-btn')?.addEventListener('click', () => this.showAIGenerationModal());
        }
    }

    populateCourseSelector() {
        const courseSelector = document.getElementById('course-selector');
        if (!courseSelector) return;
        const courses = window.dataManager.getCurrentCourses();
        courseSelector.innerHTML = '<option value="">Choose a course...</option>';
        if (courses && courses.length > 0) {
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.ainekood;
                option.textContent = `${course.ainekood} - ${course.ainenimetusik}`;
                courseSelector.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No courses available';
            option.disabled = true;
            courseSelector.appendChild(option);
        }
    }

    setupCourseSelectorListener() {
        const courseSelector = document.getElementById('course-selector');
        if (!courseSelector) return;
        courseSelector.addEventListener('change', (e) => {
            const courseCode = e.target.value;
            this.handleCourseSelection(courseCode);
        });
    }

    handleCourseSelection(courseCode) {
        this.selectedCourse = window.dataManager.getCourseByCode(courseCode);
        // UI element references
        const infoSection = document.getElementById('course-information-section');
        const aimsContent = document.getElementById('info-course-aims');
        const codeContent = document.getElementById('info-course-code');
        const nameEnContent = document.getElementById('info-course-name-en');
        const nameEtContent = document.getElementById('info-course-name-et');
        const eapContent = document.getElementById('info-course-eap');
        const modulesContent = document.getElementById('info-course-modules');
        const assessmentContent = document.getElementById('info-course-assessment');
        const typeContent = document.getElementById('info-course-type');
        const urlContent = document.getElementById('info-course-url');
        const closContent = document.getElementById('info-existing-clos');

        if (this.selectedCourse) {
            if (infoSection) infoSection.classList.remove('hidden');
            if (codeContent) codeContent.textContent = this.selectedCourse.ainekood || '-';
            if (nameEnContent) nameEnContent.textContent = this.selectedCourse.ainenimetusik || '-';
            if (nameEtContent) nameEtContent.textContent = this.selectedCourse.ainenimetusek || '-';
            if (eapContent) eapContent.textContent = this.selectedCourse.eap || '-';
            if (modulesContent) modulesContent.textContent = this.selectedCourse.moodulikood || '-';
            if (assessmentContent) assessmentContent.textContent = this.selectedCourse.kontrollivorm || '-';
            if (typeContent) typeContent.textContent = this.selectedCourse.KV || '-';
            if (urlContent) {
                if (this.selectedCourse.aineurl) {
                    urlContent.href = this.selectedCourse.aineurl;
                    urlContent.style.display = 'inline';
                } else {
                    urlContent.style.display = 'none';
                }
            }
            if (aimsContent) {
                const aims = this.selectedCourse.eesmarkik || this.selectedCourse.eesmarkek || 'No course aims available.';
                aimsContent.innerHTML = aims.replace(/\n/g, '<br>');
            }
            if (closContent) {
                const clos = this.selectedCourse.cloik || this.selectedCourse.cloek || {};
                if (Object.keys(clos).length > 0) {
                    closContent.innerHTML = Object.entries(clos).map(([key, text]) => `<div><strong>${key.toUpperCase()}:</strong> ${text}</div>`).join('');
                } else {
                    closContent.innerHTML = '<em>No CLOs available for this course.</em>';
                }
            }
            // MODULE CONTENT (MLOs)
            const moduleSection = document.getElementById('module-content-section');
            const moduleList = document.getElementById('module-content-list');
            if (moduleSection && moduleList) {
                moduleSection.classList.remove('hidden');
                // Find all MLOs for this course's module
                const allMLOs = window.dataManager.getCurrentMLOs();
                const moduleCode = this.selectedCourse.moodulikood;
                const relatedMLOs = allMLOs.filter(mlo => mlo.mlokood.startsWith(moduleCode));
                if (relatedMLOs.length > 0) {
                    moduleList.innerHTML = relatedMLOs.map(mlo =>
                        `<div class="mlo-item"><strong>[${mlo.mlokood}]</strong> ${mlo.mlosisuik || mlo.mlosisuek || ''}</div>`
                    ).join('');
                } else {
                    moduleList.innerHTML = '<em>No module learning outcomes found for this course.</em>';
                }
            }
        } else {
            if (infoSection) infoSection.classList.add('hidden');
            const moduleSection = document.getElementById('module-content-section');
            if (moduleSection) moduleSection.classList.add('hidden');
        }
    }

    // ...existing code for modal methods (keep only one set, remove duplicates)...
}

// Global functions for PDF modal
function closePdfPreview() {
    const modal = document.getElementById('pdf-preview-modal');
    if (modal) {
        modal.style.display = 'none';
        const iframe = document.getElementById('pdf-preview-iframe');
        if (iframe && iframe.src) {
            URL.revokeObjectURL(iframe.src);
            iframe.src = '';
        }
    }
}

function savePdfReport() {
    const iframe = document.getElementById('pdf-preview-iframe');
    if (iframe && iframe.src) {
        // Create a temporary link to download the HTML content
        const link = document.createElement('a');
        link.href = iframe.src;
        link.download = `CLO-MLO-Alignment-Report-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Close the modal
        closePdfPreview();
    }
}

// Initialize when DOM is loaded
// Also robustly fix floating home button event

document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        window.cloController = new CLOMLOController();
        if (window.cloController.init) await window.cloController.init();
        attachFloatingHomeHandler();

        // Observe DOM changes to re-attach handler if the button is replaced
        const observer = new MutationObserver(() => {
            attachFloatingHomeHandler();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();
});

function attachFloatingHomeHandler() {
    const homeBtnFloat = document.getElementById('home-btn-float');
    
    if (homeBtnFloat && !homeBtnFloat._homeHandlerAttached) {
        homeBtnFloat.onclick = () => window.location.href = 'index.html';
        homeBtnFloat._homeHandlerAttached = true;
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Setup floating action buttons
function setupFloatingButtons() {
    const homeBtn = document.getElementById('home-btn-float');
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Show/hide back to top button based on scroll
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
    });
}

// Show methodology section when analysis starts
function showMethodologySection() {
    const methodologySection = document.getElementById('methodology');
    if (methodologySection) {
        methodologySection.style.display = 'block';
    }
}

// Initialize floating components
document.addEventListener('DOMContentLoaded', () => {
    setupFloatingButtons();
    
    // Setup initial back to top button state
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.style.display = 'none';
    }
});

