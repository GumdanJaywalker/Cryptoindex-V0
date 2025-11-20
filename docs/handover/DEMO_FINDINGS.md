# Demo Work Findings - Issues to Fix in Main Project

**Created**: 2025-11-04
**Context**: Issues discovered while working on YCOMDEMO (YC Demo project)

---

## 🔴 Critical Issues

### 1. Missing Supabase Environment Variables
**Discovered**: Phase 3 build test
**Error**: `Error: supabaseUrl is required` during build
**Location**: `/api/health/route.ts` (and likely other API routes)

**Issue**:
- `.env.local` file missing in project root
- Supabase client initialization fails during build

**Fix Required**:
```bash
# Create .env.local with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Impact**: Build fails, cannot deploy to Vercel/production
**Priority**: High (blocks deployment)

---

## ⚠️ TypeScript Type Errors

### 2. Backend API Reference Type Errors
**Discovered**: Phase 3 TypeScript compilation check
**Location**: `backend-api-reference/` folder

**Errors**:
```
backend-api-reference/infra/logger.ts(1,18): Cannot find module 'pino'
backend-api-reference/middlewares/*.ts: Cannot find module 'express'
backend-api-reference/middlewares/requestContext.ts(2,22): Cannot find module 'pino-http'
```

**Cause**: Missing dependencies for backend reference code
- `pino`, `pino-http`, `express` not installed

**Fix Options**:
1. **Option A**: Install missing deps: `pnpm add -D pino pino-http express @types/express`
2. **Option B**: Exclude `backend-api-reference/` from tsconfig (if not needed for frontend)
3. **Option C**: Delete `backend-api-reference/` folder (if reference-only)

**Recommended**: Option B or C (backend reference not needed in frontend build)
**Priority**: Medium (doesn't block dev server, only tsc checks)

---

### 3. API Route Type Annotations Missing
**Discovered**: Phase 3 TypeScript compilation check
**Location**: `app/api/` routes

**Errors**:
```
app/api/auth/sync-user/route.ts(109,11): Variable 'allUserWallets' implicitly has type 'any[]'
app/api/auth/sync-user/route.ts(117,41): Parameter 'account' implicitly has an 'any' type
app/api/user/profile/route.ts(43,17): 'user' is possibly 'undefined'
app/api/user/profile/route.ts(106,56): 'user' is possibly 'undefined'
```

**Fix Required**:
- Add explicit type annotations to variables
- Add null checks for `user` object
- Type function parameters properly

**Priority**: Low (doesn't block functionality, but should fix for type safety)

---

## 📝 Improvement Suggestions

### 4. TypeScript Strict Mode
**Current**: TypeScript errors not blocking builds
**Issue**: Next.js config skips type validation during build

**In `next.config.js`**:
```js
typescript: {
  ignoreBuildErrors: true, // Currently set
}
```

**Recommendation**:
- Fix all type errors first
- Then set `ignoreBuildErrors: false` for better type safety

**Priority**: Low (future improvement)

---

## ✅ Action Items

**Before deploying main project**:
1. [ ] Create `.env.local` with Supabase credentials
2. [ ] Decide on backend-api-reference folder (keep/delete/exclude)
3. [ ] Fix API route type errors (sync-user, profile)
4. [ ] Test production build: `pnpm run build`

**Optional improvements**:
- [ ] Enable TypeScript strict checks
- [ ] Add type safety to all API routes
- [ ] Set up environment variable validation

---

## 📌 Notes

- YCOMDEMO successfully works in dev mode despite these issues
- Errors only surface during production build
- Main project likely has same issues (copied from Cryptoindex-V0)

---

**Last Updated**: 2025-11-04
**Next Review**: After Phase 3 completion
