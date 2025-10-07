# Green Booth

An environmental club photo booth application built with React, Vite, Tailwind CSS, and Firebase.

## Features

- 📸 Capture photos using device camera
- 📁 Upload photos from device
- 🔐 Google authentication
- ☁️ Store photos in Firestore
- 👤 User profile display
- 🎨 Modern, eco-friendly UI design
- 📱 Fully responsive
- 📥 **Download all photos as ZIP** (admin-only feature)
- 🔐 Admin email whitelist for download access
- 🖼️ Public gallery accessible to everyone

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Google** as a sign-in provider
   - Add your authorized domain (localhost is pre-authorized for development)
4. Create a **Firestore Database** (start in test mode for development)
5. Get your Firebase configuration from Project Settings
6. Replace the configuration in `src/App.jsx`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"

### Important: Update Firebase Auth Domain

After deploying to Vercel, add your Vercel domain to Firebase:

1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", add your Vercel domain (e.g., `your-app.vercel.app`)

## Admin Features - Download Photos

### Setup Admin Access

Before you can download photos, add your email to the admin list:

1. Open `src/App.jsx`
2. Find the `ADMIN_EMAILS` array (around line 19)
3. Replace `'your-email@gmail.com'` with your actual Google email
4. Add more admin emails if needed:

```javascript
const ADMIN_EMAILS = [
  'your-email@gmail.com',
  'admin2@example.com',
  // Add more emails here
];
```

5. Save and redeploy

### As an Admin (Email in whitelist):

1. **View Gallery**: Click the "Gallery" button in the menu
2. **Download All Photos**: Click the "Download All" button (only visible to admins)
   - Downloads all photos as a ZIP file
   - Filenames include date and username: `2025-10-08_John-Doe_1.jpg`
   - Only works if your email is in the `ADMIN_EMAILS` list

### Alternative: Export from Firebase

If you need the original data from Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Firestore Database
3. Click on "photos" collection
4. Use the export feature or Cloud Functions to export data

### Backing Up to Google Drive (Manual Method):

1. Sign in to your Green Booth app
2. Go to Gallery
3. Click "Download All"
4. Upload the downloaded ZIP to your Google Drive

### Automatic Backup (Advanced - Optional):

You can set up Firebase Cloud Functions to automatically backup photos to Google Drive:
- Use Firebase Cloud Functions
- Trigger on new photo upload
- Upload to Google Drive using Google Drive API

See [Firebase Cloud Functions](https://firebase.google.com/docs/functions) and [Google Drive API](https://developers.google.com/drive) documentation.

## Firebase Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photos/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Firebase** - Authentication and database
- **Firestore** - Cloud database for storing photos

## License

MIT
