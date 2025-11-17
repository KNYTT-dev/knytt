# Schema Foreign Key Fix Summary

## Problem
The initial database migration incorrectly referenced `auth.users` (Supabase's internal authentication table) instead of `public.users` (our application's users table) in foreign key constraints.

This caused the error:
```
ForeignKeyViolation: Key (user_id)=(...) is not present in table "users"
```

## Root Cause
In Supabase, there are TWO separate users tables:
1. **`auth.users`**: Supabase's internal authentication table (not used by our app)
2. **`public.users`**: Our application's users table (used by SQLAlchemy ORM)

The migration file (`20250107000001_initial_schema.sql`) incorrectly created foreign keys pointing to `auth.users` instead of `public.users`.

## Tables Affected
The following 5 tables had incorrect foreign key constraints in the migration:

1. ✅ **`user_profiles`**: Fixed (but table doesn't exist in current DB)
2. ✅ **`user_embeddings`**: Fixed (table exists - was causing the error)
3. ✅ **`user_interactions`**: Fixed (table exists)
4. ✅ **`user_favorites`**: Fixed (but table doesn't exist in current DB)
5. ✅ **`search_queries`**: Fixed (but table doesn't exist in current DB)

## Fixes Applied

### 1. Live Database Fix (Applied immediately)
```sql
-- Fixed user_embeddings FK constraint
ALTER TABLE user_embeddings DROP CONSTRAINT user_embeddings_user_id_fkey;
ALTER TABLE user_embeddings 
  ADD CONSTRAINT user_embeddings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
```

### 2. Migration File Fix
Created new migration: `supabase/migrations/20251117000000_fix_user_embeddings_fk.sql`

### 3. Initial Schema Fix
Updated `supabase/migrations/20250107000001_initial_schema.sql` to prevent this issue in future deployments:
- Changed all 5 instances of `REFERENCES auth.users(id)` to `REFERENCES public.users(id)`

## Current Status
✅ **All foreign key constraints now correctly reference `public.users`**
✅ **No code references to `auth.users` found**
✅ **Migration files updated for future deployments**

## Verification
To verify all FKs are correct:
```sql
SELECT 
    tc.table_name, 
    kcu.column_name,
    ccu.table_schema AS fk_schema,
    ccu.table_name AS fk_table
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND ccu.table_name = 'users'
ORDER BY tc.table_name;
```

Expected result: All FKs should point to `public.users`, not `auth.users`.

