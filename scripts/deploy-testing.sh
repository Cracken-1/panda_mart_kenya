#!/bin/bash

# Panda Mart Kenya - Testing Deployment Script
# This script helps deploy the app for user testing

echo "🐼 Panda Mart Kenya - Testing Deployment"
echo "========================================"

# Check if required tools are installed
command -v git >/dev/null 2>&1 || { echo "❌ Git is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Prerequisites check passed"

# Build and test locally first
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful"

# Run type checking
echo "🔍 Running type checks..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix TypeScript errors."
    exit 1
fi

echo "✅ Type check passed"

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ .env.example file not found"
    exit 1
fi

echo "✅ Environment template found"

# Git operations
echo "📦 Preparing Git repository..."

# Add all files
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "Deploy: Testing version $(date +%Y%m%d-%H%M%S)"
fi

# Check if origin exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "📤 Pushing to GitHub..."
    git push origin main
    echo "✅ Code pushed to GitHub"
else
    echo "⚠️  No Git remote 'origin' found."
    echo "Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/panda-mart-kenya.git"
    echo "git push -u origin main"
fi

# Deployment instructions
echo ""
echo "🚀 Next Steps for Deployment:"
echo "=============================="
echo ""
echo "1. 🗄️  Setup Database (Supabase):"
echo "   - Go to https://supabase.com"
echo "   - Create new project"
echo "   - Copy connection string"
echo "   - Run DATABASE_SCHEMA.sql in SQL editor"
echo ""
echo "2. 🌐 Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import from GitHub"
echo "   - Add environment variables:"
echo "     * DATABASE_URL"
echo "     * NEXT_PUBLIC_APP_URL"
echo "     * NEXTAUTH_SECRET"
echo "     * SMTP_* variables"
echo ""
echo "3. ✉️  Setup Email (Gmail):"
echo "   - Enable 2FA on Gmail"
echo "   - Generate App Password"
echo "   - Add SMTP credentials to Vercel"
echo ""
echo "4. 🧪 Test Deployment:"
echo "   - Visit your Vercel URL"
echo "   - Test user registration"
echo "   - Verify email flow"
echo "   - Test password reset"
echo ""
echo "5. 📊 Monitor:"
echo "   - Check /api/health endpoint"
echo "   - Monitor Vercel analytics"
echo "   - Review error logs"
echo ""
echo "🎉 Ready for user testing!"
echo ""
echo "Useful commands:"
echo "- npm run db:seed    # Add sample data"
echo "- npm run db:backup  # Backup database"
echo "- vercel logs        # View deployment logs"
echo ""
echo "Need help? Check DEPLOYMENT_GUIDE.md"