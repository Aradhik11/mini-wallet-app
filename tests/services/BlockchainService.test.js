const BlockchainService = require('../../src/services/BlockchainService');
const { ethers } = require('ethers');

jest.mock('ethers');

describe('BlockchainService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    it('should create a new wallet', async () => {
      const mockWallet = {
        address: '0x1234567890123456789012345678901234567890',
        privateKey: '0xprivatekey123'
      };

      ethers.Wallet.createRandom = jest.fn().mockReturnValue(mockWallet);

      const result = await BlockchainService.createWallet();

      expect(result.address).toBe(mockWallet.address);
      expect(result.privateKey).toBe(mockWallet.privateKey);
    });

    it('should handle wallet creation errors', async () => {
      ethers.Wallet.createRandom = jest.fn().mockImplementation(() => {
        throw new Error('Creation failed');
      });

      await expect(BlockchainService.createWallet())
        .rejects.toThrow('Failed to create wallet');
    });
  });

  describe('validateAddress', () => {
    it('should validate Ethereum addresses', () => {
      ethers.isAddress = jest.fn().mockReturnValue(true);
      
      const result = BlockchainService.validateAddress('0x1234567890123456789012345678901234567890');
      
      expect(result).toBe(true);
      expect(ethers.isAddress).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890');
    });

    it('should reject invalid addresses', () => {
      ethers.isAddress = jest.fn().mockReturnValue(false);
      
      const result = BlockchainService.validateAddress('invalid-address');
      
      expect(result).toBe(false);
    });
  });

  describe('getBalance', () => {
    it('should format balance correctly', async () => {
      const mockProvider = {
        getBalance: jest.fn().mockResolvedValue('1500000000000000000') // 1.5 ETH in wei
      };

      BlockchainService.provider = mockProvider;
      ethers.formatEther = jest.fn().mockReturnValue('1.5');

      const result = await BlockchainService.getBalance('0x1234567890123456789012345678901234567890');

      expect(result).toBe('1.5');
      expect(mockProvider.getBalance).toHaveBeenCalled();
    });
  });
});