# Gojo Marketplace — NestJS Database Schema

## Architecture Overview

This schema is designed for a **large-scale multi-vendor marketplace** (Alibaba-style) using:
- **NestJS** (backend framework)
- **Prisma ORM** (database access)
- **PostgreSQL** (database)
- **Microservice-ready** module separation

### Key Concepts

| Concept | Description |
|---------|-------------|
| **User** | Any registered person (buyer, seller, admin, moderator) |
| **Company** | A registered business entity that sells products |
| **Agent** | A person who logs in on behalf of a company to manage listings and orders |
| **Seller** | The company profile — agents operate under it |
| **Product** | Listing with variants, attributes, images, and approval workflow |
| **Order** | Multi-seller order split into sub-orders per seller |

### Module Breakdown (Microservice-ready)

```
├── auth-module          (users, sessions, roles, agents)
├── company-module       (companies, verification, agents)
├── product-module       (products, variants, attributes, images, categories)
├── order-module         (orders, order-items, sub-orders, returns)
├── payment-module       (payments, refunds, escrow, settlements)
├── messaging-module     (conversations, messages)
├── notification-module  (notifications, preferences)
├── review-module        (reviews, ratings, reports)
├── analytics-module     (views, search queries, events)
├── logistics-module     (shipping, tracking, addresses)
└── admin-module         (moderation, approvals, system config)
```

---

## Entity Relationship Summary

```
User ──┬── has many ── UserRole
       ├── has many ── Address
       ├── has many ── Order
       ├── has many ── Review
       ├── has many ── Wishlist
       ├── has many ── CartItem
       ├── has many ── Notification
       └── has many ── SearchQuery

Company ──┬── has many ── CompanyAgent (users acting as agents)
          ├── has many ── Product
          ├── has many ── SubOrder (seller side)
          ├── has many ── Settlement
          └── has one ── CompanyVerification

Product ──┬── has many ── ProductVariant
          ├── has many ── ProductImage
          ├── has many ── ProductAttribute
          ├── has many ── Review
          └── belongs to ── Category (hierarchical)

Order ──┬── has many ── SubOrder (one per seller)
        └── SubOrder ── has many ── OrderItem
                     ── has one ── Payment
                     ── has one ── Shipment
```
