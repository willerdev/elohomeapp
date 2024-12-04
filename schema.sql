-- Create listings table first (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_urls TEXT[],
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    specifications JSONB,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Add specifications column if it doesn't exist
ALTER TABLE IF EXISTS public.listings
  ADD COLUMN IF NOT EXISTS specifications JSONB;

-- If the column already exists but isn't JSONB, we'll alter it
ALTER TABLE IF EXISTS public.listings
  ALTER COLUMN specifications TYPE JSONB USING specifications::JSONB;

-- Add a check constraint to ensure specifications is a valid JSON object
ALTER TABLE public.listings
  ADD CONSTRAINT valid_specifications 
  CHECK (jsonb_typeof(specifications) = 'object');

-- Create index on the specifications column for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_specifications 
  ON public.listings USING GIN (specifications);

-- Add comment to explain the specifications column
COMMENT ON COLUMN public.listings.specifications IS 'Dynamic category-specific fields stored as JSONB. Structure varies by category.';

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create policies for listings
CREATE POLICY "Anyone can view listings"
    ON public.listings FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own listings"
    ON public.listings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
    ON public.listings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
    ON public.listings FOR DELETE
    USING (auth.uid() = user_id);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own profile
CREATE POLICY "Users can view any profile"
  ON public.profiles FOR SELECT
  USING (true);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policy to allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Drop existing favorite table if it exists to recreate it with proper constraints
DROP TABLE IF EXISTS public.favorite;

-- Create favorite table with proper foreign key constraints and timestamps
CREATE TABLE public.favorite (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, listing_id)
);

-- Create indexes for faster favorite lookups
CREATE INDEX IF NOT EXISTS idx_favorite_user_id ON public.favorite(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_listing_id ON public.favorite(listing_id);

-- Enable RLS for favorite
ALTER TABLE public.favorite ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for favorite
CREATE POLICY "Users can view their own favorite"
  ON public.favorite
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorite"
  ON public.favorite
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorite"
  ON public.favorite
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_favorite_updated_at
    BEFORE UPDATE ON public.favorite
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();