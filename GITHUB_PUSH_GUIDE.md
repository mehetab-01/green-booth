# 📤 Push to GitHub - Step by Step Guide

## Prerequisites
- Git installed on your computer ✅
- GitHub account (create one at https://github.com if needed)

## Step 1: Configure Git (First Time Only)

If you haven't set up Git before, run these commands in PowerShell:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Replace with your actual name and email.

## Step 2: Create Repository on GitHub

1. Go to https://github.com
2. Sign in to your account
3. Click the **"+"** icon in the top-right corner
4. Select **"New repository"**
5. Repository settings:
   - **Name**: `green-booth` (or any name you prefer)
   - **Description**: "Environmental club photo booth application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Add a README file" (we already have one)
   - **DO NOT** add .gitignore or license (we already have them)
6. Click **"Create repository"**

## Step 3: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

### In PowerShell (from your project folder):

```powershell
# Navigate to your project (if not already there)
cd "C:\Users\almeh\OneDrive\Desktop\green-booth"

# Stage all files
git add .

# Commit the files
git commit -m "Initial commit: Green Booth photo booth app"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/green-booth.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR-USERNAME`** with your actual GitHub username!

### Alternative: Using SSH (if you have SSH keys set up)

```powershell
git remote add origin git@github.com:YOUR-USERNAME/green-booth.git
git push -u origin main
```

## Step 4: Enter Credentials

When you run `git push`, you may be asked for:
- **GitHub username**
- **Personal Access Token** (not password)

### Getting a Personal Access Token:

If you need a token:
1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: "Green Booth Deploy"
4. Select scopes: Check **"repo"**
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use this token instead of a password when pushing

## Step 5: Verify Upload

After pushing:
1. Go to your repository on GitHub
2. Refresh the page
3. You should see all your files!

## Future Updates

After the initial push, to update your code:

```powershell
# Make your changes, then:
git add .
git commit -m "Description of changes"
git push
```

## Common Issues & Solutions

### Issue: "fatal: not a git repository"
**Solution:**
```powershell
git init
```

### Issue: "remote origin already exists"
**Solution:**
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/green-booth.git
```

### Issue: "Authentication failed"
**Solution:**
- Use a Personal Access Token instead of password
- Or set up SSH keys

### Issue: "refusing to merge unrelated histories"
**Solution:**
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Quick Command Reference

```powershell
# Check status
git status

# Stage files
git add .

# Commit
git commit -m "Your message"

# Push
git push

# Pull latest changes
git pull

# View remotes
git remote -v

# View commit history
git log --oneline
```

## Next: Deploy to Vercel

After pushing to GitHub:
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your `green-booth` repository
4. Click "Deploy"
5. Done! 🎉

## Need Help?

If you get stuck:
1. Copy the error message
2. Search on Google: "git [error message]"
3. Check GitHub's help: https://docs.github.com

---

**Tip:** Use GitHub Desktop (https://desktop.github.com) for a visual interface if you prefer not using command line!
