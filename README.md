# Green Booth 🌿

A web application for capturing and sharing images related to greenery, social cleanliness, and green club events. Users can scan a QR code to access the live link, sign in via Google, and either open their camera or upload images.

## Features

- 🔐 **Google Authentication** - Secure sign-in with Google OAuth
- 📷 **Camera Capture** - Take photos directly from your device
- 📤 **Image Upload** - Upload existing images from your device
- 🔍 **QR Code Access** - Easy access via QR code scanning
- 👨‍💼 **Admin Dashboard** - View all uploaded images with user information
- 🎨 **Modern UI** - Responsive design with green-themed interface
- ☁️ **Firebase Integration** - Cloud storage and real-time database

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth with Google Provider
- **Storage**: Firebase Storage
- **Database**: Firebase Firestore
- **QR Code**: qrcode.react
- **Camera**: react-webcam

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication, Storage, and Firestore enabled

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Google Sign-In in Authentication > Sign-in method
3. Enable Firebase Storage
4. Enable Firestore Database
5. Create a web app in Project Settings and copy the configuration

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mehetab-01/green-booth.git
cd green-booth
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your Firebase configuration to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Users

1. **Access the Application**
   - Visit the URL or scan the QR code displayed on the homepage
   
2. **Sign In**
   - Click "Sign in with Google" to authenticate

3. **Capture or Upload**
   - Use "Open Camera" to take a photo directly
   - Or use "Upload Image" to select an existing image
   
4. **Submit**
   - Review your image and click "Upload" to save it

### For Admins

1. Navigate to `/admin` to view the admin dashboard
2. Sign in with Google
3. View all uploaded images with user information and timestamps
4. See statistics about total images, camera captures, and uploads

## Project Structure

```
green-booth/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── AuthButton.tsx        # Google sign-in/out button
│   ├── CameraCapture.tsx     # Camera capture component
│   ├── ImageUpload.tsx       # Image upload component
│   └── QRCodeDisplay.tsx     # QR code generator
├── lib/
│   └── firebase.ts           # Firebase configuration
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── .env.local               # Environment variables (gitignored)
├── package.json             # Dependencies
└── README.md                # This file
```

## Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /images/{imageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.

---

Made with 💚 for a greener future
