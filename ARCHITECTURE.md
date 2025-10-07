# Green Booth - Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         GREEN BOOTH                              │
│              Live Photo Booth for Green Events                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

    1. ACCESS                2. AUTHENTICATE        3. CAPTURE
    
    [QR Code] ──or──>       [Google Sign-In]       [Camera]
    [Direct URL]              ↓                      ↓
         ↓                [Firebase Auth]        [Webcam API]
    [Landing Page]            ↓                      ↓
                         [Authorized]            [Preview]
                              ↓                      ↓
                              └─────────┬───────────┘
                                        ↓
    4. UPLOAD                      [Submit]
    
    [File Picker]                    ↓
         ↓                    [Firebase Storage]
    [Preview]                        ↓
         ↓                    [Firestore Metadata]
    [Submit] ────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION STRUCTURE                         │
└─────────────────────────────────────────────────────────────────┘

Frontend (Next.js + TypeScript)
│
├── app/
│   ├── page.tsx              → Main landing/booth page
│   │   ├── Shows QR code when not authenticated
│   │   ├── Shows camera/upload when authenticated
│   │   └── Green-themed responsive UI
│   │
│   ├── admin/
│   │   └── page.tsx          → Admin dashboard
│   │       ├── View all images
│   │       ├── Statistics
│   │       └── User information
│   │
│   ├── layout.tsx            → Root layout & metadata
│   └── globals.css           → Global styles (Tailwind)
│
├── components/
│   ├── AuthButton.tsx        → Google sign-in/out
│   ├── CameraCapture.tsx     → Camera functionality
│   ├── ImageUpload.tsx       → File upload
│   └── QRCodeDisplay.tsx     → QR code generator
│
└── lib/
    └── firebase.ts           → Firebase configuration


Backend Services (Firebase)
│
├── Authentication
│   └── Google OAuth Provider
│       └── Manages user sessions
│
├── Storage
│   └── images/{userId}/{timestamp}
│       └── Stores image files
│
└── Firestore
    └── images/ collection
        └── Document per image with:
            ├── userId
            ├── userEmail
            ├── userName
            ├── imageUrl
            ├── timestamp
            └── type (camera/upload)


┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                 │
└─────────────────────────────────────────────────────────────────┘

User Action             │  Frontend                │  Backend
────────────────────────┼──────────────────────────┼───────────────
                        │                          │
Scan QR Code           →│  Load Landing Page       │
                        │                          │
Click "Sign In"        →│  signInWithPopup()      →│  Firebase Auth
                        │  ← User object          ←│  Verify & Token
                        │                          │
Open Camera            →│  Webcam Component        │
Capture Photo          →│  getScreenshot()         │
                        │  Show Preview            │
                        │                          │
Click Upload           →│  Convert to Blob        →│  Storage Upload
                        │  uploadBytes()          →│  Get Download URL
                        │  addDoc()               →│  Save Metadata
                        │  ← Success             ←│  Confirm Save
                        │                          │
Visit /admin           →│  Load Admin Page         │
                        │  getDocs()              →│  Query Firestore
                        │  ← Image List          ←│  Return Documents
                        │  Display Grid           │


┌─────────────────────────────────────────────────────────────────┐
│                       SECURITY MODEL                             │
└─────────────────────────────────────────────────────────────────┘

Authentication:
  ✓ All actions require Google sign-in
  ✓ Firebase handles session management
  ✓ Secure token-based authentication

Storage Rules:
  ✓ Users can only write to their own folder
  ✓ All authenticated users can read images
  ✓ Path: images/{userId}/{imageId}

Firestore Rules:
  ✓ Users can only create images with their userId
  ✓ All authenticated users can read images
  ✓ Users can update/delete their own images


┌─────────────────────────────────────────────────────────────────┐
│                         KEY FEATURES                             │
└─────────────────────────────────────────────────────────────────┘

User Features:
  📸 Real-time camera capture with preview
  📤 File upload with preview
  🔐 Secure Google authentication
  📱 QR code for easy mobile access
  🎨 Modern, responsive green UI
  ✅ Upload confirmation

Admin Features:
  📊 Statistics dashboard
  🖼️  Grid view of all images
  👤 User information display
  🕐 Timestamp tracking
  🏷️  Type indicators (camera/upload)


┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                            │
└─────────────────────────────────────────────────────────────────┘

Frontend:
  • Next.js 15 (React Framework)
  • TypeScript (Type Safety)
  • Tailwind CSS (Styling)
  • react-webcam (Camera Access)
  • qrcode (QR Generation)

Backend:
  • Firebase Authentication
  • Firebase Storage
  • Firebase Firestore

Build Tools:
  • ESLint (Linting)
  • TypeScript Compiler
  • Next.js Compiler


┌─────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT                               │
└─────────────────────────────────────────────────────────────────┘

Recommended: Vercel
  1. Import GitHub repository
  2. Add environment variables
  3. Deploy automatically

Also supports:
  • Netlify
  • AWS Amplify
  • Google Cloud Run
  • Docker deployment
  • Any Node.js host


┌─────────────────────────────────────────────────────────────────┐
│                      GETTING STARTED                             │
└─────────────────────────────────────────────────────────────────┘

Quick Start:
  1. Clone repository
  2. Run setup.sh or npm install
  3. Configure Firebase
  4. Add .env.local with Firebase config
  5. Run npm run dev
  6. Open http://localhost:3000

See QUICKSTART.md for detailed instructions!
```
