# Gojo Ethiopia Connect - Setup Instructions

## Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier available)
- Google OAuth credentials (optional, for Google login)
- Git

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd gojo-ethiopia-connect

# Install dependencies
npm install

# Or with yarn
yarn install
```

## Step 2: Supabase Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to initialize
5. Go to Project Settings → API to get your credentials

### Get Your Credentials
- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → anon key
- **Service Role Key**: Settings → API → Project API keys → service_role key (for admin operations)

### Create Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Create a new query
3. Copy the entire content from `src/lib/supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute

This will create:
- All 15 tables with relationships
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamps
- Real-time subscriptions

### Configure Authentication
1. Go to Authentication → Providers
2. **Email/Password**: Already enabled by default
3. **Google OAuth** (optional):
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Create Storage Buckets
1. Go to Storage → Buckets
2. Create three public buckets:
   - `product-images` - For product photos
   - `user-avatars` - For user profile pictures
   - `verification-documents` - For seller verification files

3. For each bucket, set policies:
   - Public read access
   - Authenticated write access (for uploads)

## Step 3: Environment Configuration

### Create .env.local file
```bash
cp .env.example .env.local
```

### Fill in your credentials
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_VOICE_SEARCH=true
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_ANALYTICS=true

# App Configuration
VITE_APP_NAME=Gojo Ethiopia Connect
VITE_APP_DESCRIPTION=Ethiopian E-commerce Platform
VITE_APP_URL=http://localhost:5173
```

## Step 4: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 5: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Step 6: Create Test Data

### Create Admin User
1. Go to Supabase Authentication → Users
2. Create a new user with email: `admin@gojo.com` and password
3. Go to SQL Editor and run:

```sql
UPDATE profiles 
SET role = 'admin', is_verified = true 
WHERE email = 'admin@gojo.com';
```

### Create Test Seller
1. Create a new user with email: `seller@gojo.com`
2. Run in SQL Editor:

```sql
UPDATE profiles 
SET role = 'seller', is_verified = true 
WHERE email = 'seller@gojo.com';
```

### Create Test Buyer
1. Create a new user with email: `buyer@gojo.com`
2. Run in SQL Editor:

```sql
UPDATE profiles 
SET role = 'buyer', is_verified = true 
WHERE email = 'buyer@gojo.com';
```

## Step 7: Verify Installation

### Check Database Connection
1. Open browser DevTools (F12)
2. Go to Console tab
3. You should see no errors related to Supabase

### Test Authentication
1. Go to http://localhost:5173
2. Try signing up with a test email
3. Check Supabase Authentication → Users to see the new user

### Test Product Listing
1. Navigate to Products page
2. You should see mock products from `src/data/mock-data.ts`

## Step 8: Configure Google OAuth (Optional)

### Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback`
   - `https://your-domain.com/auth/callback` (for production)

### Add to Supabase
1. Go to Supabase Authentication → Providers → Google
2. Enable Google
3. Add your Client ID and Client Secret
4. Add redirect URL in Supabase: `https://your-project.supabase.co/auth/v1/callback`

## Step 9: Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Step 10: Deploy to Vercel

### Connect GitHub Repository
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration

### Set Environment Variables
1. In Vercel project settings → Environment Variables
2. Add all variables from `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_CLIENT_ID`
   - etc.

### Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Your app will be live at `https://your-project.vercel.app`

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
npm install @supabase/supabase-js
```

### Issue: Supabase connection errors
**Solution:**
1. Check `.env.local` has correct credentials
2. Verify Supabase project is active
3. Check network tab in DevTools for API errors

### Issue: Authentication not working
**Solution:**
1. Verify email/password provider is enabled in Supabase
2. Check user exists in Supabase Authentication
3. Clear browser cache and cookies

### Issue: Images not loading
**Solution:**
1. Verify storage buckets are created
2. Check bucket policies allow public read
3. Verify image URLs are correct

### Issue: RLS policies blocking access
**Solution:**
1. Check user is authenticated
2. Verify user role in profiles table
3. Review RLS policies in Supabase

## Development Tips

### Hot Module Replacement (HMR)
- Changes to React components auto-refresh
- Changes to CSS auto-apply
- No need to manually refresh browser

### Debugging
- Use React DevTools browser extension
- Check browser Console for errors
- Use Supabase dashboard to inspect data

### Database Inspection
1. Go to Supabase Table Editor
2. View and edit data directly
3. Use SQL Editor for complex queries

### Real-time Testing
1. Open app in two browser windows
2. Make changes in one window
3. See real-time updates in other window (if real-time enabled)

## Next Steps

1. **Customize Branding**
   - Update logo in `public/`
   - Modify colors in `tailwind.config.ts`
   - Update app name in `.env.local`

2. **Add More Categories**
   - Edit `src/data/mock-data.ts`
   - Add to database via Supabase dashboard

3. **Implement Payment**
   - Integrate Stripe or Paystack
   - Add payment processing in checkout

4. **Set Up Email Notifications**
   - Configure Supabase email templates
   - Add email triggers for orders

5. **Enable Analytics**
   - Set up Google Analytics
   - Track user behavior

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

## Performance Checklist

- [ ] Images optimized and lazy-loaded
- [ ] Database queries indexed
- [ ] API responses cached where appropriate
- [ ] Bundle size analyzed
- [ ] Code splitting implemented
- [ ] Unused dependencies removed
- [ ] Production build tested
- [ ] Lighthouse score checked

## Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Storage buckets created
- [ ] Authentication providers configured
- [ ] Email templates set up
- [ ] Error monitoring configured
- [ ] Analytics enabled
- [ ] Backup strategy in place
- [ ] SSL certificate valid
- [ ] DNS records configured
