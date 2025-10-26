# GitHub Actions Quick Reference

## 🚀 One-Time Setup

```bash
# 1. Get your Fly.io token
flyctl auth token

# 2. Add to GitHub Secrets
# Go to: Settings → Secrets and variables → Actions → New repository secret
# Name: FLY_API_TOKEN
# Value: <paste token from step 1>
```

## 📋 Daily Workflow

```bash
# Make changes to your code
git add .
git commit -m "feat: your feature"
git push

# That's it! GitHub Actions will:
# ✅ Run tests
# ✅ Deploy to Fly.io
# ✅ Run migrations
```

## ⚡ Quick Commands

### Skip Deployment
```bash
git commit -m "docs: update [skip ci]"
```

### Manual Deploy (if needed)
```bash
cd server
fly deploy
flyctl ssh console -C "pnpm db:migrate"
```

### View Deployment Status
```bash
flyctl status -a kompa-server
flyctl logs -a kompa-server
```

### Rollback
```bash
flyctl releases -a kompa-server
flyctl releases rollback <version> -a kompa-server
```

## 🎯 Workflows

### CI Workflow
- **When**: Every push/PR to main or feat/web
- **What**: Type checks + tests + build
- **Time**: ~3-5 minutes

### Deploy Workflow
- **When**: Push to main or feat/web (only server changes)
- **What**: Deploy + run migrations
- **Time**: ~2-3 minutes

## 📊 Monitoring

- **View runs**: GitHub repo → Actions tab
- **Check logs**: Click on any workflow run
- **App status**: `flyctl status -a kompa-server`

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "unauthorized" | Update FLY_API_TOKEN secret |
| Migrations fail | Check logs: `flyctl logs` |
| CI doesn't trigger | Check if files changed in `server/` |
| Need to deploy without CI | Add `[skip ci]` to commit message |

## 📖 Full Documentation

See `GITHUB_ACTIONS_SETUP.md` for complete guide.
