import AuthService from '../services/AuthService';
import WalletService from '../services/WalletService';
import { User } from '../models';
import Joi from 'joi';
import { GraphQLContext } from '../types';

const validateInput = (schema: Joi.ObjectSchema, input: any) => {
  const { error, value } = schema.validate(input);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

const resolvers = {
  Query: {
    me: async (_: any, __: any, { userId }: GraphQLContext) => {
      if (!userId) throw new Error('Not authenticated');
      return await User.findByPk(userId, {
        attributes: ['id', 'username']
      });
    },

    myWallets: async (_: any, __: any, { userId }: GraphQLContext) => {
      if (!userId) throw new Error('Not authenticated');
      return await WalletService.getUserWallets(userId);
    },

    walletBalance: async (_: any, { walletId }: { walletId: string }, { userId }: GraphQLContext) => {
      if (!userId) throw new Error('Not authenticated');
      
      validateInput(Joi.string().uuid().required(), walletId);
      
      return await WalletService.getWalletBalance(walletId, userId);
    },

    transactionHistory: async (_: any, { walletId, limit = 10 }: { walletId: string; limit?: number }, { userId }: GraphQLContext) => {
      if (!userId) throw new Error('Not authenticated');
      
      validateInput(Joi.object({
        walletId: Joi.string().uuid().required(),
        limit: Joi.number().integer().min(1).max(100).default(10)
      }), { walletId, limit });
      
      return await WalletService.getTransactionHistory(walletId, userId, limit);
    }
  },

  Mutation: {
    register: async (_: any, { username, password }: { username: string; password: string }) => {
      validateInput(Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(6).required()
      }), { username, password });
      
      return await AuthService.register(username, password);
    },

    login: async (_: any, { username, password }: { username: string; password: string }) => {
      validateInput(Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
      }), { username, password });
      
      return await AuthService.login(username, password);
    },

    createWallet: async (_: any, __: any, { userId }: GraphQLContext) => {
      if (!userId) throw new Error('Not authenticated');
      return await WalletService.createWallet(userId);
    },

    sendFunds: async (_: any, { walletId, toAddress, amount }: { walletId: string; toAddress: string; amount: number }, { userId }: GraphQLContext) => {
      if (!userId) throw new Error('Not authenticated');
      
      validateInput(Joi.object({
        walletId: Joi.string().uuid().required(),
        toAddress: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required(),
        amount: Joi.number().positive().required()
      }), { walletId, toAddress, amount });
      
      return await WalletService.sendFunds(walletId, userId, toAddress, amount);
    }
  }
};

export default resolvers;