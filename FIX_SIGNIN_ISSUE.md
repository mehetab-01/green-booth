# 🔧 Fix Sign-In Issue on Vercel

## Problem
You're getting an error when clicking "Sign in with Google" on your live Vercel site.

## Solution: Add Vercel Domain to Firebase

### Step 1: Go to Firebase Console

1. Open: **https://console.firebase.google.com/**
2. Select your project: **green-booth**

### Step 2: Navigate to Authentication Settings

1. Click **Authentication** in the left sidebar
2. Click on the **Settings** tab (top menu)
3. Scroll down to **Authorized domains**

### Step 3: Add Your Vercel Domain

1. Click **Add domain**
2. Enter: `green-booth.vercel.app`
3. Click **Add**

**Note:** `localhost` should already be there for local development.

### Step 4: Test

1. Go back to: **https://green-booth.vercel.app**
2. Refresh the page
3. Click **"Sign in with Google"**
4. It should now work! ✅

## Common Errors & What They Mean

### Error: "auth/unauthorized-domain"
**Cause:** Your Vercel domain is not in Firebase authorized domains
**Fix:** Follow steps above to add `green-booth.vercel.app`

### Error: "auth/popup-blocked"
**Cause:** Browser blocked the popup window
**Fix:** Allow popups for your site in browser settings

### Error: "auth/cancelled-popup-request"
**Cause:** User closed the sign-in popup
**Fix:** Normal behavior, try signing in again

## If You Have a Custom Domain

If you later add a custom domain (like `yourdomain.com`):
1. Go to Firebase Console → Authentication → Settings
2. Add your custom domain to authorized domains
3. Both `green-booth.vercel.app` AND your custom domain need to be listed

## Verify It's Working

After adding the domain:
1. ✅ Sign in with Google
2. ✅ Go to "Home" view
3. ✅ Try to capture or upload a photo
4. ✅ Go to "Gallery" view
5. ✅ Check if "Download All" button shows (if you're an admin)

## Screenshots to Help

### Firebase Console Path:
```
Firebase Console
  └── Authentication
      └── Settings tab
          └── Authorized domains section
              └── Click "Add domain"
```

## Need More Help?

If you still see errors:
1. Open browser console (F12 or Right-click → Inspect → Console)
2. Look for error messages in red
3. Copy the error message
4. Google: "firebase auth [error message]"

---

**Important:** After adding the domain, changes take effect immediately. No need to redeploy!
