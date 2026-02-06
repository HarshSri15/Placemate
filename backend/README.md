# PlaceMate Backend

**Production-ready backend built for your PlaceMate frontend**

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your secrets
npm run dev
```

Server: `http://localhost:5000/v1`

## Environment Setup

```env
JWT_ACCESS_SECRET=<generate-64-char-secret>
JWT_REFRESH_SECRET=<generate-64-char-secret>
COOKIE_SECRET=<generate-secret>
MONGODB_URI=mongodb://localhost:27017/placemate
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Features

✅ Authentication (JWT)  
✅ User Management  
✅ Applications CRUD  
✅ Pipeline Stages  
✅ Analytics & Stats  
✅ Reminders  
✅ Clean Architecture  
✅ TypeScript  
✅ MongoDB  
✅ Professional Security  

## API Endpoints

- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `GET /applications` - List applications
- `POST /applications` - Create application
- `PUT /applications/:id` - Update application
- `DELETE /applications/:id` - Delete application
- `PATCH /applications/:id/stage` - Update stage
- `GET /analytics/dashboard` - Dashboard stats
- `GET /analytics/full` - Full analytics
- `GET /reminders` - List reminders
- `POST /reminders` - Create reminder

## Frontend Integration

See `FRONTEND_INTEGRATION.md` for complete setup guide.

## Scripts

- `npm run dev` - Development
- `npm run build` - Build for production
- `npm start` - Run production
- `npm test` - Run tests

## Production Deployment

```bash
npm run build
npm start
```

Or use Docker:
```bash
docker-compose up -d
```

## Architecture

```
src/
├── config/         # Env, DB, logging
├── modules/        # Feature modules
│   ├── auth/      # Authentication
│   ├── users/     # User management
│   ├── applications/  # Job applications
│   ├── analytics/     # Stats & charts
│   └── reminders/     # Reminder system
├── middleware/    # Auth, validation, errors
├── common/        # Utilities, errors, types
├── app.ts        # Express app
└── server.ts     # Entry point
```

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation
- Winston Logging
- Helmet Security
- Rate Limiting

## License

MIT
