# Gojo Ethiopia Connect - Final Setup Instructions

## ⚠️ CRITICAL: Install Supabase Dependency

The application requires `@supabase/supabase-js` to function. This is the most important step.

### Run this command in your terminal:

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

**After installation, restart the dev server:**

```bash
npm run dev
```

---

## Your Supabase Project Configuration

```
Project URL: https://xfzewohkrgwednbqzext.supabase.co
Publishable Key: sb_publishable_G6ozOxh6jhtAN0U1_w0ivg_sBuvUmNM
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmemV3b2hrcmd3ZWRuYnF6ZXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTM0MDMsImV4cCI6MjA4ODg4OTQwM30.YrWy7TTTCChcYH53-GrwPtW9OPDpJcGspJMWJsYYzFU
```

---

## Step 1: Create Database Tables

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **xfzewohkrgwednbqzext**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire SQL from [`SETUP_DATABASE.md`](SETUP_DATABASE.md)
6. Paste into the SQL editor
7. Click **Run**
8. Wait for completion (should see "Success" message)

---

## Step 2: Verify Environment Variables

Your `.env` file should contain:

```env
VITE_SUPABASE_URL=https://xfzewohkrgwednbqzext.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_G6ozOxh6jhtAN0U1_w0ivg_sBuvUmNM
```

✅ This is already configured correctly.

---

## Step 3: Restart Development Server

```bash
npm run dev
```

The server should now start without errors at `http://localhost:5000`

---

## Step 4: Test Authentication

1. Open `http://localhost:5000` in your browser
2. Click **Create Account**
3. Select **Buyer**
4. Fill in the form:
   - Full Name: Test User
   - Phone: +251911111111
   - Email: test@example.com
   - Password: Test123!@#
5. Accept terms and conditions
6. Click **Create Account**
7. You should be redirected to the dashboard

---

## Step 5: Test Seller Signup

1. Click **Create Account** again
2. Select **Seller**
3. Fill in Step 1:
   - Company Name: Test Store
   - Contact Person: Test Person
   - Business Email: seller@test.com
   - Phone: +251911111111
   - Password: Test123!@#
4. Click **Next**
5. Fill in Step 2:
   - Business Address: Addis Ababa
   - Years in Business: 2
6. Click **Create Account**
7. You should be redirected to seller dashboard

---

## Step 6: Test Admin Login

1. Go to Supabase Dashboard
2. Click **Authentication → Users**
3. Click **Add User**
4. Email: `admin@test.com`
5. Password: `Admin123!@#`
6. Click **Create User**

7. Go to **SQL Editor** and run:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@test.com';
```

8. Back in the app, click **Sign In**
9. Select **Admin**
10. Enter credentials
11. You should be redirected to admin dashboard

---

## Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"

**Solution**: Run `npm install @supabase/supabase-js` and restart the dev server

### Error: "RLS policy violation"

**Solution**: Make sure you ran the SQL schema from [`SETUP_DATABASE.md`](SETUP_DATABASE.md)

### Error: "Table does not exist"

**Solution**: Run the complete SQL schema in Supabase SQL Editor

### Error: "CORS error"

**Solution**: The CORS is already configured in Supabase for localhost

---

## Project Structure

```
gojo-ethiopia-connect/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts (Auth, Theme)
│   ├── lib/                # Utilities and Supabase client
│   ├── integrations/       # Supabase integration
│   ├── data/               # Mock data
│   └── App.tsx             # Main app component
├── public/                 # Static assets
├── .env                    # Environment variables
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## Key Features Implemented

✅ **8 New Product Categories**
- Electronics, Bags, Shoes, Cars, Home Rent, Home Sale, Gifts, Add-on Accessories

✅ **Complete Supabase Backend**
- 19 database tables
- Full-text search
- Row Level Security (RLS) policies
- Real-time messaging
- Notifications system

✅ **Frontend Features**
- Multi-role authentication (buyer, seller, admin)
- Product listing with filters
- Product detail page with image gallery
- Shopping cart and checkout
- Admin dashboard
- Seller dashboard
- Real-time chat
- Wishlist functionality

✅ **Documentation**
- Installation guide
- Authentication troubleshooting
- Database setup guide
- This final setup guide

---

## Next Steps

1. **Install Supabase dependency** (CRITICAL)
2. **Create database tables** using SQL from [`SETUP_DATABASE.md`](SETUP_DATABASE.md)
3. **Restart dev server**
4. **Test authentication** with buyer, seller, and admin accounts
5. **Create test products** as a seller
6. **Test shopping cart** and checkout
7. **Deploy to production** when ready

---

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

---

## Production Deployment

Before deploying to production:

1. Update `.env` with production Supabase credentials
2. Enable email verification in Supabase
3. Configure SMTP for email notifications
4. Update CORS settings for production domain
5. Enable RLS policies (already configured)
6. Set up backups in Supabase
7. Configure CDN for static assets
8. Set up monitoring and logging

---

## Questions?

Refer to the documentation files:
- [`INSTALLATION_GUIDE.md`](INSTALLATION_GUIDE.md)
- [`AUTHENTICATION_TROUBLESHOOTING.md`](AUTHENTICATION_TROUBLESHOOTING.md)
- [`SETUP_DATABASE.md`](SETUP_DATABASE.md)
