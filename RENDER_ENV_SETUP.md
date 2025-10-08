# Render Environment Variables

Set these in your Render dashboard under Environment Variables:

## Required Variables:
```
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
ETHERSCAN_API_KEY=your-etherscan-api-key
ALCHEMY_API_KEY=your-alchemy-api-key
NETWORK=sepolia
BCRYPT_ROUNDS=12
DATABASE_URL=/opt/render/project/src/database.sqlite
```

## How to get API Keys:

### Etherscan API Key:
1. Go to https://etherscan.io/apis
2. Create account and verify email
3. Generate API key (free tier: 5 calls/sec)

### Alchemy API Key:
1. Go to https://www.alchemy.com/
2. Create account
3. Create new app → Ethereum → Sepolia testnet
4. Copy API key from dashboard