# Quick Testing Guide - Registration & Login

## Step 1: Prepare Supabase Database

### 1.1 Run Database Schema
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: **xfzewohkrgwednbqzext**
3. Click **SQL Editor** → **New Query**
4. Copy content from [`src/lib/supabase.schema.sql`](src/lib/supabase.schema.sql)
5. Paste and click **Run**
6. Wait for "Success" message

### 1.2 Enable RLS Policies
1. In SQL Editor, click **New Query**
2. Copy content from [`SAMPLE_DATA_SETUP.sql`](SAMPLE_DATA_SETUP.sql) (section 7)
3. Paste and click **Run**

### 1.3 Create Test Users
1. Go to **Authentication → Users**
2. Click **Add User**
3. Create these test users:

| Email | Password | Role |
|-------|----------|------|
| buyer@test.com | Test123!@# | Buyer |
| seller@test.com | Test123!@# | Seller |
| admin@test.com | Test123!@# | Admin |

**Important:** Copy the UUID of each created user - you'll need it for the next step.

### 1.4 Insert Test Profiles
1. In SQL Editor, click **New Query**
2. Replace the UUIDs in this SQL with your actual user IDs:

```sql
INSERT INTO profiles (id, email, full_name, phone, role, status, city, preferred_language, created_at, updated_at)
VALUES 
  ('YOUR-BUYER-UUID-HERE', 'buyer@test.com', 'John Buyer', '+251911111111', 'buyer', 'active', 'Addis Ababa', 'en', NOW(), NOW()),
  ('YOUR-SELLER-UUID-HERE', 'seller@test.com', 'Jane Seller', '+251922222222', 'seller', 'active', 'Dire Dawa', 'en', NOW(), NOW()),
  ('YOUR-ADMIN-UUID-HERE', 'admin@test.com', 'Admin User', '+251933333333', 'admin', 'active', 'Addis Ababa', 'en', NOW(), NOW());
```

3. Click **Run**

### 1.5 Insert Test Seller Profile (Optional)
```sql
INSERT INTO seller_profiles (
  user_id, company_name, contact_person, business_email, phone,
  company_address, city, years_in_business, status, is_verified,
  joined_date, created_at, updated_at
)
VALUES (
  'YOUR-SELLER-UUID-HERE',
  'Ethiopian Coffee Exports Ltd',
  'Jane Seller',
  'jane@ethiopiancoffee.com',
  '+251922222222',
  'Addis Ababa, Bole District',
  'Addis Ababa',
  5,
  'active',
  true,
  CURRENT_DATE,
  NOW(),
  NOW()
);
```

## Step 2: Test Login

### 2.1 Start Development Server
```bash
npm run dev
```

### 2.2 Open Application
- Go to `http://localhost:5173`
- Click **Sign In**

### 2.3 Test Buyer Login
1. Email: `buyer@test.com`
2. Password: `Test123!@#`
3. Click **Sign In**
4. **Expected:** Redirects to dashboard

### 2.4 Test Seller Login
1. Email: `seller@test.com`
2. Password: `Test123!@#`
3. Click **Sign In**
4. **Expected:** Redirects to seller dashboard

### 2.5 Test Admin Login
1. Email: `admin@test.com`
2. Password: `Test123!@#`
3. Click **Sign In**
4. **Expected:** Redirects to admin panel

## Step 3: Monitor Console Logs

### 3.1 Open Browser DevTools
- Press `F12` or right-click → **Inspect**

### 3.2 Go to Console Tab
- Look for messages starting with `[AUTH]`

### 3.3 Expected Log Output for Successful Login
```
[AUTH] Starting signup for: {email: "buyer@test.com", role: "buyer"}
[AUTH] Auth signup successful, user ID: xxx-xxx-xxx
[AUTH] Creating profile for user: xxx-xxx-xxx
[AUTH] Profile created successfully
[AUTH] Signup completed successfully
```

### 3.4 If You See Errors
- Check the error message in console
- Look for RLS policy violations
- Check if tables exist in Supabase

## Step 4: Verify Data Storage

### 4.1 Check Profiles Table
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **profiles** table
4. Verify your test users are there

### 4.2 Check Seller Profiles Table
1. Select **seller_profiles** table
2. Verify seller data is stored

## Step 5: Test New Registration (Optional)

### 5.1 Disable Email Verification (For Testing)
1. Go to Supabase Dashboard
2. Click **Authentication → Providers → Email**
3. Toggle **Confirm email** to **OFF**
4. Click **Save**

### 5.2 Test Buyer Registration
1. Go to `http://localhost:5173`
2. Click **Create Account**
3. Select **Buyer**
4. Fill in form:
   - Full Name: Test Buyer
   - Phone: +251911111111
   - Email: newbuyer@test.com
   - Password: Test123!@#
   - Confirm Password: Test123!@#
5. Accept terms
6. Click **Create Account**
7. **Expected:** Redirects to dashboard

### 5.3 Check Console Logs
- Look for `[AUTH]` messages
- Verify profile was created

### 5.4 Verify in Database
1. Go to Supabase Table Editor
2. Check **profiles** table
3. Verify newbuyer@test.com is there

## Troubleshooting

### Issue: "Email rate limit exceeded"
**Solution:** Wait 5-10 minutes between signup attempts, or disable email verification in Supabase Auth

### Issue: "RLS policy violation"
**Solution:** Run the RLS setup SQL from SAMPLE_DATA_SETUP.sql section 7

### Issue: "Table does not exist"
**Solution:** Run the database schema SQL from src/lib/supabase.schema.sql

### Issue: Login fails with "Invalid credentials"
**Solution:** 
- Verify user exists in Supabase Authentication → Users
- Check email and password are correct
- Verify profile exists in profiles table

### Issue: Data not appearing in database
**Solution:**
- Check browser console for [AUTH] error messages
- Verify RLS policies are enabled
- Check if profile insert is failing

## Data Storage Summary

### When User Registers as Buyer:
- ✅ Data stored in: **profiles** table
- ✅ Columns: id, email, full_name, phone, role='buyer', status='active'

### When User Registers as Seller:
- ✅ Data stored in: **profiles** + **seller_profiles** tables
- ✅ profiles: id, email, full_name, phone, role='seller', status='active'
- ✅ seller_profiles: user_id, company_name, contact_person, business_email, etc.

### When User Logs In:
- ✅ Auth verified against: **auth.users** table (Supabase managed)
- ✅ Profile loaded from: **profiles** table
- ✅ Seller data loaded from: **seller_profiles** table (if seller)
