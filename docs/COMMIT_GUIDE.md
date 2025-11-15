# Git Commit Message Guide

Professional commit messages help track changes and understand project history.

---

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (Required)
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style (formatting, no logic change)
- **refactor**: Code restructuring (no new features or fixes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, config)
- **ci**: CI/CD changes
- **build**: Build system changes

### Scope (Optional)
The module or area affected: `auth`, `products`, `orders`, `docker`, etc.

### Subject (Required)
- Short description (50 characters max)
- Imperative mood: "add" not "added"
- No period at the end
- Lowercase first letter

### Body (Optional)
- Detailed explanation of what and why
- Wrap at 72 characters
- Separate from subject with blank line

### Footer (Optional)
- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Closes #123`, `Fixes #456`

---

## Examples

### ✅ Good Commits

```bash
# New feature
feat(auth): add JWT refresh token support

Implemented refresh token mechanism to extend user sessions
without requiring re-authentication. Tokens expire after 7 days.

Closes #45

# Bug fix
fix(products): resolve cache invalidation on update

Fixed issue where product updates weren't reflected immediately
due to stale Redis cache. Now properly invalidates cache on PUT.

Fixes #78

# Documentation
docs: update deployment guide with SSL setup

Added step-by-step instructions for Let's Encrypt SSL
certificate installation on DigitalOcean droplet.

# Refactoring
refactor(orders): extract order validation to separate service

Moved order validation logic from controller to dedicated
validator service for better testability and reusability.

# Performance
perf(products): add database query optimization

Added proper indexes on categoryId and status columns.
Reduced query time from 150ms to 15ms for product listing.

# Build/CI
ci: add GitHub Actions workflow for automated testing

Configured CI pipeline to run linting, tests, and Docker
build on every push to main branch.

# Chore
chore(deps): update NestJS to v10.3.0

Updated core NestJS packages and fixed breaking changes
in TypeORM configuration.
```

### ❌ Bad Commits

```bash
# Too vague
"fixed stuff"
"updates"
"WIP"

# Not descriptive
"fix bug"
"update code"

# Past tense
"added feature"
"fixed issue"

# No type
"authentication improvements"
```

---

## Commit Workflow

### 1. Stage Your Changes
```bash
# Stage specific files
git add nestjs-backend/src/auth/auth.service.ts

# Stage all changes in a directory
git add nestjs-backend/src/auth/

# Stage all changes (be careful!)
git add .
```

### 2. Check What's Staged
```bash
git status
git diff --staged
```

### 3. Write Commit Message
```bash
# Simple commit
git commit -m "feat(auth): add JWT authentication"

# Detailed commit (opens editor)
git commit

# In editor, write:
feat(auth): add JWT authentication

Implemented JWT-based authentication with bcrypt password
hashing. Users can register, login, and access protected
routes using bearer tokens.

- Added JWT strategy with Passport
- Created auth guards for route protection
- Implemented role-based access control

Closes #12
```

### 4. Push to Remote
```bash
# Push to main branch
git push origin main

# Push to feature branch
git push origin feature/user-authentication

# Force push (use with caution!)
git push --force origin main
```

---

## Branch Naming Convention

```bash
# Feature branches
feature/user-authentication
feature/product-search
feature/order-notifications

# Bug fix branches
fix/cart-quantity-bug
fix/login-redirect-issue

# Hotfix branches (urgent production fixes)
hotfix/payment-gateway-down
hotfix/security-vulnerability

# Release branches
release/v1.0.0
release/v2.1.0

# Development branch
develop
```

---

## Common Scenarios

### Scenario 1: Completed a Module
```bash
git add nestjs-backend/src/categories/
git commit -m "feat(categories): implement category management module

Added complete CRUD operations for product categories:
- Service layer with business logic
- Controller with REST endpoints
- DTOs for validation
- Admin-only access guards

Closes #23"
git push origin main
```

### Scenario 2: Fixed a Bug
```bash
git add nestjs-backend/src/products/products.service.ts
git commit -m "fix(products): resolve null reference in findOne method

Added proper null check before accessing product properties.
Prevents server crash when product doesn't exist.

Fixes #67"
git push origin main
```

### Scenario 3: Updated Documentation
```bash
git add README.md INTERVIEW_PREP.md
git commit -m "docs: update README with deployment instructions

Added comprehensive deployment guide for DigitalOcean setup
including Docker, SSL, and firewall configuration."
git push origin main
```

### Scenario 4: Multiple Related Changes
```bash
git add nestjs-backend/
git commit -m "refactor: improve error handling across all modules

Standardized error responses with global exception filter.
All modules now return consistent error format with proper
HTTP status codes.

Changes:
- Added HttpExceptionFilter
- Updated all controllers to use standard exceptions
- Improved error logging

BREAKING CHANGE: Error response format has changed"
git push origin main
```

---

## Before Pushing Checklist

- [ ] Code compiles: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] Tests pass: `npm test` (when available)
- [ ] No sensitive data (passwords, API keys)
- [ ] Commit message follows convention
- [ ] Changes are related (one logical change per commit)

---

## Amending Commits

### Forgot to add a file?
```bash
git add forgotten-file.ts
git commit --amend --no-edit
```

### Wrong commit message?
```bash
git commit --amend -m "correct commit message"
```

### Need to change last commit?
```bash
git add changes.ts
git commit --amend
# Edit message in editor, save and exit
```

**⚠️ Warning**: Only amend commits that haven't been pushed yet!

---

## Viewing History

```bash
# See commit history
git log

# Pretty format
git log --oneline --graph --decorate

# Last 5 commits
git log -5

# Commits by author
git log --author="Your Name"

# Commits affecting specific file
git log -- nestjs-backend/src/auth/auth.service.ts
```

---

## Useful Aliases

Add to `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    cm = commit -m
    unstage = reset HEAD --
    last = log -1 HEAD
    lg = log --oneline --graph --decorate --all
    amend = commit --amend --no-edit
```

Usage:
```bash
git st          # instead of git status
git cm "message" # instead of git commit -m "message"
git lg          # pretty log
```

---

## Summary

**Good commits**:
- Follow the convention
- Are descriptive and clear
- Reference issues when applicable
- Explain the "why" not just the "what"

**This helps**:
- Team collaboration
- Code reviews
- Debugging history
- Release notes
- Your interview discussions!

---

Remember: Your commit history shows your professionalism and attention to detail. Make it count! 📝

