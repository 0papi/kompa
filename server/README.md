# Server - Production-Grade Backend

A production-ready backend server built with Express, PostgreSQL (via Drizzle ORM), and Firebase Authentication.

## Features

- **Authentication**: Firebase Admin SDK integration with JWT token verification
- **Database**: PostgreSQL with Drizzle ORM and connection pooling
- **Security**: Helmet for HTTP headers, rate limiting, CORS protection
- **Logging**: Structured logging with Winston
- **Error Handling**: Global error handler with custom error classes
- **Health Checks**: `/health` and `/health/db` endpoints for monitoring
- **Graceful Shutdown**: Proper cleanup on SIGTERM/SIGINT signals
- **Testing**: Vitest with unit and integration tests
- **Type Safety**: Full TypeScript support
- **Environment Validation**: Zod-based environment variable validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Admin SDK
- **Testing**: Vitest + Supertest
- **Logging**: Winston
- **Validation**: Zod

## Prerequisites

- Node.js >= 20 (LTS recommended)
- pnpm (or npm/yarn)
- PostgreSQL >= 14
- Firebase project with service account credentials

## Setup

1. **Clone and install dependencies**

```bash
cd server
pnpm install
```

2. **Configure environment variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Service account email
- `FIREBASE_PRIVATE_KEY`: Service account private key
- `CORS_ORIGIN`: Allowed origin for CORS

3. **Set up the database**

Generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

Or push schema directly (development only):

```bash
pnpm db:push
```

4. **Start the development server**

```bash
pnpm dev
```

The server will start on `http://localhost:3000` (or your configured PORT).

## Available Scripts

- `pnpm dev` - Start development server with hot reload (using tsx)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check-types` - Run TypeScript type checking
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database (dev only)
- `pnpm db:studio` - Open Drizzle Studio for database management
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage report

## Project Structure

```
src/
├── config/          # Configuration files (env, firebase, logger)
├── db/              # Database setup, schema, and migrations
├── middleware/      # Express middleware (auth, security, errors)
├── routes/          # API route handlers
├── controllers/     # Route controllers
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── index.ts         # Server entry point

tests/
├── unit/            # Unit tests
└── integration/     # Integration tests
```

## API Endpoints

### Health Checks

- `GET /health` - Basic health check
- `GET /health/db` - Database health check

### Root

- `GET /` - API info

## Authentication

Protected routes require a Firebase JWT token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

Use the `authenticateUser` middleware to protect routes:

```typescript
import { authenticateUser } from './middleware/auth';

router.get('/protected', authenticateUser, (req, res) => {
  // req.user contains { uid, email, name }
});
```

## Database Schema

### Users Table

```typescript
{
  id: uuid (primary key)
  firebaseUid: string (unique)
  email: string (unique)
  name: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Error Handling

The API uses a custom `AppError` class for consistent error responses:

```typescript
throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
```

Response format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Security Features

- **Helmet**: Secure HTTP headers
- **Rate Limiting**: Configurable request limits
- **CORS**: Restricted origins
- **Input Validation**: Zod schema validation
- **Environment Validation**: Required env vars checked at startup

## Logging

Winston logger with different levels:
- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages
- `debug`: Debug messages (development only)

Example:

```typescript
import { logger } from './config/logger';

logger.info('User created', { userId: user.id });
logger.error('Failed to create user', { error });
```

## Testing

Run tests:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test -- --watch
```

Coverage:

```bash
pnpm test:coverage
```

## Production Deployment

1. Build the application:

```bash
pnpm build
```

2. Set `NODE_ENV=production`

3. Ensure all environment variables are set

4. Run migrations:

```bash
pnpm db:migrate
```

5. Start the server:

```bash
pnpm start
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication
3. Go to Project Settings > Service Accounts
4. Generate a new private key
5. Add the credentials to your `.env` file

## Contributing

1. Create a new branch
2. Make your changes
3. Run tests: `pnpm test`
4. Check types: `pnpm check-types`
5. Submit a pull request

## License

MIT
