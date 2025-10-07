# Camera Fix Guide for Vercel Deployment

## Issue
Camera not working on the deployed Vercel site (green-booth.vercel.app).

## Root Cause
Browsers require **HTTPS** for camera access (`getUserMedia()` API) for security reasons. While localhost works without HTTPS, production deployments must use HTTPS.

## ✅ Good News
Vercel automatically provides HTTPS for all deployments! Your site at `https://green-booth.vercel.app` already has HTTPS enabled.

## Common Issues & Solutions

### 1. **Browser Permissions Not Granted**
**Symptom:** "Please allow camera permissions" error message

**Solution:**
- Click the camera icon in your browser's address bar
- Select "Always allow green-booth.vercel.app to access your camera"
- Refresh the page and try again

**Chrome/Edge:**
1. Click the lock/camera icon next to the URL
2. Click "Site settings"
3. Find "Camera" and set to "Allow"

**Firefox:**
1. Click the lock icon next to the URL
2. Click the arrow next to "Blocked" or "Permissions"
3. Find Camera and select "Allow"

**Safari:**
1. Go to Safari → Settings → Websites → Camera
2. Find green-booth.vercel.app and set to "Allow"

### 2. **Camera Already in Use**
**Symptom:** "Camera is already in use by another application" error

**Solution:**
- Close any other apps/tabs using the camera (Zoom, Teams, other video apps)
- Close other browser tabs that might be using the camera
- Restart your browser
- On Windows: Close Camera app from Task Manager

### 3. **No Camera Detected**
**Symptom:** "No camera found on this device" error

**Solution:**
- Check if your device has a camera
- For external cameras: ensure it's plugged in properly
- Check device manager (Windows) or system preferences (Mac) to verify camera is working
- Try the camera in another app to confirm it works

### 4. **iOS Safari Issues**
**Symptom:** Camera button doesn't work or video doesn't show

**Solution:**
- Make sure you're using Safari (Chrome on iOS doesn't support camera well)
- Check Settings → Safari → Camera and set to "Ask" or "Allow"
- Try tapping "Start Camera" twice if it doesn't work the first time
- Restart Safari if needed

### 5. **Browser Compatibility**
**Not all browsers support camera access. Recommended browsers:**
- ✅ Chrome/Edge (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (Desktop & iOS)
- ❌ Instagram/Facebook in-app browsers (use default browser instead)
- ❌ Very old browsers

## Testing Steps

1. **Verify HTTPS:**
   - Open https://green-booth.vercel.app
   - Check that the URL shows a lock icon 🔒
   - Should say "Connection is secure"

2. **Grant Permissions:**
   - Click "Start Camera"
   - Browser will ask for camera permission
   - Click "Allow"

3. **Test Camera:**
   - You should see yourself in the preview
   - Camera should mirror (like a selfie)
   - Click "Capture Photo" to test photo taking

## What Was Fixed

### Code Improvements:
1. **Added browser compatibility check** - Detects if `getUserMedia` is supported
2. **Enhanced error handling** - Better error messages for different scenarios
3. **Added fallback mechanism** - Automatic retry if metadata doesn't load
4. **Video attributes** - Added `playsinline`, `autoplay`, `muted` for better compatibility
5. **HTTPS detection** - Shows specific message if HTTPS is missing

### Updated Error Messages:
- Now shows specific guidance for each error type
- Mentions HTTPS requirement when relevant
- Better user instructions for permission issues

## Deployment Checklist

✅ HTTPS enabled (Vercel does this automatically)
✅ Camera permissions prompt working
✅ Error handling implemented
✅ Mobile compatibility (iOS Safari, Android Chrome)
✅ Video attributes for autoplay

## Still Having Issues?

### Debug Steps:
1. **Check browser console:**
   - Right-click → Inspect → Console tab
   - Look for red error messages
   - Share the error message for further help

2. **Test on different devices:**
   - Try on mobile if desktop fails (or vice versa)
   - Try a different browser

3. **Clear cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache completely

4. **Check system permissions:**
   - Windows: Settings → Privacy → Camera
   - Mac: System Preferences → Security & Privacy → Camera
   - Ensure browser has system-level camera access

## Alternative: File Upload
If camera still doesn't work, users can always use the **"Choose File"** button to upload photos directly from their device!

---

**Last Updated:** October 8, 2025
**App Version:** With enhanced camera error handling
