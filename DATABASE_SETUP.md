# Database Setup for Render Deployment

## Option 1: SQLite (Simple, Free)
For development and small-scale production:

**Render Environment Variables:**
```
DATABASE_URL=/opt/render/project/src/database.sqlite
```

**Pros:** Free, no additional setup
**Cons:** File-based, limited scalability

## Option 2: PostgreSQL (Recommended for Production)

### Using Render PostgreSQL:
1. In Render dashboard: New + → PostgreSQL
2. Create database (free tier available)
3. Copy connection string
4. Set in environment variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Using External PostgreSQL:
- **Supabase**: Free tier with 500MB
- **ElephantSQL**: Free tier with 20MB
- **Heroku Postgres**: Free tier discontinued

## Database Migration

The app automatically runs migrations on startup via:
```bash
npm run migrate
```

This creates the required tables:
- `Users` (id, username, password, createdAt, updatedAt)
- `Wallets` (id, address, encryptedPrivateKey, network, userId, createdAt, updatedAt)

## Manual Migration (if needed):
```bash
# Local development
npm run migrate

# Production (via Render shell)
npm run build && npm run migrate
```