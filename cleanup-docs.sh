#!/bin/bash

# Documentation Cleanup Script
# Removes old/unnecessary MD files and organizes the project

echo "🧹 Starting documentation cleanup..."
echo ""

# Create directories
mkdir -p archived/old-docs
mkdir -p docs

# Files to KEEP (move to docs/ or keep in root)
KEEP_FILES=(
    "README.md"
    "PROJECT_SUMMARY.md"
    "INTERVIEW_PREP.md"
    "DIGITALOCEAN_DEPLOYMENT_GUIDE.md"
    "FINAL_STATUS.md"
)

# Move old/unnecessary MD files to archived
echo "📦 Archiving old documentation..."

ARCHIVE_FILES=(
    "ADMIN_ACCESS_SUMMARY.md"
    "ADMIN_DASHBOARD_DETAILS.md"
    "ALGERIA_TRANSFORMATION_SUMMARY.md"
    "AWS_DEPLOYMENT_GUIDE.md"
    "BACKEND_DEPLOYMENT.md"
    "CORS_FIX_COMPLETE.md"
    "DATABASE_MIGRATION.md"
    "DEMO_MODE_COMPLETE.md"
    "DEMO_MODE_FIX.md"
    "DEMO_MODE_GUIDE.md"
    "DEMO_MODE_SETUP.md"
    "DEPLOY_FIX_SUMMARY.md"
    "DEPLOYMENT.md"
    "DEPLOYMENT_CHECKLIST.md"
    "DEPLOYMENT_GUIDE.md"
    "DEPLOYMENT_STATUS.md"
    "DIGITALOCEAN_DEPLOYMENT.md"
    "DOCKER.md"
    "docs.md"
    "FINAL_ADMIN_SETUP.md"
    "FINAL_FIX.md"
    "FINAL_FIXES.md"
    "FIXES_SUMMARY.md"
    "FOUND_THE_BUG.md"
    "IMAGE_FIX.md"
    "IMPLEMENTATION_SUMMARY.md"
    "LOCAL_SETUP_COMPLETE.md"
    "MOBILE_RESPONSIVENESS_FIX.md"
    "NESTJS_COMPLETE_GUIDE.md"
    "NESTJS_MIGRATION_GUIDE.md"
    "NESTJS_STEP_BY_STEP.md"
    "PORTFOLIO_READY.md"
    "PORTFOLIO_SCREENSHOTS.md"
    "PORTFOLIO_SCREENSHOTS_COMPLETE.md"
    "PRODUCTS_PAGE_FIX.md"
    "QUICK_START.md"
    "RDS_POSTGRESQL_SETUP.md"
    "SUPABASE_SETUP.md"
    "SWITCH_MODES.md"
    "VERCEL_DATABASE_SETUP.md"
    "VERCEL_DEPLOYMENT.md"
    "VERCEL_ENV_SETUP.md"
    "VERCEL_FIX_COMPLETE.md"
)

count=0
for file in "${ARCHIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" "archived/old-docs/"
        echo "  ✓ Archived: $file"
        ((count++))
    fi
done

echo "📦 Archived $count old documentation files"
echo ""

# Archive old backend folders
echo "📦 Archiving old backend code..."

OLD_BACKEND_FOLDERS=(
    "server"
    "backend"
    "api"
    "db"
)

backend_count=0
for folder in "${OLD_BACKEND_FOLDERS[@]}"; do
    if [ -d "$folder" ]; then
        mv "$folder" "archived/"
        echo "  ✓ Archived: $folder/"
        ((backend_count++))
    fi
done

echo "📦 Archived $backend_count old backend folders"
echo ""

# Archive old deployment scripts
echo "📦 Archiving old deployment scripts..."

OLD_SCRIPTS=(
    "deploy.sh"
    "deploy-frontend.sh"
    "deploy-to-aws.sh"
    "deploy-to-vercel.sh"
    "setup-postgres.sh"
    "setup-rds.sh"
    "setup-vercel-env.sh"
    "start-local.sh"
    "start-postgres.sh"
    "test-rds-connection.sh"
    "migrate-db.sh"
    "check-local-db.sh"
)

script_count=0
for script in "${OLD_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        mv "$script" "archived/"
        echo "  ✓ Archived: $script"
        ((script_count++))
    fi
done

echo "📦 Archived $script_count old scripts"
echo ""

# Archive old config files
echo "📦 Archiving old config files..."

OLD_CONFIGS=(
    "vercel.json"
    "vercel-full.json"
    "ecs-task-definition.json"
    "s3-bucket-policy.json"
    "start.js"
)

config_count=0
for config in "${OLD_CONFIGS[@]}"; do
    if [ -f "$config" ]; then
        mv "$config" "archived/"
        echo "  ✓ Archived: $config"
        ((config_count++))
    fi
done

echo "📦 Archived $config_count old config files"
echo ""

# Archive old src/ and public/ if they're duplicates
if [ -d "src" ] && [ -d "client/src" ]; then
    echo "📦 Found duplicate src/ folder (client/src exists)"
    mv "src" "archived/old-src"
    echo "  ✓ Archived: src/"
fi

if [ -d "public" ] && [ -d "client/public" ]; then
    echo "📦 Found duplicate public/ folder (client/public exists)"
    mv "public" "archived/old-public"
    echo "  ✓ Archived: public/"
fi

# Create README in archived folder
cat > archived/README.md << 'EOF'
# Archived Files

This folder contains old code and documentation that's no longer actively used but kept for reference.

## Contents

- **old-docs/** - Old markdown documentation files
- **server/**, **backend/**, **api/**, **db/** - Old Express backend implementations
- Various old deployment scripts and configs

## Why Keep This?

- Historical reference
- Migration documentation
- Understanding the evolution of the project

## Should I Use This?

**No.** Use the main `nestjs-backend/` folder for current code.

These files are archived because:
- They're outdated
- They've been replaced by better implementations
- They're from previous iterations of the project

---

*Archived during project cleanup - $(date)*
EOF

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Summary:"
echo "  - Archived $count documentation files → archived/old-docs/"
echo "  - Archived $backend_count old backend folders → archived/"
echo "  - Archived $script_count old scripts → archived/"
echo "  - Archived $config_count old config files → archived/"
echo ""
echo "Current structure:"
echo "  📂 nestjs-backend/     ← Main backend (use this!)"
echo "  📂 client/             ← React frontend"
echo "  📂 docs/               ← Documentation"
echo "  📂 archived/           ← Old code (reference only)"
echo "  📂 .github/workflows/  ← CI/CD pipelines"
echo ""
echo "Essential docs remaining:"
for file in "${KEEP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    fi
done
echo ""
echo "🎉 Project is now clean and organized!"

