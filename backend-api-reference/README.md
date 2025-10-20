# Backend API Reference

This folder contains Launch API code from the HLH_hack backend project for reference during backend integration.

## 📁 Contents

```
backend-api-reference/
├── routes/
│   ├── assets.ts          # GET /api/launch/assets
│   ├── baskets.ts         # POST /api/launch/basket-calculate
│   └── positions.ts       # Launch position management
├── types/                 # Type definitions
├── utils/                 # Helper functions
├── middlewares/          # Auth, error handling
├── .env                  # Environment variables (INCLUDED - not in .gitignore)
├── package.json          # Backend dependencies
└── README.md             # This file
```

## 🚀 API Endpoints

### 1. **GET /api/launch/assets**
Returns list of available assets for index creation.

**Response:**
```typescript
[
  {
    symbol: "BTC",
    name: "Bitcoin",
    marketType: "perp" | "spot"
  },
  // ...
]
```

### 2. **POST /api/launch/basket-calculate**
Calculates portfolio preview chart data.

**Request:**
```typescript
{
  interval: "1h" | "1d",
  assets: [
    {
      symbol: "BTC",
      side: "long" | "short",
      leverage: 1-50,
      allocation: 0-100
    },
    // ...
  ]
}
```

**Response:**
```typescript
{
  data: [
    {
      date: "2024-10-01T00:00:00Z",
      value: 1234.56,
      nav: 1234.56
    },
    // ...
  ]
}
```

### 3. **POST /api/launch/create-index** (Optional)
Creates new index on-chain.

**Request:**
```typescript
{
  name: "My Index",
  ticker: "MYIDX",
  assets: [...],
  composition: [...]
}
```

## 🔧 Backend Integration Instructions

### Option A: Integrate into Cryptoindex Backend (Recommended)

When ready to implement backend:

1. **Copy API routes** to your backend project:
```bash
cp backend-api-reference/routes/* your-backend/src/routes/launch/
```

2. **Copy dependencies** (types, utils, middlewares):
```bash
cp -r backend-api-reference/types your-backend/src/
cp -r backend-api-reference/utils your-backend/src/
cp -r backend-api-reference/middlewares your-backend/src/
```

3. **Install dependencies** from package.json:
```bash
cd your-backend
npm install
```

4. **Register routes** in your server:
```typescript
// your-backend/src/server.ts

import assetsRoutes from './routes/launch/assets';
import basketsRoutes from './routes/launch/baskets';

app.use('/api/launch/assets', assetsRoutes);
app.use('/api/launch/baskets', basketsRoutes);
```

5. **Update frontend** to use real API:
```typescript
// app/launch/page.tsx

// Remove mock data
useEffect(() => {
  fetch('/api/launch/assets')
    .then(res => res.json())
    .then(data => setAssets(data))
    .catch(err => console.error('Failed to load assets:', err));
}, []);
```

### Option B: Run HLH_hack Backend Separately (Not Recommended)

If you want to keep backends separate:

```bash
# Terminal 1: HLH_hack backend
cd /HLH_hack/backend
npm install
npm run dev  # Runs on port 3001

# Terminal 2: Cryptoindex frontend
cd /Cryptoindex-V0
pnpm run dev  # Runs on port 3000
```

Update frontend to use different base URL:
```typescript
fetch('http://localhost:3001/api/launch/assets')
```

**Drawback**: Requires running two separate servers.

## 🔐 Environment Variables

The `.env` file is included in this folder with all necessary environment variables.

**IMPORTANT**: When setting up your backend, copy these values to your backend's `.env` file.

Key variables you'll need:
- Database connection strings
- API keys
- RPC endpoints
- Auth secrets

## 📦 Dependencies

See `package.json` for all backend dependencies. Key packages:
- Express (server framework)
- TypeScript
- Database drivers
- Middleware packages

## 🔍 File Structure Explained

### routes/
Contains Express route handlers for Launch APIs. Each file exports a router that can be mounted in your main server.

### types/
TypeScript type definitions used across the backend. Import these in your frontend for type safety.

### utils/
Helper functions for calculations, validations, and common operations.

### middlewares/
Authentication, error handling, and request validation middleware.

## 📝 Notes

- **This is reference code only** - The frontend currently uses mock data
- **Not a running backend** - These files are for integration reference
- **All files included** - Including .env for easy setup (normally excluded from git)
- **Ready for integration** - Just copy files when backend is ready

## 🎯 Current Frontend State

The Launch page (`app/launch/page.tsx`) is fully functional with mock data. It's ready to integrate with these APIs by simply:
1. Removing mock data
2. Adding fetch calls
3. Using the same data structures

No frontend code changes needed beyond swapping mock → real data!

---

**Last Updated**: 2025-10-19
**Source**: HLH_hack/backend
