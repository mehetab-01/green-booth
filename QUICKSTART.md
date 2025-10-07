# Quick Start Guide 🚀

## Get Started in 5 Minutes

### 1. Clone & Install
```bash
git clone https://github.com/mehetab-01/green-booth.git
cd green-booth
npm install
```

Or use the setup script:
```bash
./setup.sh
```

### 2. Set Up Firebase

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "green-booth")
4. Follow the wizard to create the project

#### Enable Services
1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Google" provider
   - Save

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in production mode"
   - Select a location
   - Copy the contents of `firestore.rules` to Rules tab

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Choose "Start in production mode"
   - Copy the contents of `storage.rules` to Rules tab

#### Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon (</>) to create a web app
4. Register app with a nickname
5. Copy the `firebaseConfig` object

### 3. Configure Environment

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test the Features

#### User Flow
1. **Sign In**: Click "Sign in with Google"
2. **Capture**: Click "Open Camera" or "Upload Image"
3. **Submit**: Review and click "Upload"

#### Admin Flow
1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. View all uploaded images
3. See statistics and user information

### 6. Deploy (Optional)

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

#### Or use the Vercel dashboard:
1. Import your GitHub repository
2. Add environment variables
3. Deploy

## Common Issues

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check that your `.env.local` file has the correct Firebase configuration.

### Issue: Camera not working
**Solution**: Ensure your browser has camera permissions and you're using HTTPS in production.

### Issue: Images not uploading
**Solution**: 
1. Check Firebase Storage rules
2. Verify Firebase Storage is enabled
3. Check browser console for errors

### Issue: Build fails
**Solution**: Ensure all environment variables are set (even dummy values for build time).

## Development Tips

### Hot Reload
The app uses Next.js hot reload - just save your files and see changes instantly.

### Check Build
```bash
npm run build
```

### Run Linter
```bash
npm run lint
```

### View Firebase Data
- Images: Firebase Console → Storage → images/
- Metadata: Firebase Console → Firestore → images collection

## Need Help?

- 📚 Read the full [README.md](README.md)
- 📖 Check [IMPLEMENTATION.md](IMPLEMENTATION.md) for technical details
- 🐛 Open an issue on GitHub
- 🔥 Check [Firebase documentation](https://firebase.google.com/docs)

---

Happy coding! 🌿
