# Complete Setup & Fixes Guide

## 🎯 Summary of All Issues & Fixes

### ✅ Issues Fixed

1. **Hardcoded Production URLs** → Fixed ✓
2. **Wrong Default Ports (8001 → 8000)** → Fixed ✓  
3. **Product ID Type Mismatch (int → UUID)** → Fixed ✓

### ⚠️ Issues Requiring Action

4. **No User Authentication** → **YOU NEED TO REGISTER/LOGIN**
5. **User Not Onboarded** → **YOU NEED TO COMPLETE ONBOARDING**
6. **Redis Not Running** → Optional (errors are handled gracefully)

---

## 🔧 What Was Fixed

### 1. Product ID Type Bug (Backend + Frontend)
**Problem**: Backend expected `integer`, but database uses `UUID` strings.

**Files Changed**:
- `backend/api/models/recommend.py`: Changed `product_id` from `int` to `str`
- `frontend/src/types/api.ts`: Changed back from `number` to `string`  
- `frontend/src/lib/queries/recommendations.ts`: Removed `parseInt()` conversion

**Result**: 422 error on `/api/v1/recommend` is now fixed ✅

---

## 🚀 Next Steps to Get Everything Working

### Step 1: Restart Backend (to apply Product ID fix)
```bash
# Terminal 2 - Stop backend with Ctrl+C, then:
cd /Users/jin.huang/claude/knytt/knytt
source venv/bin/activate
python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Restart Frontend (already fixed)
```bash
# Terminal 3 - If not already restarted:
cd /Users/jin.huang/claude/knytt/knytt/frontend
npm run dev
```

### Step 3: Register a User Account
**Option A: Via UI** (Recommended)
1. Go to http://localhost:3000/register
2. Register with email & password
3. Login

**Option B: Via API**
```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Password123!"}'

# Login (save the returned tokens)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Password123!"}'
```

### Step 4: Complete Onboarding
1. After logging in, you'll be redirected to onboarding
2. Select 3-5 products you like from the moodboard
3. Set your price range (optional)
4. Click "Complete Setup"

This creates your user embeddings for personalized recommendations.

---

## 🐛 Error Explanations

### Error 1: 500 on `/api/v1/feedback`
```
Key (user_id)=(f2764255-0d16-46f3-b729-a39e50842bd7) is not present in table "users"
```

**Cause**: You're not logged in or the user doesn't exist in database.

**Solution**: Register and login (Step 3 above).

---

### Error 2: 422 on `/api/v1/recommend`
```
Input should be a valid integer, unable to parse string as an integer
Input: '02510e56-9009-40e5-b0d7-7c6c4c3e67f7'
```

**Cause**: Backend expected integer, but product IDs are UUIDs.

**Solution**: ✅ FIXED! Restart backend (Step 1 above).

---

### Error 3: 404 on `/api/v1/recommend`
```
User has no preference profile. Please complete onboarding first.
```

**Cause**: User exists but hasn't completed onboarding moodboard.

**Solution**: Complete onboarding (Step 4 above).

---

### Error 4: Redis Connection Errors (Non-Critical)
```
Redis GET error: Error 8 connecting to redis:6379
```

**Cause**: Redis is not running locally (it's configured for Docker hostname `redis`).

**Solution**: This is expected and handled gracefully. The app works without Redis, just slower (no caching).

**Optional Fix**: Update `.env` to use `localhost` instead of `redis`:
```bash
REDIS_HOST=localhost
```

Then start Redis locally:
```bash
# macOS
brew services start redis

# Or run manually
redis-server
```

---

## 📋 Complete File Changes Summary

### Backend Files Modified:
```
backend/api/models/recommend.py
  ✓ Line 45: product_id type changed from int → str (UUID)
```

### Frontend Files Modified:
```
frontend/src/lib/queries/
  ✓ feedback.ts        - Fixed hardcoded production URL
  ✓ user.ts           - Fixed hardcoded production URL
  ✓ search.ts         - Fixed port 8001 → 8000
  ✓ recommendations.ts - Fixed port, removed parseInt conversion
  ✓ discover.ts       - Fixed port 8001 → 8000
  ✓ onboarding.ts     - Fixed port 8001 → 8000

frontend/src/types/
  ✓ api.ts            - Fixed product_id type back to string (UUID)
```

---

## ✅ Testing Checklist

After completing all steps above, test these features:

### 1. Authentication
- [ ] Register new user → Should succeed
- [ ] Login → Should receive tokens and redirect
- [ ] View profile → Should see user info

### 2. Onboarding
- [ ] See product moodboard → Should load 20 products
- [ ] Select 3-5 products → Should highlight selected
- [ ] Complete setup → Should create user embeddings

### 3. Product Features
- [ ] Browse products → Should load product grid
- [ ] View product details → Should show full info
- [ ] Add to Favorites ❤️ → Should save (no more 500 error!)
- [ ] View Favorites → Should show liked products

### 4. Recommendations
- [ ] View personalized feed → Should show recommendations
- [ ] View similar products → Should work (no more 422 error!)
- [ ] Search products → Should return results

---

## 🔍 Debugging Commands

### Check if Supabase is running:
```bash
supabase status
```

### Check backend logs:
```bash
# Backend terminal will show all errors
```

### Check frontend network requests:
```bash
# Browser DevTools → Network tab
# All requests should go to http://localhost:8000
```

### Check database:
```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres

# Check if user exists
SELECT id, email, created_at FROM users;

# Check if products exist
SELECT COUNT(*) FROM products;

# Check user embeddings
SELECT user_id, created_at FROM user_embeddings;
```

---

## 🎉 Success Criteria

Everything is working when:

1. ✅ You can register and login
2. ✅ You complete onboarding successfully
3. ✅ You can add products to favorites (no 500 error)
4. ✅ You can view personalized recommendations (no 404/422 errors)
5. ✅ Search works and returns results
6. ✅ Product details page shows similar products

---

## 📞 Still Having Issues?

If you're still seeing errors after completing all steps:

1. Check all three terminals (Supabase, Backend, Frontend) for error messages
2. Verify Supabase is running: `supabase status`
3. Check database has products: Connect to DB and run `SELECT COUNT(*) FROM products;`
4. Verify user is logged in: Check browser cookies or localStorage
5. Clear browser cache and reload

---

Built with ❤️ - Now with properly typed UUIDs! 🎯

