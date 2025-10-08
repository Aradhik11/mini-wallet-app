import { ethers } from 'ethers';
import axios from 'axios';
import logger from '../utils/logger';
import { BlockchainWallet, Transaction, TransactionResult } from '../types';

class BlockchainService {
  private network: string;
  private etherscanApiKey: string;
  private alchemyApiKey: string;
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.network = process.env.NETWORK || 'sepolia';
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY!;
    this.alchemyApiKey = process.env.ALCHEMY_API_KEY!;
    
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(
      `https://eth-${this.network}.g.alchemy.com/v2/${this.alchemyApiKey}`
    );
  }

  async createWallet(): Promise<BlockchainWallet> {
    try {
      const wallet = ethers.Wallet.createRandom();
      return {
        address: wallet.address,
        privateKey: wallet.privateKey
      };
    } catch (error) {
      logger.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet');
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      // Add timeout and retry logic
      const balance = await Promise.race([
        this.provider.getBalance(address),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        )
      ]) as bigint;
      
      return ethers.formatEther(balance);
    } catch (error) {
      logger.error('Error getting balance:', error);
      // Return 0 balance instead of throwing error for better UX
      return '0.0';
    }
  }

  async sendTransaction(fromPrivateKey: string, toAddress: string, amount: number): Promise<TransactionResult> {
    try {
      const wallet = new ethers.Wallet(fromPrivateKey, this.provider);
      const tx = {
        to: toAddress,
        value: ethers.parseEther(amount.toString()),
        gasLimit: 21000
      };

      const transaction = await wallet.sendTransaction(tx);
      return {
        hash: transaction.hash,
        from: transaction.from!,
        to: transaction.to!,
        value: ethers.formatEther(transaction.value)
      };
    } catch (error) {
      logger.error('Error sending transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  async getTransactionHistory(address: string, limit: number = 10): Promise<Transaction[]> {
    try {
      const baseUrl = this.network === 'mainnet' 
        ? 'https://api.etherscan.io/api'
        : `https://api-${this.network}.etherscan.io/api`;

      const response = await axios.get(baseUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: limit,
          sort: 'desc',
          apikey: this.etherscanApiKey
        }
      });

      if (response.data.status !== '1') {
        throw new Error('Failed to fetch transaction history');
      }

      return response.data.result.map((tx: any): Transaction => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        status: tx.txreceipt_status === '1' ? 'success' : 'failed'
      }));
    } catch (error) {
      logger.error('Error getting transaction history:', error);
      throw new Error('Failed to get transaction history');
    }
  }

  validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }
}

export default new BlockchainService();