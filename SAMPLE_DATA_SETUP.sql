-- ============================================================
-- GOJO MARKETPLACE - SAMPLE DATA FOR TESTING
-- ============================================================
-- Run this SQL in Supabase SQL Editor to create test data
-- This will help verify the database is working correctly

-- ============================================================
-- 1. CREATE TEST USERS IN AUTH
-- ============================================================
-- Note: You need to create these manually in Supabase Dashboard:
-- Go to Authentication → Users → Add User
-- 
-- Test User 1 (Buyer):
--   Email: buyer@test.com
--   Password: Test123!@#
--
-- Test User 2 (Seller):
--   Email: seller@test.com
--   Password: Test123!@#
--
-- Test User 3 (Admin):
--   Email: admin@test.com
--   Password: Test123!@#

-- ============================================================
-- 2. INSERT TEST PROFILES
-- ============================================================
-- After creating auth users, get their UUIDs and insert profiles

-- Example: Replace the UUIDs with actual user IDs from auth.users
INSERT INTO profiles (id, email, full_name, phone, role, status, city, preferred_language, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'buyer@test.com', 'John Buyer', '+251911111111', 'buyer', 'active', 'Addis Ababa', 'en', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'seller@test.com', 'Jane Seller', '+251922222222', 'seller', 'active', 'Dire Dawa', 'en', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'admin@test.com', 'Admin User', '+251933333333', 'admin', 'active', 'Addis Ababa', 'en', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. INSERT TEST SELLER PROFILE
-- ============================================================
INSERT INTO seller_profiles (
  user_id, company_name, contact_person, business_email, phone,
  company_address, city, years_in_business, status, is_verified,
  joined_date, created_at, updated_at
)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
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
)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- 4. INSERT TEST CATEGORIES
-- ============================================================
INSERT INTO categories (name, name_amharic, slug, description, icon, sort_order, is_active, created_at, updated_at)
VALUES 
  ('Coffee', 'ቡና', 'coffee', 'Ethiopian coffee and coffee products', '☕', 1, true, NOW(), NOW()),
  ('Textiles', 'ጨርቅ', 'textiles', 'Traditional and modern textiles', '🧵', 2, true, NOW(), NOW()),
  ('Spices', 'ሙስ', 'spices', 'Ethiopian spices and seasonings', '🌶️', 3, true, NOW(), NOW()),
  ('Jewelry', 'ጌጣ', 'jewelry', 'Traditional and modern jewelry', '💍', 4, true, NOW(), NOW()),
  ('Fashion', 'ፋሽን', 'fashion', 'Clothing and fashion items', '👗', 5, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 5. INSERT TEST PRODUCTS
-- ============================================================
INSERT INTO products (
  seller_id, category_id, name, slug, description, price, currency,
  status, in_stock, stock_quantity, condition, brand, location, city,
  created_at, updated_at
)
SELECT 
  sp.id,
  c.id,
  'Premium Ethiopian Yirgacheffe Coffee',
  'premium-ethiopian-yirgacheffe-coffee',
  'High-quality single-origin coffee from Yirgacheffe region',
  450.00,
  'ETB',
  'approved',
  true,
  100,
  'new',
  'Ethiopian Coffee Exports',
  'Addis Ababa',
  'Addis Ababa',
  NOW(),
  NOW()
FROM seller_profiles sp
JOIN categories c ON c.slug = 'coffee'
WHERE sp.user_id = '550e8400-e29b-41d4-a716-446655440002'
LIMIT 1;

-- ============================================================
-- 6. VERIFY DATA WAS INSERTED
-- ============================================================
-- Run these queries to verify:

-- Check profiles
SELECT id, email, full_name, role, status FROM profiles ORDER BY created_at DESC LIMIT 5;

-- Check seller profiles
SELECT user_id, company_name, contact_person, status, is_verified FROM seller_profiles LIMIT 5;

-- Check categories
SELECT id, name, slug FROM categories ORDER BY sort_order;

-- Check products
SELECT p.id, p.name, p.price, p.status, sp.company_name 
FROM products p
JOIN seller_profiles sp ON p.seller_id = sp.id
LIMIT 5;

-- ============================================================
-- 7. ENABLE RLS POLICIES (if not already enabled)
-- ============================================================

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can read their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Enable RLS on seller_profiles
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for sellers to read their own profile
CREATE POLICY "Sellers can read their own profile"
ON seller_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for sellers to update their own profile
CREATE POLICY "Sellers can update their own profile"
ON seller_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy for sellers to insert their own profile
CREATE POLICY "Sellers can insert their own profile"
ON seller_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 8. TESTING INSTRUCTIONS
-- ============================================================
-- 
-- After running this SQL:
--
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Create test users:
--    - Email: buyer@test.com, Password: Test123!@#
--    - Email: seller@test.com, Password: Test123!@#
--    - Email: admin@test.com, Password: Test123!@#
--
-- 3. Copy the UUIDs of created users
-- 4. Update the INSERT statements above with the correct UUIDs
-- 5. Run the updated SQL
--
-- 6. Test login in the app:
--    - Go to http://localhost:5173
--    - Click "Sign In"
--    - Enter buyer@test.com / Test123!@#
--    - Should redirect to dashboard
--
-- 7. Check browser console for [AUTH] logs
-- 8. Verify data in Supabase Dashboard → Table Editor
