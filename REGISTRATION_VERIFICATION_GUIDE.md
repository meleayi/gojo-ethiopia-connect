# How to Verify Registration Success

## After You Click "Create Account"

### What Should Happen

1. **Form Submission** - The form data is sent to Supabase
2. **Account Creation** - Supabase creates a new user in the auth system
3. **Profile Creation** - A profile record is created in the database
4. **Redirect** - You are redirected to the dashboard
5. **Success Message** - A toast notification appears saying "Account created!"

---

## How to Know Registration Worked

### ✅ Sign 1: Success Toast Message

After clicking "Create Account", you should see a green notification at the top of the screen that says:
- **For Buyers**: "Account created! Please check your email to verify."
- **For Sellers**: "Account created! Your seller application is under review."

### ✅ Sign 2: Redirected to Dashboard

After successful registration, you should be automatically redirected to:
- **Buyers** → `/dashboard` (Buyer Dashboard)
- **Sellers** → `/seller-dashboard` (Seller Dashboard)
- **Admin** → `/admin` (Admin Dashboard)

### ✅ Sign 3: Check Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **xfzewohkrgwednbqzext**
3. Click **Authentication → Users**
4. You should see your new user email in the list

### ✅ Sign 4: Check Database

1. In Supabase, click **Table Editor**
2. Click **profiles** table
3. You should see a new row with your email and role

---

## If Registration Fails

### ❌ Error: "Cannot find module '@supabase/supabase-js'"

**This means the Supabase library is not installed**

**Solution:**
```bash
npm install @supabase/supabase-js
npm run dev
```

### ❌ Error: "RLS policy violation"

**This means the database tables don't exist or RLS policies are not configured**

**Solution:**
1. Go to Supabase SQL Editor
2. Run the complete SQL from [`SETUP_DATABASE.md`](SETUP_DATABASE.md)
3. Restart dev server

### ❌ Error: "Table does not exist"

**This means the database schema was not created**

**Solution:**
1. Go to Supabase SQL Editor
2. Click **New Query**
3. Copy entire SQL from [`SETUP_DATABASE.md`](SETUP_DATABASE.md)
4. Click **Run**
5. Restart dev server

### ❌ Error: "User already registered"

**This means the email already exists in the system**

**Solution:**
- Use a different email address
- Or delete the user from Supabase and try again

### ❌ Error: "Passwords do not match"

**This means the password and confirm password fields don't match**

**Solution:**
- Make sure both password fields have the same value
- Try again

### ❌ Error: "Please accept the terms and conditions"

**This means you didn't check the terms checkbox**

**Solution:**
- Check the "I agree to Gojo's Terms of Service and Privacy Policy" checkbox
- Click Create Account again

---

## Step-by-Step Registration Test

### Test 1: Buyer Registration

1. Open `http://localhost:5000`
2. Click **Create Account**
3. Select **Buyer** (should be selected by default)
4. Fill in:
   - Full Name: `John Doe`
   - Phone: `+251911111111`
   - Email: `john@example.com`
   - Password: `Test123!@#`
   - Confirm Password: `Test123!@#`
5. Check the terms checkbox
6. Click **Create Account**

**Expected Result:**
- Green toast: "Account created! Please check your email to verify."
- Redirected to `/dashboard`
- Can see "Welcome, John Doe" or similar greeting

### Test 2: Seller Registration

1. Click **Create Account** again
2. Select **Seller**
3. **Step 1 - Account Details:**
   - Company Name: `My Store`
   - Contact Person: `Jane Smith`
   - Business Email: `jane@mystore.com`
   - Phone: `+251922222222`
   - Password: `Test123!@#`
   - Confirm Password: `Test123!@#`
4. Click **Next**
5. **Step 2 - Business Details:**
   - Business Address: `Addis Ababa, Ethiopia`
   - Years in Business: `2`
6. Check the terms checkbox
7. Click **Create Account**

**Expected Result:**
- Green toast: "Account created! Your seller application is under review."
- Redirected to `/seller-dashboard`
- Can see seller dashboard with product management options

### Test 3: Sign In

1. Click **Sign In** (or go back to auth page)
2. Select **Buyer**
3. Enter:
   - Email: `john@example.com`
   - Password: `Test123!@#`
4. Click **Sign In**

**Expected Result:**
- Green toast: "Welcome back!"
- Redirected to `/dashboard`
- Can see your profile information

---

## Verify in Supabase

### Check Users Table

1. Go to Supabase Dashboard
2. Click **Authentication → Users**
3. You should see:
   - `john@example.com` (Buyer)
   - `jane@mystore.com` (Seller)

### Check Profiles Table

1. Click **Table Editor**
2. Click **profiles**
3. You should see rows with:
   - `john@example.com` with role `buyer`
   - `jane@mystore.com` with role `seller`

### Check Seller Profiles Table

1. Click **seller_profiles**
2. You should see a row for `jane@mystore.com` with:
   - company_name: `My Store`
   - contact_person: `Jane Smith`
   - status: `pending`
   - is_verified: `false`

---

## Browser Console Debugging

If something goes wrong, check the browser console for errors:

1. Press `F12` to open Developer Tools
2. Click **Console** tab
3. Look for error messages
4. Common errors:
   - `VITE_SUPABASE_URL is undefined` → Check `.env` file
   - `Cannot find module '@supabase/supabase-js'` → Run `npm install @supabase/supabase-js`
   - `RLS policy violation` → Run database schema SQL
   - `Table does not exist` → Run database schema SQL

---

## Network Tab Debugging

If registration seems to hang:

1. Press `F12` to open Developer Tools
2. Click **Network** tab
3. Try to register
4. Look for requests to `supabase.co`
5. Check if requests are failing (red X)
6. Click on failed request to see error details

---

## Email Verification (Optional)

If email verification is enabled:

1. After registration, check your email inbox
2. Look for email from Supabase
3. Click the verification link
4. You should see "Email verified successfully"

**Note:** For development, email verification is disabled by default. To enable it:
1. Go to Supabase → Authentication → Providers → Email
2. Toggle **Confirm email** to ON

---

## Troubleshooting Checklist

- [ ] Supabase dependency installed (`npm install @supabase/supabase-js`)
- [ ] `.env` file has correct Supabase credentials
- [ ] Database schema created (SQL executed in Supabase)
- [ ] Dev server restarted after installing dependencies
- [ ] Using correct email format (e.g., `test@example.com`)
- [ ] Password is at least 6 characters
- [ ] Passwords match in both fields
- [ ] Terms checkbox is checked
- [ ] No error messages in browser console
- [ ] Supabase project is active and accessible

---

## Still Having Issues?

1. **Check [`FINAL_SETUP_INSTRUCTIONS.md`](FINAL_SETUP_INSTRUCTIONS.md)** for complete setup
2. **Check [`AUTHENTICATION_TROUBLESHOOTING.md`](AUTHENTICATION_TROUBLESHOOTING.md)** for detailed troubleshooting
3. **Check [`SETUP_DATABASE.md`](SETUP_DATABASE.md)** for database schema
4. **Check browser console** for error messages
5. **Check Supabase logs** for backend errors

---

## Success Indicators

✅ Registration is working if:
- You see a success toast message
- You are redirected to the dashboard
- Your email appears in Supabase Users table
- Your profile appears in the profiles table
- You can sign in with your credentials
- You can see your profile information on the dashboard
