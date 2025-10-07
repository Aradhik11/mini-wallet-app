import { Wallet } from '../models';
import BlockchainService from './BlockchainService';
import CryptoUtils from '../utils/crypto';
import logger from '../utils/logger';
import { WalletBalance, Transaction, TransactionResult } from '../types';

class WalletService {
  async createWallet(userId: string): Promise<{ id: string; address: string; network: string }> {
    try {
      const { address, privateKey } = await BlockchainService.createWallet();
      
      // Encrypt private key
      const encryptionKey = process.env.JWT_SECRET!;
      const encryptedData = CryptoUtils.encrypt(privateKey, encryptionKey);
      
      const wallet = await Wallet.create({
        userId,
        address,
        encryptedPrivateKey: JSON.stringify(encryptedData),
        network: process.env.NETWORK || 'sepolia'
      });

      return {
        id: wallet.id,
        address: wallet.address,
        network: wallet.network
      };
    } catch (error) {
      logger.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet');
    }
  }

  async getWalletBalance(walletId: string, userId: string): Promise<WalletBalance> {
    try {
      const wallet = await Wallet.findOne({
        where: { id: walletId, userId }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balance = await BlockchainService.getBalance(wallet.address);
      return {
        address: wallet.address,
        balance,
        network: wallet.network
      };
    } catch (error) {
      logger.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  async sendFunds(walletId: string, userId: string, toAddress: string, amount: number): Promise<TransactionResult> {
    try {
      const wallet = await Wallet.findOne({
        where: { id: walletId, userId }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (!BlockchainService.validateAddress(toAddress)) {
        throw new Error('Invalid recipient address');
      }

      // Decrypt private key
      const encryptionKey = process.env.JWT_SECRET!;
      const privateKey = CryptoUtils.decrypt(wallet.encryptedPrivateKey, encryptionKey);

      const transaction = await BlockchainService.sendTransaction(
        privateKey,
        toAddress,
        amount
      );

      return transaction;
    } catch (error) {
      logger.error('Error sending funds:', error);
      throw error;
    }
  }

  async getTransactionHistory(walletId: string, userId: string, limit: number = 10): Promise<Transaction[]> {
    try {
      const wallet = await Wallet.findOne({
        where: { id: walletId, userId }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const transactions = await BlockchainService.getTransactionHistory(
        wallet.address,
        limit
      );

      return transactions;
    } catch (error) {
      logger.error('Error getting transaction history:', error);
      throw error;
    }
  }

  async getUserWallets(userId: string): Promise<Array<{ id: string; address: string; network: string; createdAt: Date }>> {
    try {
      const wallets = await Wallet.findAll({
        where: { userId },
        attributes: ['id', 'address', 'network', 'createdAt']
      });

      return wallets.map(wallet => ({
        id: wallet.id,
        address: wallet.address,
        network: wallet.network,
        createdAt: wallet.createdAt
      }));
    } catch (error) {
      logger.error('Error getting user wallets:', error);
      throw error;
    }
  }
}

export default new WalletService();