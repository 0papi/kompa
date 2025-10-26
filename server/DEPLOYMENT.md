# Fly.io Deployment Guide

This guide will walk you through deploying the Kompa server to Fly.io.

## Prerequisites

- [x] Fly.io CLI installed (flyctl)
- [x] Fly.io account (sign up at https://fly.io)
- [x] PostgreSQL database (you already have one on Render!)
- [x] Firebase service account credentials

## Initial Setup

### 1. Login to Fly.io

```bash
flyctl auth login
```

### 2. Navigate to the server directory

```bash
cd server
```

### 3. Launch the app (first time only)

The `fly.toml` configuration is already created. To initialize your app:

```bash
flyctl launch --no-deploy
```

When prompted:
- Choose your app name (default: `kompa-server`)
- Select your preferred region (default: `iad` - US East)
- **DO NOT** deploy yet - we need to set up secrets first

Alternatively, if you want to use the existing configuration:

```bash
flyctl apps create kompa-server
```

### 4. Configure PostgreSQL Database

You have two options:

#### Option A: External Database (Recommended - FREE)

If you're using an external PostgreSQL database like Render, Supabase, or Neon (recommended to avoid Fly.io database costs), set the DATABASE_URL secret:

```bash
flyctl secrets set DATABASE_URL="postgresql://username:password@host:5432/database_name"
```

For example, with your Render database:
```bash
flyctl secrets set DATABASE_URL="postgresql://kompa_db_user:your-password@dpg-xxx-a/kompa_db"
```

#### Option B: Fly Postgres (Paid)

If you prefer to use Fly.io's managed Postgres (this is a paid service):

```bash
flyctl postgres create --name kompa-db --region iad
flyctl postgres attach kompa-db -a kompa-server
```

This will automatically set the `DATABASE_URL` secret.

### 5. Set Environment Secrets

Set all required environment variables as secrets:

```bash
# CORS Origin (your frontend URL)
flyctl secrets set CORS_ORIGIN="https://your-frontend-domain.com"

# Firebase Configuration
flyctl secrets set FIREBASE_PROJECT_ID="your-project-id"
flyctl secrets set FIREBASE_CLIENT_EMAIL="your-service-account@your-project-id.iam.gserviceaccount.com"
flyctl secrets set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
Your private key here (with actual newlines)
-----END PRIVATE KEY-----"

# Database Pool Configuration (optional, defaults are good)
flyctl secrets set DB_POOL_MIN="2"
flyctl secrets set DB_POOL_MAX="10"

# Rate Limiting Configuration (optional)
flyctl secrets set RATE_LIMIT_WINDOW_MS="900000"
flyctl secrets set RATE_LIMIT_MAX_REQUESTS="100"
```

**Note:** For `FIREBASE_PRIVATE_KEY`, you can either:
- Copy-paste the entire key with newlines
- Use a file: `flyctl secrets set FIREBASE_PRIVATE_KEY="$(cat firebase-key.txt)"`

### 6. Run Database Migrations

After deploying, you'll need to run migrations. You can do this via:

```bash
# Option 1: SSH into the machine
flyctl ssh console
cd /app
node_modules/.bin/drizzle-kit migrate

# Option 2: Run as a one-off command
flyctl ssh console -C "cd /app && node_modules/.bin/drizzle-kit migrate"
```

## Deployment

### Deploy the application

```bash
flyctl deploy
```

This will:
1. Build the Docker image
2. Push it to Fly.io registry
3. Deploy to your app
4. Run health checks

### Monitor the deployment

```bash
flyctl logs
```

### Check the status

```bash
flyctl status
```

## Post-Deployment

### Verify the deployment

```bash
# Check if app is running
flyctl status

# View recent logs
flyctl logs

# Open in browser
flyctl open
```

Your API should be accessible at `https://kompa-server.fly.dev` (or your custom domain).

### Test the health endpoint

```bash
curl https://kompa-server.fly.dev/health
```

## Scaling

### Scale VM resources

```bash
# Scale memory
flyctl scale memory 2048

# Scale CPUs
flyctl scale vm shared-cpu-2x
```

### Scale machine count

```bash
# Set minimum machines
flyctl scale count 2

# Set minimum and maximum
flyctl scale count 2 --max-per-region 4
```

## Environment Management

### List all secrets

```bash
flyctl secrets list
```

### Update a secret

```bash
flyctl secrets set SECRET_NAME="new-value"
```

### Remove a secret

```bash
flyctl secrets unset SECRET_NAME
```

## Troubleshooting

### View logs

```bash
# Stream logs
flyctl logs

# View specific number of recent logs
flyctl logs --lines 100
```

### SSH into the machine

```bash
flyctl ssh console
```

### Restart the application

```bash
flyctl apps restart kompa-server
```

### Check app info

```bash
flyctl info
```

## Custom Domain (Optional)

### Add a custom domain

```bash
flyctl certs create api.yourdomain.com
```

Follow the instructions to add DNS records.

### Verify certificate

```bash
flyctl certs show api.yourdomain.com
```

## CI/CD Integration

For automated deployments, you can use GitHub Actions:

1. Get a Fly.io deploy token:
   ```bash
   flyctl tokens create deploy
   ```

2. Add the token as a GitHub secret named `FLY_API_TOKEN`

3. Create `.github/workflows/deploy.yml` in your repository

## Useful Commands

```bash
# View all apps
flyctl apps list

# View app info
flyctl info

# View app status
flyctl status

# View app secrets
flyctl secrets list

# Open app in browser
flyctl open

# View monitoring dashboard
flyctl dashboard

# Destroy app (careful!)
flyctl apps destroy kompa-server
```

## Cost Optimization

- Fly.io offers a free tier with limited resources
- For production, consider:
  - Using `auto_stop_machines` (already configured)
  - Setting appropriate `min_machines_running`
  - Using shared CPU VMs for cost savings
  - Monitoring resource usage with `flyctl dashboard`

## Support

- Fly.io Documentation: https://fly.io/docs/
- Fly.io Community: https://community.fly.io/
- Status Page: https://status.fly.io/
