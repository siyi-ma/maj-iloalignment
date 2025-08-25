// Global variables to store data
let courseData = [];
let mloData = [];
let currentCourses = []; // Changed from currentCourse to currentCourses (array)
let currentMLOs = [];
let currentCLOs = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load Programmes.json data
    loadProgrammeData();
    
    // Set up event listeners
    setupEventListeners();

    // Hide home button
    document.getElementById('home-btn').style.display = 'none';

    // Show course input section
    showSection('course-input');
});

// Populate the datalist with course codes and names
function populateCourseCodeAutocomplete() {
    const datalist = document.getElementById('course-code-list');
    datalist.innerHTML = ''; // Clear existing options

    // Add unique course codes and names to the datalist
    const uniqueCourses = [...new Set(courseData.map(course => `${course.ainekood} - ${course.oppeainenimetusik}`))];
    uniqueCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course; // Format: "CourseCode - CourseName"
        datalist.appendChild(option);
    });
}

// Course descriptions (sample data for demonstration)
const courseDescriptions = {
    "MMJ3050": "Introduce the principles and practices of entrepreneurship, creativity and innovation. Help students to understand the role of creativity and implement it for solving problems and for developing new and established enterprises.",
    "TMJ0140": "The objective of the course is to give an integrated knowledge of entrepreneurship, focusing on starting and running a business. Students learn the basic concepts of entrepreneurship and get a thorough knowledge of different stages of the entrepreneurial process.",
    "MMM3040": "The aim of the course is to provide students with knowledge about marketing research theory and practice. Students learn the main methods used in marketing research and develop skills to plan and conduct marketing research projects.",
    "MMO3030": "The course aims to develop students' understanding of key concepts in management and leadership. Students will learn about management functions, leadership styles, and how to apply these concepts in organizational settings.",
    "TMM2470": "The aim is to provide students with knowledge about e-marketing concepts, strategies, and tools. Students will learn how to develop and implement effective digital marketing campaigns and measure their performance."
};

// Load CSV data directly from embedded strings
async function loadCSVData() {
    try {
        // Embedded course data with corrected special characters
        const courseText = `ainekood;oppeainenimetusek;oppeainenimetusik;eap;moodlikood
EKX0040;Sissejuhatus ringmajandusse;Introduction to Circular Economy;3;e1mlo
EKX0040;Sissejuhatus ringmajandusse;Introduction to Circular Economy;3;e2mlo
HHF3081;Filosoofia;Philosophy;3;ylmlo
HOL6010;Euroopa Liidu õigus;European Union Law;6;e1mlo
HOL6010;Euroopa Liidu õigus;European Union Law;6;e2mlo
IDK0043;IT alused I;IT Foundations I;3;ylmlo
IDK0044;IT alused II;IT Foundations II;3;ylmlo
MEF3010;Finantsmodelleerimine;Financial Modelling;6;e1mlo
MEF3010;Finantsmodelleerimine;Financial Modelling;6;e2mlo
MEF3020;Eraisiku rahandus;Personal Finance;3;ylmlo
MEF3030;Bakalaureusetöö seminar;Bachelor Seminar;3;e2mlo
MEM3010;Matemaatika täiendusõpe ärikorralduse üliõpilastele;Refresher Course in Mathematics for Business Students;3;ylmlo
MEM3020;Majandusmatemaatika alused;Fundamentals of Business Mathematics;6;p1mlo
MMA3090;Äritarkvara ja arvestuse infosüsteemid;Business Software Solutions;6;e1mlo
MMA3090;Äritarkvara ja arvestuse infosüsteemid;Business Software Solutions;6;e2mlo
MMA3100;Ärianalüütika alused;Business Analytics;6;e1mlo
MMA3100;Ärianalüütika alused;Business Analytics;6;e2mlo
MMA3110;Finantsarvestuse keskkursus;Intermediate Financial Accounting;6;e1mlo
MMA3110;Finantsarvestuse keskkursus;Intermediate Financial Accounting;6;e2mlo
MMA3160;Juhtimis- ja kuluarvestus;Management and Cost Accounting;6;e1mlo
MMA3160;Juhtimis- ja kuluarvestus;Management and Cost Accounting;6;e2mlo
MME3010;Keskkonna ja säästva arengu ökonoomika;Environmental and Sustainable Development Economics;6;p1mlo
MMJ3040;Rahvusvaheline äri ja eetika;International Business and Ethics;6;p2mlo
MMJ3050;Loovus ja innovatsioon;Creativity and innovation;6;e1mlo
MMJ3050;Loovus ja innovatsioon;Creativity and innovation;6;e2mlo
MMJ3070;Tööpraktika;Internship;6;e1mlo
MMJ3070;Tööpraktika;Internship;6;e2mlo
MMK3100;Tootmise juhtimine ja arengutrendid;Operations Management and Development Trends;6;e1mlo
MMK3100;Tootmise juhtimine ja arengutrendid;Operations Management and Development Trends;6;e2mlo
MMM3020;Bakalaureusetöö seminar;Bachelor Seminar;3;e1mlo
MMM3040;Turundusuuring;Marketing Research;6;e1mlo
MMM3040;Turundusuuring;Marketing Research;6;e2mlo
MMM3070;Turunduskommunikatsioon ja tarbijäkäitumine;Marketing Communication and Consumer Behaviour;6;e1mlo
MMO3030;Juhtimine ja eestvedamine;Management and Leadership;6;p2mlo
MMO3050;Rahvusvaheline inimeste juhtimine;International People Management;6;e1mlo
MMO3050;Rahvusvaheline inimeste juhtimine;International People Management;6;e2mlo
MMO3070;Teadmusjuhtimine;Knowledge Management;6;e1mlo
MMO3070;Teadmusjuhtimine;Knowledge Management;6;e2mlo
MMS3030;Majandussotsioloogia;Economic sociology;6;e1mlo
MMS3030;Majandussotsioloogia;Economic sociology;6;e2mlo
MMS3050;Äriuuringute alused;Research Methods in Business Studies;6;p2mlo
MOE5071;Äriõiguse alused;Business Law;6;p2mlo
TAF2810;Finantsarvestuse alused;Principles of Financial Accounting;6;p2mlo
TER2550;Rahanduse alused;Basic Finance;6;p2mlo
TER2560;Raha, finantsinstitutsioonid ja turud;Money;6;e1mlo
TER2560;Raha, finantsinstitutsioonid ja turud;Money;6;e2mlo
TER2620;Finantsjuhtimine;Financial Management;6;e1mlo
TER2620;Finantsjuhtimine;Financial Management;6;e2mlo
TES0020;Statistika;Statistics;6;p1mlo
TES1140;Ökonometria;Econometrics;6;e1mlo
TES1140;Ökonometria;Econometrics;6;e2mlo
TET0010;Mikroökonoomika I;Microeconomics I;6;p1mlo
TET2550;Makroökonoomika I;Macroeconomics I;6;p1mlo
TMJ0140;Ettevõtluse alused;Introduction to Entrepreneurship;6;p2mlo
TMJ0190;Start-up ettevõtlus;Start-up Entrepreneurship;6;e1mlo
TMJ0190;Start-up ettevõtlus;Start-up Entrepreneurship;6;e2mlo
TMJ0230;Ärilogistika ja varude juhtimine;Logistics and Inventory Management;6;p2mlo
TMM2150;Turundus;Basic Marketing;6;p2mlo
TMM2420;Turunduse juhtimine;Marketing Management;6;e1mlo
TMM2420;Turunduse juhtimine;Marketing Management;6;e2mlo
TMM2470;E-turundus;E-marketing;6;e1mlo
TMM2470;E-turundus;E-marketing;6;e2mlo
TMT2020;Töökeskkond ja ergonoomika;Working Environment and Ergonomics;6;ylmlo
TSK0028;Majandusalane inglise keel II;Business English II;6;ylmlo
TSK0326;Majandusalane inglise keel I;Business English I;6;ylmlo
TSP0073;Rahvusvahelised suhted kaasajal;Contemporary International Relations;6;ylmlo
UTT0120;Probleem- ja projektõpe;Problem- and Project Based Learning;6;e1mlo
UTT0120;Probleem- ja projektõpe;Problem- and Project Based Learning;6;e2mlo
YTM0071;Eluslooduse alused;Fundamentals of life;3;ylmlo`;
        courseData = parseCSV(courseText);
        
        // Embedded MLO data (mlosisu.csv content)
        const mloText = `moodlikood;kategooria;ilosisu;oisnimetus
kava;kava;"synthesizes wide-ranging knowledge and skills to overcome challenges in international organizations in various sectors as an employee, to run one's own business, and/or to continue studies on graduate level;";Learning outcomes of the study programme
kava;kava;"critically evaluates main concepts of business administration and relevant social and legal aspects, generally accepted foundational theories and models, and appraises operating environments, development trends in economy and society, and best practices in industries;";Learning outcomes of the study programme
kava;kava;"designs and evaluates business models and plans and evaluates strategic, tactical and functional decisions considering sustainability of the organization, people and environment, and adheres to the principles of corporate social responsibility and ethics;";Learning outcomes of the study programme
kava;kava;"purposefully synthesizes the acquired knowledge and skills to identify, solve or alleviate problems in the fields of management, marketing, supply chain, accounting and finance based on evidence and considering cross-functional dependencies; identifies and appraises alternative scenarios and plans work-related activities systematically and efficiently;";Learning outcomes of the study programme
kava;kava;expresses ideas fluently and efficiently in professional communication and applies modern information and communication technologies;Learning outcomes of the study programme
kava;kava;demonstrates proactive attitude towards change and continuous development at personal and organizational levels, formulates relevant individual and organizational goals, and assembles and leads a team.;Learning outcomes of the study programme
ylmlo;moodul;"knows the basic principles of ICT, is able to find and evaluate information efficiently, is able to use spreadsheets and word processing applications proficiently and is able to use programming tools for processing data;";Learning outcomes of the General studies module - Foundational Competences
ylmlo;moodul;"can scientifically interpret the effect of work environment on human body, knows the risk factors involved in work environment and is able to develop a healthy and ergonomic work environment;";Learning outcomes of the General studies module - Foundational Competences
ylmlo;moodul;has selectively strengthened and broadened knowledge and skills in communication skills in Estonian or in a foreign language, or regarding the principles of natural science.;Learning outcomes of the General studies module - Foundational Competences
p1mlo;moodul;"is able to think in economic terms and explain the economic behaviour of economic actors; comprehend the relationship between individual economic phenomena and economy as a whole;";Learning outcomes of the first Core studies module - P1 Methods, Markets and Economy
p1mlo;moodul;"knows the fundamental concepts of economics theory and principles of economics both on micro and macro level; is able to interpret microeconomic indicators and analyse relationships between and reasons for elementary macroeconomic processes;";Learning outcomes of the first Core studies module - P1 Methods, Markets and Economy
p1mlo;moodul;"demonstrates systematic knowledge about environmental economics and the economics of sustainable development, main environmental problems, their causes, consequences and the possibilities of influencing and preventing them, environment-based restrictions on the economy and about related regulations;";Learning outcomes of the first Core studies module - P1 Methods, Markets and Economy
p1mlo;moodul;"has an overview of statistics concepts and research methods used in economic and business studies;";Learning outcomes of the first Core studies module - P1 Methods, Markets and Economy
p1mlo;moodul;is able to interpret economic problems mathematically, formulate less sophisticated mathematical economics tasks and solve them.;Learning outcomes of the first Core studies module - P1 Methods, Markets and Economy
p2mlo;moodul;"demonstrates broad fundamental knowledge and skills across four pillars of the programme marketing, entrepreneurship and management, accounting and business intelligence, and finance from operative level to broadly outlined strategic level;";Learning outcomes of the second Core studies module - P2 Core Business Competences
p2mlo;moodul;"knows the basic terminology, theories and concepts of the above named areas and general conventional methods of analysis, and is able to set area-related aims and develop the processes in focus;";Learning outcomes of the second Core studies module - P2 Core Business Competences
p2mlo;moodul;"is able to perceive relationships and interdependence between business functions, their impact on total costs of enterprise, its efficiency and competitive position, and defines, analyses and improves practical problems and challenges of not overly sophisticated nature;";Learning outcomes of the second Core studies module - P2 Core Business Competences
p2mlo;moodul;"is able to evaluate positive and negative aspects and risks of being an entrepreneur; knows which personality traits are essential for an entrepreneur and is able to evaluate his/her own fitness for becoming an entrepreneur;";Learning outcomes of the second Core studies module - P2 Core Business Competences
p2mlo;moodul;"knows the principles of creative thinking, can demonstrate initiative, evaluate entrepreneurial opportunities, analyse impact of a business environment on the idea realisation potential and develop a business model; take the main decisions related to the establishment of an enterprise and plan business growth and development;";Learning outcomes of the second Core studies module - P2 Core Business Competences
p2mlo;moodul;"knows the characteristics of business research, stages of the research process, methods for gathering and analysing quantitative and qualitative data; is skilled in applying widely used data collection methods; is able to conduct data analysis, interpret results of analysis and present them in a generalised, informative way in agreement with academic requirements;";Learning outcomes of the second Core studies module - P2 Core Business Competences
p2mlo;moodul;"is able to analyse different situations and issues of dispute in the area of business law, and is able to envisage legal interpretations and potential consequences of related business decisions;";Learning outcomes of the second Core studies module - P2 Core Business Competences
p2mlo;moodul;"has knowledge about the essence of international business and basic principles of internationalisation;";Learning outcomes of the second Core studies module - P2 Core Business Competences
p2mlo;moodul;knows the theoretical bases of business ethics and is able to analyse business ethics dilemmas based on the principle of corporate social responsibility.;Learning outcomes of the second Core studies module - P2 Core Business Competences
e1mlo;moodul;"analyses the international business environment, constructs business ideas, and plans their realization; Show less...";Learning outcomes of the first Special studies module - E1 Entrepreneurship and Marketing
e1mlo;moodul;"analyses the role of human resource management in organisations and plans key sub-activities;";Learning outcomes of the first Special studies module - E1 Entrepreneurship and Marketing
e1mlo;moodul;"explains the nature of production and service management processes and their strategic importance, and places these into the wider development trends context of the world economy;";Learning outcomes of the first Special studies module - E1 Entrepreneurship and Marketing
e1mlo;moodul;"understands marketing concepts, the essence of marketing management, e-marketing, and context and influencing factors of marketing decisions;";Learning outcomes of the first Special studies module - E1 Entrepreneurship and Marketing
e1mlo;moodul;designs and conducts market research and interprets the results in the context of strategic positioning, competitive advantage, and development opportunities of the organisation.;Learning outcomes of the first Special studies module - E1 Entrepreneurship and Marketing
gdmlo;moodul;"formulates a research problem corresponding to the main speciality, sets the aim of the thesis and defines research questions/tasks/hypotheses; Show less...";Learning outcomes of the Graduation thesis module
gdmlo;moodul;"chooses appropriate scientific and field-specific literature, analyses and synthesizes their content;";Learning outcomes of the Graduation thesis module
gdmlo;moodul;"chooses appropriate methodology to fulfill the aim of the thesis;";Learning outcomes of the Graduation thesis module
gdmlo;moodul;"collects, processes and analyses relevant information;";Learning outcomes of the Graduation thesis module
gdmlo;moodul;"uses professional knowledge to solve the research problem, interpret the results and provide conclusions;";Learning outcomes of the Graduation thesis module
gdmlo;moodul;"formats the thesis according to pre-set requirements using scientific language and professional terminology and following proper citing principles;";Learning outcomes of the Graduation thesis module
gdmlo;moodul;presents and explains one's viewpoints in both written and oral form.;Learning outcomes of the Graduation thesis module
e2mlo;moodul;"can organize financial accounting within a company, comprehends, interprets, and analyzes financial statements;";Learning outcomes of the second Special studies module - E2 Finance and Accounting
e2mlo;moodul;"comprehends and interprets the content of financial statements and can generally manage financial accounting within a company;";Learning outcomes of the second Special studies module - E2 Finance and Accounting
e2mlo;moodul;"navigates the basic concepts of management and cost accounting, can prepare different decisions based on quantitative data, create various budgets, plans, and reports, perform ratio-based analysis, and evaluate the success of an international company using different financial performance criteria;";Learning outcomes of the second Special studies module - E2 Finance and Accounting
e2mlo;moodul;"analyzes practical financial issues, demonstrating a basic knowledge of the international financial system, services, and instruments;";Learning outcomes of the second Special studies module - E2 Finance and Accounting
e2mlo;moodul;"understands the impact and challenges of the digital age on traditional accounting, can collect financial information from various company information systems, process, analyze, interpret it, and present it to company management;";Learning outcomes of the second Special studies module - E2 Finance and Accounting
e2mlo;moodul;is familiar with the main research methods in econometrics and applies them in a practical context, handling quantitative analysis of economic problems.;Learning outcomes of the second Special studies module - E2 Finance and Accounting`;
        courseData = parseCSV(courseText);
        mloData = parseCSV(mloText);

        console.log('Data loaded successfully');
        document.getElementById('search-btn').disabled = false;

        // Populate the autocomplete datalist
        populateCourseCodeAutocomplete();
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data: ' + error.message);
    }
}

// Parse CSV text into array of objects
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(';');
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const values = line.split(';');
        const obj = {};
        
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });
        
        return obj;
    });
}

// Set up event listeners for user interactions
function setupEventListeners() {
    // Search button click
    document.getElementById('search-btn').addEventListener('click', searchCourse);
    
    // Course code input enter key
    document.getElementById('course-code').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCourse();
        }
    });
    
    // Home button
    document.getElementById('home-btn').addEventListener('click', resetApp);
    
    // New course button
    document.getElementById('new-course-btn').addEventListener('click', resetApp);
    
    // AI Generate CLOs button
    document.getElementById('suggest-clo-btn').addEventListener('click', suggestCLOs);
    
    // Input CLOs button
    document.getElementById('input-clo-btn').addEventListener('click', showCLOInput);
    
    // Add CLO button
    document.getElementById('add-clo-btn').addEventListener('click', addCLO);
    
    // Analyze button
    document.getElementById('analyze-btn').addEventListener('click', performAnalysis);
    
    // Use suggestions button
    document.getElementById('use-suggestions-btn').addEventListener('click', useSuggestions);
    
    // Modify suggestions button
    document.getElementById('modify-suggestions-btn').addEventListener('click', modifySuggestions);
    
    // Regenerate button for AI suggestions with true randomization
    document.getElementById('regenerate-btn').addEventListener('click', function() {
        // Add loading animation
        const suggestionsContainer = document.getElementById('suggestions-container');
        suggestionsContainer.innerHTML = '<div id="loading-indicator"><div class="spinner"></div><p>AI is regenerating suggestions...</p></div>';
        
        // Set a global flag to force randomization on regenerate
        window.forceRandomization = true;
        
        // Simulate processing time for AI generation
        setTimeout(() => {
            // Generate new suggestions with significant variations
            const newSuggestions = generateCLOSuggestions();
            
            // Reset the randomization flag
            window.forceRandomization = false;
            
            // Display the new suggestions
            displayCLOSuggestions(newSuggestions);
        }, 1500);
    });
    
    // Export report button
    document.getElementById('export-report-btn').addEventListener('click', exportReport);

    // Language switch functionality removed
}

// Update the language switch function
function switchLanguage(lang, placeholder) {
    const textarea = document.getElementById('clo-textarea');
    textarea.setAttribute('lang', lang);
    textarea.setAttribute('spellcheck', 'true');
    textarea.placeholder = placeholder;
}

// Add input event listener for the textarea
document.getElementById('clo-textarea').addEventListener('input', function(e) {
    const text = e.target.value;
    if (text.trim().length > 0) {
        const detectedLang = detectLanguage(text);
        e.target.setAttribute('lang', detectedLang);
        e.target.setAttribute('spellcheck', 'true');
        
        // Update placeholder based on detected language
        e.target.placeholder = detectedLang === 'et' 
            ? 'Sisesta iga õpiväljund uuele reale...'
            : 'Enter each Course Learning Outcome on a new line...';
    }
});

// Add this function for AI-enhanced language detection
function detectLanguage(text) {
    // Common Estonian words with expanded vocabulary for better detection
    const estonianWords = [
        'ja', 'ning', 'või', 'aga', 'kui', 'siis', 'et', 'on', 'oli', 'ole',
        'see', 'seda', 'mida', 'kes', 'mis', 'nii', 'nagu', 'ka', 'ei', 'oma',
        'selle', 'saab', 'peab', 'võib', 'kus', 'kas', 'üle', 'läbi', 'pärast', 'enne'
    ];
    
    // Convert text to lowercase and split into words
    const words = text.toLowerCase().split(/\s+/);
    
    // Count Estonian words with improved algorithm
    const estonianWordCount = words.filter(word => estonianWords.includes(word)).length;
    
    // Check for Estonian-specific characters
    const hasEstonianChars = /[õäöüÕÄÖÜ]/.test(text);
    
    // Improved language detection using multiple signals
    if (hasEstonianChars || (words.length > 3 && (estonianWordCount / words.length) > 0.08)) {
        return 'et';
    }
    return 'en';
}

// Function to reset the app
function resetApp() {
    // Clear input fields
    document.getElementById('course-code').value = '';

    // Clear displayed data
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

    // Reset global variables
    currentCourses = [];
    currentMLOs = [];
    currentCLOs = [];

    // Show both PLO-MLO link and course input sections, hide other sections
    document.querySelectorAll('section').forEach(section => {
        if (section.id === 'course-input' || section.id === 'plo-mlo-link') {
            section.classList.remove('hidden-section');
            section.classList.add('active-section');
        } else {
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        }
    });

    // Hide home button when returning to landing page
    document.getElementById('home-btn').style.display = 'none';
}

// Search for a course by code
function searchCourse() {
    const courseCodeInput = document.getElementById('course-code');
    
    // Get the value directly from the input field
    let courseCode = '';
    if (courseCodeInput && courseCodeInput.value) {
        courseCode = courseCodeInput.value.trim();
    }
    
    const validationMessage = document.getElementById('validation-message');
    
    console.log("Searching for course code:", courseCode);
    
    // Remove validation message logic
    validationMessage.textContent = ''; // Clear any previous validation messages

    // Find course in data
    const foundCourses = courseData.filter(course => `${course.ainekood} - ${course.oppeainenimetusik}` === courseCode);
    
    if (foundCourses.length === 0) {
        validationMessage.textContent = 'Course not found. Please select a valid course from the list.';
        return;
    }
    
    // Clear validation message
    validationMessage.textContent = '';
    
    // Store all found courses
    currentCourses = foundCourses;
    
    // Display course information
    displayCourseInfo(currentCourses);
    
    // Retrieve and display MLOs for all module codes
    retrieveMLOs(currentCourses);
    
    // Show options panel
    showSection('options-panel');
}

// Validate course code format (3 letters followed by 4 digits)
function isValidCourseCode(code) {
    // Ensure code is a string and remove any spaces
    code = String(code).replace(/\s+/g, '');
    console.log("Validating code:", code);
    const regex = /^[A-Z]{3}\d{4}$/;
    const isValid = regex.test(code);
    console.log("Is valid:", isValid);
    return isValid;
}

// Display course information
function displayCourseInfo(courses) {
    // Use the first course for common information
    const course = courses[0];

    const courseCodeElement = document.getElementById('display-course-code');
    courseCodeElement.innerHTML = `<a href="http://ois2.taltech.ee/uusois/aine/${course.ainekood}" target="_blank" class="course-link">${course.ainekood}</a>`;
    document.getElementById('course-name-en').textContent = course.oppeainenimetusik;
    document.getElementById('course-name-et').textContent = course.oppeainenimetusek;
    document.getElementById('course-credits').textContent = course.eap;

    // Get all unique module codes
    const moduleCodes = [...new Set(courses.map(c => c.moodlikood))];

    // Create comma-separated list of module codes in uppercase
    const moduleCodeElement = document.getElementById('module-code');
    moduleCodeElement.textContent = moduleCodes
        .map(code => code.toUpperCase().replace('MLO', ''))
        .join(', ');
        
    // Course description feature removed

    // Show course info section
    showSection('course-info');

    // Ensure options panel is visible
    const optionsPanel = document.getElementById('options-panel');
    optionsPanel.classList.remove('hidden-section');
    optionsPanel.classList.add('active-section');
}

// Retrieve MLOs based on module codes from all courses
function retrieveMLOs(courses) {
    // Get all unique module codes
    const moduleCodes = [...new Set(courses.map(c => c.moodlikood))];
    
    // Filter MLOs by all module codes
    currentMLOs = [];
    moduleCodes.forEach(moduleCode => {
        const moduleMLOs = mloData.filter(mlo => mlo.moodlikood === moduleCode);
        // Add module code information to each MLO for display purposes
        moduleMLOs.forEach(mlo => {
            mlo.moduleCode = moduleCode;
        });
        currentMLOs = currentMLOs.concat(moduleMLOs);
    });
    
    // Display MLOs
    displayMLOs(currentMLOs);
}

// Display MLOs
function displayMLOs(mlos) {
    const mloContainer = document.getElementById('mlo-container');
    mloContainer.innerHTML = '';
    
    if (mlos.length === 0) {
        mloContainer.innerHTML = '<p>No Module Learning Outcomes found for this course.</p>';
        showSection('mlo-display');
        return;
    }
    
    // Group MLOs by module code
    const moduleGroups = {};
    mlos.forEach(mlo => {
        if (!moduleGroups[mlo.moduleCode]) {
            moduleGroups[mlo.moduleCode] = [];
        }
        moduleGroups[mlo.moduleCode].push(mlo);
    });
    
    // Define module order
    const moduleOrder = ['ylmlo', 'p1mlo', 'p2mlo', 'e1mlo', 'e2mlo', 'gdmlo'];
    
    // Create a section for each module in the specified order
    moduleOrder.forEach(moduleCode => {
        if (!moduleGroups[moduleCode]) return; // Skip if module doesn't exist
        
        const moduleMLOs = moduleGroups[moduleCode];
        
        // Create module section
        const moduleSection = document.createElement('div');
        moduleSection.className = 'module-section';
        
        // Add module header with the full name
        const moduleHeader = document.createElement('div');
        moduleHeader.className = 'module-header';
        moduleHeader.innerHTML = `<h3>${getModuleFullName(moduleCode)}</h3>`;
        moduleSection.appendChild(moduleHeader);
        
        // Add MLOs for this module
        moduleMLOs.forEach((mlo, index) => {
            const mloItem = document.createElement('div');
            mloItem.className = 'mlo-item';
            
            // Remove quotation marks and clean up the text
            let mloText = mlo.ilosisu;
            mloText = mloText.replace(/^["']|["']$/g, '').trim(); // Remove leading/trailing quotes
            
            mloItem.innerHTML = `
                <h4>${moduleCode.toUpperCase()} ${index + 1}</h4>
                <p>${mloText}</p>
            `;
            moduleSection.appendChild(mloItem);
        });
        
        mloContainer.appendChild(moduleSection);
    });
    
    // Show MLO display section
    showSection('mlo-display');
}

// Reset to search view
function resetToSearch() {
    // Clear current CLOs
    currentCLOs = [];

    // Reset other UI elements
    document.getElementById('clo-list').innerHTML = '';
    document.getElementById('clo-textarea').value = '';
    showSection('course-input');
}

// Show CLO input section
function showCLOInput() {
    // Clear current CLOs
    currentCLOs = [];
    document.getElementById('clo-list').innerHTML = '';
    document.getElementById('clo-textarea').value = '';

    // Show CLO input section
    showSection('clo-input');
}

// Add CLO from textarea
function addCLO() {
    const cloTextarea = document.getElementById('clo-textarea');
    const cloText = cloTextarea.value.trim();

    if (cloText === '') {
        return; // Do nothing if the input is empty
    }

    // Split by new lines and add each as a CLO
    const cloLines = cloText.split('\n').filter(line => line.trim() !== '');

    cloLines.forEach(line => {
        // Add to current CLOs
        currentCLOs.push(line);

        // Add to display
        addCLOToDisplay(line);
    });

    // Clear textarea
    cloTextarea.value = '';
    console.log('Current CLOs:', currentCLOs);
}

// Add a CLO to the display
function addCLOToDisplay(cloText) {
    const cloList = document.getElementById('clo-list');
    const index = currentCLOs.length;
    
    const cloItem = document.createElement('div');
    cloItem.className = 'clo-item';
    cloItem.innerHTML = `
        <div class="clo-text">
            <strong>CLO ${index}:</strong> ${cloText}
        </div>
        <div class="clo-actions">
            <button class="edit-clo" data-index="${index - 1}"><i class="fas fa-edit"></i></button>
            <button class="delete-clo" data-index="${index - 1}"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Add event listeners for edit and delete buttons
    cloItem.querySelector('.edit-clo').addEventListener('click', function() {
        editCLO(this.getAttribute('data-index'));
    });
    
    cloItem.querySelector('.delete-clo').addEventListener('click', function() {
        deleteCLO(this.getAttribute('data-index'));
    });
    
    cloList.appendChild(cloItem);
}

// Edit a CLO
function editCLO(index) {
    const cloText = currentCLOs[index];
    const cloTextarea = document.getElementById('clo-textarea');
    
    // Set textarea value to CLO text
    cloTextarea.value = cloText;
    
    // Delete the CLO (will be re-added when user clicks Add CLO)
    deleteCLO(index);
    
    // Focus textarea
    cloTextarea.focus();
}

// Delete a CLO
function deleteCLO(index) {
    // Remove from array
    currentCLOs.splice(index, 1);
    
    // Refresh display
    const cloList = document.getElementById('clo-list');
    cloList.innerHTML = '';
    
    // Re-add all CLOs to display
    currentCLOs.forEach(clo => {
        addCLOToDisplay(clo);
    });
}

// Suggest CLOs based on course and MLOs
function suggestCLOs() {
    // Generate suggestions based on course name and MLOs
    const suggestions = generateCLOSuggestions();

    // Display suggestions without modifying currentCLOs
    displayCLOSuggestions(suggestions);

    // Show suggestions section
    showSection('clo-suggestions');
}

// System prompt for generating high-quality learning outcomes
const CLO_GENERATION_GUIDELINES = `
Follow below key elements to generate good learning outcomes: 
1) The CLOs should align with related MLOs
2) The CLOs are specific and clear, avoid vague language. It precisely states what the student is expected to learn or accomplish, which helps in guiding both instruction and assessment.
3) The CLOs should focus on student learning rather than teacher instruction. They emphasize what the students will do or understand, not just what the instructor will cover or present.
4) The CLOs should be challenging yet attainable for students at the course level. It should push students to advance their skills and knowledge without being so difficult that it becomes demotivating or overwhelming. Using action verbs from Bloom's Taxonomy (such as analyse, create, evaluate) helps in creating objectives at the appropriate level. 
5) Format course outcomes as a numbered list. Each outcome should be one sentence. Begin each outcome by using a strong and measurable verb. Use only one verb per objective. Avoid using jargon if possible. Don't use the words understand, understanding, demonstrate.
6) Use Bloom's Taxonomy: Familiarize yourself with Bloom's Taxonomy, which categorizes cognitive skills from lower to higher order.
`;

// Generate high-quality CLO suggestions (fewer than 5 CLOs, with alignment scores > 3)
function generateCLOSuggestions() {
    console.log("Generating CLOs following guidelines:", CLO_GENERATION_GUIDELINES);
    
    // Use the first course for common information
    const course = currentCourses[0];
    const courseName = course.oppeainenimetusik;
    let candidateSuggestions = [];
    
    // Determine if we need to ensure more randomization
    const forceUniqueness = window.forceRandomization === true;
    
    // Forbidden verbs to avoid
    const forbiddenVerbs = ['understand', 'understanding', 'demonstrate'];
    
    // Preferred Bloom's taxonomy verbs by level (avoiding forbidden verbs)
    const bloomVerbs = {
        remember: ['recall', 'identify', 'define', 'list', 'name', 'recognize', 'state'],
        understand: ['explain', 'summarize', 'interpret', 'classify', 'describe', 'discuss'],
        apply: ['use', 'solve', 'implement', 'execute', 'apply', 'operate', 'show', 'practice'],
        analyze: ['analyze', 'compare', 'differentiate', 'examine', 'categorize', 'contrast', 'investigate'],
        evaluate: ['evaluate', 'assess', 'judge', 'critique', 'justify', 'support', 'argue', 'defend'],
        create: ['create', 'design', 'develop', 'formulate', 'construct', 'produce', 'plan', 'compose']
    };
    
    // Create template patterns for more variety
    const cloTemplates = {
        remember: [
            "{verb} key {subject} concepts through written assignments.",
            "{verb} the essential {subject} terminology in classroom discussions.",
            "{verb} core principles of {subject} in a structured framework."
        ],
        understand: [
            "{verb} the relationships between {subject} concepts in written form.",
            "{verb} how different {subject} theories address real-world scenarios.",
            "{verb} the implications of {subject} approaches in various contexts."
        ],
        apply: [
            "{verb} {subject} frameworks to solve discipline-specific problems.",
            "{verb} relevant {subject} methods in case study analysis.",
            "{verb} {subject} principles to address practical challenges in the field."
        ],
        analyze: [
            "{verb} case studies related to {subject} and {verb2} their effectiveness.",
            "{verb} the relationships between {subject} concepts in various contexts.",
            "{verb} how {subject} approaches impact outcomes in different scenarios."
        ],
        evaluate: [
            "{verb} the strengths and limitations of {subject} approaches in real-world settings.",
            "{verb} different perspectives on {subject} through critical assessment.",
            "{verb} the effectiveness of {subject} methods through comparative analysis."
        ],
        create: [
            "{verb} a project that applies {subject} to a real-world scenario.",
            "{verb} innovative solutions to {subject} challenges using appropriate methodologies.",
            "{verb} original {subject} frameworks that integrate multiple theoretical perspectives."
        ]
    };
    
    // Helper to get a random verb from a specific Bloom's level
    const getRandomVerb = (level) => {
        const verbs = bloomVerbs[level];
        return verbs[Math.floor(Math.random() * verbs.length)];
    };
    
    // Helper to get a different random verb (for variety)
    const getDifferentVerb = (level, excludeVerb) => {
        const verbs = bloomVerbs[level].filter(v => v !== excludeVerb);
        if (verbs.length === 0) return getRandomVerb(level);
        return verbs[Math.floor(Math.random() * verbs.length)];
    };
    
    // Helper to get a random template for a level
    const getRandomTemplate = (level) => {
        const templates = cloTemplates[level];
        return templates[Math.floor(Math.random() * templates.length)];
    };
    
    // Helper to clean and validate CLO
    const validateCLO = (clo) => {
        // Ensure only one sentence
        let cleanClo = clo.replace(/\.\s+\w/g, '. ').trim();
        if (!cleanClo.endsWith('.')) cleanClo += '.';
        
        // Check for forbidden verbs
        let isValid = true;
        forbiddenVerbs.forEach(verb => {
            if (cleanClo.toLowerCase().includes(verb)) {
                isValid = false;
                // Replace forbidden verbs with appropriate alternatives
                if (verb === 'understand') {
                    cleanClo = cleanClo.replace(/understand/i, 'explain');
                    cleanClo = cleanClo.replace(/understanding/i, 'knowledge of');
                } else if (verb === 'demonstrate') {
                    cleanClo = cleanClo.replace(/demonstrate/i, 'show');
                }
            }
        });
        
        // Ensure it starts with a strong verb
        const firstWord = cleanClo.split(' ')[0].toLowerCase();
        if (!Object.values(bloomVerbs).flat().includes(firstWord)) {
            // Get a random higher-level verb as replacement
            const highLevelVerb = getRandomVerb(['analyze', 'evaluate', 'create'][Math.floor(Math.random() * 3)]);
            cleanClo = capitalize(highLevelVerb) + ' ' + cleanClo.substring(cleanClo.indexOf(' ') + 1);
        }
        
        return cleanClo;
    };
    
    // Check if we have a course description to use as a basis
    const courseDescription = courseDescriptions[course.ainekood];
    
    // Generate MLO-aligned CLOs if we have MLOs available
    if (currentMLOs.length > 0) {
        // Group MLOs by module for better organization
        const moduleGroups = {};
        currentMLOs.forEach(mlo => {
            if (!moduleGroups[mlo.moduleCode]) {
                moduleGroups[mlo.moduleCode] = [];
            }
            moduleGroups[mlo.moduleCode].push(mlo);
        });
        
        // Get key modules in priority order
        const moduleOrder = ['e1mlo', 'e2mlo', 'p1mlo', 'p2mlo', 'ylmlo', 'gdmlo']; // Specific modules first
        const sortedModules = Object.keys(moduleGroups).sort((a, b) => {
            return moduleOrder.indexOf(a) - moduleOrder.indexOf(b);
        });
        
        // Generate CLOs from MLOs for each key module
        sortedModules.forEach((moduleCode, index) => {
            if (candidateSuggestions.length >= 5) return; // Limit to 5 total suggestions
            
            const moduleMLOs = moduleGroups[moduleCode];
            
            // Use randomized MLO selection when regenerating
            const mloIndex = forceUniqueness ? Math.floor(Math.random() * moduleMLOs.length) : 0;
            
            // Take a random or first MLO from this module based on regeneration flag
            if (moduleMLOs.length > 0) {
                const mlo = moduleMLOs[mloIndex % moduleMLOs.length]; // Ensure valid index
                
                // Extract keywords and context from MLO
                const keywords = extractKeywords(mlo.ilosisu);
                const mloVerbs = extractVerbs(mlo.ilosisu);
                
                if (keywords.length > 0) {
                    // Use appropriate Bloom's verbs based on MLO context
                    // Use escalating cognitive levels but vary for regeneration
                    const bloomLevels = ['apply', 'analyze', 'evaluate', 'create'];
                    
                    // Add more randomization when regenerating
                    let levelIndex = Math.min(index, bloomLevels.length - 1);
                    if (forceUniqueness) {
                        // Use a different level index for variety
                        levelIndex = (levelIndex + Math.floor(Math.random() * 3) + 1) % bloomLevels.length;
                    }
                    
                    const bloomLevel = bloomLevels[levelIndex];
                    const verb = getRandomVerb(bloomLevel);
                    
                    // For second verb in templates when needed
                    const verb2 = getDifferentVerb(bloomLevel, verb);
                    
                    let cloText;
                    if (forceUniqueness) {
                        // Use template-based generation for more variety when regenerating
                        const template = getRandomTemplate(bloomLevel);
                        cloText = template
                            .replace("{verb}", capitalize(verb))
                            .replace("{verb2}", verb2)
                            .replace("{subject}", `${keywords.slice(0, 2).join(' and ')} in ${courseName}`);
                    } else {
                        // Use original switch-based generation for first time
                        switch (bloomLevel) {
                            case 'apply':
                                cloText = `${capitalize(verb)} ${keywords.slice(0, 2).join(' and ')} concepts to solve relevant problems in ${courseName}.`;
                                break;
                            case 'analyze':
                                cloText = `${capitalize(verb)} the relationships between ${keywords.slice(0, 2).join(' and ')} in ${courseName} contexts.`;
                                break;
                            case 'evaluate':
                                cloText = `${capitalize(verb)} the effectiveness of ${keywords.slice(0, 2).join(' and ')} approaches in ${courseName} scenarios.`;
                                break;
                            case 'create':
                                cloText = `${capitalize(verb)} original solutions to ${courseName} challenges using principles of ${keywords.slice(0, 2).join(' and ')}.`;
                                break;
                        }
                    }
                    
                    candidateSuggestions.push({
                        text: validateCLO(cloText),
                        priority: 1  // High priority for MLO-aligned CLOs
                    });
                }
            }
        });
    }
    
    // Use course description if available to generate additional CLOs
    if (courseDescription) {
        // Parse course description for key concepts
        const descriptionKeywords = extractKeywords(courseDescription);
        
        // Define Bloom levels to use
        const bloomLevels = ['apply', 'analyze', 'evaluate', 'create'];
        
        // Generate CLOs at different Bloom's taxonomy levels
        bloomLevels.forEach(level => {
            // Skip if we already have enough suggestions
            if (candidateSuggestions.length >= 5) return;
            
            const verb = getRandomVerb(level);
            const verb2 = getDifferentVerb(level, verb);
            let cloText;
            
            if (forceUniqueness) {
                // Use templates for more variety when regenerating
                const template = getRandomTemplate(level);
                cloText = template
                    .replace("{verb}", capitalize(verb))
                    .replace("{verb2}", verb2)
                    .replace("{subject}", `${descriptionKeywords.slice(0, 2).join(' and ')} in ${courseName}`);
            } else {
                // Standard format for initial generation
                switch (level) {
                    case 'apply':
                        cloText = `${capitalize(verb)} principles of ${descriptionKeywords.slice(0, 2).join(' and ')} to solve practical problems in ${courseName}.`;
                        break;
                    case 'analyze':
                        cloText = `${capitalize(verb)} different approaches to ${descriptionKeywords.slice(0, 2).join(' and ')} in the context of ${courseName}.`;
                        break;
                    case 'evaluate':
                        cloText = `${capitalize(verb)} the effectiveness of ${descriptionKeywords.slice(0, 2).join(' and ')} methods used in ${courseName}.`;
                        break;
                    case 'create':
                        cloText = `${capitalize(verb)} innovative solutions that integrate ${descriptionKeywords.slice(0, 2).join(' and ')} to address challenges in ${courseName}.`;
                        break;
                }
            }
            
            candidateSuggestions.push({
                text: validateCLO(cloText),
                priority: 2
            });
        });
    }
    
    // Generate fallback CLOs if we still need more
    if (candidateSuggestions.length < 5) {
        // Different wording when regenerating
        const basicFallbacks = [
            {
                text: `Explain key theories, concepts, and methods used in ${courseName} clearly and accurately.`,
                priority: 3
            },
            {
                text: `Apply ${courseName} principles to analyze and solve real-world problems.`, 
                priority: 3
            },
            {
                text: `Evaluate the strengths and limitations of different approaches in ${courseName}.`,
                priority: 3
            },
            {
                text: `Create original solutions to complex problems in ${courseName} using appropriate methods and techniques.`,
                priority: 3
            },
            {
                text: `Analyze case studies related to ${courseName} and critique their effectiveness in written reports.`,
                priority: 3
            }
        ];
        
        // Alternate fallbacks for regeneration
        const alternateFallbacks = [
            {
                text: `Describe fundamental principles and theoretical frameworks of ${courseName} in discussions and assignments.`,
                priority: 3
            },
            {
                text: `Implement ${courseName} techniques to address practical challenges in field-related contexts.`,
                priority: 3
            },
            {
                text: `Assess the impact and relevance of various ${courseName} methodologies through critical analysis.`,
                priority: 3
            },
            {
                text: `Develop innovative approaches to ${courseName} that integrate multiple perspectives and theories.`,
                priority: 3
            },
            {
                text: `Examine relationships between ${courseName} concepts and their applications in diverse scenarios.`,
                priority: 3
            }
        ];
        
        // Choose which fallback set to use based on regeneration flag
        const fallbackCLOs = forceUniqueness ? alternateFallbacks : basicFallbacks;
        
        // Add fallback CLOs until we have 5 or run out of fallbacks
        for (let i = 0; i < fallbackCLOs.length && candidateSuggestions.length < 5; i++) {
            candidateSuggestions.push({
                text: validateCLO(fallbackCLOs[i].text),
                priority: fallbackCLOs[i].priority
            });
        }
    }
    
    // Sort by priority (lower number = higher priority)
    candidateSuggestions.sort((a, b) => a.priority - b.priority);
    
    // Return 5 suggestions now instead of 4
    return candidateSuggestions.slice(0, 5).map(suggestion => suggestion.text);
}

// Extract action verbs from text for better CLO formation
function extractVerbs(text) {
    // Common action verbs from Bloom's taxonomy and academic writing
    const commonVerbs = [
        'analyze', 'apply', 'assess', 'create', 'define', 'demonstrate', 'design', 
        'develop', 'evaluate', 'explain', 'identify', 'implement', 'interpret', 
        'plan', 'solve', 'understand', 'use', 'synthesize', 'formulate', 'construct',
        'propose', 'integrate', 'critique', 'examine', 'investigate', 'articulate',
        'generate', 'organize', 'compose', 'produce'
    ];
    
    // Convert to lowercase for comparison
    const textLower = text.toLowerCase();
    
    // Find verbs that appear in the text
    const foundVerbs = commonVerbs.filter(verb => textLower.includes(verb));
    
    // If no verbs found, return default verbs appropriate for higher education
    return foundVerbs.length > 0 ? foundVerbs : ['demonstrate', 'analyze', 'develop'];
}

// Helper function to capitalize first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Extract keywords from text (simplified version)
function extractKeywords(text) {
    // Remove common words and punctuation
    const commonWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 'on', 'at'];
    
    // Split text into words, filter out common words, and take unique words
    const words = text.toLowerCase()
        .replace(/[.,;:'"!?()]/g, '')
        .split(' ')
        .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Return up to 3 unique words
    return [...new Set(words)].slice(0, 3);
}

// Display CLO suggestions
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

// Use selected suggestions as CLOs
function useSuggestions() {
    // Clear current CLOs only if suggestions are explicitly used
    const checkboxes = document.querySelectorAll('.suggestion-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one suggestion.');
        return;
    }

    // Replace currentCLOs with selected suggestions
    currentCLOs = [];
    checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent;
        currentCLOs.push(label);
    });

    // Perform analysis with selected CLOs
    performAnalysis();
}

// Modify suggestions (go to CLO input with suggestions pre-filled)
function modifySuggestions() {
    // Get all checked suggestions
    const checkboxes = document.querySelectorAll('.suggestion-checkbox:checked');
    let selectedSuggestions = [];
    
    checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling.textContent;
        selectedSuggestions.push(label);
    });
    
    // Show CLO input section
    showCLOInput();
    
    // Pre-fill textarea with selected suggestions
    document.getElementById('clo-textarea').value = selectedSuggestions.join('\n');
}

// Perform alignment analysis between CLOs and MLOs
function performAnalysis() {
    // Check if we have CLOs
    if (currentCLOs.length === 0) {
        alert('Please add at least one Course Learning Outcome.');
        return;
    }
    
    // Check if we have MLOs
    if (currentMLOs.length === 0) {
        alert('No Module Learning Outcomes available for analysis.');
        return;
    }
    
    // Perform the analysis
    const analysisResults = analyzeAlignment();
    
    // Display analysis results (best matches for each CLO)
    displayAnalysisResults(analysisResults.bestMatches);
    
    // Show analysis section
    showSection('alignment-analysis');
    
    // Generate and display comprehensive report with all pairings
    generateReport(analysisResults);
}

// Analyze alignment between CLOs and MLOs - comprehensive analysis of all pairings
function analyzeAlignment() {
    const results = [];
    const allPairings = [];

    // Loop through user-input CLOs
    currentCLOs.forEach((clo, cloIndex) => {
        let bestMatch = {
            mlo: null,
            mloIndex: -1,
            score: 0,
            reason: '',
            suggestion: ''
        };
        
        const cloPairings = []; // Store all pairings for this CLO

        // Compare with each MLO
        currentMLOs.forEach((mlo, mloIndex) => {
            const score = calculateAlignmentScore(clo, mlo.ilosisu);
            const reason = generateAlignmentReason(clo, mlo.ilosisu, score);
            
            // Create this pairing
            const pairing = {
                clo: clo,
                cloIndex: cloIndex,
                mlo: mlo,
                mloIndex: mloIndex,
                score: score,
                reason: reason
            };
            
            // Add to all pairings for this CLO
            cloPairings.push(pairing);

            // If this is the best match so far, update bestMatch
            if (score > bestMatch.score) {
                bestMatch = {
                    mlo: mlo,
                    mloIndex: mloIndex,
                    score: score,
                    reason: reason
                };
            }
        });

        // Add the best match to main results (for backward compatibility)
        results.push({
            clo: clo,
            cloIndex: cloIndex,
            mlo: bestMatch.mlo,
            mloIndex: bestMatch.mloIndex,
            score: bestMatch.score,
            reason: bestMatch.reason,
            allPairings: cloPairings // Include all pairings for this CLO
        });
        
        // Add all pairings to the comprehensive list
        allPairings.push(...cloPairings);
    });

    // Add all pairings to the results object
    return {
        bestMatches: results,
        allPairings: allPairings
    };
}

// Calculate alignment score between CLO and MLO (1-5 scale) with AI-enhanced scoring
function calculateAlignmentScore(clo, mloText) {
    // AI-enhanced scoring algorithm using more sophisticated pattern matching
    
    // Convert to lowercase for comparison
    const cloLower = clo.toLowerCase();
    const mloLower = mloText.toLowerCase();
    
    // Extract keywords from both
    const cloKeywords = extractKeywords(cloLower);
    const mloKeywords = extractKeywords(mloLower);
    
    // Extract verbs for better alignment
    const cloVerbs = extractVerbs(cloLower);
    const mloVerbs = extractVerbs(mloLower);
    
    // Analyze keyword matches with semantic weighting
    let keywordScore = 0;
    cloKeywords.forEach(keyword => {
        if (mloLower.includes(keyword)) {
            // Give higher weight to longer keywords (likely more specific)
            keywordScore += 0.5 + (keyword.length / 20);
        } else {
            // Check for partial matches or synonyms (simulated)
            const partialMatches = mloKeywords.filter(mk => 
                mk.includes(keyword) || keyword.includes(mk));
            if (partialMatches.length > 0) {
                keywordScore += 0.3;
            }
        }
    });
    
    // Advanced verb alignment check using Bloom's taxonomy levels
    const verbScore = calculateVerbScore(cloVerbs, mloVerbs);
    
    // Semantic similarity calculation (simulated)
    const semanticScore = calculateSemanticScore(cloLower, mloLower);
    
    // Calculate final score with weighted components
    let score = 1; // Base score
    
    // Add weighted keyword score (max 2 points)
    score += Math.min(keywordScore, 2);
    
    // Add verb alignment score (max 1 point)
    score += Math.min(verbScore, 1);
    
    // Add semantic similarity score (max 1 point)
    score += Math.min(semanticScore, 1);
    
    return Math.min(Math.round(score), 5); // Round and cap at 5
}

// Calculate verb alignment score based on Bloom's taxonomy with expanded coverage
function calculateVerbScore(cloVerbs, mloVerbs) {
    // Bloom's taxonomy levels (comprehensive)
    const bloomLevels = {
        // Knowledge/Remembering (Level 1)
        'remember': 1,
        'recognize': 1,
        'recall': 1,
        'identify': 1,
        'retrieve': 1,
        'name': 1,
        'define': 1,
        'list': 1,
        'state': 1,
        'describe': 1,
        'locate': 1,
        'memorize': 1,
        
        // Comprehension/Understanding (Level 1)
        'understand': 1,
        'interpret': 1,
        'classify': 1,
        'summarize': 1,
        'explain': 1,
        'paraphrase': 1,
        'discuss': 1,
        'distinguish': 1,
        'predict': 1,
        'express': 1,
        'translate': 1,
        
        // Application (Level 2)
        'apply': 2,
        'implement': 2,
        'use': 2,
        'execute': 2,
        'solve': 2,
        'demonstrate': 2,
        'operate': 2,
        'show': 2,
        'exhibit': 2,
        'illustrate': 2,
        'practice': 2,
        'calculate': 2,
        'perform': 2,
        
        // Analysis (Level 3)
        'analyze': 3,
        'differentiate': 3,
        'compare': 3,
        'contrast': 3,
        'examine': 3,
        'test': 3,
        'question': 3,
        'investigate': 3,
        'inspect': 3,
        'categorize': 3,
        'breakdown': 3,
        'correlate': 3,
        'diagram': 3,
        'deconstruct': 3,
        
        // Evaluation (Level 4)
        'evaluate': 4,
        'check': 4,
        'judge': 4,
        'critique': 4,
        'recommend': 4,
        'justify': 4,
        'assess': 4,
        'appraise': 4,
        'argue': 4,
        'defend': 4,
        'rank': 4,
        'determine': 4,
        'select': 4,
        'support': 4,
        'measure': 4,
        
        // Creation/Synthesis (Level 5)
        'create': 5,
        'design': 5,
        'construct': 5,
        'develop': 5,
        'synthesize': 5,
        'formulate': 5,
        'author': 5,
        'compose': 5,
        'devise': 5,
        'generate': 5,
        'invent': 5,
        'originate': 5,
        'plan': 5,
        'organize': 5,
        'integrate': 5,
        'produce': 5
    };
    
    // Get the highest Bloom's level for each set of verbs
    let cloHighestLevel = 0;
    let mloHighestLevel = 0;
    
    cloVerbs.forEach(verb => {
        const level = bloomLevels[verb] || 0;
        cloHighestLevel = Math.max(cloHighestLevel, level);
    });
    
    mloVerbs.forEach(verb => {
        const level = bloomLevels[verb] || 0;
        mloHighestLevel = Math.max(mloHighestLevel, level);
    });
    
    // Exact match of highest level is best
    if (cloHighestLevel === mloHighestLevel && cloHighestLevel > 0) {
        return 1.0;
    }
    
    // Close alignment (within 1 level) is good
    if (Math.abs(cloHighestLevel - mloHighestLevel) <= 1 && cloHighestLevel > 0 && mloHighestLevel > 0) {
        return 0.8;
    }
    
    // At least one common verb is decent
    const commonVerbs = cloVerbs.filter(verb => mloVerbs.includes(verb));
    if (commonVerbs.length > 0) {
        return 0.6;
    }
    
    // Some verbs present but no alignment
    if (cloHighestLevel > 0 && mloHighestLevel > 0) {
        return 0.3;
    }
    
    return 0;
}

// Calculate semantic similarity score (simulated NLP)
function calculateSemanticScore(cloText, mloText) {
    // In a real AI implementation, this would use embeddings or other NLP methods
    
    // Simulate semantic similarity by analyzing common phrases and patterns
    const commonPhrases = [
        'understand', 'knowledge', 'apply', 'skill', 'analyze', 
        'critical', 'evaluate', 'create', 'design', 'develop',
        'problem', 'solution', 'research', 'communicate', 'demonstrate',
        'professional', 'ethical', 'team', 'individual', 'practice'
    ];
    
    // Count common meaningful phrases
    let commonCount = 0;
    commonPhrases.forEach(phrase => {
        if (cloText.includes(phrase) && mloText.includes(phrase)) {
            commonCount++;
        }
    });
    
    // Check text length similarity as a crude proxy for content similarity
    const lengthRatio = Math.min(cloText.length, mloText.length) / Math.max(cloText.length, mloText.length);
    
    // Calculate semantic score based on common phrases and length similarity
    return (commonCount / 10) * 0.7 + lengthRatio * 0.3;
}

// Generate AI-enhanced reason for alignment score with specific content analysis
function generateAlignmentReason(clo, mloText, score) {
    // Extract key elements for contextualized feedback
    const cloKeywords = extractKeywords(clo);
    const mloKeywords = extractKeywords(mloText);
    const cloVerbs = extractVerbs(clo);
    const mloVerbs = extractVerbs(mloText);
    
    // Find common and different elements
    const commonKeywords = cloKeywords.filter(k => mloKeywords.includes(k));
    const uncommonMloKeywords = mloKeywords.filter(k => !cloKeywords.includes(k));
    const commonVerbs = cloVerbs.filter(v => mloVerbs.includes(v));
    const uncommonMloVerbs = mloVerbs.filter(v => !cloVerbs.includes(v));
    
    // Create more specific and data-driven justifications
    switch (score) {
        case 0:
            return `No alignment detected. The CLO focuses on "${cloKeywords.join(', ')}" while the MLO addresses "${mloKeywords.join(', ')}". The learning levels (${cloVerbs.join(', ')}) vs (${mloVerbs.join(', ')}) are also distinct.`;
            
        case 1:
            if (commonKeywords.length === 0 && commonVerbs.length === 0) {
                return `Minimal alignment. The CLO and MLO address different topics with no shared terminology or learning approaches. Consider incorporating MLO concepts such as "${uncommonMloKeywords.slice(0, 3).join(', ')}" with verbs like "${uncommonMloVerbs.slice(0, 2).join(', ')}".`;
            } else if (commonKeywords.length > 0) {
                return `Limited alignment with only superficial connections. While both mention "${commonKeywords.join(', ')}", they have different learning objectives, contexts, and methods that don't meaningfully align.`;
            } else {
                return `Limited structural alignment only. Both use similar verbs (${commonVerbs.join(', ')})}, but apply them to entirely different content areas: CLO (${cloKeywords.join(', ')}) vs MLO (${mloKeywords.join(', ')}).`;
            }
            
        case 2:
            if (commonKeywords.length === 0 && commonVerbs.length > 0) {
                return `Partial alignment through similar learning approaches (${commonVerbs.join(', ')}), but different content focus. To improve, incorporate concepts like "${uncommonMloKeywords.slice(0, 3).join(', ')}" from the MLO.`;
            } else if (commonKeywords.length > 0 && commonVerbs.length === 0) {
                return `Partial content alignment through shared terms "${commonKeywords.join(', ')}", but different cognitive levels. Consider adopting MLO verbs like "${uncommonMloVerbs.slice(0, 2).join(', ')}" for better alignment.`;
            } else if (commonKeywords.length > 0 && commonVerbs.length > 0) {
                return `Moderate alignment potential with some shared vocabulary (${commonKeywords.join(', ')}) and learning approaches (${commonVerbs.join(', ')}), but the emphasis and context differ significantly.`;
            } else {
                return `Limited alignment. The CLO and MLO have different focuses: CLO (${cloKeywords.join(', ')}) using approaches (${cloVerbs.join(', ')}) vs MLO (${mloKeywords.join(', ')}) using (${mloVerbs.join(', ')}).`;
            }
            
        case 3:
            if (commonKeywords.length >= 2 && commonVerbs.length >= 1) {
                return `Meaningful alignment through shared vocabulary (${commonKeywords.join(', ')}) and learning approaches (${commonVerbs.join(', ')}), though the scope and emphasis still differ in important ways.`;
            } else if (commonKeywords.length > 0) {
                return `Content alignment through shared concepts (${commonKeywords.join(', ')}), but cognitive approaches differ. The CLO uses ${cloVerbs.join(', ')} while the MLO emphasizes ${mloVerbs.join(', ')}.`;
            } else if (commonVerbs.length > 0) {
                return `Process alignment through shared learning approaches (${commonVerbs.join(', ')}), but applied to different content areas. Consider integrating MLO concepts like ${uncommonMloKeywords.slice(0, 2).join(', ')}.`;
            } else {
                return `Moderate conceptual alignment despite different terminology and approaches. Both address complementary aspects that support similar learning goals.`;
            }
            
        case 4:
            if (commonKeywords.length >= 2 && commonVerbs.length >= 1) {
                return `Strong alignment through shared key concepts (${commonKeywords.join(', ')}) and learning approaches (${commonVerbs.join(', ')}). The CLO effectively supports and complements the MLO's learning expectations.`;
            } else if (commonKeywords.length >= 2) {
                return `Strong content alignment with shared terminology (${commonKeywords.join(', ')}). The different cognitive approaches are complementary and support coherent learning progression.`;
            } else if (commonVerbs.length >= 2) {
                return `Strong methodological alignment through shared learning processes (${commonVerbs.join(', ')}). The different content areas are complementary and support the same learning goals.`;
            } else {
                return `Strong alignment in purpose and application. The CLO and MLO work synergistically toward similar learning outcomes despite using different specific vocabulary.`;
            }
            
        case 5:
            if (commonKeywords.length >= 3 && commonVerbs.length >= 2) {
                return `Excellent alignment across multiple dimensions: shared terminology (${commonKeywords.join(', ')}), learning approaches (${commonVerbs.join(', ')}), and contextual application. The CLO directly reinforces and extends the MLO.`;
            } else if (commonKeywords.length >= 3) {
                return `Exceptional content alignment with extensive shared terminology (${commonKeywords.join(', ')}). The CLO effectively contextualizes and applies the MLO's knowledge requirements in a coherent way.`;
            } else if (commonVerbs.length >= 2) {
                return `Exceptional methodological alignment through shared cognitive processes (${commonVerbs.join(', ')}). The content areas form a coherent and integrated learning approach.`;
            } else {
                return `Exceptional holistic alignment. The CLO and MLO form a perfectly coherent learning progression with strong conceptual connections and complementary approaches.`;
            }
            
        default:
            return `Alignment score ${score} - Unable to generate specific justification with available data.`;
    }
}

// Generate AI-enhanced improvement suggestions for low scores based on Bloom's taxonomy
function generateImprovementSuggestion(clo, mloText) {
    // Extract semantic elements from both texts
    const mloKeywords = extractKeywords(mloText);
    const cloKeywords = extractKeywords(clo);
    const mloVerbs = extractVerbs(mloText);
    const cloVerbs = extractVerbs(clo);
    
    // Define Bloom's taxonomy verb suggestions by level
    const bloomVerbsByLevel = {
        1: ["list", "define", "recall", "identify", "name", "state"],
        2: ["explain", "summarize", "interpret", "classify", "describe"],
        3: ["apply", "use", "solve", "implement", "practice"],
        4: ["analyze", "compare", "differentiate", "organize", "examine"],
        5: ["evaluate", "judge", "critique", "defend", "assess"],
        6: ["design", "construct", "develop", "create", "produce"]
    };
    
    // AI-suggested improvements based on detailed analysis
    let suggestions = [];
    
    // Check for missing keywords from MLO
    const missingKeywords = mloKeywords.filter(k => !cloKeywords.includes(k));
    if (missingKeywords.length > 0) {
        suggestions.push(`Incorporate key concepts from the MLO such as: "${missingKeywords.slice(0, 3).join(', ')}"`);
    }
    
    // Define comprehensive Bloom's level mapping
    const bloomLevels = {
        // Knowledge/Remembering (Level 1)
        'remember': 1, 'recognize': 1, 'recall': 1, 'identify': 1, 'retrieve': 1, 
        'name': 1, 'define': 1, 'list': 1, 'state': 1, 'describe': 1, 'locate': 1,
        
        // Comprehension/Understanding (Level 2)
        'understand': 2, 'interpret': 2, 'explain': 2, 'summarize': 2, 'classify': 2,
        'discuss': 2, 'paraphrase': 2, 'distinguish': 2, 'predict': 2, 'express': 2,
        
        // Application (Level 3)
        'apply': 3, 'implement': 3, 'use': 3, 'execute': 3, 'solve': 3, 
        'demonstrate': 3,
        'operate': 3, 'practice': 3, 'calculate': 3, 'perform': 3,
        
        // Analysis (Level 4)
        'analyze': 4, 'compare': 4, 'differentiate': 4, 'examine': 4, 'organize': 4,
        'test': 4, 'contrast': 4, 'investigate': 4, 'categorize': 4, 'deconstruct': 4,
        
        // Evaluation (Level 5)
        'evaluate': 5, 'judge': 5, 'critique': 5, 'defend': 5, 'assess': 5,
        'recommend': 5, 'justify': 5, 'appraise': 5, 'argue': 5, 'support': 5,
        
        // Creation (Level 6)
        'create': 6, 'design': 6, 'construct': 6, 'develop': 6, 'formulate': 6,
        'compose': 6, 'generate': 6, 'plan': 6, 'produce': 6, 'synthesize': 6
    };
    
    // Get the highest Bloom's level for each
    let cloHighestLevel = 0;
    let mloHighestLevel = 0;
    
    cloVerbs.forEach(verb => {
        const level = bloomLevels[verb] || 0;
        cloHighestLevel = Math.max(cloHighestLevel, level);
    });
    
    mloVerbs.forEach(verb => {
        const level = bloomLevels[verb] || 0;
        mloHighestLevel = Math.max(mloHighestLevel, level);
    });
    
    // Suggest verb improvement based on Bloom's taxonomy
    if (cloHighestLevel < mloHighestLevel) {
        // Suggest higher-level verbs based on MLO level
        const recommendedVerbs = bloomVerbsByLevel[mloHighestLevel] || bloomVerbsByLevel[4];
        suggestions.push(`Use higher-order thinking verbs like "${recommendedVerbs.slice(0, 3).join('", "')}" to match the MLO's cognitive level`);
    } else if (cloHighestLevel > mloHighestLevel + 1) {
        // Suggest more appropriate level verbs
        const recommendedVerbs = bloomVerbsByLevel[mloHighestLevel] || bloomVerbsByLevel[3];
        if (recommendedVerbs && recommendedVerbs.length > 0) {
            suggestions.push(`Consider aligning with the MLO's cognitive level using verbs like "${recommendedVerbs.slice(0, 3).join('", "')}"`);
        }
    }
    
    // Check for clarity and actionability
    if (clo.split(' ').length < 10) {
        suggestions.push("Expand the CLO to be more specific and comprehensive");
    } else if (clo.split(' ').length > 30) {
        suggestions.push("Consider simplifying the CLO while maintaining its core alignment with the MLO");
    }
    
    // Suggest measurement/assessment component if missing
    if (!clo.toLowerCase().includes('demonstrat') && 
        !clo.toLowerCase().includes('measur') && 
        !clo.toLowerCase().includes('assess') &&
        !clo.toLowerCase().includes('presentation') &&
        !clo.toLowerCase().includes('report') &&
        !clo.toLowerCase().includes('assignment')) {
        suggestions.push("Add how the outcome will be demonstrated or measured (e.g., through presentations, written reports, or assignments)");
    }
    
    // If we have suggestions, format them nicely
    if (suggestions.length > 0) {
        return `AI Suggestion: ${suggestions.join('. Also, ')}. Ensure the CLO aligns with the MLO's expectations.`;
    } else {
        return 'AI Suggestion: Consider refining the CLO to improve alignment with the specific language and learning level of the MLO.';
    }
}

// Display analysis results with AI enhancements
function displayAnalysisResults(results) {
    const analysisContainer = document.getElementById('analysis-container');
    analysisContainer.innerHTML = '';
    
    // Add AI analysis header
    const aiHeader = document.createElement('div');
    aiHeader.className = 'ai-analysis-header';
    aiHeader.innerHTML = `
        <div class="ai-badge"><i class="fas fa-robot"></i> AI Analysis</div>
        <p>Our AI has analyzed the alignment between your Course Learning Outcomes and Module Learning Outcomes.</p>
    `;
    analysisContainer.appendChild(aiHeader);
    
    results.forEach((result, index) => {
        const alignmentItem = document.createElement('div');
        alignmentItem.className = 'alignment-item';
        
        // Create header with title and score
        const header = document.createElement('div');
        header.className = 'alignment-header';
        
        const title = document.createElement('div');
        title.className = 'alignment-title';
        title.textContent = `Alignment ${index + 1}`;
        
        const score = document.createElement('div');
        score.className = `alignment-score score-${result.score}`;
        score.textContent = `Score: ${result.score}/5`;
        
        header.appendChild(title);
        header.appendChild(score);
        
        // Create details section
        const details = document.createElement('div');
        details.className = 'alignment-details';
        
        // CLO section
        const cloSection = document.createElement('div');
        cloSection.className = 'alignment-clo';
        cloSection.innerHTML = `
            <strong>CLO ${result.cloIndex + 1}:</strong>
            <p>${result.clo}</p>
        `;
        
        // MLO section
        const mloSection = document.createElement('div');
        mloSection.className = 'alignment-mlo';
        mloSection.innerHTML = `
            <strong>MLO ${result.mloIndex + 1}:</strong>
            <p>${result.mlo.ilosisu}</p>
        `;
        
        // Reason section with AI badge
        const reasonSection = document.createElement('div');
        reasonSection.className = 'alignment-reason';
        reasonSection.innerHTML = `
            <strong>AI Analysis:</strong>
            <p>${result.reason}</p>
        `;
        
        // Add sections to details
        details.appendChild(cloSection);
        details.appendChild(mloSection);
        details.appendChild(reasonSection);
        
        // Add suggestion if score is low
        if (result.score < 4) {
            // Always show suggestion from AI
            const suggestion = generateImprovementSuggestion(result.clo, result.mlo.ilosisu);
            const suggestionSection = document.createElement('div');
            suggestionSection.className = 'alignment-suggestion';
            suggestionSection.innerHTML = `
                <strong><i class="fas fa-lightbulb"></i> AI Improvement Suggestion:</strong>
                <p>${suggestion}</p>
            `;
            details.appendChild(suggestionSection);
        }
        
        // Add header and details to item
        alignmentItem.appendChild(header);
        alignmentItem.appendChild(details);
        
        // Add item to container
        analysisContainer.appendChild(alignmentItem);
    });
}

// Generate report with comprehensive alignment matrix
function generateReport(results) {
    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = '';

    // Add back to top button
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);

    // Handle scroll event for back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
        }
    });

    // Handle click event for back to top button
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const course = currentCourses[0];
    const bestMatches = results.bestMatches;
    const allPairings = results.allPairings;

    // Create report header with prominent course name/code
    const reportHeader = `
        <div class="report-header">
            <div class="report-title">
                <h3 class="course-title">${course.oppeainenimetusik}</h3>
                <p class="course-code-large"><a href="http://ois2.taltech.ee/uusois/aine/${course.ainekood}" target="_blank" class="course-link-large">${course.ainekood}</a></p>
            </div>
            <div class="report-actions">
                <button id="continue-editing-btn" class="primary-btn">
                    <i class="fas fa-edit"></i> Continue Editing CLOs
                </button>
                <button id="export-report-btn" class="primary-btn">
                    <i class="fas fa-file-export"></i> Export Report
                </button>
            </div>
        </div>
    `;
    reportContainer.innerHTML += reportHeader;

    // SECTION 1: BEST MATCHES - Group best match results by module
    reportContainer.innerHTML += `<h4 class="report-section-title">Best Matches (Overview)</h4>`;
    
    const moduleGroups = {};
    bestMatches.forEach(result => {
        const moduleCode = result.mlo.moduleCode;
        if (!moduleGroups[moduleCode]) {
            moduleGroups[moduleCode] = [];
        }
        moduleGroups[moduleCode].push(result);
    });

    // Define module order
    const moduleOrder = ['ylmlo', 'p1mlo', 'p2mlo', 'e1mlo', 'e2mlo', 'gdmlo'];

    // Generate best matches report for each module in the specified order
    moduleOrder.forEach(moduleCode => {
        if (!moduleGroups[moduleCode]) return; // Skip if module doesn't exist in results

        const moduleResults = moduleGroups[moduleCode];
        const moduleMLOs = currentMLOs.filter(mlo => mlo.moduleCode === moduleCode);

        const moduleTable = `
            <div class="report-section">
                <h4>${getModuleFullName(moduleCode)}</h4>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>CLO</th>
                            <th>Best Matching MLO</th>
                            <th>Score</th>
                            <th>Justification</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${moduleResults.map(result => {
                            const mloNumber = moduleMLOs.findIndex(mlo => 
                                mlo.ilosisu === result.mlo.ilosisu) + 1;
                            
                            return `
                            <tr>
                                <td><strong>CLO ${result.cloIndex + 1}:</strong> ${result.clo}</td>
                                <td><strong>${moduleCode.toUpperCase()} ${mloNumber}:</strong> ${result.mlo.ilosisu}</td>
                                <td class="score-${result.score}">${result.score}/5</td>
                                <td>${result.reason}</td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
        `;
        reportContainer.innerHTML += moduleTable;
    });

    // SECTION 2: COMPREHENSIVE ALIGNMENT MATRIX
    reportContainer.innerHTML += `
        <h4 class="report-section-title">Comprehensive Alignment Matrix</h4>
        <p class="matrix-description">This matrix shows the alignment scores between all CLOs and MLOs. Scores range from 0 (no alignment) to 5 (excellent alignment).</p>
    `;
    
    // Create CLO-MLO alignment matrix
    const matrixSection = document.createElement('div');
    matrixSection.className = 'matrix-section';
    
    // Create matrix table
    const matrixTable = document.createElement('table');
    matrixTable.className = 'matrix-table';
    
    // Create header row with MLO labels
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th class="matrix-corner">CLO / MLO</th>`;
    
    mloLabels.forEach(mloLabel => {
        headerRow.innerHTML += `<th class="mlo-header" title="${mloLabel.mlo.ilosisu.substring(0, 100)}...">${mloLabel.label}</th>`;
    });
    
    matrixTable.appendChild(headerRow);
    
    // Create rows for each CLO
    currentCLOs.forEach((clo, cloIndex) => {
        const row = document.createElement('tr');
        row.innerHTML = `<th class="clo-header" title="${clo}">CLO ${cloIndex + 1}</th>`;
        
        // Add cells for each MLO
        mloLabels.forEach(mloLabel => {
            // Find the alignment score for this CLO-MLO pair
            const pairing = allPairings.find(p => 
                p.cloIndex === cloIndex && 
                p.mlo.ilosisu === mloLabel.mlo.ilosisu);
            
            const score = pairing ? pairing.score : 0;
            const reason = pairing ? pairing.reason : "No significant alignment detected.";
            const cellId = `cell-clo-${cloIndex}-mlo-${mloLabels.findIndex(ml => ml.mlo.ilosisu === mloLabel.mlo.ilosisu)}`;
            
            // Create interactive cell with tooltips and click navigation
            row.innerHTML += `<td id="${cellId}" class="score-cell score-${score}" 
                data-tooltip="${reason}" 
                data-clo="${cloIndex}" 
                data-mlo="${mloLabels.findIndex(ml => ml.mlo.ilosisu === mloLabel.mlo.ilosisu)}">${score}</td>`;
        });
        
        matrixTable.appendChild(row);
    });
    
    matrixSection.appendChild(matrixTable);
    
    // Add click and hover event listeners to all score cells after adding to DOM
    setTimeout(() => {
        const scoreCells = document.querySelectorAll('.score-cell');
        
        scoreCells.forEach(cell => {
            // Add tooltip hover functionality
            cell.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'matrix-tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                // Position the tooltip
                tooltip.style.top = (e.pageY - tooltip.offsetHeight - 10) + 'px';
                tooltip.style.left = (e.pageX - tooltip.offsetWidth / 2) + 'px';
                
                // Store tooltip reference
                this.tooltip = tooltip;
            });
            
            cell.addEventListener('mousemove', function(e) {
                if (this.tooltip) {
                    this.tooltip.style.top = (e.pageY - this.tooltip.offsetHeight - 10) + 'px';
                    this.tooltip.style.left = (e.pageX - this.tooltip.offsetWidth / 2) + 'px';
                }
            });
            
            cell.addEventListener('mouseleave', function() {
                if (this.tooltip) {
                    document.body.removeChild(this.tooltip);
                    this.tooltip = null;
                }
            });
            
            // Add click navigation to detailed view
            cell.addEventListener('click', function() {
                const cloIndex = this.getAttribute('data-clo');
                
                // Scroll to corresponding CLO breakdown
                const cloElement = document.querySelector(`#clo-breakdown .clo-details:nth-child(${parseInt(cloIndex) + 1})`);
                if (cloElement) {
                    cloElement.scrollIntoView({behavior: 'smooth'});
                    
                    // Highlight the element temporarily
                    cloElement.classList.add('highlight-section');
                    setTimeout(() => {
                        cloElement.classList.remove('highlight-section');
                    }, 2000);
                }
            });
        });
    }, 100);
    
    matrixSection.appendChild(matrixTable);
    reportContainer.appendChild(matrixSection);
    
    // SECTION 3: DETAILED BREAKDOWNS (CLO and MLO Views)
    reportContainer.innerHTML += `
        <h4 class="report-section-title">Detailed Breakdown</h4>
        <div class="toggle-container breakdown-toggle">
            <button id="toggle-breakdown-view-btn" class="toggle-btn">
                <i class="fas fa-exchange-alt"></i> Switch to MLO Breakdown View
            </button>
        </div>
        <div id="detailed-breakdown-container">
            <div id="clo-breakdown" class="active-breakdown">
                <h5 class="breakdown-subtitle">Breakdown by Course Learning Outcome</h5>
                <div id="detailed-breakdown-clo"></div>
            </div>
            <div id="mlo-breakdown" class="hidden-breakdown">
                <h5 class="breakdown-subtitle">Breakdown by Module Learning Outcome</h5>
                <div id="detailed-breakdown-mlo"></div>
            </div>
        </div>
    `;
    
    // CLO BREAKDOWN VIEW
    const detailedBreakdownCLO = document.getElementById('detailed-breakdown-clo');
    
    // Create details for each CLO
    currentCLOs.forEach((clo, cloIndex) => {
        const cloDetails = document.createElement('div');
        cloDetails.className = 'clo-details';
        cloDetails.innerHTML = `
            <h5>CLO ${cloIndex + 1}</h5>
            <p class="clo-text">${clo}</p>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>MLO</th>
                        <th>Score</th>
                        <th>Justification</th>
                    </tr>
                </thead>
                <tbody>
                    ${mloLabels.map(mloLabel => {
                        // Find the alignment score for this CLO-MLO pair
                        const pairing = allPairings.find(p => 
                            p.cloIndex === cloIndex && 
                            p.mlo.ilosisu === mloLabel.mlo.ilosisu);
                        
                        const score = pairing ? pairing.score : 0;
                        const reason = pairing ? pairing.reason : "No significant alignment detected.";
                        
                        // Get improvement suggestions for scores < 3
                        let suggestionHtml = '';
                        if (score < 3) {
                            const suggestion = generateImprovementSuggestion(clo, mloLabel.mlo.ilosisu);
                            suggestionHtml = `
                            <div class="improvement-suggestion">
                                <strong><i class="fas fa-lightbulb"></i> Improvement suggestions:</strong>
                                <p>${suggestion}</p>
                            </div>`;
                        }
                        
                        return `
                        <tr>
                            <td><strong>${mloLabel.label}:</strong> ${truncateText(mloLabel.mlo.ilosisu, 100)}</td>
                            <td class="score-${score}">${score}/5</td>
                            <td>${reason}${score < 3 ? suggestionHtml : ''}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        detailedBreakdownCLO.appendChild(cloDetails);
    });
    
    // MLO BREAKDOWN VIEW
    const detailedBreakdownMLO = document.getElementById('detailed-breakdown-mlo');
    
    // Create details for each MLO
    mloLabels.forEach(mloLabel => {
        const mloDetails = document.createElement('div');
        mloDetails.className = 'mlo-details';
        mloDetails.innerHTML = `
            <h5>${mloLabel.label}</h5>
            <p class="mlo-text">${mloLabel.mlo.ilosisu}</p>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>CLO</th>
                        <th>Score</th>
                        <th>Justification</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentCLOs.map((clo, cloIndex) => {
                        // Find the alignment score for this MLO-CLO pair
                        const pairing = allPairings.find(p => 
                            p.cloIndex === cloIndex && 
                            p.mlo.ilosisu === mloLabel.mlo.ilosisu);
                        
                        const score = pairing ? pairing.score : 0;
                        const reason = pairing ? pairing.reason : "No significant alignment detected.";
                        
                        // Get improvement suggestions for scores < 3
                        let suggestionHtml = '';
                        if (score < 3) {
                            const suggestion = generateImprovementSuggestion(clo, mloLabel.mlo.ilosisu);
                            suggestionHtml = `
                            <div class="improvement-suggestion">
                                <strong><i class="fas fa-lightbulb"></i> Improvement suggestions:</strong>
                                <p>${suggestion}</p>
                            </div>`;
                        }
                        
                        return `
                        <tr>
                            <td><strong>CLO ${cloIndex + 1}:</strong> ${truncateText(clo, 100)}</td>
                            <td class="score-${score}">${score}/5</td>
                            <td>${reason}${score < 3 ? suggestionHtml : ''}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        detailedBreakdownMLO.appendChild(mloDetails);
    });
    
    // Add report footer
    const reportFooter = `
        <div class="report-footer">
            <button id="continue-editing-bottom-btn" class="primary-btn">
                <i class="fas fa-edit"></i> Continue Editing CLOs
            </button>
            <button id="export-report-btn" class="primary-btn">
                <i class="fas fa-file-export"></i> Export Report
            </button>
        </div>
    `;
    reportContainer.innerHTML += reportFooter;

    // Add event listeners for all export report buttons
    document.querySelectorAll('#export-report-btn, [id^="export-report-btn"]').forEach(btn => {
        // Remove existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new listener
        newBtn.addEventListener('click', function() {
            const previewWindow = window.open('', '_blank');
            const reportContent = generateExportContent(results);
            previewWindow.document.write(reportContent);
            previewWindow.document.close();
        });
    });

    // Add event listener for toggle breakdown view button
    document.querySelector('#toggle-breakdown-view-btn').addEventListener('click', function() {
        const cloBreakdown = document.getElementById('clo-breakdown');
        const mloBreakdown = document.getElementById('mlo-breakdown');
        
        if (cloBreakdown.classList.contains('active-breakdown')) {
            // Switch to MLO view
            cloBreakdown.classList.remove('active-breakdown');
            cloBreakdown.classList.add('hidden-breakdown');
            
            mloBreakdown.classList.remove('hidden-breakdown');
            mloBreakdown.classList.add('active-breakdown');
            
            this.innerHTML = '<i class="fas fa-exchange-alt"></i> Switch to CLO Breakdown View';
        } else {
            // Switch to CLO view
            mloBreakdown.classList.remove('active-breakdown');
            mloBreakdown.classList.add('hidden-breakdown');
            
            cloBreakdown.classList.remove('hidden-breakdown');
            cloBreakdown.classList.add('active-breakdown');
            
            this.innerHTML = '<i class="fas fa-exchange-alt"></i> Switch to MLO Breakdown View';
        }
    });

    // Modify the event listeners for continue editing buttons
    document.querySelectorAll('#continue-editing-btn, #continue-editing-bottom-btn').forEach(btn => {
        // Remove existing event listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new event listener with proper function binding
        newBtn.addEventListener('click', () => {
            // Show the CLO input section
            showSection('clo-input');
            
            // Pre-fill the textarea with current CLOs
            const cloTextarea = document.getElementById('clo-textarea');
            cloTextarea.value = currentCLOs.join('\n');
            
            // Update the CLO list display
            const cloList = document.getElementById('clo-list');
            cloList.innerHTML = ''; // Clear existing list
            
            // Re-add each CLO to the display
            currentCLOs.forEach((clo, index) => {
                const cloText = clo.text || clo;
                const cloItem = document.createElement('div');
                cloItem.className = 'clo-item';
                cloItem.innerHTML = `
                    <span class="clo-text">${cloText}</span>
                    <div class="clo-actions">
                        <button onclick="editCLO(${index})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteCLO(${index})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cloList.appendChild(cloItem);
            });
        });
    });

    showSection('report-section');
}

// Move the export content generation to a separate function
function generateExportContent(results) {
    const course = currentCourses[0];
    const currentDate = new Date().toISOString().split('T')[0];
    const bestMatches = results.bestMatches;
    const allPairings = results.allPairings;
    
    // Group best match results by module for organized display
    const moduleGroups = {};
    bestMatches.forEach(result => {
        const moduleCode = result.mlo.moduleCode;
        if (!moduleGroups[moduleCode]) {
            moduleGroups[moduleCode] = [];
        }
        moduleGroups[moduleCode].push(result);
    });

    // Define module order
    const moduleOrder = ['ylmlo', 'p1mlo', 'p2mlo', 'e1mlo', 'e2mlo', 'gdmlo'];
    
    // Create MLO labels array for matrix
    const mloLabels = moduleOrder.flatMap(moduleCode => {
        const moduleMLOs = currentMLOs.filter(mlo => mlo.moduleCode === moduleCode);
        return moduleMLOs.map((mlo, index) => ({
            label: `${moduleCode.toUpperCase()} ${index + 1}`,
            mlo: mlo
        }));
    });
    
    return `
        <html>
        <head>
            <title>TVTB ILO Alignment Report - ${course.ainekood}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    max-width: 1000px;
                    margin: 0 auto;
                    line-height: 1.6;
                }
                h3 { margin-top: 30px; }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
                .module-section {
                    margin-bottom: 30px;
                    page-break-inside: avoid;
                }
                .mlo-list {
                    margin: 20px 0;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                }
                .mlo-item {
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }
                .mlo-item:last-child {
                    border-bottom: none;
                }
                .section-title {
                    color: #342b60;
                    font-size: 1.5rem;
                    margin: 30px 0 15px 0;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e4067e;
                }
                .matrix-table {
                    font-size: 0.85rem;
                }
                .matrix-table th, .matrix-table td {
                    text-align: center;
                    padding: 8px;
                }
                .score-0 { background-color: #f5f5f5; color: #999; }
                .score-1 { background-color: #ffcdd2; }
                .score-2 { background-color: #ffecb3; }
                .score-3 { background-color: #fff9c4; }
                .score-4 { background-color: #c8e6c9; }
                .score-5 { background-color: #a5d6a7; }
                .clo-details {
                    background-color: #f8f9fa;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                }
                .clo-text {
                    background-color: white;
                    padding: 10px;
                    border-left: 3px solid #e4067e;
                    margin-bottom: 15px;
                }
                .matrix-description {
                    background-color: #f0f0f0;
                    padding: 10px;
                    border-radius: 4px;
                    margin: 10px 0;
                    font-style: italic;
                }
                .print-controls {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                @media print {
                    .print-controls { display: none; }
                    .matrix-table th, .matrix-table td { padding: 4px; font-size: 0.7rem; }
                }
            </style>
        </head>
        <body>
            <h1>TVTB ILO Alignment Report</h1>
            <h2>${course.ainekood} - ${course.oppeainenimetusik}</h2>
            <p><strong>Generated:</strong> ${currentDate}</p>
            
            <div class="course-info">
                <h3>Course Information</h3>
                <table>
                    <tr><td><strong>Course Code:</strong></td><td>${course.ainekood}</td></tr>
                    <tr><td><strong>Name (EN):</strong></td><td>${course.oppeainenimetusik}</td></tr>
                    <tr><td><strong>Name (ET):</strong></td><td>${course.oppeainenimetusek}</td></tr>
                    <tr><td><strong>Credits:</strong></td><td>${course.eap} EAP</td></tr>
                </table>
            </div>

            <div class="mlo-info">
                <h3>Module Learning Outcomes</h3>
                ${moduleOrder.map(moduleCode => {
                    const moduleMLOs = currentMLOs.filter(mlo => mlo.moduleCode === moduleCode);
                    if (moduleMLOs.length === 0) return '';
                    
                    return `
                        <div class="mlo-list">
                            <h4>${getModuleFullName(moduleCode)}</h4>
                            ${moduleMLOs.map((mlo, index) => `
                                <div class="mlo-item">
                                    <strong>${moduleCode.toUpperCase()} ${index + 1}:</strong> ${mlo.ilosisu}
                                </div>
                            `).join('')}
                        </div>
                    `;
                }).join('')}
            </div>

            <h3 class="section-title">Best Matches Overview</h3>
            ${moduleOrder.map(moduleCode => {
                if (!moduleGroups[moduleCode]) return '';
                const moduleResults = moduleGroups[moduleCode];
                const moduleMLOs = currentMLOs.filter(mlo => mlo.moduleCode === moduleCode);
                
                return `
                    <div class="module-section">
                        <h4>${getModuleFullName(moduleCode)}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>CLO</th>
                                    <th>Best Matching MLO</th>
                                    <th>Score</th>
                                    <th>Justification</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${moduleResults.map(result => {
                                    const mloNumber = moduleMLOs.findIndex(mlo => 
                                        mlo.ilosisu === result.mlo.ilosisu) + 1;
                                    return `
                                        <tr>
                                            <td><strong>CLO ${result.cloIndex + 1}:</strong> ${result.clo}</td>
                                            <td><strong>${moduleCode.toUpperCase()} ${mloNumber}:</strong> ${result.mlo.ilosisu}</td>
                                            <td class="score-${result.score}">${result.score}/5</td>
                                            <td>${result.reason}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }).join('')}

            <h3 class="section-title">Comprehensive Alignment Matrix</h3>
            <p class="matrix-description">This matrix shows the alignment scores between all CLOs and MLOs. Scores range from 0 (no alignment) to 5 (excellent alignment).</p>
            
            <table class="matrix-table">
                <tr>
                    <th>CLO / MLO</th>
                    ${mloLabels.map(label => `<th>${label.label}</th>`).join('')}
                </tr>
                ${currentCLOs.map((clo, cloIndex) => `
                    <tr>
                        <th>CLO ${cloIndex + 1}</th>
                        ${mloLabels.map(mloLabel => {
                            // Find the alignment score for this CLO-MLO pair
                            const pairing = allPairings.find(p => 
                                p.cloIndex === cloIndex && 
                                p.mlo.ilosisu === mloLabel.mlo.ilosisu);
                            
                            const score = pairing ? pairing.score : 0;
                            return `<td class="score-${score}">${score}</td>`;
                        }).join('')}
                    </tr>
                `).join('')}
            </table>

            <h3 class="section-title">Detailed Breakdown by CLO</h3>
            
            ${currentCLOs.map((clo, cloIndex) => `
                <div class="clo-details">
                    <h4>CLO ${cloIndex + 1}</h4>
                    <p class="clo-text">${clo}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>MLO</th>
                                <th>Score</th>
                                <th>Justification</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mloLabels.map(mloLabel => {
                                // Find the alignment score for this CLO-MLO pair
                                const pairing = allPairings.find(p => 
                                    p.cloIndex === cloIndex && 
                                    p.mlo.ilosisu === mloLabel.mlo.ilosisu);
                                
                                const score = pairing ? pairing.score : 0;
                                const reason = pairing ? pairing.reason : "No significant alignment detected.";
                                
                                // Get improvement suggestions for scores < 3
                                let suggestionHtml = '';
                                if (score < 3) {
                                    const suggestion = generateImprovementSuggestion(clo, mloLabel.mlo.ilosisu);
                                    suggestionHtml = `
                                    <div class="improvement-suggestion">
                                        <strong><i class="fas fa-lightbulb"></i> Improvement suggestions:</strong>
                                        <p>${suggestion}</p>
                                    </div>`;
                                }
                                
                                return `
                                <tr>
                                    <td><strong>${mloLabel.label}:</strong> ${truncateText(mloLabel.mlo.ilosisu, 100)}</td>
                                    <td class="score-${score}">${score}/5</td>
                                    <td>${reason}${score < 3 ? suggestionHtml : ''}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}

            <div class="print-controls">
                <button onclick="window.print()" style="margin-right: 10px;">Save as PDF/Print</button>
                <button onclick="window.close()">Close Preview</button>
            </div>
        </body>
        </html>
    `;
}

// Add the continue editing function
function continueEditing() {
    // Show the CLO input section
    const cloInputSection = document.getElementById('clo-input');
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden-section');
    });
    cloInputSection.classList.remove('hidden-section');
    
    // Pre-fill the textarea with current CLOs
    const cloTextarea = document.getElementById('clo-textarea');
    const existingCLOs = currentCLOs.map(clo => clo.text || clo).join('\n');
    cloTextarea.value = existingCLOs;
    
    // Update the CLO list display
    const cloList = document.getElementById('clo-list');
    cloList.innerHTML = ''; // Clear existing list
    
    // Re-add each CLO to the display
    currentCLOs.forEach((clo, index) => {
        const cloText = clo.text || clo;
        const cloItem = document.createElement('div');
        cloItem.className = 'clo-item';
        cloItem.innerHTML = `
            <span class="clo-text">${cloText}</span>
            <div class="clo-actions">
                <button onclick="editCLO(${index})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCLO(${index})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cloList.appendChild(cloItem);
    });
}

// Helper function to get full module names
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

// Truncate text to a certain length
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

// Toggle text display between truncated and full
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

// Show a specific section and hide others
function showSection(sectionId) {
    const keepVisible = ['course-info', 'mlo-display'];
    const homeBtn = document.getElementById('home-btn');
    
    // Always hide home button on course-input section (landing page)
    if (sectionId === 'course-input') {
        homeBtn.style.display = 'none';
    } else {
        homeBtn.style.display = 'block';
    }
    
    document.querySelectorAll('section').forEach(section => {
        if (keepVisible.includes(section.id) && !section.classList.contains('hidden-section')) {
            return;
        }
        
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

// Generate improved CLO based on MLO
function generateImprovedCLO(clo, mloText) {
    const mloKeywords = extractKeywords(mloText);
    if (mloKeywords.length > 0) {
        return `Revise the CLO to: "Develop proficiency in ${mloKeywords.join(', ')} and align with the MLO expectations."`;
    }
    return 'Revise the CLO to better align with the MLO themes and learning levels.';
}

// Email report
function emailReport(results) {
    if (confirm('This will open your Outlook. Do you want to continue?')) {
        const course = currentCourses[0];
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Create email subject
        const subject = `TVTB ILO Alignment: ${course.ainekood} ${course.oppeainenimetusik} (${currentDate})`;
        
        // Generate email body with report content
        let body = `TVTB ILO Alignment Report\n`;
        body += `${'-'.repeat(50)}\n\n`;
        
        // Course Information
        body += `Course Information:\n`;
        body += `Code: ${course.ainekood}\n`;
        body += `Name (EN): ${course.oppeainenimetusik}\n`;
        body += `Name (ET): ${course.oppeainenimetusek}\n`;
        body += `Credits: ${course.eap} EAP\n\n`;
        
        // Module Information
        const moduleCodes = [...new Set(currentCourses.map(c => c.moodlikood))];
        body += `Modules: ${moduleCodes.join(', ').toUpperCase()}\n\n`;
        
        // CLOs and Alignments
        body += `Analysis Results:\n${'-'.repeat(20)}\n\n`;
        results.forEach((result, index) => {
            body += `CLO ${result.cloIndex + 1}: ${result.clo}\n`;
            body += `Aligned with ${result.mlo.moduleCode.toUpperCase()}\n`;
            body += `Score: ${result.score}/5\n`;
            body += `Reason: ${result.reason}\n\n`;
        });
        
        body += `\nReport generated on ${currentDate}`;
        
        // Create mailto link with subject and body
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    }
}

// Load Programme data from JSON
async function loadProgrammeData() {
    try {
        const response = await fetch('data/programmes.json');
        const json = await response.json();

        // Example: Remap TVTB programme PLOs and MLOs to your flat array structure
        const tvtb = json.tvtb;
        const plos = tvtb.plos.map(plo => ({
            kategooria: 'kava',
            ilosisu: plo.plosisuik
        }));

        // Flatten MLOs (you may need to adjust this for your actual structure)
        const mlos = tvtb.mlos.map(mlo => ({
            moodlikood: mlo.mlokood ? mlo.mlokood.replace(/_/g, '') : '',
            kategooria: 'moodul',
            ilosisu: mlo.mlosisuik
        }));

        // Now use plos and mlos as your data sources
        processData([...plos, ...mlos]);
    } catch (error) {
        console.error('Error loading programme data:', error);
    }
}
