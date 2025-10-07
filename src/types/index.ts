export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  encryptedPrivateKey: string;
  network: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  user: {
    id: string;
    username: string;
  };
  token: string;
}

export interface WalletBalance {
  address: string;
  balance: string;
  network: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  status: string;
}

export interface TransactionResult {
  hash: string;
  from: string;
  to: string;
  value: string;
}

export interface BlockchainWallet {
  address: string;
  privateKey: string;
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

export interface GraphQLContext {
  userId?: string;
}