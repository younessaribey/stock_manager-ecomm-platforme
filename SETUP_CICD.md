# CI/CD Setup Guide - Step by Step

Complete guide to set up GitHub Actions CI/CD for your project.

---

## What You'll Get

✅ **Automatic testing** on every push
✅ **Automatic deployment** to DigitalOcean
✅ **Security scanning** for vulnerabilities
✅ **Professional workflow** that impresses interviewers

---

## Prerequisites

- [x] GitHub account
- [x] Repository on GitHub
- [x] DigitalOcean droplet (146.190.16.6)
- [x] SSH access to droplet

---

## Step 1: Push Your Code to GitHub

### If you don't have a repo yet:

```bash
cd /Users/mac/Desktop/stock_manager-ecomm-platforme

# Initialize Git (if not done)
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial project setup with NestJS backend

Complete e-commerce platform with:
- NestJS backend with 11 modules
- PostgreSQL, RabbitMQ, Redis
- Docker containerization
- CI/CD with GitHub Actions"

# Create repo on GitHub (go to github.com/new)
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/stock-manager.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up GitHub Secrets

1. **Go to your repository on GitHub**
   - https://github.com/YOUR_USERNAME/stock-manager

2. **Click Settings**

3. **Click "Secrets and variables" → "Actions"**

4. **Add these secrets** (click "New repository secret"):

### Secret 1: DIGITALOCEAN_SSH_KEY
```bash
# Get your SSH private key
cat ~/.ssh/id_rsa

# Copy the entire output (including BEGIN and END lines)
# Paste into GitHub secret value
```

**Value**: Your entire SSH private key
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAA...
-----END OPENSSH PRIVATE KEY-----
```

### Secret 2: DIGITALOCEAN_IP
**Name**: `DIGITALOCEAN_IP`
**Value**: `146.190.16.6`

### Secret 3: DIGITALOCEAN_USER
**Name**: `DIGITALOCEAN_USER`
**Value**: `root` (or your SSH username)

---

## Step 3: Test CI Pipeline

```bash
# Make any small change
echo "# CI/CD Test" >> README.md

# Commit and push
git add README.md
git commit -m "ci: test GitHub Actions pipeline"
git push origin main
```

### Watch it run:

1. Go to your repo on GitHub
2. Click **"Actions"** tab
3. See your workflow running!

**Expected**: ✅ All checks pass in 2-3 minutes

---

## Step 4: Test CD (Deploy to DigitalOcean)

### Manual Deploy (Recommended First Time):

1. Go to GitHub → **Actions** tab
2. Click **"Deploy to DigitalOcean"** on the left
3. Click **"Run workflow"** button (top right)
4. Select branch: **main**
5. Click **"Run workflow"**
6. Watch the deployment!

**Expected**: ✅ Deployment completes in 3-5 minutes

### Verify Deployment:

```bash
# Test API
curl http://146.190.16.6:3000/api/health

# Should return:
# {"status":"ok","timestamp":"2024-..."}
```

---

## Step 5: Enable Automatic Deployment (Optional)

By default, deployment is **manual** (safer).

To make it automatic on every push to `main`:

Edit `.github/workflows/deploy.yml`:

```yaml
# Change this:
on:
  workflow_dispatch:  # Manual only

# To this:
on:
  push:
    branches: [main]  # Auto-deploy on push to main
  workflow_dispatch:  # Still allow manual
```

**Warning**: Only do this if you're confident in your tests!

---

## Step 6: Create Version Tags (Best Practice)

When you have a stable version:

```bash
# Tag your current version
git tag -a v1.0.0 -m "Release version 1.0.0

Features:
- Complete NestJS backend
- 11 feature modules
- Docker deployment
- CI/CD pipeline"

# Push tag to GitHub
git push origin v1.0.0
```

**Result**: GitHub Actions will automatically deploy `v1.0.0` to production!

---

## Workflow Explained

### On Every Push to `main`:

```
1. You: git push origin main
   ↓
2. GitHub: Receives push event
   ↓
3. CI Pipeline runs:
   ├─ Install dependencies
   ├─ Run ESLint ✓
   ├─ Build TypeScript ✓
   ├─ Run tests ✓
   ├─ Build Docker ✓
   └─ Security scan ✓
   ↓
4. If all pass → ✅ Ready to deploy
   If any fail → ❌ Fix and push again
```

### Manual Deployment:

```
1. You: Click "Run workflow" on GitHub
   ↓
2. GitHub Actions:
   ├─ SSH to DigitalOcean (146.190.16.6)
   ├─ Pull latest code
   ├─ Stop old containers
   ├─ Build new images
   ├─ Start new containers
   ├─ Check health
   └─ Test API endpoint
   ↓
3. Result: ✅ Live at http://146.190.16.6:3000/api
```

---

## Troubleshooting

### CI fails with "npm install" error

**Problem**: Dependencies mismatch

**Solution**:
```bash
cd nestjs-backend
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: update package-lock.json"
git push
```

### CI fails with TypeScript errors

**Problem**: Code doesn't compile

**Solution**:
```bash
cd nestjs-backend
npm run build  # See errors
# Fix errors locally
git add .
git commit -m "fix: resolve TypeScript compilation errors"
git push
```

### Deployment fails with "Permission denied"

**Problem**: SSH key issue

**Solution**:
1. Check GitHub secret `DIGITALOCEAN_SSH_KEY` is correct
2. Test SSH manually: `ssh root@146.190.16.6`
3. Make sure key doesn't have a passphrase

### Deployment fails with "Connection refused"

**Problem**: DigitalOcean firewall blocking GitHub

**Solution**:
```bash
# SSH to droplet
ssh root@146.190.16.6

# Allow GitHub IPs (or allow all for testing)
ufw allow from any to any port 22
```

---

## Best Practices

### 1. Always Test Locally First

```bash
# Before pushing, verify locally:
cd nestjs-backend
npm run lint     # Should pass
npm run build    # Should compile
npm test         # Should pass (when tests exist)
```

### 2. Write Good Commit Messages

```bash
# Good
git commit -m "feat(products): add search by category"

# Bad
git commit -m "update"
```

See `docs/COMMIT_GUIDE.md` for details.

### 3. Use Feature Branches

```bash
# Create feature branch
git checkout -b feature/payment-integration

# Work on feature
git add .
git commit -m "feat(payments): add Stripe integration"

# Push feature branch
git push origin feature/payment-integration

# Create Pull Request on GitHub
# CI will test your PR before merging!
```

### 4. Monitor Your Builds

- Check **Actions** tab regularly
- Fix failures quickly
- Read error logs carefully

---

## Viewing Logs

### CI Logs (on GitHub):
1. Go to **Actions** tab
2. Click on workflow run
3. Click on failed job
4. Read error output

### Deployment Logs (on DigitalOcean):
```bash
# SSH to droplet
ssh root@146.190.16.6

# View API logs
cd /root/stock-manager
docker-compose -f docker-compose.prod.yml logs -f api
```

---

## Adding More Checks

### Add Test Coverage:

Edit `.github/workflows/ci.yml`:

```yaml
- name: Run tests with coverage
  run: npm run test:cov

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

### Add Performance Tests:

```yaml
- name: Load test API
  run: |
    npm install -g artillery
    artillery quick --count 10 -n 20 http://localhost:3000/api/health
```

---

## Rollback Plan

If deployment breaks production:

### Manual Rollback:

```bash
# SSH to droplet
ssh root@146.190.16.6
cd /root/stock-manager

# Checkout previous version
git log --oneline  # See commit history
git checkout <previous-commit-hash>

# Redeploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Automatic Rollback (Future):

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Rollback on failure
  if: failure()
  run: |
    ssh ${DO_USER}@${DO_IP} << 'ENDSSH'
      cd /root/stock-manager
      git checkout HEAD~1
      docker-compose -f docker-compose.prod.yml up -d --build
    ENDSSH
```

---

## Interview Talking Points

### Q: "Have you used CI/CD?"

**Answer**: "Yes, I implemented a GitHub Actions pipeline for my e-commerce project. The CI runs on every push, checking code quality with ESLint, ensuring TypeScript compiles, and running security audits. For deployment, I have a workflow that connects to my DigitalOcean droplet via SSH, pulls the latest code, rebuilds Docker containers, and verifies the API is healthy. The whole process takes about 3 minutes."

### Q: "Why did you choose GitHub Actions?"

**Answer**: "GitHub Actions is free for public repos, integrates directly with GitHub, and has a large ecosystem of actions. It's simpler than Jenkins and more flexible than Travis CI. Plus, many companies use it, so it's valuable experience."

### Q: "What happens if a build fails?"

**Answer**: "If CI fails, the deployment is blocked automatically. GitHub shows me exactly where it failed - whether it's linting, compilation, or tests. I fix the issue locally, test it, and push again. This prevents broken code from reaching production."

---

## Success!

You now have:
✅ Automatic testing on every push
✅ One-click deployment to DigitalOcean
✅ Security scanning
✅ Professional DevOps workflow

**Next**: Show it off in your interview! 🚀

---

## Quick Commands

```bash
# Test CI locally
cd nestjs-backend
npm run lint && npm run build && npm test

# Deploy to production (after pushing)
# Go to GitHub → Actions → Deploy to DigitalOcean → Run workflow

# Check deployment
curl http://146.190.16.6:3000/api/health

# View deployment logs
ssh root@146.190.16.6
docker-compose -f docker-compose.prod.yml logs -f
```

