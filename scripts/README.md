# Project Scripts

This folder contains utility scripts to help maintain the project workflow.

## ensure-main-branch Scripts

These scripts ensure that whenever you open the project, you're automatically on the `main` branch with the latest changes.

### Files:
- `ensure-main-branch.ps1` - PowerShell version for Windows
- `ensure-main-branch.sh` - Bash version for Unix/Linux/macOS

### What they do:
1. ✅ Check if you're currently on the `main` branch
2. 🔄 If not, switch to `main` (after checking for uncommitted changes)
3. 📥 Pull the latest changes from `origin/main`
4. 🎉 Confirm the project is ready

### Usage:

#### Manual execution:
```powershell
# Windows PowerShell
.\scripts\ensure-main-branch.ps1

# Unix/Linux/macOS
./scripts/ensure-main-branch.sh
```

#### Automatic execution:
The VS Code workspace is configured to automatically run the appropriate script when you open the project folder.

### Safety Features:
- 🛡️ Checks for uncommitted changes before switching branches
- 📝 Provides clear instructions if you have work in progress
- ✨ Only switches if it's safe to do so

This ensures you always start your work session on the clean, up-to-date `main` branch!
