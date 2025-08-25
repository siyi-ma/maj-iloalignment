# Learning Outcomes Alignment System

## Overview

A sophisticated modular system for analyzing alignment between Programme Learning Outcomes (PLOs) and Module Learning Outcomes (MLOs), with AI-powered Course Learning Outcome (CLO) generation capabilities. Built for educational institutions requiring comprehensive curriculum quality assessment.

## � Design Standards

This system follows the **TalTech Corporate Visual Identity (CVI)** guidelines to ensure brand consistency and professional appearance. See [TalTech CVI Guide](docs/TALTECH_CVI_GUIDE.md) for complete design specifications, color palette, and typography standards.

### Key Design Elements
- **Primary Colors**: TT Burgundy (#aa1352) and TT Magenta (#e4067e)
- **Typography**: Proxima Nova with Verdana fallback
- **Cultural Heritage**: Colors reflect TalTech's cultural identity
- **Accessibility**: Maximum legibility across all applications

## �🎯 Key Features

### **Advanced Alignment Analysis**
- **Multi-dimensional scoring** combining lexical, semantic, and cognitive alignment
- **Bloom's Taxonomy integration** for cognitive level assessment  
- **Domain-specific competency mapping** for educational contexts
- **Professional TalTech CVI-compliant interface**

### **AI-Powered CLO Generation**
- Intelligent Course Learning Outcome generation from descriptions
- Manual CLO input and editing capabilities
- Comprehensive CLO-MLO alignment analysis
- Automated improvement recommendations

### **Professional Reporting**
- Interactive alignment matrices with drill-down details
- Comprehensive CSV export functionality
- Gap analysis and coverage assessment
- Quality assurance metrics and recommendations

## 🏗️ Architecture

### **Three-Page Modular System**

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   index.html        │    │   plo-mlo.html      │    │   clo-mlo.html      │
│   Programme         │───►│   PLO-MLO Analysis  │    │   CLO-MLO Analysis  │
│   Selection         │    │   & Reporting       │◄───│   & Generation     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### **Core JavaScript Modules**

```javascript
DataManager          // Programme data loading and management
AlignmentEngine      // Sophisticated alignment algorithms  
PLOMLOController     // PLO-MLO analysis functionality
CLOMLOController     // CLO-MLO analysis with AI generation
```

## 🚀 Quick Start

### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (local or production)
- `programmes.json` data file

### **Installation**

1. **Clone or download the project files**
2. **Ensure proper file structure:**
   ```
   MAJ-iloalignment/
   ├── index.html
   ├── plo-mlo.html  
   ├── clo-mlo.html
   ├── css/
   ├── js/
   ├── data/programmes.json
   └── docs/
   ```

3. **Start local server:**
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

4. **Open browser to `http://localhost:8000`**

## 🌐 GitHub Pages Deployment

This webapp is configured for automatic deployment to GitHub Pages:

### **Live Demo**
Visit the deployed application: `https://siyi-ma.github.io/maj-iloalignment/`

### **Automatic Deployment**
- ✅ Deploys automatically on push to `main` branch
- ✅ Custom GitHub Actions workflow configured
- ✅ All static files optimized for web deployment
- ✅ Secure configuration with proper `.gitignore`

### **Deployment Features**
- **Fast Loading**: Optimized static assets
- **Mobile Responsive**: Works on all devices  
- **Professional Branding**: TalTech CVI compliant
- **Error Handling**: Custom 404 page included

For detailed deployment instructions, see [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md)

## 📖 User Guide

### **1. Programme Selection (index.html)**
1. Select your study programme from available cards
2. Review programme statistics (PLOs, MLOs, categories)
3. Choose analysis path:
   - **PLO-MLO Analysis**: Comprehensive programme-module alignment
   - **CLO-MLO Analysis**: Course-module alignment with AI generation

### **2. PLO-MLO Analysis (plo-mlo.html)**
1. **Automatic Loading**: PLOs and MLOs loaded from selected programme
2. **Run Analysis**: Click "Analyze Alignment" to compute scores
3. **View Results**: 
   - Summary statistics and coverage metrics
   - Interactive alignment matrix (click cells for details)
   - Detailed breakdown with justifications
4. **Filter & Export**: Adjust threshold, toggle views, export CSV

### **3. CLO-MLO Analysis (clo-mlo.html)**
1. **Course Information**: Enter course code, name, and description
2. **CLO Generation**: 
   - **AI Generation**: Let the system create CLOs from course description
   - **Manual Input**: Enter CLOs manually
3. **Analysis**: Run CLO-MLO alignment analysis
4. **Results**: View matrix, recommendations, and export reports

## 🧠 Sophisticated Algorithms

### **Multi-Dimensional Alignment Scoring**

```javascript
overallScore = (
    keywordScore * 0.4 +      // 40% keyword overlap
    semanticScore * 0.35 +    // 35% semantic similarity  
    bloomScore * 0.25         // 25% cognitive level alignment
);
```

### **Bloom's Taxonomy Integration**

- **Level 1-6 Classification**: Remember → Create
- **Action Verb Analysis**: Comprehensive educational verb taxonomy
- **Cognitive Complexity**: Alignment scoring based on learning complexity

### **Domain-Specific Competency Mapping**

10 competency categories with specialized keyword analysis:
- Analytical, Application, Creative, Management, Communication
- Collaboration, Research, Technical, Business, International

## 📚 Documentation

### **Comprehensive Documentation Set**
- **[PROTOTYPE_ANALYSIS.md](docs/PROTOTYPE_ANALYSIS.md)**: Deep analysis of original algorithms
- **[CLEANUP_GUIDE.md](docs/CLEANUP_GUIDE.md)**: Implementation and maintenance guide
- **README.md**: This overview and user guide

### **Technical Deep-Dive**
The system preserves and enhances sophisticated algorithms from a 2170-line prototype:
- Advanced semantic analysis with educational domain expertise
- Multi-dimensional alignment scoring with weighted composites
- Professional interface design following TalTech CVI standards
- Modular architecture supporting future AI integration

## 🔧 Development

### **Project Structure**

```
MAJ-iloalignment/
├── 📄 Core Pages
│   ├── index.html              # Programme selection homepage
│   ├── plo-mlo.html           # PLO-MLO analysis interface  
│   └── clo-mlo.html           # CLO-MLO analysis with AI generation
├── 🎨 Styling
│   ├── css/shared.css         # Common styles and TalTech CVI
│   ├── css/index.css          # Homepage-specific styles
│   └── css/plo-mlo-styles.css # Analysis page styles
├── ⚙️ JavaScript Modules
│   ├── js/data-manager.js     # Programme data management
│   ├── js/alignment-engine.js # Core alignment algorithms
│   ├── js/plo-mlo.js         # PLO-MLO analysis controller
│   └── js/mlo-clo.js         # CLO-MLO analysis controller
├── 📊 Data
│   └── data/programmes.json   # Programme, PLO, and MLO data
├── 📖 Documentation
│   ├── docs/PROTOTYPE_ANALYSIS.md
│   ├── docs/CLEANUP_GUIDE.md
│   └── docs/README.md
└── 🗄️ Backup
    └── backup/                # Original prototype and references
```

## � Support

### **Resources**
- **Technical Documentation**: See `docs/` folder for comprehensive guides
- **Original Prototype**: Available in `backup/` for algorithm reference
- **Implementation Guide**: `docs/CLEANUP_GUIDE.md` for setup and maintenance

---

**Version**: 2.0  
**Last Updated**: January 2025  
**Status**: Production Ready  

*Built with ❤️ for educational excellence and quality assurance in higher education.*
- **Design**: Responsive grid layouts, TT brand colors
- **State Management**: localStorage for user preferences
- **Architecture**: Modular functions, separation of concerns

## 🎨 **Design Principles**

- **User-Centered**: Designed for educator workflows
- **Professional**: Tallinn University of Technology branding
- **Accessible**: Clear navigation and bilingual support
- **Maintainable**: Clean, documented, modular code

## 🚀 **Future Enhancements**

- Database integration for larger datasets
- User authentication and saved analyses
- PDF export functionality
- Advanced analytics and reporting
- Collaborative editing features

---

**Developed for Tallinn University of Technology's MAJ programmes**

*For detailed development insights and learning documentation, visit [`docs/`](docs/)*

add dev branch x2