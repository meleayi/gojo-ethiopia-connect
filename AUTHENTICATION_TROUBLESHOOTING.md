# Authentication Troubleshooting Guide

## Issue: Sign Up and Account Creation Not Working

### Root Causes

The authentication system requires proper Supabase configuration. Here are the common issues:

## 1. Missing or Incorrect Environment Variables

### Problem
The `.env` file has incorrect or missing Supabase credentials.

### Solution

**Step 1: Get Correct Credentials from Supabase**

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your project
3. Navigate to **Settings → API**
4. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

**Step 2: Update `.env` File**

Replace the contents of `.env` with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

**Step 3: Restart Development Server**

```bash
npm run dev
```

## 2. Database Schema Not Created

### Problem
The Supabase database doesn't have the required tables for authentication.

### Solution

**Step 1: Run Database Schema**

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from [`src/lib/supabase.schema.sql`](src/lib/supabase.schema.sql)
4. Paste into the SQL editor
5. Click **Run**
6. Wait for completion (should see "Success" message)

## 3. Row Level Security (RLS) Policies Not Configured

### Problem
RLS policies prevent users from creating profiles.

### Solution

**Step 1: Check RLS Policies**

1. In Supabase, go to **Authentication → Policies**
2. Verify policies exist for:
   - `profiles` table
   - `seller_profiles` table
   - `cart_items` table
   - `wishlists` table

**Step 2: If Missing, Run RLS Setup**

In Supabase SQL Editor, run:

```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

## 4. Email Verification Not Configured

### Problem
Users can't verify their email after signup.

### Solution

**Step 1: Configure Email Provider**

1. In Supabase, go to **Authentication → Email Templates**
2. Verify email template is enabled
3. Check **SMTP Settings** if using custom email

**Step 2: For Development (Skip Email Verification)**

1. Go to **Authentication → Providers → Email**
2. Toggle **Confirm email** to OFF (for testing only)
3. Toggle back ON for production

## 5. CORS Issues

### Problem
Browser console shows CORS errors when signing up.

### Solution

**Step 1: Check CORS Settings**

1. In Supabase, go to **Settings → API**
2. Scroll to **CORS Configuration**
3. Add your development URL:
   ```
   http://localhost:5000
   http://localhost:5173
   ```

**Step 2: Restart Dev Server**

```bash
npm run dev
```

## 6. Seller Profile Creation Fails

### Problem
Seller signup completes but seller profile isn't created.

### Solution

**Step 1: Check seller_profiles Table**

In Supabase SQL Editor:

```sql
-- Check if seller_profiles table exists
SELECT * FROM seller_profiles LIMIT 1;

-- If table doesn't exist, create it
CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_email TEXT NOT NULL,
  business_license TEXT,
  company_address TEXT NOT NULL,
  city TEXT NOT NULL,
  years_in_business INTEGER,
  status TEXT DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT false,
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own seller profile
CREATE POLICY "Users can insert their own seller profile"
ON seller_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## 7. Testing Authentication Locally

### Step 1: Create Test User

1. Go to Supabase **Authentication → Users**
2. Click **Add User**
3. Email: `test@example.com`
4. Password: `Test123!@#`
5. Click **Create User**

### Step 2: Test Sign In

1. Open app at `http://localhost:5000`
2. Click **Sign In**
3. Enter test credentials
4. Should redirect to dashboard

### Step 3: Test Sign Up

1. Click **Create Account**
2. Select **Buyer**
3. Fill in form:
   - Full Name: Test User
   - Phone: +251911111111
   - Email: newuser@example.com
   - Password: Test123!@#
4. Accept terms
5. Click **Create Account**
6. Should redirect to dashboard

## 8. Check Browser Console for Errors

### Step 1: Open Developer Tools

Press `F12` or right-click → **Inspect**

### Step 2: Check Console Tab

Look for errors like:
- `VITE_SUPABASE_URL is undefined`
- `VITE_SUPABASE_PUBLISHABLE_KEY is undefined`
- `RLS policy violation`
- `Table does not exist`

### Step 3: Check Network Tab

1. Click **Network** tab
2. Try to sign up
3. Look for failed requests to Supabase
4. Check response for error messages

## 9. Common Error Messages and Solutions

### Error: "Invalid login credentials"
- **Cause**: Wrong email or password
- **Solution**: Check credentials, ensure user exists in Supabase

### Error: "User already registered"
- **Cause**: Email already exists
- **Solution**: Use different email or reset password

### Error: "RLS policy violation"
- **Cause**: RLS policies not configured correctly
- **Solution**: Run RLS setup SQL from Step 3 above

### Error: "Table does not exist"
- **Cause**: Database schema not created
- **Solution**: Run database schema from Step 2 above

### Error: "CORS error"
- **Cause**: CORS not configured
- **Solution**: Add localhost URLs to CORS settings

## 10. Complete Setup Checklist

- [ ] Supabase project created
- [ ] `.env` file has correct credentials
- [ ] Database schema created (SQL executed)
- [ ] RLS policies configured
- [ ] Email verification configured (or disabled for testing)
- [ ] CORS settings updated
- [ ] Dev server restarted
- [ ] Test user created
- [ ] Sign in works
- [ ] Sign up works

## 11. Still Having Issues?

### Check Supabase Logs

1. In Supabase, go to **Logs → Auth**
2. Look for error messages
3. Check **Logs → Database** for SQL errors

### Check Application Logs

1. Open browser console (F12)
2. Look for error messages
3. Check Network tab for failed requests

### Verify Supabase Connection

In browser console, run:

```javascript
import { supabase } from '@/lib/supabase';
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Supabase Key:', supabase.supabaseKey);
```

## 12. Production Deployment

Before deploying to production:

1. **Enable Email Verification**
   - Go to **Authentication → Providers → Email**
   - Toggle **Confirm email** to ON

2. **Configure Email Provider**
   - Set up SMTP or use Supabase email service
   - Configure email templates

3. **Update CORS Settings**
   - Add production domain
   - Remove localhost URLs

4. **Enable RLS Policies**
   - Verify all policies are in place
   - Test with production data

5. **Set Environment Variables**
   - Update `.env.production`
   - Deploy to hosting platform

## Support

For more help:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Project Issues](https://github.com/your-repo/issues)
