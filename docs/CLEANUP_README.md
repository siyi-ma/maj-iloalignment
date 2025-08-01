# 📁 Project Organization & Cleanup Guide

## ✅ Essential Files to Keep

### Core Application
- `plo-mlo-alignment.html` - Main application with AI integration
- `index.html` - Landing page
- `mlo-clo.html` - Secondary functionality
- `main.js` - Core JavaScript
- `style.css` - Styles

### AI Enhancement System
- `pytorch_free_server.py` - Production AI server
- `pytorch_free_backend.py` - Production AI engine  
- `secure_config.py` - Security configuration

### Configuration & Security
- `.env.example` - Template for environment variables (KEEP for other developers)
- `.gitignore` - Security rules
- `start_server.bat` - Windows startup script

### Data & Documentation
- `data/` folder - Programme data
- `docs/` folder - Project documentation
- `scripts/` folder - Utility scripts
- `README.md` - Main documentation

## 🗑️ Files to Remove

### Test & Development Files
- `test-matrix.html` - Test file, functionality integrated into main HTML
- `test_analysis.py` - Development testing only

### Deprecated AI Files  
- `enhanced_analysis_backend.py` - Superseded by pytorch_free_backend.py
- `enhanced_api_server.py` - Superseded by pytorch_free_server.py
- `enhanced_frontend_integration.js` - Integrated into main HTML

### Setup Scripts (Redundant)
- `quick_start.py` - Superseded by start_server.bat
- `simple_setup.py` - Redundant setup script
- `setup.py` - Not needed for this project type

### Documentation (Merge into README)
- `enhanced-analysis-plan.md` - Development planning document
- `AI_SETUP_README.md` - Merge into main README
- `API_KEY_SECURITY.md` - Merge into main README  
- `SETUP_GUIDE.md` - Merge into main README
- `VERSION_COMPARISON.md` - Development artifact
- `WINDOWS_SETUP.md` - Merge into main README

## 📁 Proposed Final Structure

```
MAJ-iloalignment/
├── 📄 Core Application
│   ├── plo-mlo-alignment.html (main app)
│   ├── index.html
│   ├── mlo-clo.html  
│   ├── main.js
│   └── style.css
│
├── 🤖 AI Enhancement  
│   ├── ai/
│   │   ├── pytorch_free_server.py
│   │   ├── pytorch_free_backend.py
│   │   └── secure_config.py
│   └── start_server.bat
│
├── 📊 Data & Config
│   ├── data/programmes.json
│   ├── .env.example
│   └── .gitignore
│
├── 📚 Documentation
│   ├── README.md (consolidated)
│   ├── docs/
│   └── scripts/
│
└── 🔧 Development
    ├── .git/
    ├── __pycache__/
    └── maj-iloalignment.code-workspace
```

## Manual Cleanup Steps

1. **Remove unnecessary files:**
   ```powershell
   Remove-Item test-matrix.html, test_analysis.py -Force
   Remove-Item enhanced_analysis_backend.py, enhanced_api_server.py -Force  
   Remove-Item enhanced_frontend_integration.js -Force
   Remove-Item quick_start.py, simple_setup.py, setup.py -Force
   Remove-Item enhanced-analysis-plan.md -Force
   Remove-Item AI_SETUP_README.md, API_KEY_SECURITY.md -Force
   Remove-Item SETUP_GUIDE.md, VERSION_COMPARISON.md, WINDOWS_SETUP.md -Force
   ```

2. **Organize AI files:**
   ```powershell
   New-Item -ItemType Directory -Path ai -Force
   Move-Item pytorch_free_server.py, pytorch_free_backend.py, secure_config.py ai/
   ```

3. **Update start_server.bat** to reference new paths:
   ```bat
   python ai\secure_config.py
   python ai\pytorch_free_server.py
   ```

This cleanup reduces the project from 25+ files to 12 essential files, making it much more maintainable!
