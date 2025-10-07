# Mini Wallet Application

A production-grade blockchain wallet application built with **TypeScript**, Node.js, Express, Apollo GraphQL, and Ethereum integration.

## 🚀 Live Demo

**Deployed Application:** [https://mini-wallet-app.onrender.com](https://mini-wallet-app.onrender.com)
**GraphQL Playground:** [https://mini-wallet-app.onrender.com/graphql](https://mini-wallet-app.onrender.com/graphql)

## 📋 Features

- **Create Wallet**: Generate Ethereum wallet addresses with secure private key storage
- **Check Balance**: Real-time balance checking via Ethereum testnet
- **Send Funds**: Transfer ETH between wallets on Sepolia testnet
- **Transaction History**: View recent transactions for any wallet
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Web Interface**: Simple UI for wallet operations

## 🛠 Tech Stack

- **Language**: TypeScript
- **Backend**: Node.js, Express.js
- **GraphQL**: Apollo Server
- **Database**: SQLite with Sequelize ORM
- **Blockchain**: Ethers.js with Ethereum Sepolia testnet
- **Authentication**: JWT + bcrypt
- **Testing**: Jest with ts-jest (70%+ coverage)
- **Deployment**: Docker + Render
- **CI/CD**: GitHub Actions

## 🏗 Architecture

```
src/
├── types/            # TypeScript type definitions
├── database/         # Database configuration and migrations
├── models/          # Sequelize models with TypeScript (User, Wallet)
├── services/        # Business logic layer
│   ├── AuthService.ts
│   ├── WalletService.ts
│   └── BlockchainService.ts
├── graphql/         # GraphQL schema and resolvers
├── middleware/      # Authentication middleware
├── utils/          # Utilities (crypto, logger)
└── server.ts       # Main application entry point
```

## 🔐 Security Features

- Private keys encrypted with AES-256-GCM
- JWT tokens for authentication
- Input validation with Joi
- Rate limiting (100 req/15min)
- Helmet.js security headers
- Environment variable protection

## 📊 API Documentation

### Authentication

```graphql
# Register new user
mutation Register {
  register(username: "testuser", password: "password123") {
    user { id username }
    token
  }
}

# Login
mutation Login {
  login(username: "testuser", password: "password123") {
    user { id username }
    token
  }
}
```

### Wallet Operations

```graphql
# Create new wallet
mutation CreateWallet {
  createWallet {
    id
    address
    network
  }
}

# Get wallet balance
query WalletBalance {
  walletBalance(walletId: "wallet-id") {
    address
    balance
    network
  }
}

# Send funds
mutation SendFunds {
  sendFunds(
    walletId: "wallet-id"
    toAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
    amount: 0.001
  ) {
    hash
    from
    to
    value
  }
}

# Get transaction history
query TransactionHistory {
  transactionHistory(walletId: "wallet-id", limit: 10) {
    hash
    from
    to
    value
    timestamp
    status
  }
}
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Ethereum Sepolia testnet API keys:
  - [Etherscan API Key](https://etherscan.io/apis)
  - [Alchemy API Key](https://www.alchemy.com/)

### Local Development

1. **Clone and install**
```bash
git clone https://github.com/Aradhik11/mini-wallet-app.git
cd mini-wallet-app
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. **Build TypeScript**
```bash
npm run build
```

4. **Database setup**
```bash
npm run migrate
```

5. **Start development server**
```bash
npm run dev
```

5. **Access the application**
- Web UI: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t mini-wallet .
docker run -p 4000:4000 --env-file .env mini-wallet
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Current Test Coverage: 85%+**

Test suites include:
- Unit tests for all services
- Crypto utility tests
- Authentication flow tests
- Input validation tests

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=12

# Blockchain APIs
ETHERSCAN_API_KEY=your-etherscan-api-key
ALCHEMY_API_KEY=your-alchemy-api-key
NETWORK=sepolia

# Database
DATABASE_URL=./database.sqlite
```

### Supported Networks

- **Sepolia** (default): Ethereum testnet
- **Mainnet**: Ethereum mainnet (production)

## 🚀 Deployment

### Render Deployment

1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build production image
docker build -t mini-wallet .

# Deploy to your preferred platform
# (AWS ECS, Google Cloud Run, etc.)
```

## 📈 Performance & Scalability

- **Database**: SQLite for development, PostgreSQL recommended for production
- **Caching**: In-memory caching for frequently accessed data
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Connection Pooling**: Optimized database connections
- **Error Handling**: Comprehensive error logging and user feedback

## 🔒 Security Considerations

### Private Key Security
- Private keys are encrypted using AES-256-GCM
- Encryption keys derived from JWT secret
- Private keys never logged or exposed in API responses

### Authentication Security
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with 24-hour expiration
- Secure HTTP headers with Helmet.js

### Input Validation
- All inputs validated with Joi schemas
- Ethereum address format validation
- Amount and transaction parameter validation

## 🧪 Testing Strategy

### Unit Tests (70%+ coverage)
- Service layer business logic
- Crypto utilities
- Authentication flows
- Input validation

### Integration Tests
- GraphQL API endpoints
- Database operations
- Blockchain service integration

### Security Tests
- Authentication bypass attempts
- Input sanitization
- Private key exposure prevention

## 📚 API Examples

### Postman Collection

```json
{
  "info": { "name": "Mini Wallet API" },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/graphql",
        "body": {
          "query": "mutation { register(username: \"testuser\", password: \"password123\") { user { id username } token } }"
        }
      }
    }
  ]
}
```

### cURL Examples

```bash
# Register user
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { register(username: \"testuser\", password: \"password123\") { user { id username } token } }"}'

# Create wallet (with auth token)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "mutation { createWallet { id address network } }"}'
```

