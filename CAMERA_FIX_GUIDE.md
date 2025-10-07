# Camera Fix Guide for Vercel Deployment

## Issue
Camera not working on the deployed Vercel site (green-booth.vercel.app).

## ✅ Latest Fixes Applied (Oct 8, 2025)

### Enhanced Error Handling & Logging
1. **Detailed Console Logging** - Added comprehensive logging at each step:
   - `Requesting camera access...`
   - `Camera stream obtained`
   - `Video element configured`
   - `Video metadata loaded`
   - `Attempting to play video...`
   - `Video playing successfully`

2. **Improved State Management**
   - Reset camera state before starting
   - Proper cleanup of previous streams
   - Better async/await handling with promises

3. **Video Element Configuration**
   - Set properties directly: `muted`, `playsInline`, `autoplay`
   - Check if video element is ready before proceeding
   - Verify `readyState` to avoid race conditions

4. **Retry Mechanism**
   - 5-second timeout for metadata loading
   - Automatic retry if first play attempt fails
   - Fallback to simple constraints if resolution issues

5. **Better Error Messages**
   - Added `AbortError` handling
   - Added `OverconstrainedError` with automatic fallback
   - More descriptive error messages with actual error text

## 🔍 How to Debug Camera Issues

### Step 1: Open Browser Console
**This is the most important step!**

1. Open your site: https://green-booth.vercel.app
2. Right-click anywhere → **Inspect** (or press F12)
3. Click **Console** tab
4. Click **Start Camera** button
5. Watch the console messages

### What to Look For:

✅ **Success Pattern:**
```
Requesting camera access...
Camera stream obtained: MediaStream {...}
Video element configured, waiting for metadata...
Video metadata loaded
Attempting to play video...
Video playing successfully
```

❌ **Error Patterns:**

**Pattern 1: Permission Denied**
```
Error accessing camera: NotAllowedError: Permission denied
```
**Fix:** Allow camera permissions (see below)

**Pattern 2: No Camera Found**
```
Error accessing camera: NotFoundError: Requested device not found
```
**Fix:** Check if camera is connected/enabled

**Pattern 3: HTTPS Issue (shouldn't happen on Vercel)**
```
Error accessing camera: NotSupportedError
```
**Fix:** Ensure using https:// (Vercel provides this)

**Pattern 4: Camera In Use**
```
Error accessing camera: NotReadableError: Could not start video source
```
**Fix:** Close other apps using camera

**Pattern 5: Video Play Failed**
```
Error playing video: NotAllowedError
```
**Fix:** Usually means browser autoplay policy - try clicking again

### Step 2: Check Browser Permissions

#### Chrome/Edge:
1. Click the **camera icon** or **lock icon** in address bar (left of URL)
2. Find "Camera" setting
3. Change to **"Allow"**
4. Click **Reload** or refresh the page
5. Try "Start Camera" again

#### Firefox:
1. Click the **lock icon** in address bar
2. Click the arrow next to permissions
3. Find "Use the Camera"
4. Select **"Allow"**
5. Refresh and try again

#### Safari (Desktop):
1. Safari menu → **Settings** → **Websites** → **Camera**
2. Find green-booth.vercel.app
3. Set to **"Allow"**
4. Refresh the page

#### Safari (iOS):
1. Settings → **Safari** → **Camera**
2. Set to **"Allow"** or **"Ask"**
3. Refresh the page in Safari
4. Tap "Start Camera" when prompted

### Step 3: Check System Permissions

#### Windows 10/11:
1. **Settings** → **Privacy & Security** → **Camera**
2. Ensure "Camera access" is **On**
3. Ensure "Let apps access your camera" is **On**
4. Scroll down and ensure your **browser** (Chrome/Edge/Firefox) is **On**

#### macOS:
1. **System Settings** → **Privacy & Security** → **Camera**
2. Find your browser in the list
3. Toggle it **On**
4. Restart browser if needed

#### Android:
1. **Settings** → **Apps** → **Chrome** (or your browser)
2. **Permissions** → **Camera**
3. Set to **"Allow"**

#### iOS:
1. **Settings** → **Safari**
2. Scroll to **Camera**
3. Set to **"Ask"** or **"Allow"**

## Common Issues & Solutions

### Issue 1: Camera Permissions Not Granted
**Symptom:** "Please allow camera permissions" error

**Solution:**
1. Look for camera icon in browser address bar
2. Click it and select "Allow"
3. If you previously clicked "Block", you need to reset:
   - Chrome: Settings → Privacy → Site Settings → Camera → find site → Allow
   - Firefox: Click lock icon → Permissions → Camera → Allow
   - Safari: Safari → Settings → Websites → Camera → Allow

### Issue 2: Camera Already in Use
**Symptom:** "Camera is already in use" error

**Solution:**
1. Close these apps: Zoom, Teams, Discord, Skype, OBS, other video apps
2. Close other browser tabs that might use camera
3. **Windows:** Open Task Manager → End "Camera" process
4. **Mac:** Force quit camera apps
5. Restart browser

### Issue 3: Video Doesn't Play (Black Screen)
**Symptom:** Camera permission granted but video is black

**Console shows:** `Error playing video`

**Solutions:**
1. **Try clicking "Start Camera" again** - Sometimes needs a second click
2. Check console for specific error
3. Try different browser
4. Update your browser to latest version
5. Restart browser completely

### Issue 4: iOS Safari Not Working
**Symptom:** Button doesn't respond or shows error

**Solutions:**
1. **Must use Safari** - Chrome on iOS doesn't support camera well
2. Settings → Safari → Camera → "Allow"
3. Clear Safari cache: Settings → Safari → Clear History and Website Data
4. Update iOS to latest version
5. Try tapping "Start Camera" twice

### Issue 5: Works on One Device but Not Another
**Symptom:** Works on desktop but not mobile (or vice versa)

**Check:**
1. Does the device have a camera?
2. Is camera enabled in system settings?
3. Is browser updated?
4. Try different browser on that device
5. Check console logs for specific error

## Browser Compatibility

### ✅ Fully Supported:
- **Chrome** 53+ (Desktop & Android)
- **Edge** 79+ (Desktop)
- **Firefox** 36+ (Desktop & Android)
- **Safari** 11+ (Desktop & iOS)
- **Samsung Internet** 6.0+

### ⚠️ Partial Support:
- **Opera** (usually works)
- **Brave** (works but may need permission reset)

### ❌ Not Supported:
- **Internet Explorer** (all versions)
- **Instagram in-app browser** - use "Open in Safari/Chrome" instead
- **Facebook in-app browser** - use "Open in Safari/Chrome" instead
- **Very old browsers** (pre-2017)

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Site loads with HTTPS (lock icon shows in browser)
- [ ] Console shows no errors on page load
- [ ] Click "Start Camera" button
- [ ] Browser asks for camera permission
- [ ] Click "Allow" on permission prompt
- [ ] Console shows "Requesting camera access..."
- [ ] Console shows "Camera stream obtained"
- [ ] Console shows "Video playing successfully"
- [ ] Video preview appears (shows your face)
- [ ] Video is mirrored (like a selfie)
- [ ] Click "Capture Photo" to test capture
- [ ] Photo appears in preview
- [ ] Camera stops after capture

## Alternative: Use File Upload

If camera still doesn't work after trying everything:

1. Click **"Choose File"** button instead
2. Select a photo from your device
3. Upload and submit normally

This works on ALL devices and browsers!

## Technical Details (For Developers)

### What We Changed:

```javascript
// Before: Simple metadata callback
videoRef.current.onloadedmetadata = () => {
  videoRef.current.play()
}

// After: Promise-based with timeout and retry
const videoReady = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    reject(new Error('Video metadata loading timeout'));
  }, 5000);
  
  videoRef.current.onloadedmetadata = () => {
    clearTimeout(timeout);
    resolve();
  };
  
  // Check if already ready
  if (videoRef.current.readyState >= 2) {
    clearTimeout(timeout);
    resolve();
  }
});

await videoReady;
await videoRef.current.play();
```

### Key Improvements:
1. **Promise-based async handling** - Better control flow
2. **Timeout mechanism** - Don't wait forever for metadata
3. **Retry logic** - Second attempt if first fails
4. **readyState check** - Handle already-loaded video
5. **Comprehensive logging** - Easy debugging
6. **Fallback function** - Try simple constraints if complex ones fail
7. **Proper cleanup** - Dedicated stopCamera function

## Still Not Working?

### Last Resort Steps:

1. **Share Console Output:**
   - Copy ALL console messages (even if they look cryptic)
   - Include both errors (red) and regular messages (black)
   - Take a screenshot of the console

2. **Share Browser Info:**
   - What browser? (Chrome, Firefox, Safari, etc.)
   - What version? (Help → About in browser menu)
   - What device? (Windows, Mac, iPhone, Android)
   - What OS version?

3. **Try This Test Site:**
   - Go to: https://webcamtests.com/
   - If camera works there but not on Green Booth, it's a code issue
   - If camera doesn't work there either, it's a device/permission issue

4. **Nuclear Option - Reset Everything:**
   - Clear ALL browser data for green-booth.vercel.app
   - Chrome: Settings → Privacy → Clear browsing data → Site Settings → green-booth.vercel.app → Clear & reset
   - Restart browser completely
   - Restart computer
   - Try again from scratch

---

**Last Updated:** October 8, 2025  
**Version:** 2.0 with enhanced error handling and retry logic  
**Deployment:** Auto-deploys from GitHub to Vercel
