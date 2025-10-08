# Fix API Key Issues

## The Problem
Your current API keys are invalid/incomplete:
- `ALCHEMY_API_KEY=cz-IenkNikdgJZPH4VqRs` (too short)
- Network connection timeouts

## Quick Fix

### 1. Get Valid Alchemy API Key
1. Go to https://www.alchemy.com/
2. Sign up/login
3. Create new app:
   - Chain: Ethereum
   - Network: Sepolia testnet
4. Copy the full API key (should be ~32 characters)

### 2. Get Valid Etherscan API Key
1. Go to https://etherscan.io/apis
2. Create account and verify email
3. Generate API key (free tier)

### 3. Update .env file
```env
ETHERSCAN_API_KEY=your-real-etherscan-key-here
ALCHEMY_API_KEY=your-real-alchemy-key-here-32-chars
```

### 4. Test Connection
```bash
# Restart server
npm run dev

# Test in browser console
fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'query { __schema { types { name } } }'
  })
}).then(r => r.json()).then(console.log)
```

## For Testing Without Real API Keys
The app now returns "0.0" balance when API fails, so basic functionality works without valid keys.

## Get Test ETH
Once you have valid keys and create a wallet:
1. Copy wallet address
2. Go to https://sepoliafaucet.com/
3. Request test ETH for your address