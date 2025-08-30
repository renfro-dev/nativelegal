-- Fix RLS policies to allow anon inserts for development
-- Drop the restrictive policies
DROP POLICY IF EXISTS "Allow all for authenticated users" ON sources;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON posts;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON post_metrics;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON jobs;

-- Create more permissive policies for development
CREATE POLICY "Allow all operations for anon and authenticated" ON sources 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for anon and authenticated" ON posts 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for anon and authenticated" ON post_metrics 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for anon and authenticated" ON jobs 
FOR ALL USING (true) WITH CHECK (true);
