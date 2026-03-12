-- ============================================================
-- GOJO MARKETPLACE — SUPABASE SCHEMA
-- Designed for millions of users, products, and transactions
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- for fast full-text search
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- for accent-insensitive search

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin', 'moderator');
CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended', 'banned');
CREATE TYPE seller_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE product_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'archived');
CREATE TYPE listing_type AS ENUM ('sale', 'rent');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('telebirr', 'cbe_birr', 'amole', 'chapa', 'cash_on_delivery');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM ('message', 'order', 'approval', 'rejection', 'review', 'seller_verification', 'system');
CREATE TYPE delivery_method AS ENUM ('standard', 'express', 'same_day');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL UNIQUE,
  full_name       TEXT,
  phone           TEXT,
  avatar_url      TEXT,
  role            user_role NOT NULL DEFAULT 'buyer',
  status          user_status NOT NULL DEFAULT 'active',
  city            TEXT,
  sub_city        TEXT,
  woreda          TEXT,
  house_number    TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_profiles_role   ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_email  ON profiles(email);

-- ============================================================
-- SELLER PROFILES
-- ============================================================
CREATE TABLE seller_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name        TEXT NOT NULL,
  contact_person      TEXT NOT NULL,
  business_email      TEXT NOT NULL,
  phone               TEXT NOT NULL,
  business_license    TEXT,
  company_address     TEXT NOT NULL,
  city                TEXT NOT NULL,
  years_in_business   INT,
  description         TEXT,
  logo_url            TEXT,
  banner_url          TEXT,
  website             TEXT,
  social_links        JSONB NOT NULL DEFAULT '{}',
  certifications      JSONB NOT NULL DEFAULT '[]',
  status              seller_status NOT NULL DEFAULT 'pending',
  is_verified         BOOLEAN NOT NULL DEFAULT false,
  verification_note   TEXT,
  rating              NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_reviews       INT NOT NULL DEFAULT 0,
  total_sales         INT NOT NULL DEFAULT 0,
  total_products      INT NOT NULL DEFAULT 0,
  response_time_hours NUMERIC(5,2) NOT NULL DEFAULT 0,
  joined_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  approved_at         TIMESTAMPTZ,
  approved_by         UUID REFERENCES profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX idx_seller_profiles_status  ON seller_profiles(status);
CREATE INDEX idx_seller_profiles_city    ON seller_profiles(city);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  name_amharic   TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT,
  image_url      TEXT,
  icon           TEXT,
  parent_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order     INT NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  product_count  INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug      ON categories(slug);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id         UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  category_id       UUID NOT NULL REFERENCES categories(id),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL,
  description       TEXT,
  price             NUMERIC(12,2) NOT NULL,
  original_price    NUMERIC(12,2),
  currency          TEXT NOT NULL DEFAULT 'ETB',
  listing_type      listing_type NOT NULL DEFAULT 'sale',
  rent_period       TEXT,
  status            product_status NOT NULL DEFAULT 'pending',
  rejection_note    TEXT,
  badge             TEXT,
  in_stock          BOOLEAN NOT NULL DEFAULT true,
  stock_quantity    INT NOT NULL DEFAULT 0,
  min_order_quantity INT NOT NULL DEFAULT 1,
  max_order_quantity INT,
  weight_kg         NUMERIC(8,3),
  dimensions        JSONB NOT NULL DEFAULT '{}',
  condition         TEXT NOT NULL DEFAULT 'new',
  brand             TEXT,
  model             TEXT,
  location          TEXT NOT NULL,
  city              TEXT NOT NULL,
  specs             JSONB NOT NULL DEFAULT '{}',
  tags              TEXT[] NOT NULL DEFAULT '{}',
  view_count        BIGINT NOT NULL DEFAULT 0,
  wishlist_count    INT NOT NULL DEFAULT 0,
  order_count       INT NOT NULL DEFAULT 0,
  rating            NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count      INT NOT NULL DEFAULT 0,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  is_flash_deal     BOOLEAN NOT NULL DEFAULT false,
  flash_deal_ends_at TIMESTAMPTZ,
  approved_at       TIMESTAMPTZ,
  approved_by       UUID REFERENCES profiles(id),
  search_vector     TSVECTOR,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique slug per seller
CREATE UNIQUE INDEX idx_products_seller_slug ON products(seller_id, slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status      ON products(status);
CREATE INDEX idx_products_city        ON products(city);
CREATE INDEX idx_products_price       ON products(price);
CREATE INDEX idx_products_listing_type ON products(listing_type);
CREATE INDEX idx_products_created_at  ON products(created_at DESC);
CREATE INDEX idx_products_rating      ON products(rating DESC);
CREATE INDEX idx_products_view_count  ON products(view_count DESC);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_tags        ON products USING GIN(tags);
CREATE INDEX idx_products_search      ON products USING GIN(search_vector);

-- Auto-update search vector
CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE product_images (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  storage_path TEXT,
  alt_text     TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  is_primary   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
CREATE TABLE product_variants (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  sku              TEXT,
  price_adjustment NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock_quantity   INT NOT NULL DEFAULT 0,
  attributes       JSONB NOT NULL DEFAULT '{}',
  image_url        TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);

-- ============================================================
-- PRODUCT ATTRIBUTES
-- ============================================================
CREATE TABLE product_attributes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  attribute_name  TEXT NOT NULL,
  attribute_value TEXT NOT NULL,
  sort_order      INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_product_attributes_product_id ON product_attributes(product_id);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id            UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id              UUID,
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id             UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  rating                INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title                 TEXT,
  comment               TEXT,
  images                TEXT[] NOT NULL DEFAULT '{}',
  is_verified_purchase  BOOLEAN NOT NULL DEFAULT false,
  helpful_count         INT NOT NULL DEFAULT 0,
  is_approved           BOOLEAN NOT NULL DEFAULT true,
  reply                 TEXT,
  reply_at              TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_reviews_user_product ON reviews(user_id, product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_seller_id  ON reviews(seller_id);
CREATE INDEX idx_reviews_rating     ON reviews(rating);

-- ============================================================
-- WISHLISTS
-- ============================================================
CREATE TABLE wishlists (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
CREATE INDEX idx_wishlists_user_id    ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE addresses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label           TEXT NOT NULL DEFAULT 'Home',
  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  city            TEXT NOT NULL,
  sub_city        TEXT NOT NULL,
  woreda          TEXT NOT NULL,
  house_number    TEXT,
  additional_info TEXT,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ============================================================
-- CART ITEMS
-- ============================================================
CREATE TABLE cart_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id     UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity       INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  saved_for_later BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id, variant_id)
);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number          TEXT NOT NULL UNIQUE,
  user_id               UUID NOT NULL REFERENCES profiles(id),
  seller_id             UUID NOT NULL REFERENCES seller_profiles(id),
  status                order_status NOT NULL DEFAULT 'pending',
  subtotal              NUMERIC(12,2) NOT NULL,
  delivery_fee          NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount              NUMERIC(12,2) NOT NULL DEFAULT 0,
  total                 NUMERIC(12,2) NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'ETB',
  address_id            UUID REFERENCES addresses(id),
  shipping_full_name    TEXT NOT NULL,
  shipping_phone        TEXT NOT NULL,
  shipping_city         TEXT NOT NULL,
  shipping_sub_city     TEXT NOT NULL,
  shipping_woreda       TEXT NOT NULL,
  shipping_house_number TEXT,
  shipping_additional_info TEXT,
  delivery_method       delivery_method NOT NULL DEFAULT 'standard',
  estimated_delivery_at TIMESTAMPTZ,
  delivered_at          TIMESTAMPTZ,
  cancelled_at          TIMESTAMPTZ,
  cancel_reason         TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user_id   ON orders(user_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status    ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Auto-generate order numbers: GJ-YYYYMM-NNNNNN
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'GJ-' || to_char(now(), 'YYYYMM') || '-' || lpad(nextval('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TRIGGER orders_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id),
  variant_id    UUID REFERENCES product_variants(id),
  seller_id     UUID NOT NULL REFERENCES seller_profiles(id),
  product_name  TEXT NOT NULL,
  product_image TEXT NOT NULL,
  variant_name  TEXT,
  quantity      INT NOT NULL,
  unit_price    NUMERIC(12,2) NOT NULL,
  total_price   NUMERIC(12,2) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_seller_id  ON order_items(seller_id);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id           UUID NOT NULL REFERENCES orders(id),
  user_id            UUID NOT NULL REFERENCES profiles(id),
  method             payment_method NOT NULL,
  status             payment_status NOT NULL DEFAULT 'pending',
  amount             NUMERIC(12,2) NOT NULL,
  currency           TEXT NOT NULL DEFAULT 'ETB',
  transaction_id     TEXT,
  provider_reference TEXT,
  provider_response  JSONB NOT NULL DEFAULT '{}',
  paid_at            TIMESTAMPTZ,
  failed_at          TIMESTAMPTZ,
  failure_reason     TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id  ON payments(user_id);
CREATE INDEX idx_payments_status   ON payments(status);

-- ============================================================
-- CONVERSATIONS (buyer <-> seller messaging)
-- ============================================================
CREATE TABLE conversations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id          UUID REFERENCES products(id) ON DELETE SET NULL,
  order_id            UUID REFERENCES orders(id) ON DELETE SET NULL,
  last_message_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  buyer_unread_count  INT NOT NULL DEFAULT 0,
  seller_unread_count INT NOT NULL DEFAULT 0,
  is_archived         BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (buyer_id, seller_id, product_id)
);
CREATE INDEX idx_conversations_buyer_id  ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller_id ON conversations(seller_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT,
  image_url       TEXT,
  attachment_url  TEXT,
  attachment_name TEXT,
  message_type    TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'attachment')),
  status          message_status NOT NULL DEFAULT 'sent',
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id       ON messages(sender_id);
CREATE INDEX idx_messages_created_at      ON messages(created_at);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  data       JSONB NOT NULL DEFAULT '{}',
  is_read    BOOLEAN NOT NULL DEFAULT false,
  read_at    TIMESTAMPTZ,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user_id   ON notifications(user_id);
CREATE INDEX idx_notifications_is_read   ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================
-- PRODUCT VIEWS (analytics)
-- ============================================================
CREATE TABLE product_views (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  ip_hash    TEXT,
  referrer   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_product_views_product_id ON product_views(product_id);
CREATE INDEX idx_product_views_created_at ON product_views(created_at DESC);

-- ============================================================
-- SEARCH QUERIES (analytics)
-- ============================================================
CREATE TABLE search_queries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id    TEXT,
  query         TEXT NOT NULL,
  results_count INT NOT NULL DEFAULT 0,
  category_id   UUID REFERENCES categories(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_search_queries_user_id    ON search_queries(user_id);
CREATE INDEX idx_search_queries_created_at ON search_queries(created_at DESC);
CREATE INDEX idx_search_queries_query      ON search_queries USING GIN(to_tsvector('english', query));

-- ============================================================
-- TRIGGERS: updated_at auto-update
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at         BEFORE UPDATE ON profiles         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_seller_profiles_updated_at  BEFORE UPDATE ON seller_profiles  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_categories_updated_at       BEFORE UPDATE ON categories       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_products_updated_at         BEFORE UPDATE ON products         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_reviews_updated_at          BEFORE UPDATE ON reviews          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_addresses_updated_at        BEFORE UPDATE ON addresses        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_cart_items_updated_at       BEFORE UPDATE ON cart_items       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_orders_updated_at           BEFORE UPDATE ON orders           FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_payments_updated_at         BEFORE UPDATE ON payments         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_messages_updated_at         BEFORE UPDATE ON messages         FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TRIGGER: update product stats on review
-- ============================================================
CREATE OR REPLACE FUNCTION update_product_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET
    rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE product_id = NEW.product_id AND is_approved = true),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = true)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- ============================================================
-- TRIGGER: update seller product count
-- ============================================================
CREATE OR REPLACE FUNCTION update_seller_product_count() RETURNS TRIGGER AS $$
BEGIN
  UPDATE seller_profiles
  SET total_products = (
    SELECT COUNT(*) FROM products
    WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id)
    AND status = 'approved'
  )
  WHERE id = COALESCE(NEW.seller_id, OLD.seller_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_product_change
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_seller_product_count();

-- ============================================================
-- TRIGGER: update wishlist_count on products
-- ============================================================
CREATE OR REPLACE FUNCTION update_wishlist_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products SET wishlist_count = wishlist_count + 1 WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products SET wishlist_count = wishlist_count - 1 WHERE id = OLD.product_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_wishlist_change
  AFTER INSERT OR DELETE ON wishlists
  FOR EACH ROW EXECUTE FUNCTION update_wishlist_count();

-- ============================================================
-- STORAGE BUCKETS (run via Supabase dashboard or API)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('seller-assets', 'seller-assets', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-avatars', 'profile-avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', false);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries   ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role() RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is the current user an admin or moderator?
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('admin', 'moderator');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get seller_profile id for current user
CREATE OR REPLACE FUNCTION get_my_seller_id() RETURNS UUID AS $$
  SELECT id FROM seller_profiles WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES ──────────────────────────────────────────────────
CREATE POLICY "Profiles are public to authenticated users"
  ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL USING (is_admin());

-- ── SELLER PROFILES ──────────────────────────────────────────
CREATE POLICY "Seller profiles visible to all"
  ON seller_profiles FOR SELECT USING (true);

CREATE POLICY "Sellers can update their own profile"
  ON seller_profiles FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Sellers can insert their own profile"
  ON seller_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all seller profiles"
  ON seller_profiles FOR ALL USING (is_admin());

-- ── CATEGORIES ───────────────────────────────────────────────
CREATE POLICY "Categories are public"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL USING (is_admin());

-- ── PRODUCTS ─────────────────────────────────────────────────
CREATE POLICY "Approved products are public"
  ON products FOR SELECT
  USING (status = 'approved' OR seller_id = get_my_seller_id() OR is_admin());

CREATE POLICY "Sellers can insert their own products"
  ON products FOR INSERT WITH CHECK (seller_id = get_my_seller_id());

CREATE POLICY "Sellers can update their own products"
  ON products FOR UPDATE USING (seller_id = get_my_seller_id());

CREATE POLICY "Sellers can delete their own products"
  ON products FOR DELETE USING (seller_id = get_my_seller_id());

CREATE POLICY "Admins can manage all products"
  ON products FOR ALL USING (is_admin());

-- ── PRODUCT IMAGES ───────────────────────────────────────────
CREATE POLICY "Product images are public"
  ON product_images FOR SELECT USING (true);

CREATE POLICY "Sellers can manage their product images"
  ON product_images FOR ALL
  USING (product_id IN (SELECT id FROM products WHERE seller_id = get_my_seller_id()));

CREATE POLICY "Admins can manage all product images"
  ON product_images FOR ALL USING (is_admin());

-- ── PRODUCT VARIANTS ─────────────────────────────────────────
CREATE POLICY "Product variants are public"
  ON product_variants FOR SELECT USING (true);

CREATE POLICY "Sellers can manage their product variants"
  ON product_variants FOR ALL
  USING (product_id IN (SELECT id FROM products WHERE seller_id = get_my_seller_id()));

-- ── PRODUCT ATTRIBUTES ───────────────────────────────────────
CREATE POLICY "Product attributes are public"
  ON product_attributes FOR SELECT USING (true);

CREATE POLICY "Sellers can manage their product attributes"
  ON product_attributes FOR ALL
  USING (product_id IN (SELECT id FROM products WHERE seller_id = get_my_seller_id()));

-- ── REVIEWS ──────────────────────────────────────────────────
CREATE POLICY "Approved reviews are public"
  ON reviews FOR SELECT USING (is_approved = true OR user_id = auth.uid() OR is_admin());

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL USING (is_admin());

-- ── WISHLISTS ─────────────────────────────────────────────────
CREATE POLICY "Users can manage their own wishlist"
  ON wishlists FOR ALL USING (user_id = auth.uid());

-- ── ADDRESSES ─────────────────────────────────────────────────
CREATE POLICY "Users can manage their own addresses"
  ON addresses FOR ALL USING (user_id = auth.uid());

-- ── CART ITEMS ───────────────────────────────────────────────
CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL USING (user_id = auth.uid());

-- ── ORDERS ───────────────────────────────────────────────────
CREATE POLICY "Buyers can see their own orders"
  ON orders FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Sellers can see orders for their products"
  ON orders FOR SELECT USING (seller_id = get_my_seller_id());

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Sellers can update order status"
  ON orders FOR UPDATE USING (seller_id = get_my_seller_id());

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL USING (is_admin());

-- ── ORDER ITEMS ──────────────────────────────────────────────
CREATE POLICY "Buyers can see their order items"
  ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can see their order items"
  ON order_items FOR SELECT USING (seller_id = get_my_seller_id());

CREATE POLICY "Order items can be inserted with order"
  ON order_items FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ── PAYMENTS ─────────────────────────────────────────────────
CREATE POLICY "Users can see their own payments"
  ON payments FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all payments"
  ON payments FOR ALL USING (is_admin());

-- ── CONVERSATIONS ─────────────────────────────────────────────
CREATE POLICY "Users can see their own conversations"
  ON conversations FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Buyers can create conversations"
  ON conversations FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- ── MESSAGES ─────────────────────────────────────────────────
CREATE POLICY "Conversation participants can see messages"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT id FROM conversations
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

CREATE POLICY "Senders can update their messages"
  ON messages FOR UPDATE USING (sender_id = auth.uid());

-- ── NOTIFICATIONS ─────────────────────────────────────────────
CREATE POLICY "Users can see their own notifications"
  ON notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT WITH CHECK (true);

-- ── PRODUCT VIEWS ─────────────────────────────────────────────
CREATE POLICY "Anyone can insert product views"
  ON product_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Sellers can see views of their products"
  ON product_views FOR SELECT
  USING (
    product_id IN (SELECT id FROM products WHERE seller_id = get_my_seller_id())
    OR is_admin()
  );

-- ── SEARCH QUERIES ────────────────────────────────────────────
CREATE POLICY "Anyone can insert search queries"
  ON search_queries FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can see search queries"
  ON search_queries FOR SELECT USING (is_admin());

-- ============================================================
-- STORAGE RLS POLICIES
-- ============================================================
-- CREATE POLICY "Product images are public" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
-- CREATE POLICY "Sellers can upload product images"
--   ON storage.objects FOR INSERT WITH CHECK (
--     bucket_id = 'product-images' AND auth.uid() IS NOT NULL
--   );
-- CREATE POLICY "Profile avatars are public" ON storage.objects FOR SELECT USING (bucket_id = 'profile-avatars');
-- CREATE POLICY "Users can upload their own avatar"
--   ON storage.objects FOR INSERT WITH CHECK (
--     bucket_id = 'profile-avatars' AND auth.uid() IS NOT NULL
--   );
