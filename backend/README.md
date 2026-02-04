# PlaceMate Backend API

Production-grade backend for PlaceMate - Job Application Tracker SaaS Platform.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with strict separation of concerns:

```
Controller → Service → Repository → Database
```

- **Controllers**: Handle HTTP requests/responses only
- **Services**: Contain all business logic
- **Repositories**: Handle all database operations
- **Models**: Define data schemas and validation

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── env.config.ts    # Environment variables
│   │   ├── database.config.ts
│   │   └── logger.config.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schema.ts
│   │   ├── users/
│   │   ├── applications/
│   │   ├── analytics/
│   │   └── reminders/
│   ├── middleware/          # Express middleware
│   ├── common/              # Shared utilities
│   │   ├── errors/          # Custom error classes
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript types
│   ├── routes.ts            # Main routes
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0 (local or Atlas)
- npm >= 9.0.0

### Installation

1. **Clone and navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/placemate

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cookie Secret
COOKIE_SECRET=your-cookie-secret-change-this-in-production

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend
FRONTEND_URL=http://localhost:5173
```

4. **Start MongoDB**

If using local MongoDB:

```bash
mongod
```

Or use MongoDB Atlas (cloud) - update `MONGODB_URI` in `.env`

5. **Run the server**

**Development mode (with hot reload):**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

## 📡 API Endpoints

Base URL: `http://localhost:5000/v1`

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout (current device) | Yes |
| POST | `/auth/logout-all` | Logout all devices | Yes |
| GET | `/auth/me` | Get current user | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update profile | Yes |
| PUT | `/users/preferences` | Update preferences | Yes |
| POST | `/users/change-password` | Change password | Yes |
| DELETE | `/users/account` | Delete account | Yes |
| GET | `/users/stats` | Get user statistics | Yes |

### Applications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/applications` | Create application | Yes |
| GET | `/applications` | List applications (paginated) | Yes |
| GET | `/applications/:id` | Get application by ID | Yes |
| PUT | `/applications/:id` | Update application | Yes |
| DELETE | `/applications/:id` | Delete application | Yes |
| PATCH | `/applications/:id/stage` | Update stage | Yes |
| POST | `/applications/:id/timeline` | Add timeline event | Yes |
| PATCH | `/applications/:id/archive` | Archive application | Yes |
| PATCH | `/applications/:id/unarchive` | Unarchive application | Yes |
| GET | `/applications/upcoming-interviews` | Get upcoming interviews | Yes |

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/dashboard` | Dashboard statistics | Yes |
| GET | `/analytics/stage-distribution` | Stage distribution | Yes |
| GET | `/analytics/applications-by-month` | Monthly applications | Yes |
| GET | `/analytics/top-companies` | Top companies | Yes |
| GET | `/analytics/conversion-rates` | Conversion rates | Yes |
| GET | `/analytics/full` | Complete analytics | Yes |

### Reminders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/reminders` | Create reminder | Yes |
| GET | `/reminders` | List reminders (paginated) | Yes |
| GET | `/reminders/:id` | Get reminder by ID | Yes |
| PUT | `/reminders/:id` | Update reminder | Yes |
| DELETE | `/reminders/:id` | Delete reminder | Yes |
| PATCH | `/reminders/:id/complete` | Mark as completed | Yes |
| PATCH | `/reminders/:id/incomplete` | Mark as incomplete | Yes |
| GET | `/reminders/upcoming` | Upcoming reminders | Yes |
| GET | `/reminders/overdue` | Overdue reminders | Yes |

## 🔐 Authentication

This API uses **JWT-based authentication** with access and refresh tokens.

### Flow

1. **Signup/Login**: Receive access token (15m) and refresh token (7d)
2. **Access Token**: Include in Authorization header: `Bearer <token>`
3. **Refresh Token**: Stored in httpOnly cookie or can be sent in body
4. **Token Refresh**: Use `/auth/refresh` when access token expires

### Example Request

```bash
# Login
curl -X POST http://localhost:5000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use access token
curl -X GET http://localhost:5000/v1/applications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved",
  "data": [ /* array of items */ ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* optional error details */ ]
}
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 🔒 Security Features

- **Helmet**: Sets security HTTP headers
- **CORS**: Configured for specific origins
- **Rate Limiting**: 100 requests per 15 minutes (configurable)
- **Auth Rate Limiting**: 5 login attempts per 15 minutes
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Secure token-based authentication
- **Input Validation**: Zod schemas for all inputs
- **MongoDB Injection Prevention**: Mongoose sanitization

## 📝 Logging

Logs are stored in `logs/` directory:

- `app.log`: All logs
- `error.log`: Error logs only
- `exceptions.log`: Uncaught exceptions
- `rejections.log`: Unhandled promise rejections

Log levels: `error`, `warn`, `info`, `http`, `debug`

## 🚢 Production Deployment

1. **Build TypeScript**

```bash
npm run build
```

2. **Set environment to production**

```env
NODE_ENV=production
```

3. **Use strong secrets**

Generate secure secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Enable HTTPS**

Use a reverse proxy (nginx) or cloud provider SSL

5. **Set up process manager**

Use PM2, Docker, or your cloud platform's process manager

6. **Monitor and log**

Set up error tracking (Sentry) and log aggregation

## 🤝 API Integration (Frontend)

Example frontend service:

```typescript
// api/client.ts
const API_BASE = 'http://localhost:5000/v1';
const token = localStorage.getItem('accessToken');

export const apiClient = {
  get: (endpoint: string) =>
    fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json()),
  
  post: (endpoint: string, data: any) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(res => res.json()),
};

// Usage
const applications = await apiClient.get('/applications');
```

## 📚 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Environment Variables Not Loading

Make sure `.env` file is in the `backend/` directory and properly formatted.

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ for production use
