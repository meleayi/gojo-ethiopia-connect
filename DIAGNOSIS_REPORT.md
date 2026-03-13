# Registration & Email Rate Limit Issue - Diagnosis Report

## Problem Summary
Users are experiencing "email rate limit exceeded" errors during registration, and data may not be storing correctly in the database.

## Root Cause Analysis

### 5-7 Possible Sources Identified:

1. **Missing Profile Auto-Creation Trigger** ⚠️ **MOST LIKELY**
   - When `supabase.auth.signUp()` is called, it creates an auth.users entry
   - The `profiles` table is NOT automatically populated
   - Current code doesn't explicitly create a profile entry
   - This causes RLS policy violations when trying to insert seller_profiles

2. **Email Rate Limiting from Supabase Auth** ⚠️ **MOST LIKELY**
   - Supabase has built-in rate limits (typically 5-10 requests/minute per IP)
   - Each signup attempt triggers a verification email
   - Rapid successive attempts trigger the rate limit
   - This is a Supabase Auth service limit, not application code

3. **RLS Policy Violations**
   - If profiles table doesn't have proper INSERT policies
   - Seller profile creation fails silently
   - User sees success but data isn't stored

4. **Missing Foreign Key Constraint**
   - seller_profiles.user_id references profiles.id
   - If profile doesn't exist, insert fails

5. **Database Connection Issues**
   - Credentials may be incorrect
   - Network connectivity problems
   - Supabase project may be paused

6. **Email Verification Configuration**
   - Email confirmation may be required but not configured
   - Blocks user from completing registration

7. **CORS Configuration**
   - Missing localhost URLs in CORS settings
   - Prevents API calls from browser

## Diagnosis Findings

### Current Code Issues:
- ❌ **No explicit profile creation** - The signUp function doesn't insert into profiles table
- ❌ **No error handling for profile creation** - Seller profile insert may fail silently
- ❌ **No logging** - Can't see what's happening during signup

### Database Schema Status:
- ✅ Tables exist (profiles, seller_profiles, categories, etc.)
- ✅ Foreign key constraints are in place
- ⚠️ RLS policies may not be configured correctly

## Solutions Implemented

### 1. Added Explicit Profile Creation
The signUp function now:
- Creates auth.users entry via `supabase.auth.signUp()`
- **Explicitly inserts into profiles table** with user data
- Then creates seller_profiles if role is "seller"
- Returns proper error if any step fails

### 2. Added Comprehensive Logging
All steps now log to console with `[AUTH]` prefix:
```
[AUTH] Starting signup for: {email, role}
[AUTH] Auth signup successful, user ID: xxx
[AUTH] Creating profile for user: xxx
[AUTH] Profile created successfully
[AUTH] Creating seller profile for user: xxx
[AUTH] Seller profile created successfully
[AUTH] Signup completed successfully
```

### 3. Error Handling
Each step has try-catch with detailed error logging:
- Auth signup errors
- Profile creation errors
- Seller profile creation errors
- Unexpected exceptions

## Next Steps to Verify

### Step 1: Check Supabase RLS Policies
Run in Supabase SQL Editor:
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('profiles', 'seller_profiles');

-- Check existing policies
SELECT * FROM pg_policies 
WHERE tablename IN ('profiles', 'seller_profiles');
```

### Step 2: Verify Database Connectivity
Test connection with provided credentials:
```
Host: db.xfzewohkrgwednbqzext.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: khqcu6hEFeCofcXN
```

### Step 3: Check Email Rate Limiting
- Wait 5-10 minutes between signup attempts
- Or disable email verification in Supabase Auth for testing:
  - Go to Authentication → Providers → Email
  - Toggle "Confirm email" to OFF

### Step 4: Monitor Console Logs
When testing signup:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for `[AUTH]` prefixed messages
4. Check for error messages

## Data Storage Flow (After Fix)

### For Buyer Registration:
1. User submits form with email, password, fullName, phone
2. `supabase.auth.signUp()` creates auth.users entry
3. **NEW:** `profiles` table INSERT creates user profile
4. User redirected to dashboard
5. Data stored in: **profiles table only**

### For Seller Registration:
1. User submits form with company details
2. `supabase.auth.signUp()` creates auth.users entry
3. **NEW:** `profiles` table INSERT creates user profile
4. `seller_profiles` table INSERT creates seller details
5. User redirected to seller dashboard
6. Data stored in: **profiles + seller_profiles tables**

## Tables Involved

| Table | Buyer | Seller | Admin | Data Stored |
|-------|-------|--------|-------|------------|
| **profiles** | ✅ | ✅ | ✅ | email, full_name, phone, role, status |
| **seller_profiles** | ❌ | ✅ | ❌ | company_name, contact_person, business_email, etc. |
| **auth.users** | ✅ | ✅ | ✅ | email, password_hash (Supabase managed) |

## Confirmation Needed

Before proceeding with full fix, please confirm:

1. **Database Schema**: Have you run the SQL schema in Supabase SQL Editor?
2. **RLS Policies**: Are RLS policies configured for profiles and seller_profiles tables?
3. **Email Verification**: Is email verification enabled or disabled in Supabase Auth?
4. **Rate Limiting**: Are you waiting between signup attempts?

Once confirmed, the enhanced logging will help identify the exact failure point.
