# ensure-main-branch.ps1
# PowerShell script to ensure we're always on the main branch when opening the project

Write-Host "🔄 Ensuring project is on main branch..." -ForegroundColor Cyan

# Check current branch
$currentBranch = git branch --show-current

if ($currentBranch -ne "main") {
    Write-Host "📍 Currently on branch: $currentBranch" -ForegroundColor Yellow
    Write-Host "🔄 Switching to main branch..." -ForegroundColor Cyan
    
    # Check if there are any uncommitted changes
    $hasChanges = git diff-index --quiet HEAD --
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  You have uncommitted changes. Please commit or stash them first." -ForegroundColor Red
        Write-Host "💡 Run: git stash save 'work in progress' to save changes" -ForegroundColor Blue
        exit 1
    }
    
    # Switch to main branch
    git checkout main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully switched to main branch" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to switch to main branch" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Already on main branch" -ForegroundColor Green
}

# Pull latest changes from remote
Write-Host "🔄 Updating main branch with latest changes..." -ForegroundColor Cyan
git pull origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Project is ready! You're on the main branch with latest changes." -ForegroundColor Green
} else {
    Write-Host "⚠️  Could not pull latest changes. You may need to check your internet connection or resolve conflicts." -ForegroundColor Yellow
}
