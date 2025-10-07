const WalletService = require('../../src/services/WalletService');
const { Wallet } = require('../../src/models');
const BlockchainService = require('../../src/services/BlockchainService');

jest.mock('../../src/models');
jest.mock('../../src/services/BlockchainService');

describe('WalletService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    it('should create a new wallet successfully', async () => {
      const mockWalletData = {
        address: '0x1234567890123456789012345678901234567890',
        privateKey: '0xprivatekey123'
      };

      const mockWallet = {
        id: 'wallet-123',
        address: mockWalletData.address,
        network: 'sepolia'
      };

      BlockchainService.createWallet.mockResolvedValue(mockWalletData);
      Wallet.create.mockResolvedValue(mockWallet);

      const result = await WalletService.createWallet('user-123');

      expect(result.address).toBe(mockWalletData.address);
      expect(result.network).toBe('sepolia');
      expect(Wallet.create).toHaveBeenCalled();
    });
  });

  describe('getWalletBalance', () => {
    it('should get wallet balance successfully', async () => {
      const mockWallet = {
        id: 'wallet-123',
        address: '0x1234567890123456789012345678901234567890',
        network: 'sepolia'
      };

      Wallet.findOne.mockResolvedValue(mockWallet);
      BlockchainService.getBalance.mockResolvedValue('1.5');

      const result = await WalletService.getWalletBalance('wallet-123', 'user-123');

      expect(result.balance).toBe('1.5');
      expect(result.address).toBe(mockWallet.address);
    });

    it('should throw error if wallet not found', async () => {
      Wallet.findOne.mockResolvedValue(null);

      await expect(WalletService.getWalletBalance('wallet-123', 'user-123'))
        .rejects.toThrow('Wallet not found');
    });
  });

  describe('sendFunds', () => {
    it('should validate address before sending', async () => {
      const mockWallet = {
        id: 'wallet-123',
        encryptedPrivateKey: JSON.stringify({ encrypted: 'test', iv: 'test', tag: 'test' })
      };

      Wallet.findOne.mockResolvedValue(mockWallet);
      BlockchainService.validateAddress.mockReturnValue(false);

      await expect(WalletService.sendFunds('wallet-123', 'user-123', 'invalid-address', 1))
        .rejects.toThrow('Invalid recipient address');
    });
  });
});