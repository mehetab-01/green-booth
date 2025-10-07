# 🔐 HOW TO ADD ADMIN EMAILS - Quick Guide

## Step 1: Open the File
Open `src/App.jsx` in your code editor

## Step 2: Find the Admin List
Look for this section (around line 19):

```javascript
// Admin emails who can download all photos - ADD YOUR EMAIL HERE
const ADMIN_EMAILS = [
  'shaaz.mehetab@gmail.com',  // Replace with your email
  // Add more admin emails below:
  // 'admin2@gmail.com',
  // 'admin3@gmail.com',
];
```

## Step 3: Add Your Email(s)
Replace the placeholder with real emails:

```javascript
const ADMIN_EMAILS = [
  'shaaz.meehtab@gmail.com',      // Main admin
  'jane.doe@example.com',      // Co-admin
  'teacher@school.edu',        // Teacher account
  // Add more as needed
];
```

## Step 4: Important Rules

✅ **DO:**
- Use the exact email you sign in with Google
- Use lowercase letters
- Include the full email with @domain.com
- Add quotes around each email
- Separate emails with commas

❌ **DON'T:**
- Forget the quotes
- Forget the comma between emails
- Use spaces or special characters
- Use emails that aren't Google accounts

## Step 5: Save and Deploy

After editing:
1. Save the file (Ctrl+S or Cmd+S)
2. Commit changes: `git add . && git commit -m "Added admin emails"`
3. Push to GitHub: `git push`
4. Vercel will auto-deploy (or redeploy manually)

## Step 6: Test

1. Go to your website
2. Sign in with an admin email
3. Click "Gallery"
4. You should see the blue "Download All" button
5. Non-admins will see "Admin access required to download"

## Examples

### Single Admin:
```javascript
const ADMIN_EMAILS = [
  'myemail@gmail.com',
];
```

### Multiple Admins:
```javascript
const ADMIN_EMAILS = [
  'admin1@gmail.com',
  'admin2@gmail.com',
  'admin3@yahoo.com',
];
```

### With Comments:
```javascript
const ADMIN_EMAILS = [
  'john@gmail.com',        // Club president
  'jane@gmail.com',        // Vice president
  'teacher@school.edu',    // Faculty advisor
];
```

## Troubleshooting

**"Download All" button not showing?**
- Check email is in the list
- Make sure you redeployed after editing
- Sign in with the exact email from the list
- Check for typos in the email
- Make sure quotes and commas are correct

**Error after editing?**
- Check for missing quotes
- Check for missing commas
- Make sure brackets `[ ]` are intact
- Check console for syntax errors

**How to remove an admin?**
- Delete their email line from the array
- Or comment it out with `//`
- Example: `// 'oldadmin@gmail.com',  // Removed`

## Security Note

⚠️ **Anyone can VIEW photos in the gallery**
🔒 **Only admins in this list can DOWNLOAD all photos**
📧 **Keep this list updated as admins change**

## Quick Copy-Paste Template

```javascript
const ADMIN_EMAILS = [
  'YOUR-EMAIL-HERE@gmail.com',
  // Add more below:
  
];
```

Replace `YOUR-EMAIL-HERE@gmail.com` with your actual email!

---

**Need more help?** Check `ADMIN_GUIDE.md` for detailed instructions.
