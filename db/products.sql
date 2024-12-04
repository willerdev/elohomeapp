-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    specifications JSONB DEFAULT '{}'::jsonb,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive', 'deleted')),
    views INTEGER DEFAULT 0,
    CONSTRAINT valid_price CHECK (price >= 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_specifications ON public.products USING GIN (specifications);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies

-- View policy (anyone can view active products)
CREATE POLICY "Anyone can view active products"
    ON public.products
    FOR SELECT
    USING (status = 'active');

-- Insert policy (authenticated users can create products)
CREATE POLICY "Users can create their own products"
    ON public.products
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Update policy (users can update their own products)
CREATE POLICY "Users can update their own products"
    ON public.products
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Delete policy (users can delete their own products)
CREATE POLICY "Users can delete their own products"
    ON public.products
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create a function to increment views
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.products
    SET views = views + 1
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT USAGE ON SEQUENCE products_id_seq TO authenticated;

-- Comments
COMMENT ON TABLE public.products IS 'Stores product listings created by users';
COMMENT ON COLUMN public.products.specifications IS 'JSON object containing category-specific fields';
COMMENT ON COLUMN public.products.status IS 'Product status: active, sold, inactive, or deleted';