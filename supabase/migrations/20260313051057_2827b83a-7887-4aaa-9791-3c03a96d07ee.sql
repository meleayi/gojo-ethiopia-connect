
-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'admin', 'moderator');
CREATE TYPE public.user_status AS ENUM ('active', 'pending', 'suspended', 'banned');
CREATE TYPE public.seller_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE public.product_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'archived');
CREATE TYPE public.listing_type AS ENUM ('sale', 'rent');
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE public.payment_method AS ENUM ('telebirr', 'cbe_birr', 'amole', 'chapa', 'cash_on_delivery');
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE public.notification_type AS ENUM ('message', 'order', 'approval', 'rejection', 'review', 'seller_verification', 'system');
CREATE TYPE public.delivery_method AS ENUM ('standard', 'express', 'same_day');
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role public.user_role NOT NULL DEFAULT 'buyer',
  status public.user_status NOT NULL DEFAULT 'active',
  city TEXT,
  sub_city TEXT,
  woreda TEXT,
  house_number TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- USER ROLES (separate table for security)
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.user_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- SELLER PROFILES
-- ============================================================
CREATE TABLE public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  business_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_license TEXT,
  company_address TEXT NOT NULL,
  city TEXT NOT NULL,
  years_in_business INT,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  status public.seller_status NOT NULL DEFAULT 'pending',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_note TEXT,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_reviews INT NOT NULL DEFAULT 0,
  total_sales INT NOT NULL DEFAULT 0,
  total_products INT NOT NULL DEFAULT 0,
  response_time_hours INT NOT NULL DEFAULT 24,
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seller profiles are viewable by everyone" ON public.seller_profiles FOR SELECT USING (true);
CREATE POLICY "Sellers can update own profile" ON public.seller_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own seller profile" ON public.seller_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update any seller profile" ON public.seller_profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_amharic TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  product_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(user_id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  original_price NUMERIC(12,2),
  currency TEXT NOT NULL DEFAULT 'ETB',
  listing_type public.listing_type NOT NULL DEFAULT 'sale',
  rent_period TEXT,
  status public.product_status NOT NULL DEFAULT 'pending',
  rejection_note TEXT,
  badge TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INT NOT NULL DEFAULT 0,
  min_order_quantity INT NOT NULL DEFAULT 1,
  max_order_quantity INT,
  weight_kg NUMERIC(8,2),
  dimensions JSONB DEFAULT '{}',
  condition TEXT NOT NULL DEFAULT 'new',
  brand TEXT,
  model TEXT,
  location TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT 'Addis Ababa',
  specs JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  view_count INT NOT NULL DEFAULT 0,
  wishlist_count INT NOT NULL DEFAULT 0,
  order_count INT NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_flash_deal BOOLEAN NOT NULL DEFAULT false,
  flash_deal_ends_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved products viewable by everyone" ON public.products FOR SELECT USING (status = 'approved' OR auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers can insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers can delete own products" ON public.products FOR DELETE USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_city ON public.products(city);
CREATE INDEX idx_products_price ON public.products(price);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Sellers can manage product images" ON public.product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price_adjustment NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  attributes JSONB DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Variants viewable by everyone" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Sellers can manage variants" ON public.product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- ============================================================
-- PRODUCT ATTRIBUTES
-- ============================================================
CREATE TABLE public.product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_name TEXT NOT NULL,
  attribute_value TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Attributes viewable by everyone" ON public.product_attributes FOR SELECT USING (true);
CREATE POLICY "Sellers can manage attributes" ON public.product_attributes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  helpful_count INT NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  reply TEXT,
  reply_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews viewable by everyone" ON public.reviews FOR SELECT USING (is_approved = true OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_reviews_product ON public.reviews(product_id);

-- ============================================================
-- WISHLISTS
-- ============================================================
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist items" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  sub_city TEXT NOT NULL,
  woreda TEXT NOT NULL,
  house_number TEXT,
  additional_info TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- CART ITEMS
-- ============================================================
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INT NOT NULL DEFAULT 1,
  saved_for_later BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  status public.order_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(12,2) NOT NULL,
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ETB',
  address_id UUID REFERENCES public.addresses(id),
  shipping_full_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_sub_city TEXT NOT NULL,
  shipping_woreda TEXT NOT NULL,
  shipping_house_number TEXT,
  shipping_additional_info TEXT,
  delivery_method public.delivery_method NOT NULL DEFAULT 'standard',
  estimated_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sellers and admins can update orders" ON public.orders FOR UPDATE USING (auth.uid() = seller_id OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL DEFAULT '',
  variant_name TEXT,
  quantity INT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items viewable by order owner" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (user_id = auth.uid() OR seller_id = auth.uid()))
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  method public.payment_method NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ETB',
  transaction_id TEXT,
  provider_reference TEXT,
  provider_response JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update payments" ON public.payments FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID REFERENCES public.products(id),
  order_id UUID REFERENCES public.orders(id),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  buyer_unread_count INT NOT NULL DEFAULT 0,
  seller_unread_count INT NOT NULL DEFAULT 0,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants can update conversations" ON public.conversations FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT,
  image_url TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  message_type TEXT NOT NULL DEFAULT 'text',
  status public.message_status NOT NULL DEFAULT 'sent',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conversation participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- ============================================================
-- PRODUCT VIEWS
-- ============================================================
CREATE TABLE public.product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  ip_hash TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert product views" ON public.product_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins and sellers can view product views" ON public.product_views FOR SELECT USING (
  public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = auth.uid())
);

-- ============================================================
-- SEARCH QUERIES
-- ============================================================
CREATE TABLE public.search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  query TEXT NOT NULL,
  results_count INT NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert search queries" ON public.search_queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view search queries" ON public.search_queries FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON public.seller_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'buyer')
  );
  
  -- Also insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'buyer')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- INCREMENT VIEW COUNT FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_view_count(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products SET view_count = view_count + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- ENABLE REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
