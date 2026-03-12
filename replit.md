# Gojo - Ethiopian Marketplace

## Overview
A frontend React/Vite e-commerce marketplace application for Ethiopian products (coffee, textiles, spices, jewelry, fashion). Built with TypeScript, Tailwind CSS, shadcn/ui components, and React Router for multi-page navigation.

## Architecture
- **Frontend only** — pure Vite + React SPA, no backend server
- **Routing**: React Router v6 with pages for home, products, product detail, cart, checkout, dashboard, seller dashboard, and admin panel
- **UI**: shadcn/ui component library (Radix UI primitives + Tailwind CSS)
- **State/Data**: Mock data in `src/data/mock-data.ts`, TanStack React Query for data management
- **Animations**: Framer Motion

## Key Directories
- `src/pages/` — top-level page components (Index, ProductListing, ProductDetail, CartPage, Checkout, Dashboard, SellerDashboard, AdminPanel)
- `src/components/` — shared components (Navbar, Footer, ProductCard, CategoryCard, etc.)
- `src/components/ui/` — shadcn/ui base components
- `src/data/` — mock data
- `src/hooks/` — custom React hooks
- `src/assets/` — local image assets
- `public/` — static assets

## Development
- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Test**: `npm run test`

## Replit Configuration
- Vite dev server configured to run on port 5000 with `host: "0.0.0.0"` and `allowedHosts: true` for Replit proxy compatibility
- `lovable-tagger` plugin removed (was Lovable-platform-specific)
