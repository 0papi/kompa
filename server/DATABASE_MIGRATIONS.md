# Database Migrations Best Practices

## Quick Reference Checklist

Before every schema change:

- [ ] Make changes in `src/models/*.ts`
- [ ] Run `pnpm db:generate` locally
- [ ] Review the generated SQL file
- [ ] Test with `pnpm db:migrate` on local DB
- [ ] Verify with `psql` or TablePlus
- [ ] Commit drizzle files
- [ ] Deploy to production
- [ ] Apply migration in production
- [ ] Verify production database

---

## 1. NEVER Delete Migration Files (Until Production is Synced)

**Golden Rule:** Once a migration is generated and committed, treat it as immutable.

### ❌ Don't do this:
```bash
# Deleting old migrations while database still references them
rm drizzle/0005_*.sql
```

### ✅ Do this instead:
```bash
# If you need a fresh start in development only:
# 1. Drop the database completely
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;

# 2. Delete ALL migrations
rm -rf drizzle/*.sql drizzle/meta/

# 3. Generate fresh baseline
pnpm db:generate

# 4. Apply to clean database
pnpm db:migrate
```

---

## 2. Proper Workflow for Schema Changes

### LOCAL DEVELOPMENT (on your machine)

```bash
# Step 1: Make schema changes in src/models/
# Edit your model files...

# Step 2: Generate migration
pnpm db:generate

# Step 3: Test migration locally first
pnpm db:migrate

# Step 4: Verify it worked
psql $DATABASE_URL -c "\dt"

# Step 5: Commit and push
git add drizzle/
git commit -m "feat: add user_preferences table"
git push
```

### PRODUCTION (Fly.io)

```bash
# Step 6: Deploy
fly deploy

# Step 7: Apply migration
flyctl ssh console -a kompa-server
pnpm db:migrate

# Step 8: Verify
psql $DATABASE_URL -c "\dt"
```

---

## 3. Type Safety - Foreign Key Rules

**Always match foreign key types exactly:**

### ❌ Wrong:
```typescript
export const comment = pgTable("comments", {
  authorId: text("author_id")  // text type
    .references(() => users.id)  // users.id is uuid - TYPE MISMATCH!
});
```

### ✅ Correct:
```typescript
export const comment = pgTable("comments", {
  authorId: uuid("author_id")  // uuid type matches users.id
    .references(() => users.id)
});
```

### Common type pairings:
- `uuid` → `uuid`
- `text` → `text`
- `integer` → `integer`
- `serial` → `integer`

**Special case - Firebase UID:**
```typescript
// Firebase UIDs are text, not uuid
firebaseUid: text("firebase_uid").notNull().unique()

// Don't use Firebase UID as foreign key
// Use the auto-generated uuid instead
```

---

## 4. Understanding Drizzle Kit Commands

| Command | Needs Source Files? | When to Use | Where to Run |
|---------|-------------------|-------------|--------------|
| `drizzle-kit generate` | ✅ YES (src/models/) | Creating new migrations | **LOCAL ONLY** |
| `drizzle-kit migrate` | ❌ NO (uses drizzle/*.sql) | Applying migrations | Local & Production |
| `drizzle-kit push` | ✅ YES | Dev only, skip migrations | Local dev only |
| `drizzle-kit studio` | ✅ YES | Database GUI | Local only |
| `drizzle-kit check` | ❌ NO | Validate migrations | Local |

### Why generate only runs locally:
Production containers don't have TypeScript source files (`src/`), only compiled JavaScript (`dist/`) and SQL migration files (`drizzle/*.sql`).

---

## 5. Proper Database Reset (Development Only)

If you need a completely fresh start:

### In psql or TablePlus:
```sql
-- This drops EVERYTHING in the public schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
```

This drops:
- ✅ All tables
- ✅ All enums/types
- ✅ All functions
- ✅ All constraints
- ✅ All sequences
- ✅ Everything!

### Then regenerate:
```bash
# Delete old migrations
rm -rf drizzle/*.sql drizzle/meta/

# Generate fresh baseline
pnpm db:generate

# Apply
pnpm db:migrate
```

---

## 6. Migration File Management

### Always commit these files:
```bash
drizzle/
├── 0000_initial_schema.sql
├── 0001_add_phone_number.sql
├── 0002_add_preferences.sql
├── meta/
│   ├── 0000_snapshot.json
│   ├── 0001_snapshot.json
│   ├── 0002_snapshot.json
│   └── _journal.json
```

**Why?**
- Migrations are the source of truth for your database schema
- They document your database evolution
- Production needs them to apply changes
- Team members need them to sync their databases

### Never commit:
- `.env` files with database credentials
- Database dumps (use migrations instead)

---

## 7. Testing Migrations Locally First

Before deploying to production, test migrations locally:

```bash
# 1. Create a local test database
createdb kompa_test

# 2. Point to it in .env.test
DATABASE_URL=postgresql://localhost/kompa_test

# 3. Test migration
DATABASE_URL=postgresql://localhost/kompa_test pnpm db:migrate

# 4. Verify schema
psql kompa_test -c "\d+ users"
psql kompa_test -c "\dT"  # List types/enums

# 5. Test some queries
psql kompa_test -c "INSERT INTO users (firebase_uid, email) VALUES ('test123', 'test@example.com');"

# 6. If all good, deploy to production
```

---

## 8. When Things Go Wrong in Production

### If a migration fails:

1. **Don't panic and delete migrations** - this makes it worse
2. **Read the error message carefully** - it usually tells you exactly what's wrong
3. **Common errors:**
   - `type already exists` - enum wasn't dropped
   - `relation already exists` - table wasn't dropped
   - `type mismatch` - foreign key types don't match
   - `cannot be implemented` - usually a type mismatch
4. **Fix the schema** in `src/models/`
5. **Generate a NEW migration** that fixes the issue
6. **Test locally** then deploy

### Example recovery:

```bash
# You tried to apply a migration and it failed
# DON'T delete the migration file!

# Instead:
# 1. Fix the issue in src/models/
# 2. Generate a new migration
pnpm db:generate

# 3. Test locally
pnpm db:migrate

# 4. Deploy
git add drizzle/
git commit -m "fix: correct type mismatch in comments table"
git push
fly deploy

# 5. Apply in production
flyctl ssh console -a kompa-server
pnpm db:migrate
```

### If you need to rollback:

```sql
-- Check what migrations were applied
SELECT * FROM __drizzle_migrations ORDER BY created_at;

-- Manually undo the last migration's changes
-- (e.g., DROP TABLE, DROP TYPE, etc.)

-- Then remove its tracking entry
DELETE FROM __drizzle_migrations WHERE tag = '0005_bad_migration';

-- Now you can try re-applying or fixing
```

---

## 9. Common Patterns

### Adding a new table:

```typescript
// 1. Create model file: src/models/new-table.model.ts
export const newTable = pgTable("new_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Export from index
export * from './new-table.model';

// 3. Generate migration
pnpm db:generate

// 4. Review drizzle/000X_*.sql
// 5. Test and deploy
```

### Adding a column:

```typescript
// 1. Add to existing model
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"), // NEW COLUMN
});

// 2. Generate migration
pnpm db:generate

// This will create:
// ALTER TABLE "users" ADD COLUMN "phone_number" text;
```

### Modifying a column (careful!):

```typescript
// Drizzle can't always detect changes
// You might need to manually edit the migration

// If changing nullable -> not null:
// 1. Add column as nullable
// 2. Backfill data
// 3. Add NOT NULL constraint

// If changing type:
// 1. Add new column
// 2. Migrate data
// 3. Drop old column
// 4. Rename new column
```

---

## 10. Package.json Scripts

Ensure you have these in `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:check": "drizzle-kit check"
  }
}
```

### What each script does:

- **generate**: Creates SQL migration files from your schema
- **migrate**: Applies SQL migrations to your database
- **push**: Directly syncs schema without migrations (dev only)
- **studio**: Opens a web GUI for your database
- **check**: Validates migration files for consistency

---

## 11. Troubleshooting Guide

### Error: "No file ./drizzle/0000_xxx.sql found"

**Cause:** Database has migrations tracked that don't exist in files.

**Fix:**
```sql
-- Check tracked migrations
SELECT * FROM __drizzle_migrations;

-- Either restore missing files or clear tracking
DELETE FROM __drizzle_migrations;
```

### Error: "type 'xxx' already exists"

**Cause:** Enum type already exists in database.

**Fix:**
```sql
-- Drop the enum
DROP TYPE IF EXISTS xxx CASCADE;

-- Then re-run migration
```

### Error: "relation 'xxx' already exists"

**Cause:** Table already exists in database.

**Fix:**
```sql
-- Drop the table
DROP TABLE IF EXISTS xxx CASCADE;

-- Then re-run migration
```

### Error: "foreign key constraint cannot be implemented"

**Cause:** Type mismatch between foreign key columns.

**Fix:**
Check your model definitions. Foreign key types must match exactly:
```typescript
// Both must be uuid, or both must be text, etc.
authorId: uuid("author_id").references(() => users.id)
```

---

## 12. Production Deployment Checklist

Before pushing migrations to production:

- [ ] Test migration on local database
- [ ] Check migration SQL file for correctness
- [ ] Backup production database (if critical)
- [ ] Check for type mismatches
- [ ] Verify foreign key constraints are valid
- [ ] Consider data migration needs
- [ ] Plan for rollback if needed
- [ ] Notify team of schema changes
- [ ] Update API/application code if needed
- [ ] Test application with new schema

---

## Key Takeaways

1. **Migrations are forward-only** - don't delete old ones
2. **Always test locally first** - before production
3. **Match foreign key types exactly** - uuid to uuid, text to text
4. **Generate locally, migrate everywhere** - never generate in production
5. **Commit all migration files** - they're your schema history
6. **Read error messages carefully** - they tell you exactly what's wrong
7. **Use DROP SCHEMA CASCADE** - for complete database resets
8. **One migration per feature** - keep them focused and atomic

Remember: When in doubt, create a new migration to fix issues rather than trying to modify or delete old ones!
