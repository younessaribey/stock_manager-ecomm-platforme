#!/bin/bash

# Script to check if any private/local guide files were accidentally committed
# Run this before pushing to ensure clean commit history

echo "🔍 Checking commits for private/local guide files..."
echo ""

# Files that should NOT be in commits (private/personal)
PRIVATE_PATTERNS=(
  "INTERVIEW"
  "COMPLETE_EXPLANATION"
  "START_HERE"
  "ALL_DONE"
  "_READY.md"
  "LEARNING_JOURNAL"
  "notes/"
  ".local"
  "my-notes"
  "personal"
  "private"
)

# Check last 20 commits
FOUND_ISSUES=0

for pattern in "${PRIVATE_PATTERNS[@]}"; do
  echo "Checking for: $pattern"
  
  # Search in commit messages and file names
  RESULTS=$(git log --all -20 --name-only --pretty=format:"%h %s" | grep -i "$pattern" || true)
  
  if [ ! -z "$RESULTS" ]; then
    echo "⚠️  Found matches for '$pattern':"
    echo "$RESULTS"
    echo ""
    FOUND_ISSUES=1
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $FOUND_ISSUES -eq 0 ]; then
  echo "✅ No private/local guide files found in recent commits!"
  echo "✅ Safe to push to GitHub"
  exit 0
else
  echo "⚠️  Warning: Found potential private files in commit history"
  echo ""
  echo "📝 These files are tracked in .gitignore for future commits:"
  echo "   - INTERVIEW*.md"
  echo "   - COMPLETE_EXPLANATION.md"
  echo "   - START_HERE.md"
  echo "   - ALL_DONE.md"
  echo "   - *_READY.md"
  echo "   - LEARNING_JOURNAL.md"
  echo "   - notes/**"
  echo ""
  echo "💡 If these files are already committed, they're in history."
  echo "   To remove them from history (advanced):"
  echo "   git filter-branch --index-filter 'git rm --cached --ignore-unmatch <file>' HEAD"
  echo ""
  echo "   Or use BFG Repo-Cleaner for large repos:"
  echo "   https://rtyley.github.io/bfg-repo-cleaner/"
  exit 1
fi

