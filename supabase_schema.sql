-- Esquema de base de datos para Ddreams 3D
-- Basado en la estructura de tipos del proyecto

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===== USUARIOS Y AUTENTICACIÓN =====

-- Tabla de usuarios (extiende auth.users de Supabase)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    phone TEXT,
    address TEXT,
    birth_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== EMPRESAS B2B =====

CREATE TABLE public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    ruc TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    contact_person TEXT,
    industry TEXT,
    size TEXT CHECK (size IN ('small', 'medium', 'large', 'enterprise')),
    payment_terms INTEGER DEFAULT 30, -- días
    credit_limit DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    website TEXT,
    employee_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usuarios B2B asociados a empresas
CREATE TABLE public.b2b_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'manager', 'user')) DEFAULT 'user',
    permissions TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- ===== CATEGORÍAS Y PRODUCTOS =====

CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    product_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount DECIMAL(5,2),
    currency TEXT DEFAULT 'USD',
    sku TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER,
    weight DECIMAL(8,3),
    materials TEXT[] DEFAULT '{}',
    print_time INTEGER, -- en horas
    complexity TEXT CHECK (complexity IN ('low', 'medium', 'high')) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Imágenes de productos
CREATE TABLE public.product_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Especificaciones de productos
CREATE TABLE public.product_specifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dimensiones de productos
CREATE TABLE public.product_dimensions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    length DECIMAL(8,3) NOT NULL,
    width DECIMAL(8,3) NOT NULL,
    height DECIMAL(8,3) NOT NULL,
    unit TEXT CHECK (unit IN ('mm', 'cm', 'm')) DEFAULT 'mm',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags de productos
CREATE TABLE public.product_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, tag)
);

-- ===== CARRITO DE COMPRAS =====

CREATE TABLE public.carts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, product_id)
);

-- Personalizaciones de items del carrito
CREATE TABLE public.cart_item_customizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cart_item_id UUID REFERENCES public.cart_items(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('color', 'material', 'size', 'finish', 'other')),
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    additional_cost DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== DIRECCIONES =====

CREATE TABLE public.addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÓRDENES Y PEDIDOS =====

CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN (
        'pending', 'confirmed', 'processing', 'printing', 'post_processing',
        'quality_check', 'packaging', 'shipped', 'delivered', 'cancelled', 'refunded'
    )) DEFAULT 'pending',
    payment_status TEXT CHECK (payment_status IN (
        'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
    )) DEFAULT 'pending',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    shipping_address_id UUID REFERENCES public.addresses(id),
    billing_address_id UUID REFERENCES public.addresses(id),
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    tracking_number TEXT,
    notes TEXT,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items de órdenes
CREATE TABLE public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    file_name TEXT,
    material TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'printing', 'post-processing', 'quality-check', 'completed', 'cancelled')) DEFAULT 'pending',
    start_time TIMESTAMP WITH TIME ZONE,
    completed_time TIMESTAMP WITH TIME ZONE,
    quality_notes TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personalizaciones de items de órdenes
CREATE TABLE public.order_item_customizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('color', 'material', 'size', 'finish', 'other')),
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    additional_cost DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progreso de impresión
CREATE TABLE public.printing_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE,
    current_layer INTEGER DEFAULT 0,
    total_layers INTEGER DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0,
    time_remaining INTEGER DEFAULT 0, -- minutos
    nozzle_temperature DECIMAL(5,2),
    bed_temperature DECIMAL(5,2),
    speed DECIMAL(8,2), -- mm/s
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historial de estados de órdenes
CREATE TABLE public.order_status_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    estimated_duration INTEGER, -- minutos
    actual_duration INTEGER, -- minutos
    user_id UUID REFERENCES public.users(id),
    location TEXT,
    images TEXT[] DEFAULT '{}',
    documents TEXT[] DEFAULT '{}',
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== FACTURACIÓN =====

-- Términos de pago
CREATE TABLE public.payment_terms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    days INTEGER NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasas de impuestos
CREATE TABLE public.tax_rates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    rate DECIMAL(5,4) NOT NULL,
    description TEXT,
    country TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facturas
CREATE TABLE public.invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    quote_id UUID,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'viewed', 'overdue', 'paid', 'cancelled')) DEFAULT 'draft',
    payment_terms_id UUID REFERENCES public.payment_terms(id),
    currency TEXT DEFAULT 'USD',
    notes TEXT,
    terms_and_conditions TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items de facturas
CREATE TABLE public.invoice_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    category TEXT CHECK (category IN ('printing', 'modeling', 'post-processing', 'shipping', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historial de pagos
CREATE TABLE public.payment_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'credit_card', 'check', 'cash', 'other')),
    reference TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== RESEÑAS Y CALIFICACIONES =====

CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    comment TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    is_verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- ===== WISHLIST =====

CREATE TABLE public.wishlist_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ===== NOTIFICACIONES =====

CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN (
        'status_change', 'delay', 'quality_issue', 'delivery', 'urgent',
        'order_confirmed', 'order_shipped', 'order_delivered', 'payment_received',
        'product_back_in_stock', 'price_drop', 'new_review', 'system'
    )) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES PARA OPTIMIZACIÓN =====

-- Índices para búsquedas frecuentes
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_rating ON public.products(rating);
CREATE INDEX idx_products_created_at ON public.products(created_at);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_company_id ON public.orders(company_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

CREATE INDEX idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- ===== TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA =====

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a tablas relevantes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== POLÍTICAS RLS (ROW LEVEL SECURITY) =====

-- Habilitar RLS en tablas sensibles
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para usuarios autenticados
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own cart items" ON public.cart_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own wishlist" ON public.wishlist_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

-- Políticas para productos (lectura pública)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Product images are viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Product specifications are viewable by everyone" ON public.product_specifications FOR SELECT USING (true);
CREATE POLICY "Product dimensions are viewable by everyone" ON public.product_dimensions FOR SELECT USING (true);
CREATE POLICY "Product tags are viewable by everyone" ON public.product_tags FOR SELECT USING (true);

-- ===== DATOS INICIALES =====

-- Insertar términos de pago por defecto
INSERT INTO public.payment_terms (name, days, description) VALUES
('Inmediato', 0, 'Pago inmediato'),
('15 días', 15, 'Pago a 15 días'),
('30 días', 30, 'Pago a 30 días'),
('45 días', 45, 'Pago a 45 días'),
('60 días', 60, 'Pago a 60 días');

-- Insertar tasas de impuestos por defecto
INSERT INTO public.tax_rates (name, rate, description, country) VALUES
('IGV Perú', 0.18, 'Impuesto General a las Ventas - Perú', 'PE'),
('IVA México', 0.16, 'Impuesto al Valor Agregado - México', 'MX'),
('Sales Tax USA', 0.08, 'Sales Tax - Estados Unidos', 'US'),
('VAT Europe', 0.21, 'Value Added Tax - Europa', 'EU');

-- Insertar categorías por defecto
INSERT INTO public.categories (name, description, slug, is_active, sort_order) VALUES
('Miniaturas', 'Figuras y miniaturas personalizadas', 'miniaturas', true, 1),
('Prototipos', 'Prototipos funcionales y de diseño', 'prototipos', true, 2),
('Arquitectura', 'Maquetas y modelos arquitectónicos', 'arquitectura', true, 3),
('Joyería', 'Piezas de joyería y accesorios', 'joyeria', true, 4),
('Repuestos', 'Repuestos y piezas de reemplazo', 'repuestos', true, 5),
('Arte', 'Esculturas y piezas artísticas', 'arte', true, 6);

COMMIT;