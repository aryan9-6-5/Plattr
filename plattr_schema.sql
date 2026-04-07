-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. ENUMS
DROP TYPE IF EXISTS source_type_enum CASCADE;
CREATE TYPE source_type_enum AS ENUM ('HOME_CHEF', 'CLOUD_KITCHEN', 'RESTAURANT');

DROP TYPE IF EXISTS meal_type_enum CASCADE;
CREATE TYPE meal_type_enum AS ENUM ('TIFFIN', 'BULK', 'EVENT', 'ALA_CARTE');

DROP TYPE IF EXISTS order_status_enum CASCADE;
CREATE TYPE order_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED');

DROP TYPE IF EXISTS cuisine_region_enum CASCADE;
CREATE TYPE cuisine_region_enum AS ENUM (
    'HYDERABADI', 'NORTH_INDIAN', 'SOUTH_INDIAN', 'GUJARATI',
    'RAJASTHANI', 'BENGALI', 'MAHARASHTRIAN', 'PUNJABI',
    'KERALA', 'MUGHLAI', 'CHETTINAD', 'AWADHI', 'COASTAL', 'OTHER'
);

DROP TYPE IF EXISTS diet_type_enum CASCADE;
CREATE TYPE diet_type_enum AS ENUM ('VEG', 'NON_VEG', 'EGG', 'VEGAN', 'JAIN');

DROP TYPE IF EXISTS subscription_plan_enum CASCADE;
CREATE TYPE subscription_plan_enum AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

DROP TYPE IF EXISTS subscription_status_enum CASCADE;
CREATE TYPE subscription_status_enum AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED');

DROP TYPE IF EXISTS user_role_enum CASCADE;
CREATE TYPE user_role_enum AS ENUM ('CUSTOMER', 'HOME_CHEF', 'KITCHEN_MANAGER', 'RESTAURANT_PARTNER', 'ADMIN', 'DELIVERY_PARTNER');

DROP TYPE IF EXISTS payment_status_enum CASCADE;
CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

DROP TYPE IF EXISTS spice_level_enum CASCADE;
CREATE TYPE spice_level_enum AS ENUM ('MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT');

-- 3. CORE ENTITY TABLES
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    role user_role_enum NOT NULL DEFAULT 'CUSTOMER',
    city TEXT,
    pincode TEXT,
    profile_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS chefs CASCADE;
CREATE TABLE chefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    bio TEXT,
    region cuisine_region_enum NOT NULL,
    city TEXT NOT NULL,
    specialty TEXT NOT NULL,
    years_exp INTEGER DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    max_daily_orders INTEGER DEFAULT 20,
    service_radius_km INTEGER DEFAULT 10,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS kitchens CASCADE;
CREATE TABLE kitchens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    capacity_per_day INTEGER NOT NULL DEFAULT 100,
    rating NUMERIC(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    contact_phone TEXT,
    contact_email TEXT,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS restaurants CASCADE;
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode TEXT,
    cuisine_region cuisine_region_enum NOT NULL,
    rating NUMERIC(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_partner BOOLEAN DEFAULT TRUE,
    contact_phone TEXT,
    website TEXT,
    fssai_license TEXT,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS b2b_clients CASCADE;
CREATE TABLE b2b_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL UNIQUE,
    contact_phone TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    gst_number TEXT,
    credit_limit NUMERIC(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS dishes CASCADE;
CREATE TABLE dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    cuisine cuisine_region_enum NOT NULL,
    meal_type meal_type_enum NOT NULL,
    diet_type diet_type_enum NOT NULL DEFAULT 'VEG',
    source_type source_type_enum NOT NULL,
    source_id UUID NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    bulk_price NUMERIC(10,2) CHECK (bulk_price IS NULL OR bulk_price > 0),
    min_bulk_qty INTEGER DEFAULT 20,
    spice_level spice_level_enum DEFAULT 'MEDIUM',
    prep_time_mins INTEGER DEFAULT 30 CHECK (prep_time_mins > 0),
    calories INTEGER CHECK (calories IS NULL OR calories > 0),
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    tags TEXT[],
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. RELATIONSHIP / JUNCTION TABLES
DROP TABLE IF EXISTS chef_cuisines CASCADE;
CREATE TABLE chef_cuisines (
    chef_id UUID REFERENCES chefs(id) ON DELETE CASCADE,
    cuisine cuisine_region_enum NOT NULL,
    PRIMARY KEY (chef_id, cuisine)
);

DROP TABLE IF EXISTS kitchen_chefs CASCADE;
CREATE TABLE kitchen_chefs (
    kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
    chef_id UUID REFERENCES chefs(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (kitchen_id, chef_id)
);

DROP TABLE IF EXISTS dish_ingredients CASCADE;
CREATE TABLE dish_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
    ingredient_name TEXT NOT NULL,
    is_allergen BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID REFERENCES profiles(id),
    target_type TEXT NOT NULL CHECK (target_type IN ('CHEF','KITCHEN','RESTAURANT','DISH')),
    target_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (reviewer_id, target_type, target_id)
);

-- 5. OPERATIONAL TABLES
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES profiles(id),
    b2b_client_id UUID REFERENCES b2b_clients(id),
    status order_status_enum DEFAULT 'PENDING',
    meal_type meal_type_enum NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_pincode TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_time TIME,
    special_notes TEXT,
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(12,2) DEFAULT 0,
    delivery_fee NUMERIC(8,2) DEFAULT 0,
    tax_amount NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    payment_status payment_status_enum DEFAULT 'PENDING',
    payment_method TEXT,
    payment_ref TEXT,
    cancelled_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CHECK (customer_id IS NOT NULL OR b2b_client_id IS NOT NULL)
);

DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    dish_id UUID REFERENCES dishes(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS subscriptions CASCADE;
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES profiles(id),
    plan subscription_plan_enum NOT NULL,
    status subscription_status_enum DEFAULT 'ACTIVE',
    meal_type meal_type_enum NOT NULL DEFAULT 'TIFFIN',
    preferred_dishes UUID[],
    delivery_address TEXT NOT NULL,
    delivery_pincode TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    meals_per_day INTEGER DEFAULT 1 CHECK (meals_per_day IN (1,2,3)),
    price_per_meal NUMERIC(8,2) NOT NULL,
    total_paid NUMERIC(12,2) DEFAULT 0,
    pause_reason TEXT,
    paused_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS chef_availability CASCADE;
CREATE TABLE chef_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chef_id UUID REFERENCES chefs(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (chef_id, day_of_week),
    CHECK (close_time > open_time)
);

DROP TABLE IF EXISTS kitchen_capacity_slots CASCADE;
CREATE TABLE kitchen_capacity_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    booked_qty INTEGER DEFAULT 0,
    max_capacity INTEGER NOT NULL,
    is_holiday BOOLEAN DEFAULT FALSE,
    UNIQUE (kitchen_id, slot_date),
    CHECK (booked_qty <= max_capacity)
);

DROP TABLE IF EXISTS delivery_zones CASCADE;
CREATE TABLE delivery_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type source_type_enum NOT NULL,
    source_id UUID NOT NULL,
    pincode TEXT NOT NULL,
    city TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (source_type, source_id, pincode)
);

DROP TABLE IF EXISTS promotions CASCADE;
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_pct NUMERIC(5,2),
    discount_flat NUMERIC(8,2),
    min_order_value NUMERIC(10,2) DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CHECK (discount_pct IS NOT NULL OR discount_flat IS NOT NULL),
    CHECK (valid_until > valid_from)
);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_dishes_cuisine ON dishes(cuisine);
CREATE INDEX IF NOT EXISTS idx_dishes_meal_type ON dishes(meal_type);
CREATE INDEX IF NOT EXISTS idx_dishes_source_type ON dishes(source_type);
CREATE INDEX IF NOT EXISTS idx_dishes_combo ON dishes(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_dishes_tags ON dishes USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_dishes_name_trgm ON dishes USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_b2b ON orders(b2b_client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);

-- 7. ROW LEVEL SECURITY POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id OR is_admin());
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Inherit order visibility for items" ON order_items FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid() OR is_admin())
));
CREATE POLICY "Customers can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = customer_id OR is_admin());
CREATE POLICY "Customers can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = customer_id OR is_admin());
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update/delete own reviews" ON reviews FOR UPDATE USING (auth.uid() = reviewer_id) WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- 8. HELPER FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION trigger_set_timestamp() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_chefs BEFORE UPDATE ON chefs FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_kitchens BEFORE UPDATE ON kitchens FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_restaurants BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_dishes BEFORE UPDATE ON dishes FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_b2b_clients BEFORE UPDATE ON b2b_clients FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_subscriptions BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE OR REPLACE FUNCTION refresh_rating_fn() RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC; review_count INTEGER; t_id UUID; t_type TEXT;
BEGIN
    IF TG_OP = 'DELETE' THEN t_id := OLD.target_id; t_type := OLD.target_type;
    ELSE t_id := NEW.target_id; t_type := NEW.target_type; END IF;

    SELECT COALESCE(AVG(rating), 0), COUNT(id) INTO avg_rating, review_count FROM reviews WHERE target_id = t_id AND target_type = t_type;
    IF t_type = 'CHEF' THEN UPDATE chefs SET rating = avg_rating, total_reviews = review_count WHERE id = t_id;
    ELSIF t_type = 'KITCHEN' THEN UPDATE kitchens SET rating = avg_rating, total_reviews = review_count WHERE id = t_id;
    ELSIF t_type = 'RESTAURANT' THEN UPDATE restaurants SET rating = avg_rating, total_reviews = review_count WHERE id = t_id; END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_rating AFTER INSERT OR UPDATE OR DELETE ON reviews FOR EACH ROW EXECUTE FUNCTION refresh_rating_fn();

CREATE SEQUENCE IF NOT EXISTS order_number_seq;
CREATE OR REPLACE FUNCTION set_order_number_fn() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN NEW.order_number := 'PLT-' || to_char(NOW(), 'YYYY') || '-' || lpad(nextval('order_number_seq')::text, 5, '0'); END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_set_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION set_order_number_fn();

CREATE OR REPLACE FUNCTION update_kitchen_capacity_fn() RETURNS TRIGGER AS $$
DECLARE
    m_type meal_type_enum; s_type source_type_enum; k_id UUID; d_date DATE; cap INTEGER; booked INTEGER;
BEGIN
    SELECT meal_type, delivery_date INTO m_type, d_date FROM orders WHERE id = NEW.order_id;
    IF m_type IN ('BULK', 'EVENT') THEN
        SELECT source_type, source_id INTO s_type, k_id FROM dishes WHERE id = NEW.dish_id;
        IF s_type = 'CLOUD_KITCHEN' THEN
            SELECT booked_qty, max_capacity INTO booked, cap FROM kitchen_capacity_slots WHERE kitchen_id = k_id AND slot_date = d_date FOR UPDATE;
            IF FOUND THEN
                IF booked + NEW.quantity > cap THEN RAISE EXCEPTION 'Kitchen capacity exceeded for date %', d_date;
                ELSE UPDATE kitchen_capacity_slots SET booked_qty = booked_qty + NEW.quantity WHERE kitchen_id = k_id AND slot_date = d_date; END IF;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_kitchen_capacity AFTER INSERT ON order_items FOR EACH ROW EXECUTE FUNCTION update_kitchen_capacity_fn();

CREATE OR REPLACE FUNCTION validate_source_id_fn() RETURNS TRIGGER AS $$
DECLARE exists_flag BOOLEAN;
BEGIN
    IF NEW.source_type = 'HOME_CHEF' THEN SELECT EXISTS(SELECT 1 FROM chefs WHERE id = NEW.source_id) INTO exists_flag;
    ELSIF NEW.source_type = 'CLOUD_KITCHEN' THEN SELECT EXISTS(SELECT 1 FROM kitchens WHERE id = NEW.source_id) INTO exists_flag;
    ELSIF NEW.source_type = 'RESTAURANT' THEN SELECT EXISTS(SELECT 1 FROM restaurants WHERE id = NEW.source_id) INTO exists_flag; END IF;
    IF NOT exists_flag THEN RAISE EXCEPTION 'Invalid source'; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_validate_source_id BEFORE INSERT OR UPDATE ON dishes FOR EACH ROW EXECUTE FUNCTION validate_source_id_fn();

-- 9. SEED DATA
DO $$ 
DECLARE
    c_ravi UUID := gen_random_uuid(); c_sneha UUID := gen_random_uuid(); c_rahul UUID := gen_random_uuid();
    p_anita UUID := gen_random_uuid(); p_kavita UUID := gen_random_uuid(); p_lakshmi UUID := gen_random_uuid(); p_mgr UUID := gen_random_uuid(); p_admin UUID := gen_random_uuid();
    ch_anita UUID := gen_random_uuid(); ch_kavita UUID := gen_random_uuid(); ch_lakshmi UUID := gen_random_uuid(); ch_sunita UUID := gen_random_uuid(); ch_meena UUID := gen_random_uuid();
    k_central UUID := gen_random_uuid(); k_urban UUID := gen_random_uuid(); k_north UUID := gen_random_uuid();
    r_shah UUID := gen_random_uuid(); r_paradise UUID := gen_random_uuid(); r_buhari UUID := gen_random_uuid(); r_karim UUID := gen_random_uuid();
    d_biryani UUID := gen_random_uuid(); d_mutton UUID := gen_random_uuid(); d_veg_thali UUID := gen_random_uuid(); d_idli UUID := gen_random_uuid(); d_guj_thali UUID := gen_random_uuid(); d_kerala_sadhya UUID := gen_random_uuid(); d_haleem UUID := gen_random_uuid(); d_paneer UUID := gen_random_uuid(); d_chettinad UUID := gen_random_uuid(); d_dal UUID := gen_random_uuid(); d_seekh UUID := gen_random_uuid(); d_dhokla UUID := gen_random_uuid(); d_fish UUID := gen_random_uuid(); d_dum_aloo UUID := gen_random_uuid(); d_wedding UUID := gen_random_uuid();
    b2b_techpark UUID := gen_random_uuid(); b2b_school UUID := gen_random_uuid();
    promo_welcome UUID := gen_random_uuid(); promo_bulk UUID := gen_random_uuid(); promo_festive UUID := gen_random_uuid();
    o_tiffin UUID := gen_random_uuid(); o_bulk UUID := gen_random_uuid(); o_event UUID := gen_random_uuid();
    sub_1 UUID := gen_random_uuid(); sub_2 UUID := gen_random_uuid();
BEGIN
    -- PROFILES
    INSERT INTO profiles (id, full_name, phone, role, city, pincode) VALUES
    (c_ravi, 'Ravi Kumar', '+919999999001', 'CUSTOMER', 'Hyderabad', '500001'),
    (c_sneha, 'Sneha Verma', '+919999999002', 'CUSTOMER', 'Delhi', '110001'),
    (c_rahul, 'Rahul Dravid', '+919999999003', 'CUSTOMER', 'Bangalore', '560001'),
    (p_anita, 'Anita Reddy', '+919999999004', 'HOME_CHEF', 'Hyderabad', '500002'),
    (p_kavita, 'Kavita Sharma', '+919999999005', 'HOME_CHEF', 'Delhi', '110002'),
    (p_lakshmi, 'Lakshmi Iyer', '+919999999006', 'HOME_CHEF', 'Chennai', '600001'),
    (p_mgr, 'Kitchen Manager', '+919999999007', 'KITCHEN_MANAGER', 'Hyderabad', '500003'),
    (p_admin, 'System Admin', '+919999999008', 'ADMIN', 'Mumbai', '400001');

    -- CHEFS
    INSERT INTO chefs (id, profile_id, name, bio, region, city, specialty, years_exp) VALUES
    (ch_anita, p_anita, 'Anita Reddy', 'Authentic Hyderabadi home cooked meals', 'HYDERABADI', 'Hyderabad', 'Hyderabadi Dum Biryani, Haleem', 12),
    (ch_kavita, p_kavita, 'Kavita Sharma', 'North Indian delights from the heart', 'NORTH_INDIAN', 'Delhi', 'North Indian Thali, Dal Makhani', 8),
    (ch_lakshmi, p_lakshmi, 'Lakshmi Iyer', 'Traditional Tamil Nadu flavors', 'CHETTINAD', 'Chennai', 'Chettinad Meals, Filter Coffee', 15),
    (ch_sunita, NULL, 'Sunita Patel', 'Gujarati classics natively prepared', 'GUJARATI', 'Ahmedabad', 'Gujarati Thali, Dhokla, Undhiyu', 20),
    (ch_meena, NULL, 'Meena Krishnan', 'Coastal Kerala specials', 'KERALA', 'Kochi', 'Kerala Sadhya, Fish Curry', 6);

    -- CHEF CUISINES
    INSERT INTO chef_cuisines (chef_id, cuisine) VALUES
    (ch_anita, 'HYDERABADI'), (ch_anita, 'MUGHLAI'),
    (ch_kavita, 'NORTH_INDIAN'), (ch_kavita, 'PUNJABI'),
    (ch_lakshmi, 'SOUTH_INDIAN'), (ch_lakshmi, 'CHETTINAD'),
    (ch_sunita, 'GUJARATI'),
    (ch_meena, 'KERALA'), (ch_meena, 'COASTAL');

    -- KITCHENS
    INSERT INTO kitchens (id, name, description, city, address, pincode, capacity_per_day) VALUES
    (k_central, 'Central Cloud Kitchen', 'Main operations center for bulk catering', 'Hyderabad', 'Jubilee Hills', '500033', 150),
    (k_urban, 'Urban Kitchen Hub', 'Modern bulk cooking facility', 'Bangalore', 'Koramangala', '560034', 200),
    (k_north, 'North India Prep Center', 'Dedicated North Indian event preps', 'Delhi', 'Connaught Place', '110001', 100);

    -- KITCHEN CHEFS
    INSERT INTO kitchen_chefs (kitchen_id, chef_id) VALUES
    (k_central, ch_anita), (k_north, ch_kavita);

    -- RESTAURANTS
    INSERT INTO restaurants (id, name, brand, description, city, address, pincode, cuisine_region, fssai_license) VALUES
    (r_shah, 'Shah Ghouse', 'Shah Ghouse', 'Legendary Biryani', 'Hyderabad', 'Tolichowki', '500008', 'HYDERABADI', 'FSSAI1001'),
    (r_paradise, 'Paradise', 'Paradise', 'World Famous Biryani', 'Hyderabad', 'Secunderabad', '500003', 'HYDERABADI', 'FSSAI1002'),
    (r_buhari, 'Buhari Hotel', 'Buhari', 'Home of 65', 'Chennai', 'Mount Road', '600002', 'SOUTH_INDIAN', 'FSSAI1003'),
    (r_karim, 'Karims', 'Karims', 'Mughlai Excellence', 'Delhi', 'Jama Masjid', '110006', 'MUGHLAI', 'FSSAI1004');

    -- DISHES
    INSERT INTO dishes (id, name, description, cuisine, meal_type, diet_type, source_type, source_id, price, bulk_price, spice_level, prep_time_mins) VALUES
    (d_biryani, 'Chicken Biryani', 'Classic Dum Biryani', 'HYDERABADI', 'BULK', 'NON_VEG', 'RESTAURANT', r_shah, 250, 220, 'HOT', 45),
    (d_mutton, 'Mutton Biryani', 'Special Mutton Dum Biryani', 'HYDERABADI', 'ALA_CARTE', 'NON_VEG', 'RESTAURANT', r_paradise, 320, NULL, 'HOT', 45),
    (d_veg_thali, 'Veg Thali', 'Daily staple meal layout', 'NORTH_INDIAN', 'TIFFIN', 'VEG', 'HOME_CHEF', ch_kavita, 120, NULL, 'MILD', 30),
    (d_idli, 'Idli Sambar', 'Soft idlis with aromatic sambar', 'SOUTH_INDIAN', 'TIFFIN', 'VEG', 'HOME_CHEF', ch_lakshmi, 80, NULL, 'MILD', 20),
    (d_guj_thali, 'Gujarati Thali', 'Complete sweet & savory meal', 'GUJARATI', 'TIFFIN', 'VEG', 'HOME_CHEF', ch_sunita, 150, NULL, 'MILD', 40),
    (d_kerala_sadhya, 'Kerala Sadhya', 'Traditional festive feast of Kerala', 'KERALA', 'EVENT', 'VEG', 'HOME_CHEF', ch_meena, 350, 300, 'MEDIUM', 120),
    (d_haleem, 'Haleem', 'Rich lentil and meat stew', 'HYDERABADI', 'BULK', 'NON_VEG', 'HOME_CHEF', ch_anita, 180, 160, 'HOT', 180),
    (d_paneer, 'Paneer Butter Masala', 'Creamy rich cottage cheese curry', 'NORTH_INDIAN', 'BULK', 'VEG', 'CLOUD_KITCHEN', k_north, 140, 120, 'MEDIUM', 35),
    (d_chettinad, 'Chettinad Chicken', 'Fiery Tamil Nadu special chicken', 'CHETTINAD', 'ALA_CARTE', 'NON_VEG', 'HOME_CHEF', ch_lakshmi, 220, NULL, 'EXTRA_HOT', 40),
    (d_dal, 'Dal Makhani', 'Slow cooked black lentils', 'NORTH_INDIAN', 'TIFFIN', 'VEG', 'HOME_CHEF', ch_kavita, 100, NULL, 'MEDIUM', 45),
    (d_seekh, 'Seekh Kebab', 'Minced meat skewers', 'MUGHLAI', 'ALA_CARTE', 'NON_VEG', 'RESTAURANT', r_karim, 280, NULL, 'HOT', 30),
    (d_dhokla, 'Dhokla Platter', 'Steamed savory gram flour cakes', 'GUJARATI', 'TIFFIN', 'VEG', 'HOME_CHEF', ch_sunita, 90, NULL, 'MILD', 20),
    (d_fish, 'Fish Curry Meal', 'Tangy coconut fish curry with rice', 'KERALA', 'TIFFIN', 'NON_VEG', 'HOME_CHEF', ch_meena, 200, NULL, 'HOT', 35),
    (d_dum_aloo, 'Dum Aloo', 'Spiced baby potatoes in gravy', 'NORTH_INDIAN', 'BULK', 'VEG', 'CLOUD_KITCHEN', k_urban, 110, 95, 'MEDIUM', 40),
    (d_wedding, 'Wedding Pulao', 'Aromatic rice for celebrations', 'HYDERABADI', 'EVENT', 'VEG', 'CLOUD_KITCHEN', k_central, 180, 150, 'MILD', 90);

    -- DISH INGREDIENTS
    INSERT INTO dish_ingredients (dish_id, ingredient_name, is_allergen) VALUES
    (d_paneer, 'Paneer (Dairy)', TRUE), (d_paneer, 'Cashew Paste (Nuts)', TRUE), (d_paneer, 'Tomatoes', FALSE),
    (d_fish, 'Fish (Seafood)', TRUE), (d_fish, 'Coconut', FALSE), (d_fish, 'Tamarind', FALSE),
    (d_dum_aloo, 'Potatoes', FALSE), (d_dum_aloo, 'Yogurt (Dairy)', TRUE);

    -- B2B CLIENTS
    INSERT INTO b2b_clients (id, company_name, contact_name, contact_email, contact_phone, city) VALUES
    (b2b_techpark, 'TechPark Cafeteria', 'Amit Singh', 'amit@techpark.com', '+919888888001', 'Hyderabad'),
    (b2b_school, 'Sunrise School', 'Priya Desai', 'admin@sunriseschool.com', '+919888888002', 'Bangalore');

    -- CHEF AVAILABILITY
    FOR i IN 1..6 LOOP
        INSERT INTO chef_availability (chef_id, day_of_week, open_time, close_time) VALUES
        (ch_anita, i, '08:00', '20:00'), (ch_kavita, i, '08:00', '20:00'),
        (ch_lakshmi, i, '08:00', '20:00'), (ch_sunita, i, '08:00', '20:00');
    END LOOP;

    -- KITCHEN CAPACITY SLOTS
    FOR i IN 0..6 LOOP
        INSERT INTO kitchen_capacity_slots (kitchen_id, slot_date, max_capacity) VALUES
        (k_central, CURRENT_DATE + i, 150), (k_urban, CURRENT_DATE + i, 200), (k_north, CURRENT_DATE + i, 100);
    END LOOP;

    -- DELIVERY ZONES
    INSERT INTO delivery_zones (source_type, source_id, pincode, city) VALUES
    ('HOME_CHEF', ch_anita, '500001', 'Hyderabad'), ('HOME_CHEF', ch_anita, '500002', 'Hyderabad'),
    ('CLOUD_KITCHEN', k_central, '500033', 'Hyderabad'), ('RESTAURANT', r_shah, '500008', 'Hyderabad');

    -- PROMOTIONS
    INSERT INTO promotions (id, code, description, discount_pct, min_order_value, valid_from, valid_until) VALUES
    (promo_welcome, 'WELCOME10', '10% off first order', 10.00, 100.00, NOW(), NOW() + INTERVAL '1 year'),
    (promo_festive, 'FESTIVE15', '15% off event catering', 15.00, 5000.00, NOW(), NOW() + INTERVAL '1 month');
    INSERT INTO promotions (id, code, description, discount_flat, min_order_value, valid_from, valid_until) VALUES
    (promo_bulk, 'BULK20', '₹200 off bulk orders', 200.00, 2000.00, NOW(), NOW() + INTERVAL '1 year');

    -- ORDERS
    INSERT INTO orders (id, order_number, customer_id, status, meal_type, delivery_address, delivery_pincode, delivery_date, subtotal, total_amount) VALUES
    (o_tiffin, 'PLT-2024-00001', c_ravi, 'DELIVERED', 'TIFFIN', 'Flat 101, Hyd', '500001', CURRENT_DATE - 1, 120.00, 120.00);
    INSERT INTO orders (id, order_number, b2b_client_id, status, meal_type, delivery_address, delivery_pincode, delivery_date, subtotal, total_amount) VALUES
    (o_bulk, 'PLT-2024-00002', b2b_techpark, 'CONFIRMED', 'BULK', 'TechPark Campus', '500033', CURRENT_DATE + 2, 25000.00, 25000.00);
    INSERT INTO orders (id, order_number, customer_id, status, meal_type, delivery_address, delivery_pincode, delivery_date, subtotal, total_amount) VALUES
    (o_event, 'PLT-2024-00003', c_sneha, 'PENDING', 'EVENT', 'Delhi Banquet', '110001', CURRENT_DATE + 5, 17500.00, 17500.00);

    -- ORDER ITEMS
    INSERT INTO order_items (order_id, dish_id, quantity, unit_price) VALUES
    (o_tiffin, d_veg_thali, 1, 120.00), (o_bulk, d_biryani, 100, 250.00), (o_event, d_kerala_sadhya, 50, 350.00);

    -- SUBSCRIPTIONS
    INSERT INTO subscriptions (id, customer_id, plan, meal_type, delivery_address, delivery_pincode, start_date, end_date, price_per_meal) VALUES
    (sub_1, c_ravi, 'MONTHLY', 'TIFFIN', 'Flat 101, Hyd', '500001', CURRENT_DATE - 10, CURRENT_DATE + 20, 120.00),
    (sub_2, c_rahul, 'WEEKLY', 'TIFFIN', 'Villa 4, BLR', '560001', CURRENT_DATE, CURRENT_DATE + 7, 150.00);

    -- REVIEWS
    INSERT INTO reviews (reviewer_id, target_type, target_id, rating, comment, is_verified_purchase) VALUES
    (c_ravi, 'CHEF', ch_kavita, 5, 'Amazing home food!', TRUE),
    (c_sneha, 'RESTAURANT', r_shah, 4, 'Great biryani but slightly oily.', TRUE),
    (c_rahul, 'CHEF', ch_anita, 5, 'Best Haleem outside of Ramzan!', TRUE),
    (c_ravi, 'DISH', d_veg_thali, 5, 'Very comforting.', TRUE),
    (c_sneha, 'KITCHEN', k_north, 4, 'Good arrangement for bulk food.', FALSE);
END $$;

-- 10. VERIFICATION QUERIES
/*
SELECT 
    (SELECT count(*) FROM profiles) as profiles_count,
    (SELECT count(*) FROM chefs) as chefs_count,
    (SELECT count(*) FROM kitchens) as kitchens_count,
    (SELECT count(*) FROM restaurants) as restaurants_count,
    (SELECT count(*) FROM dishes) as dishes_count,
    (SELECT count(*) FROM orders) as orders_count;

SELECT d.name AS dish_name, d.source_type,
    CASE 
        WHEN d.source_type = 'HOME_CHEF' THEN c.name
        WHEN d.source_type = 'CLOUD_KITCHEN' THEN k.name
        WHEN d.source_type = 'RESTAURANT' THEN r.name
    END AS source_name, d.price
FROM dishes d LEFT JOIN chefs c ON d.source_id = c.id
LEFT JOIN kitchens k ON d.source_id = k.id LEFT JOIN restaurants r ON d.source_id = r.id;

SELECT name, region, rating, total_reviews FROM chefs 
WHERE total_reviews > 0 ORDER BY rating DESC, total_reviews DESC;

SELECT o.order_number, COALESCE(p.full_name, b.company_name) AS ordered_by,
    o.total_amount, o.status, o.delivery_date
FROM orders o LEFT JOIN profiles p ON o.customer_id = p.id LEFT JOIN b2b_clients b ON o.b2b_client_id = b.id
ORDER BY o.created_at DESC;

SELECT p.full_name, s.plan, s.meal_type, s.start_date, s.end_date 
FROM subscriptions s JOIN profiles p ON s.customer_id = p.id WHERE s.status = 'ACTIVE';

SELECT k.name, kcs.slot_date, kcs.booked_qty, kcs.max_capacity,
    ROUND((kcs.booked_qty::numeric / kcs.max_capacity) * 100, 2) as utilization_pct
FROM kitchen_capacity_slots kcs JOIN kitchens k ON kcs.kitchen_id = k.id
WHERE kcs.slot_date >= CURRENT_DATE ORDER BY k.name, kcs.slot_date;
*/
