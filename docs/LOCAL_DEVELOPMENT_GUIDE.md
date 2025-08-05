# Local Development Guide

This guide provides instructions for setting up and running the MAJ ILO Alignment Tool locally.

## Quick Start - Starting Local Server

### Method 1: Python HTTP Server (Recommended)
This is the simplest and most reliable method since Python is usually pre-installed.

1. Open PowerShell or Command Prompt
2. Navigate to the project directory:
   ```powershell
   cd "c:\Users\siyi.ma\OneDrive - Tallinna Tehnikaülikool\YouWare\MAJ-iloalignment"
   ```
3. Start the server:
   ```powershell
   python -m http.server 8000
   ```
4. Open your browser and go to: **http://localhost:8000**

### Method 2: Node.js HTTP Server
If you have Node.js installed:

1. Navigate to the project directory
2. Run:
   ```powershell
   npx http-server -p 8000
   ```
3. Access at: **http://localhost:8000**

### Method 3: VS Code Live Server Extension
If you have the Live Server extension installed:

1. Right-click on `index.html` in VS Code
2. Select "Open with Live Server"
3. The page will open automatically (usually on port 5500)

## Project Structure

The main entry points are:
- `index.html` - Main landing page with programme selection
- `plo-mlo.html` - Programme-Module Learning Outcomes alignment analysis
- `clo-mlo.html` - Course-Module Learning Outcomes alignment analysis

## Important Notes

- **Always use a local server**: Don't open HTML files directly in the browser (file:// protocol) as this will cause CORS issues when loading JSON data
- **Default port**: The guide uses port 8000, but you can use any available port
- **Data files**: The application loads programme data from `data/programmes.json`
- **CSS and JS**: Make sure all CSS files in the `css/` folder and JavaScript files in the `js/` folder are accessible

## Troubleshooting

### Server won't start
- Check if port 8000 is already in use
- Try a different port: `python -m http.server 8080`
- Make sure you're in the correct directory

### Page loads but data doesn't appear
- Check browser console for errors (F12)
- Verify that `data/programmes.json` exists and is valid JSON
- Ensure the server is serving files correctly

### CSS/JS not loading
- Check that file paths are correct
- Verify files exist in their respective folders
- Check browser network tab for 404 errors

## Development Workflow

1. Start the local server using Method 1 above
2. Make changes to HTML, CSS, or JS files
3. Refresh the browser to see changes
4. Use browser developer tools (F12) for debugging

## File Organization

```
MAJ-iloalignment/
├── index.html              # Main entry point
├── plo-mlo.html            # PLO-MLO analysis page
├── clo-mlo.html            # CLO-MLO analysis page
├── css/                    # Stylesheets
│   ├── shared.css          # Common styles
│   ├── index.css           # Homepage styles
│   └── ...
├── js/                     # JavaScript files
│   ├── data-manager.js     # Data management
│   ├── shared.js           # Common utilities
│   └── ...
├── data/                   # Data files
│   └── programmes.json     # Programme information
└── docs/                   # Documentation
    └── LOCAL_DEVELOPMENT_GUIDE.md  # This file
```

## Quick Commands Reference

```powershell
# Navigate to project
cd "c:\Users\siyi.ma\OneDrive - Tallinna Tehnikaülikool\YouWare\MAJ-iloalignment"

# Start server on port 8000
python -m http.server 8000

# Start server on different port
python -m http.server 8080

# Alternative with Node.js
npx http-server -p 8000
```

## Access URLs

Once the server is running:
- Main page: http://localhost:8000
- PLO-MLO Analysis: http://localhost:8000/plo-mlo.html
- CLO-MLO Analysis: http://localhost:8000/clo-mlo.html

---

**Last Updated**: August 5, 2025
**Author**: Generated for Siyi Ma - TalTech MAJ ILO Alignment Project
