# Quick Deployment Guide for GitHub & Vercel

This folder contains the complete, clean source code of your portfolio website, ready to be pushed to GitHub and deployed on Vercel.

---

### Step 1: Upload to GitHub

#### Option A: Using the Terminal (Recommended & Fastest)
Open your terminal, navigate to this folder, and run:

```bash
cd "/Users/spreddy/Downloads/Portfolio Website/github-portfolio-upload"

# Initialize git repository
git init

# Stage and commit all files
git add .
git commit -m "Initial commit of Siva Prasad Reddy Paleti portfolio"

# Rename branch to main
git branch -M main

# Link to your GitHub repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/paletispreddy/portfolio.git

# Push to GitHub
git push -u origin main
```

#### Option B: Upload Manually via GitHub Web Interface
1. Go to [https://github.com/new](https://github.com/new) and create a repository (e.g., `portfolio`).
2. On the new repository page, click **"uploading an existing file"**.
3. Drag and drop all the files and folders from inside this `github-portfolio-upload` folder into GitHub.
4. Click **"Commit changes"**.

---

### Step 2: Deploy Free on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account (`paletispreddy`).
2. Click **"Add New..."** → **"Project"**.
3. Under **"Import Git Repository"**, select your `portfolio` repository.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**.

In approximately 60 seconds, your site will be live with a free worldwide CDN URL (e.g., `https://portfolio-paletispreddy.vercel.app`) and automatic SSL!
Any time you push changes to your GitHub repository in the future, Vercel will automatically rebuild and update your live website.
