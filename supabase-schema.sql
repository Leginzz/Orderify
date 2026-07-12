-- ============================================
-- ORDERIFY - Database Schema for Supabase
-- ============================================
-- Execute this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. RESTAURANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX idx_restaurants_is_active ON restaurants(is_active);

-- ============================================
-- 2. MENU ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  preparation_time INTEGER DEFAULT 0, -- in minutes
  calories INTEGER,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_is_featured ON menu_items(is_featured);

-- ============================================
-- 3. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT,
  order_type TEXT CHECK (order_type IN ('delivery', 'pickup', 'dine-in')) NOT NULL,
  table_number INTEGER,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- 4. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  modifiers JSONB, -- Extra toppings, size, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

-- ============================================
-- 5. USER PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'restaurant_owner', 'super_admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- ============================================
-- 6. REVIEWS TABLE (optional feature)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_is_visible ON reviews(is_visible);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RESTAURANTS POLICIES
-- ============================================

-- Public can view active restaurants
CREATE POLICY "Public can view active restaurants"
ON restaurants FOR SELECT
USING (is_active = true);

-- Owners can view their own restaurants (including inactive)
CREATE POLICY "Owners can view their restaurants"
ON restaurants FOR SELECT
USING (auth.uid() = owner_id);

-- Owners can insert their own restaurants
CREATE POLICY "Owners can create restaurants"
ON restaurants FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own restaurants
CREATE POLICY "Owners can update their restaurants"
ON restaurants FOR UPDATE
USING (auth.uid() = owner_id);

-- Owners can delete their own restaurants
CREATE POLICY "Owners can delete their restaurants"
ON restaurants FOR DELETE
USING (auth.uid() = owner_id);

-- ============================================
-- MENU ITEMS POLICIES
-- ============================================

-- Public can view available menu items from active restaurants
CREATE POLICY "Public can view available menu items"
ON menu_items FOR SELECT
USING (
  is_available = true 
  AND restaurant_id IN (
    SELECT id FROM restaurants WHERE is_active = true
  )
);

-- Restaurant owners can view their own menu items
CREATE POLICY "Owners can view their menu items"
ON menu_items FOR SELECT
USING (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- Owners can insert menu items for their restaurants
CREATE POLICY "Owners can create menu items"
ON menu_items FOR INSERT
WITH CHECK (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- Owners can update their menu items
CREATE POLICY "Owners can update menu items"
ON menu_items FOR UPDATE
USING (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- Owners can delete their menu items
CREATE POLICY "Owners can delete menu items"
ON menu_items FOR DELETE
USING (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- ============================================
-- ORDERS POLICIES
-- ============================================

-- Customers can view their own orders
CREATE POLICY "Customers can view their orders"
ON orders FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM user_profiles WHERE email = orders.customer_email
  )
  OR 
  restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- Restaurant owners can view orders for their restaurants
CREATE POLICY "Owners can view orders for their restaurants"
ON orders FOR SELECT
USING (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders"
ON orders FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Restaurant owners can update orders for their restaurants
CREATE POLICY "Owners can update orders for their restaurants"
ON orders FOR UPDATE
USING (
  restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  )
);

-- ============================================
-- ORDER ITEMS POLICIES
-- ============================================

-- Visible to anyone who can see the order
CREATE POLICY "View order items"
ON order_items FOR SELECT
USING (
  order_id IN (
    SELECT id FROM orders WHERE 
      auth.uid() IN (
        SELECT id FROM user_profiles WHERE email = orders.customer_email
      )
      OR
      restaurant_id IN (
        SELECT id FROM restaurants WHERE owner_id = auth.uid()
      )
  )
);

-- Authenticated users can create order items
CREATE POLICY "Create order items"
ON order_items FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- USER PROFILES POLICIES
-- ============================================

-- Public can view basic profile info
CREATE POLICY "Public can view profiles"
ON user_profiles FOR SELECT
USING (true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- Authenticated users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- REVIEWS POLICIES
-- ============================================

-- Public can view visible reviews
CREATE POLICY "Public can view visible reviews"
ON reviews FOR SELECT
USING (is_visible = true);

-- Authenticated users can create reviews
CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (SELECT role FROM public.user_profiles WHERE email = NEW.email),
      'customer'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Uncomment to add sample data for testing
/*
INSERT INTO restaurants (name, slug, description, primary_color, secondary_color, is_active)
VALUES 
  ('Pizza Palace', 'pizza-palace', 'The best pizza in town', '#FF6B6B', '#FFFFFF', true),
  ('Burger House', 'burger-house', 'Gourmet burgers', '#FFA500', '#FFFFFF', true),
  ('Sushi Master', 'sushi-master', 'Authentic Japanese sushi', '#FF69B4', '#FFFFFF', true);

INSERT INTO menu_items (restaurant_id, name, description, price, category, is_available, is_featured)
VALUES 
  ((SELECT id FROM restaurants WHERE slug = 'pizza-palace'), 'Margherita Pizza', 'Classic tomato and mozzarella', 12.99, 'Pizza', true, true),
  ((SELECT id FROM restaurants WHERE slug = 'pizza-palace'), 'Pepperoni Pizza', 'Pepperoni and cheese', 14.99, 'Pizza', true, true),
  ((SELECT id FROM restaurants WHERE slug = 'burger-house'), 'Classic Burger', 'Beef patty with lettuce and tomato', 9.99, 'Burgers', true, true),
  ((SELECT id FROM restaurants WHERE slug = 'burger-house'), 'Cheese Burger', 'Double cheese', 11.99, 'Burgers', true, false),
  ((SELECT id FROM restaurants WHERE slug = 'sushi-master'), 'California Roll', 'Crab, avocado, cucumber', 8.99, 'Sushi', true, true),
  ((SELECT id FROM restaurants WHERE slug = 'sushi-master'), 'Salmon Nigiri', 'Fresh salmon', 6.99, 'Sushi', true, true);
*/

-- ============================================
-- END OF SCHEMA
-- ============================================