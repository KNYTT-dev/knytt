-- Fix foreign key constraints to point to public.users instead of auth.users
-- This ensures the FKs reference the correct users table used by the application

-- Fix user_embeddings FK constraint
ALTER TABLE user_embeddings DROP CONSTRAINT IF EXISTS user_embeddings_user_id_fkey;
ALTER TABLE user_embeddings 
  ADD CONSTRAINT user_embeddings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Fix user_favorites FK constraint (if table exists)
ALTER TABLE user_favorites DROP CONSTRAINT IF EXISTS user_favorites_user_id_fkey;
ALTER TABLE user_favorites 
  ADD CONSTRAINT user_favorites_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

