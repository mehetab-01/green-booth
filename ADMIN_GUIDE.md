# Admin Guide - How to Access and Download Photos

## 🔐 Admin Access Setup

### Adding Admin Emails

Only users with emails in the admin list can download all photos.

**To add yourself or other admins:**

1. Open `src/App.jsx`
2. Find the `ADMIN_EMAILS` array (around line 19)
3. Replace `'your-email@gmail.com'` with your actual email
4. Add more admin emails as needed:

```javascript
const ADMIN_EMAILS = [
  'shaaz.mehetab@gmail.com',      // Your email
  'mehetab.ali24@sakec.ac.in',         // Second admin
  'teacher@school.edu',         // Third admin
  // Add more as needed
];
```

5. Save the file
6. Redeploy to Vercel (or restart dev server)

**Important:** Use the exact email address that you sign in with Google!

## Quick Access Methods

### Method 1: Download from Web App (Easiest) ✅

**Requirements:** You must be signed in with an admin email

1. **Go to your Green Booth website**
2. **Sign in with Google** (use an email in the admin list)
3. **Click "Gallery"** in the menu bar
4. **Click "Download All"** button (blue button in the top-right)
   - If you don't see this button, you're not signed in as an admin
5. All photos will be downloaded as a ZIP file named: `green-booth-photos-YYYY-MM-DD.zip`
6. Extract the ZIP file to access all photos

**Photo naming format:** `2025-10-08_John-Doe_1.jpg`
- Date when uploaded
- Username who uploaded
- Sequential number

### Method 2: Access from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **green-booth** project
3. Click **Firestore Database** in the left menu
4. Click on **photos** collection
5. You'll see all photo documents with:
   - `imageData`: Base64 encoded image
   - `userName`: Who uploaded it
   - `userEmail`: User's email
   - `timestamp`: When it was uploaded

**To download from Firebase:**
- Click on a document
- Copy the `imageData` field
- Paste into a base64 to image converter online
- Or use the web app's download feature (Method 1)

### Method 3: Backup to Google Drive (Manual)

1. Use Method 1 to download the ZIP file
2. Go to [Google Drive](https://drive.google.com)
3. Create a folder called "Green Booth Backups"
4. Upload the ZIP file to this folder
5. Repeat periodically to keep backups

## Recommended Backup Schedule

- **Weekly**: Download photos on Fridays
- **After Events**: Download immediately after big events
- **Monthly**: Create a monthly backup archive

## Viewing Individual Photos

### From the Web App:
- Go to Gallery view
- Scroll through photos
- See who uploaded each photo
- See the upload date

### From Downloaded ZIP:
- Extract the ZIP file
- Photos are organized with clear names
- Open with any image viewer

## Sharing Photos

After downloading:
1. **Email**: Attach ZIP or individual photos
2. **Google Drive**: Share the Drive folder link
3. **Social Media**: Extract and post individual photos
4. **Print**: Take to any photo printing service

## Advanced: Automated Cloud Backup

If you want automatic backups to Google Drive, you would need to:
1. Set up Firebase Cloud Functions
2. Configure Google Drive API
3. Trigger automatic upload on new photos

This requires additional setup. For most cases, Method 1 (manual download) works perfectly fine!

## Troubleshooting

**"Download All" button not showing?**
- Make sure you're signed in with Google
- **Check that your email is in the ADMIN_EMAILS list**
- Verify you redeployed after adding your email
- Check that you're in the Gallery view
- Ensure there are photos in the database

**Download taking too long?**
- Large number of photos can take time
- Be patient, the browser will show download when ready
- Try downloading in smaller batches (future feature)

**Photos look weird?**
- They're stored as base64, which is normal
- The download converts them to proper JPG files

## Security Note

Only users whose emails are listed in `ADMIN_EMAILS` can download all photos. 

- Anyone can VIEW the gallery (even without signing in)
- This is intentional for community sharing
- Only admin emails can download the complete ZIP file
- Regular users see "Admin access required to download" message

To add yourself as admin:
1. Edit `src/App.jsx`
2. Add your email to the `ADMIN_EMAILS` array
3. Use the exact email you sign in with
4. Redeploy the app
