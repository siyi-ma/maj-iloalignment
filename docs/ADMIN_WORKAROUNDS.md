# Admin Rights Workarounds

This document contains solutions for common development setup issues when working on a company laptop without administrator privileges.

## 🔧 Git Setup Without Admin Rights

### Problem
When trying to use Git commands in PowerShell, you get the error:
```
git : The term 'git' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

This happens because Git is installed but not added to the PowerShell PATH environment variable, and you don't have admin rights to modify system environment variables.

### Solution: PowerShell Profile Method

**Step 1: Verify Git Installation**
```powershell
Test-Path "C:\Program Files\Git\bin\git.exe"
```
Should return `True` if Git is installed.

**Step 2: Create PowerShell Profile**
```powershell
if (!(Test-Path -Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
```

**Step 3: Add Git to Profile**
```powershell
Add-Content -Path $PROFILE -Value '$env:PATH = "C:\Program Files\Git\bin;" + $env:PATH'
```

**Step 4: Test the Solution**
Close and reopen PowerShell, then test:
```powershell
git --version
git status
```

### How It Works
- Creates a PowerShell profile that automatically loads when PowerShell starts
- Adds Git's bin directory to the PATH environment variable for the current session
- No admin rights required - only affects your user profile
- Persists across VS Code restarts and system reboots

### Alternative Temporary Fix
If you need a quick one-time fix for the current session only:
```powershell
$env:PATH = "C:\Program Files\Git\bin;" + $env:PATH
```

## 🛠 Other Common Admin Workarounds

### Node.js / npm Without Admin Rights
If you need Node.js but can't install it system-wide:
1. Download Node.js portable version
2. Extract to a user directory (e.g., `C:\Users\[username]\Tools\nodejs`)
3. Add to PowerShell profile:
   ```powershell
   $env:PATH = "C:\Users\$env:USERNAME\Tools\nodejs;" + $env:PATH
   ```

### Python Packages Without Admin Rights
Use `--user` flag to install packages to user directory:
```bash
pip install --user package_name
```

### VS Code Extensions
VS Code extensions install to user directory by default, so no admin rights needed.

## 📝 PowerShell Profile Location
Your PowerShell profile is located at:
```
$PROFILE
```
Typically: `\\intra.ttu.ee\home\[username]\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`

## 🔍 Troubleshooting

### Profile Not Loading
If the profile doesn't seem to work:
1. Check execution policy:
   ```powershell
   Get-ExecutionPolicy
   ```
2. If restricted, set for current user:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Check What's in Your Profile
```powershell
Get-Content $PROFILE
```

### Edit Your Profile
```powershell
notepad $PROFILE
```

## 💡 Best Practices
- Keep all workarounds documented in this file
- Test solutions in a new PowerShell session to verify they work
- Back up your PowerShell profile before making changes
- Use version control to track profile changes

---

**Last Updated:** July 31, 2025  
**Applicable Environment:** Company laptop with restricted admin rights  
**Tested On:** Windows PowerShell 5.1, VS Code integrated terminal
