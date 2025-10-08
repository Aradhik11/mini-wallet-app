# Render Deployment Checklist

## Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables ready
- [ ] API keys obtained (Etherscan + Alchemy)

## Render Setup
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create Web Service with settings:
  - **Build Command:** `npm ci && npm run build && npm run migrate`
  - **Start Command:** `npm start`
  - **Environment:** Node

## Environment Variables (Required)
- [ ] `NODE_ENV=production`
- [ ] `PORT=4000`
- [ ] `JWT_SECRET=your-32-char-secret`
- [ ] `ETHERSCAN_API_KEY=your-key`
- [ ] `ALCHEMY_API_KEY=your-key`
- [ ] `NETWORK=sepolia`
- [ ] `BCRYPT_ROUNDS=12`
- [ ] `DATABASE_URL=your-db-url`

## Database Options
- [ ] **Option A:** SQLite (simple): `DATABASE_URL=/opt/render/project/src/database.sqlite`
- [ ] **Option B:** PostgreSQL (recommended): Create Render PostgreSQL service

## Post-Deployment
- [ ] Test GraphQL endpoint: `https://your-app.onrender.com/graphql`
- [ ] Test web interface: `https://your-app.onrender.com`
- [ ] Verify user registration/login
- [ ] Test wallet creation

## Troubleshooting
- Check Render logs for errors
- Verify all environment variables are set
- Ensure API keys are valid
- Check database connection