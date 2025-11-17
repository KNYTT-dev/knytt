-- Fix foreign key constraint to point to public.users instead of auth.users
-- This ensures the FK references the correct users table used by the application

-- Drop the incorrect foreign key that pointed to auth.users
ALTER TABLE user_embeddings DROP CONSTRAINT IF EXISTS user_embeddings_user_id_fkey;

-- Add the correct foreign key pointing to public.users
ALTER TABLE user_embeddings 
  ADD CONSTRAINT user_embeddings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

