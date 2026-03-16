-- Supabase PostgreSQL Schema for PCC Query Management Portal

-- 1. Create Enums
CREATE TYPE query_category_enum AS ENUM ('registration', 'renewal', 'observation', 'misc');
CREATE TYPE query_status_enum AS ENUM ('pending', 'replied', 'resolved');

-- 2. Create the queries table
CREATE TABLE public.queries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    query_category query_category_enum NOT NULL,
    charity_name TEXT NOT NULL,
    charity_reg_no TEXT,
    user_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    status query_status_enum DEFAULT 'pending',
    admin_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE
);

-- 3. Enable RLS on queries table
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for `queries` table

-- Public Insert Policy: Anyone can insert a query.
CREATE POLICY "Public can insert queries" 
ON public.queries FOR INSERT 
TO public
WITH CHECK (true);

-- Public Select Policy: Public can select a query ONLY if their phone number matches (for tracking).
CREATE POLICY "Public can track their own queries" 
ON public.queries FOR SELECT 
TO public
USING (true); -- Note: We'll enforce the phone_number match in the Application Layer / Server Action, but structurally they can query it. Or we can restrict by requiring the exact query ID and phone number to be known.
-- A better RLS approach for public tracking: Since we do not have an authenticated user for public tracking, the select must technically be open, but we fetch using a highly specific secret ID or just enforce the filter at the edge:
-- Actually, let's keep it safe. Only allow public to query if they know the ID.
-- However, we don't know the exact value they will request in RLS without knowing the auth context. So for anon users, doing specific lookup via server action (using service role key) is safer. Let's make Public SELECT false here and rely on Server Action with service role, OR let anon select if they know the ID.
-- For simplicity: let anon select all, but we will filter in Server Action. Better yet, let's do:
-- We'll just enforce everything through Server Actions. We don't necessarily need anon RLS if Server Actions use service role or if we restrict properly.
-- Wait, Server Actions run as the User (if using standard client), so `anon` key is used.
-- If we use `anon` key, `USING (true)` means anyone can read all queries if they intercept the API.
-- So, let's DROP the anon select policy and we will use the Service Role key EXCLUSIVELY inside the secure Server Action to fetch the specific query by ID and Phone Number.
DROP POLICY IF EXISTS "Public can track their own queries" ON public.queries;


-- Authenticated Admin Policies
-- This policy allows authenticated users (Admins) to Select all queries.
-- We can refine this later so Category Admins only see their respective categories. For now, all authenticated users can view all.
CREATE POLICY "Admins can view all queries" 
ON public.queries FOR SELECT 
TO authenticated 
USING (true);

-- This policy allows authenticated users (Admins) to Update queries.
CREATE POLICY "Admins can update all queries" 
ON public.queries FOR UPDATE 
TO authenticated 
USING (true);
