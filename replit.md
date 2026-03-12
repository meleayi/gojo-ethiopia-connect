# Gojo - Ethiopian Marketplace

## Overview
Ethiopia's premier marketplace connecting local artisans, farmers, businesses and real estate agents with customers across the nation. A full-featured React/Vite SPA with 14+ product categories, advanced search, dark/light mode, and a comprehensive admin panel.

## Architecture
- **Frontend only** — pure Vite + React SPA, no backend server
- **Routing**: React Router v6 (BrowserRouter)
- **UI**: shadcn/ui component library (Radix UI + Tailwind CSS)
- **Data**: Mock data in `src/data/mock-data.ts` (structured for easy Supabase migration)
- **State**: TanStack React Query + local React state
- **Animations**: Framer Motion throughout

## Key Directories
- `src/pages/` — top-level page components
- `src/components/` — shared components including Navbar, Footer, SearchModal, ThemeProvider
- `src/components/ui/` — shadcn/ui base components
- `src/data/mock-data.ts` — all mock data (Products, Categories, Sellers, AdminUsers)
- `src/hooks/` — custom React hooks
- `src/assets/` — local image assets (hero banner, category images)
- `public/` — static assets (category images)

## Features Implemented
1. **14 Categories**: Coffee, Textiles, Spices, Fashion, Jewelry, Home & Living, Electronics, Accessories, Bags, Shoes, Cars, Home Rent, Home Sale, Gifts
2. **Advanced Search Modal** (Ctrl+K / click): live product + category suggestions, recent searches, popular searches, voice search button, keyboard navigation
3. **Dark / Light Mode**: ThemeProvider with localStorage persistence, toggle in navbar
4. **Complete Admin Panel** (8 tabs): Overview, Products (approval queue), Users, Sellers, Categories, Reports, Analytics, Settings
5. **Alibaba-style Product Detail**: hover-to-zoom image gallery, spec tables, review breakdown, auto-scrolling recommendations, chat button, tabs (specs/reviews/shipping)
6. **Product Approval System**: products have pending/approved/rejected status; admins can approve/reject from admin panel
7. **Real Estate & Cars**: special listing types with rent period display and "Schedule Viewing/Contact Seller" CTAs
8. **Updated Navbar**: full category navigation, dark mode toggle, ⌘K search shortcut badge

## Development
- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Test**: `npm run test`

## Replit Configuration
- Vite dev server on port 5000, `host: "0.0.0.0"`, `allowedHosts: true`
- `lovable-tagger` plugin removed (was Lovable-platform-specific)

## Future: Supabase Integration
The data layer is structured to migrate to Supabase. Key tables planned:
- `profiles` (users with roles: admin/seller/buyer)
- `categories` (hierarchical)
- `products` (with status: pending/approved/rejected)
- `product_images`, `reviews`, `orders`, `wishlist`, `messages`, `notifications`
- Supabase Auth (email/password, Google OAuth, magic link)
- Supabase Storage (product images, avatars)
- Supabase Realtime (messages, notifications)
