# Frontend-Backend Integration Fixes

## Issues Fixed

### 1. ✅ Hardcoded Production API URLs
**Problem**: Frontend was calling production API instead of local development backend.

**Files Fixed**:
- `frontend/src/lib/queries/feedback.ts` - Changed hardcoded production URL to use environment variable
- `frontend/src/lib/queries/user.ts` - Changed hardcoded production URL to use environment variable

**Solution**:
```typescript
// Before
const API_URL = "https://knytt-api-prod-kouzugqpra-uc.a.run.app";

// After
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

---

### 2. ✅ Wrong Default Port (8001 → 8000)
**Problem**: Multiple query files had incorrect default port.

**Files Fixed**:
- `frontend/src/lib/queries/search.ts`
- `frontend/src/lib/queries/recommendations.ts`
- `frontend/src/lib/queries/discover.ts`
- `frontend/src/lib/queries/onboarding.ts`

**Solution**: Changed default port from 8001 to 8000 to match backend configuration.

---

### 3. ✅ Type Mismatch: product_id (String vs Number)
**Problem**: Backend expects `product_id` as **integer**, frontend was sending it as **string**.

**Error**: `422 Unprocessable Entity` on `/api/v1/recommend`

**Files Fixed**:
- `frontend/src/types/api.ts` - Changed `product_id?: string` to `product_id?: number`
- `frontend/src/lib/queries/recommendations.ts` - Added `parseInt()` conversion

**Solution**:
```typescript
// Type definition
export interface RecommendRequest {
  product_id?: number; // Changed from string to number
}

// Usage in query
product_id: productId ? parseInt(productId, 10) : undefined,
```

---

## Remaining Issues to Debug

### ⚠️ 500 Internal Server Error on `/api/v1/feedback`
**Status**: Needs investigation

**Likely Causes**:
1. Database connectivity issues
2. Missing user record in database
3. Cel

ery/Redis connection issues (background tasks)
4. Missing product embeddings

**Next Steps**:
1. Check backend terminal logs for the actual error stack trace
2. Verify database is running and accessible
3. Check if user exists in database
4. Verify product exists in database

**To Debug**: Look at backend logs when clicking "Add to Favorites"

---

## Environment Configuration

### Backend (`.env`)
```bash
API_PORT=8000
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Testing After Fixes

### ✅ URLs Now Correctly Point to Local Backend
All API calls now use `http://localhost:8000` instead of production URL.

### ✅ Recommendations Type Validation Fixed
The 422 error on recommendations should be resolved.

### ⚠️ Feedback Endpoint Needs Backend Investigation
The 500 error requires checking:
- Backend logs for error details
- Database connection
- User/product existence

---

## How to Test

1. **Restart Frontend** (to apply fixes):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check Browser Console** - All requests should show `http://localhost:8000`

3. **Test Recommendations** - Should no longer get 422 error

4. **Test Add to Favorites** - Check backend logs for 500 error details

---

## Files Changed

```
frontend/src/lib/queries/
  ✓ feedback.ts        - Fixed hardcoded URL
  ✓ user.ts           - Fixed hardcoded URL  
  ✓ search.ts         - Fixed port 8001 → 8000
  ✓ recommendations.ts - Fixed port + type conversion
  ✓ discover.ts       - Fixed port 8001 → 8000
  ✓ onboarding.ts     - Fixed port 8001 → 8000

frontend/src/types/
  ✓ api.ts            - Fixed product_id type string → number
```

---

## Next Steps

1. ✅ Restart frontend (`npm run dev`)
2. ⏳ Test recommendations endpoint
3. ⏳ Check backend logs for feedback error details
4. ⏳ Fix any database/user-related issues in backend


