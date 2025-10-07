import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Wallet {
    id: ID!
    address: String!
    network: String!
    createdAt: String!
  }

  type Balance {
    address: String!
    balance: String!
    network: String!
  }

  type Transaction {
    hash: String!
    from: String!
    to: String!
    value: String!
    timestamp: String!
    status: String!
  }

  type TransactionResult {
    hash: String!
    from: String!
    to: String!
    value: String!
  }

  type Query {
    me: User
    myWallets: [Wallet!]!
    walletBalance(walletId: ID!): Balance!
    transactionHistory(walletId: ID!, limit: Int): [Transaction!]!
  }

  type Mutation {
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    createWallet: Wallet!
    sendFunds(walletId: ID!, toAddress: String!, amount: Float!): TransactionResult!
  }
`;

export default typeDefs;