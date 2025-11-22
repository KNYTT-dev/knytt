# API URL Configuration Fixes

## Summary
Fixed hardcoded production URLs and port inconsistencies across all frontend query files.

## Issues Fixed

### 1. ❌ Hardcoded Production URL
**File**: `frontend/src/lib/queries/user.ts`
- **Before**: `const API_URL = "https://knytt-api-prod-kouzugqpra-uc.a.run.app";`
- **After**: `const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";`

### 2. ⚠️ Wrong Default Port (8001 → 8000)
**Files**:
- `frontend/src/lib/queries/search.ts`
- `frontend/src/lib/queries/recommendations.ts`
- `frontend/src/lib/queries/discover.ts`
- `frontend/src/lib/queries/onboarding.ts`

**Before**: `const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";`
**After**: `const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";`

### 3. ✅ Already Fixed
**File**: `frontend/src/lib/queries/feedback.ts`
- Now uses environment variable correctly

### 4. ✅ Already Correct
**Files**:
- `frontend/src/lib/queries/auth.ts` - Already using correct port 8000
- `frontend/src/app/products/[id]/ProductDetailClient.tsx` - Already using env variable

## Configuration Files

### Backend Port
`.env` (backend):
```bash
API_PORT=8000
```

### Frontend Configuration
`.env.local` (frontend):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Result
✅ All API calls now respect the `NEXT_PUBLIC_API_URL` environment variable
✅ Development mode uses local backend at `http://localhost:8000`
✅ Production mode uses production URL when deployed
✅ No more hardcoded URLs in the codebase

## Testing
To verify the fixes work:

1. **Restart Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check Browser Console** - All API calls should now use `http://localhost:8000`

3. **Test Endpoints**:
   - Add to Favorites ✅
   - User Stats ✅
   - Search ✅
   - Recommendations ✅
   - Discover ✅
   - Onboarding ✅

