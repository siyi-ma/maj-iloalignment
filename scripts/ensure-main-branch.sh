#!/bin/bash
# ensure-main-branch.sh
# Script to ensure we're always on the main branch when opening the project

echo "🔄 Ensuring project is on main branch..."

# Check current branch
current_branch=$(git branch --show-current)

if [ "$current_branch" != "main" ]; then
    echo "📍 Currently on branch: $current_branch"
    echo "🔄 Switching to main branch..."
    
    # Check if there are any uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "⚠️  You have uncommitted changes. Please commit or stash them first."
        echo "💡 Run: git stash save 'work in progress' to save changes"
        exit 1
    fi
    
    # Switch to main branch
    git checkout main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully switched to main branch"
    else
        echo "❌ Failed to switch to main branch"
        exit 1
    fi
else
    echo "✅ Already on main branch"
fi

# Pull latest changes from remote
echo "🔄 Updating main branch with latest changes..."
git pull origin main

echo "🎉 Project is ready! You're on the main branch with latest changes."
