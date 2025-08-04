// Remove duplicate floating home buttons from the DOM
function removeDuplicateFloatingHomeButtons() {
    const buttons = document.querySelectorAll('#floating-home');
    if (buttons.length > 1) {
        // Keep the first, remove the rest
        for (let i = 1; i < buttons.length; i++) {
            buttons[i].remove();
        }
    }
}
// CLO-MLO Analysis Controller - Dynamic, Data-Driven
class CLOMLOController {

    showEditCLOsInline() {
        const closContent = document.getElementById('info-existing-clos');
        if (!this.selectedCourse || !closContent) return;
        const clos = this.selectedCourse.cloik || this.selectedCourse.cloek || {};
        let closHtml = '';
        Object.entries(clos).forEach(([key, text]) => {
            closHtml += `<div style="margin-bottom:1em"><label><strong>${key.toUpperCase()}</strong><br><textarea data-clo-key="${key}" style="width:100%;min-height:3em">${text}</textarea></label></div>`;
        });
        if (!closHtml) closHtml = '<p>No CLOs to edit for this course.</p>';
        closHtml += '<button id="save-edit-clos-btn" class="option-btn" style="margin-top:1em">Save Changes</button>';
        closContent.innerHTML = `<form id="edit-clos-form">${closHtml}</form>`;
        // Attach save handler
        setTimeout(() => {
            const form = document.getElementById('edit-clos-form');
            if (form) {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    // Save changes (not persisted in this demo)
                    // After saving, show Analyze button
                    closContent.innerHTML = '<div class="alert-success">CLO changes saved (not persisted in this demo).</div>' +
                        '<button id="analyze-clo-mlo-btn" class="option-btn" style="margin-top:1em">Analyze CLO-MLO Alignment</button>' +
                        '<div id="clo-mlo-alignment-report" style="margin-top:2em"></div>';
                    const analyzeBtn = document.getElementById('analyze-clo-mlo-btn');
                    if (analyzeBtn) {
                        analyzeBtn.onclick = () => this.showCloMloAlignmentReport();
                    }
                };
            }
        }, 0);
        closContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Robust AI-powered CLO-MLO alignment analysis and reporting
    async showCloMloAlignmentReport() {
        const closContent = document.getElementById('clo-mlo-alignment-report');
        if (!this.selectedCourse || !closContent) return;
        // Get CLOs and MLOs for this course
        const closObj = this.selectedCourse.cloik || this.selectedCourse.cloek || {};
        const allMLOs = window.dataManager.getCurrentMLOs();
        const moduleCode = this.selectedCourse.moodulikood;
        const relatedMLOs = allMLOs.filter(mlo => mlo.mlokood && mlo.mlokood.includes(moduleCode)).slice(0, 3);
        const cloKeys = Object.keys(closObj);
        if (cloKeys.length === 0 || relatedMLOs.length === 0) {
            closContent.innerHTML = '<em>No CLOs or MLOs available for alignment.</em>';
            return;
        }
        // Prepare CLOs in array format for prompt
        const clos = cloKeys.slice(0, 5).map((key, idx) => ({ id: key, text: closObj[key], index: idx }));
        // Show loading
        closContent.innerHTML = '<div class="ai-loading">🔍 Analyzing CLO-MLO alignment... Please wait.</div>';
        try {
            const prompt = this.buildOptimizedAlignmentPrompt(clos, relatedMLOs);
            const analysisText = await this.callGeminiAPIWithFallback(prompt);
            const results = this.parseAnalysisResponse(analysisText, clos, relatedMLOs);
            if (!results) {
                closContent.innerHTML = '<div class="ai-error">❌ Unable to parse any valid CLO-MLO alignments from the AI response. Please try again or adjust your CLOs/MLOs for clearer results.</div>';
                return;
            }
            closContent.innerHTML = this.createPLOMLOStyleLayout(results, clos, relatedMLOs);
            closContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (err) {
            closContent.innerHTML = `<div class="ai-error">❌ Failed to analyze alignment: ${err.message || err}</div>`;
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
        // Try secureAPIConfig if available, else fallback to direct fetch
        if (window.secureAPIConfig && window.secureAPIConfig.isReady()) {
            return await window.secureAPIConfig.callGeminiAPI(prompt, {
                temperature: 0.3,
                maxOutputTokens: 1024
            });
        }
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) throw new Error('No Gemini API key configured.');
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
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid Gemini API response format');
        }
        return data.candidates[0].content.parts[0].text;
    }

    parseAnalysisResponse(analysisText, clos, mlos) {
        // Only return CLO-MLO pairs with a real parsed score (not default)
        const parsedResults = [];
        const lines = analysisText.split('\n');
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            // Pattern: CLO1-MLO_CODE: 4 (reason)
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
                    alert('New CLO added (not persisted in this demo).');
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
    }

    // ...existing code for modal methods (keep only one set, remove duplicates)...




// Initialize when DOM is loaded
// Also robustly fix floating home button event

document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        window.cloController = new CLOMLOController();
        if (window.cloController.init) await window.cloController.init();
        removeDuplicateFloatingHomeButtons();
        attachFloatingHomeHandler();

        // Observe DOM changes to re-attach handler if the button is replaced
        const observer = new MutationObserver(() => {
            removeDuplicateFloatingHomeButtons();
            attachFloatingHomeHandler();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();
});

function attachFloatingHomeHandler() {
    const homeBtn = document.getElementById('floating-home');
    if (homeBtn && !homeBtn._homeHandlerAttached) {
        homeBtn.onclick = () => window.location.href = 'index.html';
        homeBtn._homeHandlerAttached = true;
    }
}

