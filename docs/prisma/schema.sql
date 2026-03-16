-- =============================================================
-- GOJO MARKETPLACE — PostgreSQL Schema (Raw SQL)
-- =============================================================
-- Equivalent of the Prisma schema for direct PostgreSQL usage
-- Optimized for millions of users, agents, multi-vendor
-- =============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search

-- =============================================================
-- ENUMS
-- =============================================================

CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER', 'AGENT', 'ADMIN', 'MODERATOR');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'BANNED');
CREATE TYPE company_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');
CREATE TYPE company_verification_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE agent_permission AS ENUM ('MANAGE_PRODUCTS', 'MANAGE_ORDERS', 'MANAGE_FINANCES', 'MANAGE_MESSAGES', 'VIEW_ANALYTICS', 'MANAGE_AGENTS', 'FULL_ACCESS');
CREATE TYPE product_status AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');
CREATE TYPE listing_type AS ENUM ('SALE', 'RENT', 'SERVICE');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'DISPUTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
CREATE TYPE payment_method AS ENUM ('TELEBIRR', 'CBE_BIRR', 'AMOLE', 'CHAPA', 'BANK_TRANSFER', 'CASH_ON_DELIVERY');
CREATE TYPE shipment_status AS ENUM ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'FAILED');
CREATE TYPE message_status AS ENUM ('SENT', 'DELIVERED', 'READ');
CREATE TYPE notification_type AS ENUM ('MESSAGE', 'ORDER', 'APPROVAL', 'REJECTION', 'REVIEW', 'SELLER_VERIFICATION', 'SYSTEM', 'PROMOTION');
CREATE TYPE settlement_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE dispute_status AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED_BUYER', 'RESOLVED_SELLER', 'ESCALATED', 'CLOSED');

-- =============================================================
-- AUTH MODULE
-- =============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20) UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    preferred_language VARCHAR(5) DEFAULT 'en',
    status user_status DEFAULT 'PENDING',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created ON users(created_at);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    UNIQUE(user_id, role)
);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    company_id UUID,  -- Set when acting as agent
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- =============================================================
-- COMPANY MODULE
-- =============================================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    business_email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    company_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Ethiopia',
    postal_code VARCHAR(20),
    tax_id VARCHAR(50),
    business_license VARCHAR(100),
    years_in_business INT,
    status company_status DEFAULT 'PENDING',
    is_verified BOOLEAN DEFAULT FALSE,
    rating FLOAT DEFAULT 0,
    total_products INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    response_time_hours INT DEFAULT 24,
    social_links JSONB,
    certifications JSONB,
    approved_at TIMESTAMPTZ,
    approved_by UUID,
    suspended_at TIMESTAMPTZ,
    suspend_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_companies_owner ON companies(owner_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_city ON companies(city);
CREATE INDEX idx_companies_verified ON companies(is_verified);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_created ON companies(created_at);

ALTER TABLE user_sessions ADD CONSTRAINT fk_sessions_company FOREIGN KEY (company_id) REFERENCES companies(id);

CREATE TABLE company_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100),
    permissions agent_permission[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    invited_by UUID,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);
CREATE INDEX idx_agents_company ON company_agents(company_id);
CREATE INDEX idx_agents_user ON company_agents(user_id);

CREATE TABLE company_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    status company_verification_status DEFAULT 'PENDING',
    business_license_url TEXT,
    tax_certificate_url TEXT,
    id_document_url TEXT,
    address_proof_url TEXT,
    additional_docs JSONB,
    reviewed_by UUID,
    review_note TEXT,
    reviewed_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_verifications_status ON company_verifications(status);

CREATE TABLE company_bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_bank_company ON company_bank_accounts(company_id);

-- =============================================================
-- PRODUCT MODULE
-- =============================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    name_amharic VARCHAR(255) DEFAULT '',
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    product_count INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort ON categories(sort_order);

CREATE TABLE category_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'text',
    options JSONB,
    is_required BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);
CREATE INDEX idx_catattr_category ON category_attributes(category_id);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    currency VARCHAR(5) DEFAULT 'ETB',
    listing_type listing_type DEFAULT 'SALE',
    rent_period VARCHAR(20),
    status product_status DEFAULT 'DRAFT',
    condition VARCHAR(20) DEFAULT 'new',
    brand VARCHAR(100),
    model VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    min_order_quantity INT DEFAULT 1,
    max_order_quantity INT,
    weight_kg DECIMAL(8, 3),
    dimensions JSONB,
    specs JSONB,
    tags TEXT[] DEFAULT '{}',
    location VARCHAR(255) DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    -- Denormalized metrics
    rating FLOAT DEFAULT 0,
    review_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    wishlist_count INT DEFAULT 0,
    order_count INT DEFAULT 0,
    -- Promotions
    is_featured BOOLEAN DEFAULT FALSE,
    is_flash_deal BOOLEAN DEFAULT FALSE,
    flash_deal_ends_at TIMESTAMPTZ,
    badge VARCHAR(50),
    -- Approval
    approved_at TIMESTAMPTZ,
    approved_by UUID,
    rejection_note TEXT,
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_created ON products(created_at);
CREATE INDEX idx_products_city ON products(city);
CREATE INDEX idx_products_listing ON products(listing_type);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_flash ON products(is_flash_deal, flash_deal_ends_at);
CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    storage_path TEXT,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pimages_product ON product_images(product_id);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    price_adjustment DECIMAL(12, 2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    attributes JSONB,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pvariants_product ON product_variants(product_id);

CREATE TABLE product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value TEXT NOT NULL,
    sort_order INT DEFAULT 0
);
CREATE INDEX idx_pattr_product ON product_attributes(product_id);

CREATE TABLE bulk_price_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    min_quantity INT NOT NULL,
    max_quantity INT,
    price DECIMAL(12, 2) NOT NULL
);
CREATE INDEX idx_bulk_product ON bulk_price_tiers(product_id);

-- =============================================================
-- ORDER MODULE
-- =============================================================

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    sub_city VARCHAR(100) NOT NULL,
    woreda VARCHAR(100) NOT NULL,
    house_number VARCHAR(50),
    additional_info TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_addresses_user ON addresses(user_id);

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    discount_value DECIMAL(12, 2) NOT NULL,
    min_order_amount DECIMAL(12, 2),
    max_discount DECIMAL(12, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active, expires_at);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    delivery_fee DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    tax DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'ETB',
    status order_status DEFAULT 'PENDING',
    notes TEXT,
    -- Shipping snapshot
    shipping_full_name VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_sub_city VARCHAR(100) NOT NULL,
    shipping_woreda VARCHAR(100) NOT NULL,
    shipping_house_number VARCHAR(50),
    shipping_additional_info TEXT,
    address_id UUID REFERENCES addresses(id),
    -- Coupon
    coupon_id UUID REFERENCES coupons(id),
    coupon_discount DECIMAL(12, 2) DEFAULT 0,
    cancel_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at);

CREATE TABLE sub_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    subtotal DECIMAL(12, 2) NOT NULL,
    delivery_fee DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    status order_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_suborders_order ON sub_orders(order_id);
CREATE INDEX idx_suborders_company ON sub_orders(company_id);
CREATE INDEX idx_suborders_status ON sub_orders(status);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_order_id UUID NOT NULL REFERENCES sub_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    product_name VARCHAR(500) NOT NULL,
    product_image TEXT NOT NULL,
    variant_name VARCHAR(255),
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_oitems_suborder ON order_items(sub_order_id);
CREATE INDEX idx_oitems_product ON order_items(product_id);

-- =============================================================
-- PAYMENT MODULE
-- =============================================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_order_id UUID UNIQUE NOT NULL REFERENCES sub_orders(id),
    user_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'ETB',
    method payment_method NOT NULL,
    status payment_status DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    provider_reference VARCHAR(255),
    provider_response JSONB,
    paid_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_txn ON payments(transaction_id);

CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    amount DECIMAL(12, 2) NOT NULL,
    fee DECIMAL(12, 2) DEFAULT 0,
    net_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'ETB',
    status settlement_status DEFAULT 'PENDING',
    period_from TIMESTAMPTZ NOT NULL,
    period_to TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    reference VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_settlements_company ON settlements(company_id);
CREATE INDEX idx_settlements_status ON settlements(status);

-- =============================================================
-- LOGISTICS MODULE
-- =============================================================

CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_order_id UUID UNIQUE NOT NULL REFERENCES sub_orders(id),
    carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    status shipment_status DEFAULT 'PENDING',
    estimated_delivery_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);

CREATE TABLE shipment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    note TEXT,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sevents_shipment ON shipment_events(shipment_id);

-- =============================================================
-- REVIEW MODULE
-- =============================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    reply TEXT,
    reply_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- =============================================================
-- CART & WISHLIST
-- =============================================================

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    quantity INT DEFAULT 1,
    saved_for_later BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id, variant_id)
);
CREATE INDEX idx_cart_user ON cart_items(user_id);

CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);
CREATE INDEX idx_wishlist_user ON wishlists(user_id);

-- =============================================================
-- MESSAGING MODULE
-- =============================================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    product_id UUID,
    order_id UUID,
    buyer_unread_count INT DEFAULT 0,
    seller_unread_count INT DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_conv_buyer ON conversations(buyer_id);
CREATE INDEX idx_conv_seller ON conversations(seller_id);
CREATE INDEX idx_conv_last ON conversations(last_message_at);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text',
    image_url TEXT,
    attachment_url TEXT,
    attachment_name VARCHAR(255),
    status message_status DEFAULT 'SENT',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_msg_conv ON messages(conversation_id);
CREATE INDEX idx_msg_sender ON messages(sender_id);
CREATE INDEX idx_msg_created ON messages(created_at);

-- =============================================================
-- NOTIFICATION MODULE
-- =============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type DEFAULT 'SYSTEM',
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    action_url TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notif_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notif_created ON notifications(created_at);

-- =============================================================
-- ANALYTICS MODULE
-- =============================================================

CREATE TABLE product_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    ip_hash VARCHAR(64),
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_pviews_product ON product_views(product_id);
CREATE INDEX idx_pviews_created ON product_views(created_at);

CREATE TABLE search_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    query VARCHAR(500) NOT NULL,
    category_id UUID REFERENCES categories(id),
    results_count INT DEFAULT 0,
    session_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_search_query ON search_queries(query);
CREATE INDEX idx_search_created ON search_queries(created_at);

-- =============================================================
-- DISPUTE MODULE
-- =============================================================

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_order_id UUID UNIQUE NOT NULL REFERENCES sub_orders(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    opened_by UUID NOT NULL,
    reason TEXT NOT NULL,
    evidence JSONB,
    status dispute_status DEFAULT 'OPEN',
    resolution TEXT,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_disputes_status ON disputes(status);

-- =============================================================
-- ADMIN MODULE
-- =============================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- HELPER: Auto-update updated_at trigger
-- =============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_agents_updated BEFORE UPDATE ON company_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_verifications_updated BEFORE UPDATE ON company_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_variants_updated BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_suborders_updated BEFORE UPDATE ON sub_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_shipments_updated BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cart_updated BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_messages_updated BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_disputes_updated BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
