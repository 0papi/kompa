# Quick Deployment to Fly.io (With Render Database)

**IMPORTANT**: This guide helps you deploy WITHOUT paying for Fly.io's Postgres ($38/mo). You'll use your existing FREE Render database.

## Step-by-Step Deployment

### 1. Login to Fly.io
```bash
cd server
flyctl auth login
```

### 2. Create the app (without launching)
```bash
flyctl apps create kompa-server
```

Or if the app name is taken, choose a different name:
```bash
flyctl apps create kompa-server-your-unique-name
```

If you used a different name, update the `app` field in `fly.toml`.

### 3. Set your Render database URL
```bash
flyctl secrets set DATABASE_URL="postgresql://kompa_db_user:k3rDpd9PGsroP0Ph2DUnCwDPSV8Uw57g@dpg-d3t547odl3ps738esp70-a/kompa_db" -a kompa-server
```

### 4. Set CORS origin (your frontend URL)
```bash
# For development/testing, you can use localhost
flyctl secrets set CORS_ORIGIN="http://localhost:5173" -a kompa-server

# For production, use your actual frontend domain
# flyctl secrets set CORS_ORIGIN="https://your-frontend-domain.com" -a kompa-server
```

### 5. Set Firebase credentials
```bash
flyctl secrets set FIREBASE_PROJECT_ID="your-project-id" -a kompa-server
flyctl secrets set FIREBASE_CLIENT_EMAIL="your-service-account@your-project-id.iam.gserviceaccount.com" -a kompa-server
flyctl secrets set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----" -a kompa-server
```

**Tip**: For the private key, you can use:
```bash
flyctl secrets set FIREBASE_PRIVATE_KEY="$(cat path/to/firebase-key.txt)" -a kompa-server
```

### 6. (Optional) Set database pool configuration
```bash
flyctl secrets set DB_POOL_MIN="2" -a kompa-server
flyctl secrets set DB_POOL_MAX="10" -a kompa-server
```

### 7. Deploy the application
```bash
flyctl deploy
```

This will:
- Build your Docker image
- Push it to Fly.io's registry
- Deploy your app
- Start the container
- Run health checks

**Note**: The app will be running but the database tables won't exist yet. You'll run migrations next.

### 8. Run database migrations

**IMPORTANT**: You must deploy first (step 7) before running migrations. This is because we need to SSH into the running container to execute the migration commands.

```bash
flyctl ssh console -a kompa-server -C "cd /app && node_modules/.bin/drizzle-kit migrate"
```

This connects to your running Fly.io container and runs the migrations against your Render database.

### 9. Verify deployment
```bash
# Check status
flyctl status -a kompa-server

# View logs
flyctl logs -a kompa-server

# Test the API
curl https://kompa-server.fly.dev/health
```

## Troubleshooting

### If app name is already taken
If you get an error that `kompa-server` already exists, either:
1. Use a different name when creating the app
2. Update the `app` field in `fly.toml` to match your chosen name

### If deployment fails
```bash
# Check logs for errors
flyctl logs -a kompa-server

# View recent deployments
flyctl releases -a kompa-server

# Restart the app
flyctl apps restart kompa-server
```

### If you see database errors
- Make sure your Render database is accessible from external connections
- Check that the DATABASE_URL is correct
- Verify your Render database isn't paused/sleeping

### To view all secrets
```bash
flyctl secrets list -a kompa-server
```

## Cost Breakdown
- **Compute**: FREE tier (shared CPU, up to 3 machines)
- **Database**: FREE (using your Render database)
- **Bandwidth**: FREE tier (100GB/month)

**Total monthly cost**: $0 if you stay within free tier limits

## Next Steps
- Update your frontend's API URL to point to `https://kompa-server.fly.dev`
- Set up a custom domain (optional)
- Configure CI/CD for automatic deployments (optional)
