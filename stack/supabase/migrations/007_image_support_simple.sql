-- Add image columns to posts table (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'hero_image_url') THEN
        ALTER TABLE posts ADD COLUMN hero_image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'featured_image_url') THEN
        ALTER TABLE posts ADD COLUMN featured_image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'social_image_url') THEN
        ALTER TABLE posts ADD COLUMN social_image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'thumbnail_image_url') THEN
        ALTER TABLE posts ADD COLUMN thumbnail_image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'images_generated') THEN
        ALTER TABLE posts ADD COLUMN images_generated BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'image_generation_prompt') THEN
        ALTER TABLE posts ADD COLUMN image_generation_prompt TEXT;
    END IF;
END $$;

-- Create blog-images storage bucket (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'blog-images') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'blog-images',
            'blog-images',
            true,
            5242880, -- 5MB limit
            ARRAY['image/jpeg', 'image/png', 'image/webp']
        );
    END IF;
END $$;

-- Create RLS policies for blog-images bucket (if they don't exist)
DO $$ 
BEGIN
    -- Check if policy exists before creating
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public read access for blog images'
    ) THEN
        CREATE POLICY "Public read access for blog images" ON storage.objects
        FOR SELECT USING (bucket_id = 'blog-images');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can upload blog images'
    ) THEN
        CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'blog-images');
    END IF;
END $$;

-- Create image generation jobs table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS image_generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    image_type TEXT NOT NULL CHECK (image_type IN ('hero', 'featured', 'social', 'thumbnail')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    prompt_used TEXT,
    generated_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on image_generation_jobs
ALTER TABLE image_generation_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for image_generation_jobs (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'image_generation_jobs' 
        AND policyname = 'Public read access to image generation jobs'
    ) THEN
        CREATE POLICY "Public read access to image generation jobs" ON image_generation_jobs
        FOR SELECT USING (true);
    END IF;
END $$;

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_posts_images_generated ON posts(images_generated);
CREATE INDEX IF NOT EXISTS idx_image_generation_jobs_post_id ON image_generation_jobs(post_id);
CREATE INDEX IF NOT EXISTS idx_image_generation_jobs_status ON image_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_image_generation_jobs_created_at ON image_generation_jobs(created_at);
