// main.js - Loads and remaps data from programmes.json, replaces embedded data

let courseData = [];
let mloData = [];
let currentCourses = [];
let currentMLOs = [];
let currentCLOs = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await loadProgrammeData();
    setupEventListeners();
    
    // Check if home-btn exists before trying to access its style property
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.style.display = 'none';
    }
    
    const courseInputSection = document.getElementById('course-input');
    if (courseInputSection) {
        showSection('course-input');
    }
});

// Load Programme data from JSON and remap fields
async function loadProgrammeData(programmeCode = 'tvtb') {
    console.log('Loading programme data for:', programmeCode);
    try {
        const response = await fetch('data/programmes.json');
        const json = await response.json();
        const programme = json[programmeCode];

        console.log('Programme data loaded:', programme);
        console.log('Number of courses:', programme.courses ? programme.courses.length : 0);
        console.log('Number of MLOs:', programme.mlos ? programme.mlos.length : 0);
        console.log('Number of PLOs:', programme.plos ? programme.plos.length : 0);

        courseData = (programme.courses || []);
        mloData = (programme.mlos || []);
        window.currentPLOs = (programme.plos || []);
        window.currentCourseData = courseData; // Make course data globally available
        window.currentProgrammeCode = programmeCode; // Store current programme code

        // Update course dropdown
        populateCourseCodeAutocomplete();

        // Update PLO-MLO matrix display
        displayPloMloMatrix(programme);

        // --- Add this block to update the page title and a visible heading ---
        if (programme.kavanimetusek && programme.kavanimetusik) {
            document.title = `${programme.kavanimetusek} / ${programme.kavanimetusik} - MAJ Learning Outcome Alignment Tool`;
            const progNameElem = document.getElementById('programme-names');
            if (progNameElem) {
                progNameElem.innerHTML = `<span>${programme.kavanimetusek}</span> / <span>${programme.kavanimetusik}</span>`;
            }
        }
        // ---------------------------------------------------------------

        // If on the PLO-MLO alignment page, update its content
        if (typeof updatePloMloAlignment === 'function') {
            updatePloMloAlignment(programme);
        }
    } catch (error) {
        showError('Failed to load programme data: ' + error.message);
    }
}

// Populate the datalist with course codes and names
function populateCourseCodeAutocomplete() {
    const datalist = document.getElementById('course-code-list');
    if (!datalist) return;
    datalist.innerHTML = '';
    const uniqueCourses = [...new Set(courseData.map(course =>
        `${course.ainekood} - ${course.ainenimetusik || ''}`
    ))];
    uniqueCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        datalist.appendChild(option);
    });
}

// Display PLO-MLO alignment matrix
function displayPloMloMatrix(programme) {
    const matrixContainer = document.getElementById('plo-mlo-matrix');
    if (!matrixContainer) return;

    const plos = programme.plos || [];
    const mlos = programme.mlos || [];

    if (plos.length === 0 && mlos.length === 0) {
        matrixContainer.innerHTML = '<p>No PLO or MLO data available for this programme.</p>';
        return;
    }

    let html = `<h3>Programme Learning Outcomes (PLOs)</h3>`;
    if (plos.length > 0) {
        // Create bilingual table for PLOs
        html += `<table class="mlo-table">`;
        html += `<thead>`;
        html += `<tr>`;
        html += `<th class="mlo-code-col">PLO Code</th>`;
        html += `<th class="estonian-col">plosisuek</th>`;
        html += `<th class="english-col">plosisuik</th>`;
        html += `</tr>`;
        html += `</thead>`;
        html += `<tbody>`;
        
        plos.forEach((plo, i) => {
            html += `<tr>`;
            html += `<td class="mlo-code"><strong>PLO ${i+1}</strong></td>`;
            html += `<td class="estonian-content">`;
            html += `<div class="mlo-description">${plo.plosisuek || 'N/A'}</div>`;
            html += `</td>`;
            html += `<td class="english-content">`;
            html += `<div class="mlo-description">${plo.plosisuik || 'N/A'}</div>`;
            html += `</td>`;
            html += `</tr>`;
        });
        
        html += `</tbody>`;
        html += `</table>`;
    } else {
        html += '<p>No PLOs available for this programme.</p>';
    }

    html += `<h3>Module Learning Outcomes (MLOs)</h3>`;
    if (mlos.length > 0) {
        // Group MLOs by module code (part before underscore)
        const groupedMLOs = {};
        mlos.forEach(mlo => {
            const fullCode = mlo.mlokood || 'unknown';
            // Parse module code: everything before the underscore
            const moduleCode = fullCode.includes('_') ? fullCode.split('_')[0] : fullCode;
            
            if (!groupedMLOs[moduleCode]) {
                groupedMLOs[moduleCode] = [];
            }
            groupedMLOs[moduleCode].push(mlo);
        });

        // Module name mappings
        const moduleNames = {
            'yl': 'Üldõpe / General Studies',
            'p1': 'P1 põhiõpe / P1 Core Studies', 
            'p2': 'P2 põhiõpe / P2 Core Studies',
            'e1': 'E1 erialaõpe / E1 Specialized Studies',
            'e2': 'E2 erialaõpe / E2 Specialized Studies',
            'gd': 'Lõputöö moodul / Graduation Thesis Module'
        };

        // Display grouped MLOs in tables
        html += '<div class="mlo-groups">';
        Object.keys(groupedMLOs).sort().forEach(moduleCode => {
            const moduleName = moduleNames[moduleCode.toLowerCase()] || moduleCode.toUpperCase();
            
            // Get the first MLO to extract module names
            const firstMLO = groupedMLOs[moduleCode][0];
            const moduleHeaderText = firstMLO && firstMLO.mlonimetusek && firstMLO.mlonimetusik 
                ? `${moduleName} - ${firstMLO.mlonimetusek} / ${firstMLO.mlonimetusik}`
                : moduleName;
            
            html += `<div class="module-group">`;
            html += `<h4 class="module-header">${moduleHeaderText}</h4>`;
            
            // Create bilingual table
            html += `<table class="mlo-table">`;
            html += `<thead>`;
            html += `<tr>`;
            html += `<th class="mlo-code-col">MLO Code</th>`;
            html += `<th class="estonian-col">mlonimetusek</th>`;
            html += `<th class="english-col">mlonimetusik</th>`;
            html += `</tr>`;
            html += `</thead>`;
            html += `<tbody>`;
            
            groupedMLOs[moduleCode].forEach((mlo, i) => {
                const mloNumber = mlo.mlokood ? mlo.mlokood.split('_')[1] || `${i+1}` : `${i+1}`;
                html += `<tr>`;
                html += `<td class="mlo-code"><strong>${moduleCode.toUpperCase()}_${mloNumber}</strong></td>`;
                html += `<td class="estonian-content">`;
                html += `<div class="mlo-description">${mlo.mlosisuek || 'N/A'}</div>`;
                html += `</td>`;
                html += `<td class="english-content">`;
                html += `<div class="mlo-description">${mlo.mlosisuik || 'N/A'}</div>`;
                html += `</td>`;
                html += `</tr>`;
            });
            
            html += `</tbody>`;
            html += `</table>`;
            html += `</div>`;
        });
        html += '</div>';
    } else {
        html += '<p>No MLOs available for this programme.</p>';
    }

    matrixContainer.innerHTML = html;
}

// --- UI logic and event handlers imported from 6scyxiy6c1.js ---

function setupEventListeners() {
    // Add event listeners only if elements exist
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchCourse);
    }
    
    const courseCode = document.getElementById('course-code');
    if (courseCode) {
        courseCode.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchCourse();
        });
        
        // Enable search button when input matches course
        courseCode.addEventListener('input', function() {
            if (searchBtn) {
                // Enable if the input matches a course in the datalist
                const match = courseData.some(course =>
                    `${course.ainekood} - ${course.ainenimetusik || ''}`.toLowerCase() === this.value.toLowerCase()
                );
                searchBtn.disabled = !match;
            }
        });
    }
    
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            if (window.localStorage) localStorage.clear();
            if (window.sessionStorage) sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
    
    const newCourseBtn = document.getElementById('new-course-btn');
    if (newCourseBtn) {
        newCourseBtn.addEventListener('click', resetApp);
    }
    
    const suggestCloBtn = document.getElementById('suggest-clo-btn');
    if (suggestCloBtn) {
        suggestCloBtn.addEventListener('click', suggestCLOs);
    }
    
    const inputCloBtn = document.getElementById('input-clo-btn');
    if (inputCloBtn) {
        inputCloBtn.addEventListener('click', showCLOInput);
    }
    
    const addCloBtn = document.getElementById('add-clo-btn');
    if (addCloBtn) {
        addCloBtn.addEventListener('click', addCLO);
    }
    
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', performAnalysis);
    }
    
    const useSuggestionsBtn = document.getElementById('use-suggestions-btn');
    if (useSuggestionsBtn) {
        useSuggestionsBtn.addEventListener('click', useSuggestions);
    }
    
    const modifySuggestionsBtn = document.getElementById('modify-suggestions-btn');
    if (modifySuggestionsBtn) {
        modifySuggestionsBtn.addEventListener('click', modifySuggestions);
    }
    
    const regenerateBtn = document.getElementById('regenerate-btn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            const suggestionsContainer = document.getElementById('suggestions-container');
            if (suggestionsContainer) {
                suggestionsContainer.innerHTML = '<div id="loading-indicator"><div class="spinner"></div><p>AI is regenerating suggestions...</p></div>';
                window.forceRandomization = true;
                setTimeout(() => {
                    const newSuggestions = generateCLOSuggestions();
                    window.forceRandomization = false;
                    displayCLOSuggestions(newSuggestions);
                }, 1500);
            }
        });
    }
    
    const exportReportBtn = document.getElementById('export-report-btn');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', exportReport);
    }
    
    // Initialize programme dropdown event listener
    const programmeSelect = document.getElementById('programme-select');
    if (programmeSelect) {
        programmeSelect.addEventListener('change', function() {
            loadProgrammeData(this.value);
        });
    }
}

// Show a specific section and hide others
function showSection(sectionId) {
    const keepVisible = ['course-info', 'mlo-display'];
    const homeBtn = document.getElementById('home-btn');
    if (sectionId === 'course-input') {
        homeBtn.style.display = 'none';
    } else {
        homeBtn.style.display = 'block';
    }
    document.querySelectorAll('section').forEach(section => {
        if (keepVisible.includes(section.id) && !section.classList.contains('hidden-section')) return;
        if (section.id === sectionId) {
            section.classList.remove('hidden-section');
            section.classList.add('active-section');
        } else if (!keepVisible.includes(section.id)) {
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        }
    });
}

// Show error message
function showError(message) {
    alert(message);
}

// --- UI logic and helper functions imported from 6scyxiy6c1.js ---
// All data access uses courseData and mloData loaded from programmes.json

function searchCourse() {
    const courseCodeInput = document.getElementById('course-code');
    let courseCode = courseCodeInput && courseCodeInput.value ? courseCodeInput.value.trim() : '';
    const validationMessage = document.getElementById('validation-message');
    validationMessage.textContent = '';

    // Find course in courseData
    const foundCourses = courseData.filter(course => `${course.ainekood} - ${course.ainenimetusik || ''}` === courseCode);
    if (foundCourses.length === 0) {
        validationMessage.textContent = 'Course not found. Please select a valid course from the list.';
        return;
    }
    currentCourses = foundCourses;
    displayCourseInfo(currentCourses);
    retrieveMLOs(currentCourses);
    showSection('options-panel');
}

function resetApp() {
    document.getElementById('course-code').value = '';
    document.getElementById('display-course-code').textContent = '';
    document.getElementById('course-name-en').textContent = '';
    document.getElementById('course-name-et').textContent = '';
    document.getElementById('course-credits').textContent = '';
    document.getElementById('module-code').textContent = '';
    document.getElementById('mlo-container').innerHTML = '';
    document.getElementById('clo-list').innerHTML = '';
    document.getElementById('analysis-container').innerHTML = '';
    document.getElementById('report-container').innerHTML = '';
    document.getElementById('suggestions-container').innerHTML = '';
    currentCourses = [];
    currentMLOs = [];
    currentCLOs = [];
    document.querySelectorAll('section').forEach(section => {
        if (section.id === 'course-input' || section.id === 'plo-mlo-link') {
            section.classList.remove('hidden-section');
            section.classList.add('active-section');
        } else {
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        }
    });
    document.getElementById('home-btn').style.display = 'none';
    showSection('programme-select-section');
    document.getElementById('programme-select-section').classList.add('active-section');
    document.getElementById('programme-select-section').classList.remove('hidden-section');
}

function displayCourseInfo(courses) {
    const course = courses[0];
    document.getElementById('display-course-code').innerHTML = `<a href="http://ois2.taltech.ee/uusois/aine/${course.ainekood}" target="_blank" class="course-link">${course.ainekood}</a>`;
    document.getElementById('course-name-en').textContent = course.oppeainenimetusik;
    document.getElementById('course-name-et').textContent = course.oppeainenimetusek;
    document.getElementById('course-credits').textContent = course.eap;
    const moduleCodes = [...new Set(courses.map(c => c.moodulikood || c.moodlikood))];
    document.getElementById('module-code').textContent = moduleCodes.map(code => code ? code.toUpperCase().replace('MLO', '') : '').join(', ');
    showSection('course-info');
    const optionsPanel = document.getElementById('options-panel');
    optionsPanel.classList.remove('hidden-section');
    optionsPanel.classList.add('active-section');
}

function retrieveMLOs(courses) {
    const moduleCodes = [...new Set(courses.map(c => c.moodulikood || c.moodlikood))];
    currentMLOs = [];
    moduleCodes.forEach(moduleCode => {
        const moduleMLOs = mloData.filter(mlo => mlo.moodlikood === moduleCode || mlo.moodlikood === (moduleCode || '').replace(/_/g, ''));
        moduleMLOs.forEach(mlo => { mlo.moduleCode = moduleCode; });
        currentMLOs = currentMLOs.concat(moduleMLOs);
    });
    displayMLOs(currentMLOs);
}

function displayMLOs(mlos) {
    const mloContainer = document.getElementById('mlo-container');
    mloContainer.innerHTML = '';
    if (mlos.length === 0) {
        mloContainer.innerHTML = '<p>No Module Learning Outcomes found for this course.</p>';
        showSection('mlo-display');
        return;
    }
    const moduleGroups = {};
    mlos.forEach(mlo => {
        if (!moduleGroups[mlo.moduleCode]) moduleGroups[mlo.moduleCode] = [];
        moduleGroups[mlo.moduleCode].push(mlo);
    });
    const moduleOrder = ['ylmlo', 'p1mlo', 'p2mlo', 'e1mlo', 'e2mlo', 'gdmlo'];
    moduleOrder.forEach(moduleCode => {
        if (!moduleGroups[moduleCode]) return;
        const moduleMLOs = moduleGroups[moduleCode];
        const moduleSection = document.createElement('div');
        moduleSection.className = 'module-section';
        const moduleHeader = document.createElement('div');
        moduleHeader.className = 'module-header';
        moduleHeader.innerHTML = `<h3>${getModuleFullName(moduleCode)}</h3>`;
        moduleSection.appendChild(moduleHeader);
        moduleMLOs.forEach((mlo, index) => {
            const mloItem = document.createElement('div');
            mloItem.className = 'mlo-item';
            let mloText = mlo.ilosisu;
            mloText = mloText.replace(/^["']|["']$/g, '').trim();
            mloItem.innerHTML = `<h4>${moduleCode.toUpperCase()} ${index + 1}</h4><p>${mloText}</p>`;
            moduleSection.appendChild(mloItem);
        });
        mloContainer.appendChild(moduleSection);
    });
    showSection('mlo-display');
}

// ...import the rest of the helper/UI functions from 6scyxiy6c1.js here...
// filepath: c:\Users\siyi.ma\OneDrive - Tallinna Tehnikaülikool\YouWare\MAJ-iloalignment\main.js
// ...existing code...

function showCLOInput() {
    currentCLOs = [];
    document.getElementById('clo-list').innerHTML = '';
    document.getElementById('clo-textarea').value = '';
    showSection('clo-input');
}

function addCLO() {
    const cloTextarea = document.getElementById('clo-textarea');
    const cloText = cloTextarea.value.trim();
    if (cloText === '') return;
    const cloLines = cloText.split('\n').filter(line => line.trim() !== '');
    cloLines.forEach(line => {
        currentCLOs.push(line);
        addCLOToDisplay(line);
    });
    cloTextarea.value = '';
}

function addCLOToDisplay(cloText) {
    const cloList = document.getElementById('clo-list');
    const index = currentCLOs.length;
    const cloItem = document.createElement('div');
    cloItem.className = 'clo-item';
    cloItem.innerHTML = `
        <div class="clo-text"><strong>CLO ${index}:</strong> ${cloText}</div>
        <div class="clo-actions">
            <button class="edit-clo" data-index="${index - 1}"><i class="fas fa-edit"></i></button>
            <button class="delete-clo" data-index="${index - 1}"><i class="fas fa-trash"></i></button>
        </div>
    `;
    cloItem.querySelector('.edit-clo').addEventListener('click', function() {
        editCLO(this.getAttribute('data-index'));
    });
    cloItem.querySelector('.delete-clo').addEventListener('click', function() {
        deleteCLO(this.getAttribute('data-index'));
    });
    cloList.appendChild(cloItem);
}

function editCLO(index) {
    const cloText = currentCLOs[index];
    const cloTextarea = document.getElementById('clo-textarea');
    cloTextarea.value = cloText;
    deleteCLO(index);
    cloTextarea.focus();
}

function deleteCLO(index) {
    currentCLOs.splice(index, 1);
    const cloList = document.getElementById('clo-list');
    cloList.innerHTML = '';
    currentCLOs.forEach(clo => addCLOToDisplay(clo));
}

function suggestCLOs() {
    const suggestions = generateCLOSuggestions();
    displayCLOSuggestions(suggestions);
    showSection('clo-suggestions');
}

function generateCLOSuggestions() {
    // Simple example: use course name and MLOs for suggestions
    const course = currentCourses[0];
    const courseName = course ? course.oppeainenimetusik : '';
    let suggestions = [];
    if (currentMLOs.length > 0) {
        currentMLOs.slice(0, 3).forEach((mlo, i) => {
            suggestions.push(`Apply ${courseName} concepts to ${mlo.ilosisu.toLowerCase().replace(/^\w/, c => c.toLowerCase())}`);
        });
    }
    if (suggestions.length < 3 && courseName) {
        suggestions.push(`Analyze and solve problems in ${courseName} using appropriate methods.`);
    }
    return suggestions.slice(0, 5);
}

function displayCLOSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = '';
    suggestions.forEach((suggestion, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
            <input type="checkbox" class="suggestion-checkbox" id="suggestion-${index}" checked>
            <label for="suggestion-${index}">${suggestion}</label>
        `;
        suggestionsContainer.appendChild(suggestionItem);
    });
}

function useSuggestions() {
    const checkboxes = document.querySelectorAll('.suggestion-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one suggestion.');
        return;
    }
    currentCLOs = [];
    checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent;
        currentCLOs.push(label);
    });
    performAnalysis();
}

function modifySuggestions() {
    const checkboxes = document.querySelectorAll('.suggestion-checkbox:checked');
    let selectedSuggestions = [];
    checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent;
        selectedSuggestions.push(label);
    });
    showCLOInput();
    document.getElementById('clo-textarea').value = selectedSuggestions.join('\n');
}

function performAnalysis() {
    if (currentCLOs.length === 0) {
        alert('Please add at least one Course Learning Outcome.');
        return;
    }
    if (currentMLOs.length === 0) {
        alert('No Module Learning Outcomes available for analysis.');
        return;
    }
    const analysisResults = analyzeAlignment();
    displayAnalysisResults(analysisResults.bestMatches);
    showSection('alignment-analysis');
    generateReport(analysisResults);
}

function analyzeAlignment() {
    const results = [];
    const allPairings = [];
    currentCLOs.forEach((clo, cloIndex) => {
        let bestMatch = { mlo: null, mloIndex: -1, score: 0, reason: '' };
        const cloPairings = [];
        currentMLOs.forEach((mlo, mloIndex) => {
            const score = calculateAlignmentScore(clo, mlo.ilosisu);
            const reason = generateAlignmentReason(clo, mlo.ilosisu, score);
            const pairing = { clo, cloIndex, mlo, mloIndex, score, reason };
            cloPairings.push(pairing);
            if (score > bestMatch.score) {
                bestMatch = { mlo, mloIndex, score, reason };
            }
        });
        results.push({ clo, cloIndex, mlo: bestMatch.mlo, mloIndex: bestMatch.mloIndex, score: bestMatch.score, reason: bestMatch.reason, allPairings: cloPairings });
        allPairings.push(...cloPairings);
    });
    return { bestMatches: results, allPairings: allPairings };
}

function calculateAlignmentScore(clo, mloText) {
    // Simple keyword overlap
    const cloWords = clo.toLowerCase().split(/\W+/);
    const mloWords = mloText.toLowerCase().split(/\W+/);
    const overlap = cloWords.filter(word => mloWords.includes(word));
    let score = Math.min(5, Math.max(1, overlap.length));
    return score;
}

function calculateVerbScore(cloVerbs, mloVerbs) {
    // Simple verb overlap
    return cloVerbs.some(v => mloVerbs.includes(v)) ? 1 : 0;
}

function calculateSemanticScore(cloText, mloText) {
    // Dummy: length similarity
    return Math.abs(cloText.length - mloText.length) < 20 ? 1 : 0;
}

function generateAlignmentReason(clo, mloText, score) {
    if (score >= 4) return 'Strong alignment: similar concepts and terminology.';
    if (score === 3) return 'Moderate alignment: some shared concepts.';
    if (score === 2) return 'Partial alignment: limited overlap.';
    return 'Minimal alignment: little or no shared terminology.';
}

function generateImprovementSuggestion(clo, mloText) {
    return 'Consider rephrasing the CLO to better match the terminology and focus of the MLO.';
}

function displayAnalysisResults(results) {
    const analysisContainer = document.getElementById('analysis-container');
    analysisContainer.innerHTML = '';
    results.forEach((result, index) => {
        const alignmentItem = document.createElement('div');
        alignmentItem.className = 'alignment-item';
        alignmentItem.innerHTML = `
            <div class="alignment-header">
                <div class="alignment-title">Alignment ${index + 1}</div>
                <div class="alignment-score score-${result.score}">Score: ${result.score}/5</div>
            </div>
            <div class="alignment-details">
                <div class="alignment-clo"><strong>CLO ${result.cloIndex + 1}:</strong><p>${result.clo}</p></div>
                <div class="alignment-mlo"><strong>MLO ${result.mloIndex + 1}:</strong><p>${result.mlo.ilosisu}</p></div>
                <div class="alignment-reason"><strong>AI Analysis:</strong><p>${result.reason}</p></div>
                ${result.score < 4 ? `<div class="alignment-suggestion"><strong><i class="fas fa-lightbulb"></i> AI Improvement Suggestion:</strong><p>${generateImprovementSuggestion(result.clo, result.mlo.ilosisu)}</p></div>` : ''}
            </div>
        `;
        analysisContainer.appendChild(alignmentItem);
    });
}

function generateReport(results) {
    // For brevity, only a simple report is generated here
    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = '<h3>Alignment Report</h3>';
    results.bestMatches.forEach(result => {
        reportContainer.innerHTML += `
            <div>
                <strong>CLO:</strong> ${result.clo}<br>
                <strong>Best MLO:</strong> ${result.mlo ? result.mlo.ilosisu : ''}<br>
                <strong>Score:</strong> ${result.score}/5<br>
                <strong>Reason:</strong> ${result.reason}
            </div><hr>
        `;
    });
}

function generateExportContent(results) {
    // Simple export as text
    let content = 'CLO-MLO Alignment Report\n\n';
    results.bestMatches.forEach(result => {
        content += `CLO: ${result.clo}\nBest MLO: ${result.mlo ? result.mlo.ilosisu : ''}\nScore: ${result.score}/5\nReason: ${result.reason}\n\n`;
    });
    return `<pre>${content}</pre>`;
}

function continueEditing() {
    showSection('clo-input');
    document.getElementById('clo-textarea').value = currentCLOs.join('\n');
    const cloList = document.getElementById('clo-list');
    cloList.innerHTML = '';
    currentCLOs.forEach((clo, index) => addCLOToDisplay(clo));
}

function getModuleFullName(moduleCode) {
    const moduleNames = {
        'ylmlo': 'General Studies Module - Foundational Competences (YL)',
        'p1mlo': 'First Core Studies Module - P1 Methods, Markets and Economy',
        'p2mlo': 'Second Core Studies Module - P2 Core Business Competences',
        'e1mlo': 'First Special Studies Module - E1 Entrepreneurship and Marketing',
        'e2mlo': 'Second Special Studies Module - E2 Finance and Accounting',
        'gdmlo': 'Graduation Thesis Module (GD)'
    };
    return moduleNames[moduleCode] || moduleCode.toUpperCase();
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function toggleText(element, fullText) {
    const parent = element.previousSibling;
    const isTruncated = parent.textContent.endsWith('...');
    if (isTruncated) {
        parent.textContent = fullText;
        element.textContent = 'Show less';
    } else {
        parent.textContent = truncateText(fullText, 50);
        element.textContent = 'Show more';
    }
}

function emailReport(results) {
    if (confirm('This will open your Outlook. Do you want to continue?')) {
        const course = currentCourses[0];
        const currentDate = new Date().toISOString().split('T')[0];
        let body = `ILO Alignment Report\nCourse: ${course.ainekood} - ${course.oppeainenimetusik}\nDate: ${currentDate}\n\n`;
        results.bestMatches.forEach(result => {
            body += `CLO: ${result.clo}\nBest MLO: ${result.mlo ? result.mlo.ilosisu : ''}\nScore: ${result.score}/5\nReason: ${result.reason}\n\n`;
        });
        const subject = `ILO Alignment: ${course.ainekood} ${course.oppeainenimetusik} (${currentDate})`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    }
}

// AI Agent utility for learning outcomes analysis

const aiAgent = {
  // Generate Course Learning Outcomes based on module outcomes
  generateCLOs: async (courseInfo, moduleOutcomes) => {
    try {
      const systemPrompt = `You are an expert curriculum designer specializing in learning outcomes development. Generate specific, measurable Course Learning Outcomes (CLOs) that align with the provided Module Learning Outcomes (MLOs).`;

      const userPrompt = `Course: ${courseInfo.ainenimetusik} (${courseInfo.ainekood})
Credits: ${courseInfo.eap} EAP
Module: ${courseInfo.moodulikood}

Module Learning Outcomes:
${moduleOutcomes.map((mlo, i) => `${i+1}. ${mlo}`).join('\n')}

Generate 4-6 appropriate CLOs that support these module outcomes. Each CLO should:
- Start with an action verb (analyze, evaluate, apply, create, etc.)
- Be specific and measurable
- Align with course-level learning expectations
- Support the module outcomes`;

      return await invokeAIAgent(systemPrompt, userPrompt);
    } catch (error) {
      console.error('Error generating CLOs:', error);
      throw error;
    }
  },

  // Analyze alignment between CLOs and MLOs
  analyzeAlignment: async (courseData, clos, mlos) => {
    try {
      const systemPrompt = `You are an expert curriculum analyst. Analyze the alignment between Course Learning Outcomes (CLOs) and Module Learning Outcomes (MLOs). Provide detailed analysis with scores and recommendations.`;

      const userPrompt = `Course: ${courseData.ainenimetusik} (${courseData.ainekood})

Module Learning Outcomes:
${mlos.map((mlo, i) => `MLO${i+1}: ${mlo}`).join('\n')}

Course Learning Outcomes:
${clos.map((clo, i) => `CLO${i+1}: ${clo}`).join('\n')}

Please provide:
1. Overall alignment score (1-5 scale, where 5 is excellent alignment)
2. Individual CLO-MLO alignment matrix with scores
3. Identified gaps or misalignments
4. Specific recommendations for improvement
5. Summary of strengths in current alignment`;

      return await invokeAIAgent(systemPrompt, userPrompt);
    } catch (error) {
      console.error('Error analyzing alignment:', error);
      throw error;
    }
  },

  // Generate improvement suggestions
  generateSuggestions: async (analysisResults, courseData) => {
    try {
      const systemPrompt = `You are a curriculum improvement specialist. Based on the alignment analysis, provide specific, actionable suggestions for improving learning outcomes alignment.`;

      const userPrompt = `Based on this alignment analysis for ${courseData.ainenimetusik}:

${analysisResults}

Provide specific suggestions for:
1. Improving CLO formulation
2. Better alignment with MLOs
3. Assessment strategies that support alignment
4. Learning activities that bridge gaps`;

      return await invokeAIAgent(systemPrompt, userPrompt);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw error;
    }
  }
};

// Export for use in components
window.aiAgent = aiAgent;