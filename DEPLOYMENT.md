# Vercel Deployment Guide for Green Booth

## Quick Deploy Steps

### 1. Prepare Your Project

Make sure all your changes are committed:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Method A: Vercel Dashboard (Recommended)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select your `green-booth` repository
5. Vercel will auto-detect the settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **"Deploy"**
7. Wait for deployment to complete (~2 minutes)
8. Your app will be live at: `https://your-project.vercel.app`

#### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 3. Update Firebase Settings

After deployment, you MUST update Firebase with your Vercel URL:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings**
4. Under **Authorized domains**, click **"Add domain"**
5. Add your Vercel domain: `your-app.vercel.app`
6. Click **Save**

### 4. Test Your Deployment

1. Visit your Vercel URL
2. Test Google Sign-In
3. Try uploading a photo
4. Check the Gallery
5. Test the Download All feature

## Automatic Deployments

Once connected, Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: For pull requests and other branches

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed
5. Add the custom domain to Firebase Authorized domains

## Environment Variables (If Needed)

If you want to restrict admin features:

1. In Vercel Dashboard, go to **Settings** → **Environment Variables**
2. Add: `VITE_ADMIN_EMAIL` = `your-email@gmail.com`
3. Redeploy the project

## Troubleshooting

### Camera Not Working
- Make sure you're using HTTPS (Vercel provides this automatically)
- Check browser permissions

### Sign-In Not Working
- Verify domain is added to Firebase Authorized domains
- Check Firebase Auth is enabled

### Photos Not Showing
- Check Firestore security rules
- Verify Firebase configuration in code

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- Your browser console for error messages
