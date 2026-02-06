# PlaceMate Frontend - Backend Integrated

**✅ Fully integrated with backend API!**

## Quick Start

```bash
npm install
npm run dev
```

**IMPORTANT:** Make sure backend is running on `http://localhost:5000/v1`

## What Changed

1. **Added:** `src/services/api.ts` - Complete API client
2. **Updated:** `src/stores/applicationStore.ts` - Now uses real API
3. **Ready:** All components work with real backend data

## Usage

```typescript
import { api } from '@/services/api';

// Signup
await api.signup({ email, password, name });

// Create application
await api.createApplication({ companyName, role, ... });

// Get analytics
const stats = await api.getDashboardStats();
```

See backend README for full setup guide.
