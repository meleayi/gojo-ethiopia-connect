# Gojo Ethiopia Connect - Installation & Setup Guide

## ⚠️ CRITICAL: Install Supabase Dependency

The project requires `@supabase/supabase-js` to function. Run this command immediately:

```bash
npm install @supabase/supabase-js
```

Or if using yarn:
```bash
yarn add @supabase/supabase-js
```

Or if using bun:
```bash
bun add @supabase/supabase-js
```

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: gojo-ethiopia-connect
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to Ethiopia (Europe or Africa)
5. Wait for project to initialize (2-3 minutes)

## Step 2: Get Supabase Credentials

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

## Step 3: Create Environment File

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire content from `src/lib/supabase.schema.sql`
4. Paste into SQL editor
5. Click **Run**
6. Wait for completion (should see "Success" message)

## Step 5: Create Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Click **Create Bucket** for each:
   - `product-images` (public)
   - `user-avatars` (public)
   - `verification-documents` (public)

3. For each bucket:
   - Click bucket name
   - Go to **Policies**
   - Click **New Policy**
   - Select **For public access**
   - Click **Review** then **Save**

## Step 6: Enable Authentication

1. Go to **Authentication → Providers**
2. Ensure **Email** is enabled (default)
3. Optional: Enable **Google OAuth**
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add to Supabase provider settings

## Step 7: Install Dependencies

```bash
npm install
```

## Step 8: Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## Step 9: Test Authentication

1. Open http://localhost:5000
2. Click "Sign Up"
3. Create test account:
   - **Email**: test@example.com
   - **Password**: Test123!@#
   - **Role**: Buyer
4. Verify email (check spam folder)
5. Sign in with credentials

## Step 10: Create Test Data

### Create Admin User

1. In Supabase, go to **Authentication → Users**
2. Click **Add User**
3. Email: `admin@gojo.com`
4. Password: `Admin123!@#`
5. Click **Create User**

6. Go to **SQL Editor** and run:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@gojo.com';
```

### Create Test Seller

1. Create user: `seller@gojo.com`
2. Run in SQL Editor:
```sql
UPDATE profiles 
SET role = 'seller' 
WHERE email = 'seller@gojo.com';

INSERT INTO seller_profiles (
  user_id, company_name, contact_person, business_email, 
  phone, company_address, city, status, is_verified
)
SELECT id, 'Test Store', 'Test Person', 'seller@gojo.com', 
       '+251911111111', 'Addis Ababa', 'Addis Ababa', 'active', true
FROM profiles WHERE email = 'seller@gojo.com';
```

### Create Test Categories

Run in SQL Editor:
```sql
INSERT INTO categories (name, name_amharic, slug, description, sort_order, is_active)
VALUES
  ('Electronics', 'ኤሌክትሮኒክስ', 'electronics', 'Phones, laptops, tablets', 1, true),
  ('Fashion', 'ፋሽን', 'fashion', 'Clothing and accessories', 2, true),
  ('Home & Garden', 'ቤት እና ሙሉ', 'home-garden', 'Home items and furniture', 3, true),
  ('Books', 'መጽሐፍ', 'books', 'Educational and entertainment books', 4, true),
  ('Sports', 'ስፖርት', 'sports', 'Sports equipment and gear', 5, true);
```

## Step 11: Build for Production

```bash
npm run build
```

Output will be in `dist/` folder

## Step 12: Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **Import Project**
4. Select your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**

## Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"

**Solution**: Run `npm install @supabase/supabase-js`

### Error: "Missing Supabase environment variables"

**Solution**: 
1. Check `.env.local` exists
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Restart dev server: `npm run dev`

### Error: "RLS policy violation"

**Solution**:
1. Check user is authenticated
2. Verify RLS policies in Supabase
3. Check user role matches policy requirements

### Error: "Storage bucket not found"

**Solution**:
1. Create buckets in Supabase Storage
2. Set bucket policies to public
3. Verify bucket names match code

### Images not loading

**Solution**:
1. Check storage bucket is public
2. Verify image URLs are correct
3. Check CORS settings in Supabase

## Database Schema Overview

### Core Tables
- **profiles** - User accounts
- **seller_profiles** - Seller business info
- **categories** - Product categories
- **products** - Product listings
- **product_images** - Product photos
- **product_variants** - Product variants
- **product_attributes** - Product specs

### Commerce Tables
- **cart_items** - Shopping cart
- **orders** - Customer orders
- **order_items** - Items in orders
- **payments** - Payment records
- **wishlists** - Saved items

### Communication Tables
- **conversations** - Buyer-seller chats
- **messages** - Individual messages
- **notifications** - User notifications

### Analytics Tables
- **product_views** - View tracking
- **search_queries** - Search analytics

## Features Implemented

✅ Multi-role authentication (buyer, seller, admin)
✅ Product management with approval workflow
✅ Shopping cart and checkout
✅ Order management
✅ Real-time messaging
✅ Notifications system
✅ Admin dashboard
✅ Seller dashboard
✅ Product reviews and ratings
✅ Wishlist functionality
✅ Search and filtering
✅ Analytics and reporting

## Next Steps

1. **Customize Branding**
   - Update logo in `public/`
   - Modify colors in `tailwind.config.ts`
   - Update app name in `.env.local`

2. **Add Payment Integration**
   - Integrate Telebirr API
   - Add CBE Birr payment
   - Setup Chapa gateway

3. **Configure Email**
   - Setup Supabase email templates
   - Configure SMTP settings
   - Test email notifications

4. **Setup Analytics**
   - Enable Google Analytics
   - Configure Supabase analytics
   - Setup error tracking

5. **Performance Optimization**
   - Enable caching
   - Optimize images
   - Setup CDN

## Support

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Vite Docs**: https://vitejs.dev

## Security Checklist

- [ ] Environment variables not committed to git
- [ ] `.env.local` added to `.gitignore`
- [ ] Supabase RLS policies reviewed
- [ ] Storage bucket policies configured
- [ ] CORS settings verified
- [ ] API keys rotated regularly
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] Error messages don't expose sensitive info
- [ ] User input validated and sanitized
