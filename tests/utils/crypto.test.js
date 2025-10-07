const CryptoUtils = require('../../src/utils/crypto');

describe('CryptoUtils', () => {
  const testKey = 'test-encryption-key-32-characters';
  const testData = 'sensitive-private-key-data';

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt data correctly', () => {
      const encrypted = CryptoUtils.encrypt(testData, testKey);
      
      expect(encrypted.encrypted).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.tag).toBeDefined();

      const decrypted = CryptoUtils.decrypt(JSON.stringify(encrypted), testKey);
      expect(decrypted).toBe(testData);
    });

    it('should produce different encrypted output for same input', () => {
      const encrypted1 = CryptoUtils.encrypt(testData, testKey);
      const encrypted2 = CryptoUtils.encrypt(testData, testKey);
      
      expect(encrypted1.encrypted).not.toBe(encrypted2.encrypted);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
    });

    it('should fail decryption with wrong key', () => {
      const encrypted = CryptoUtils.encrypt(testData, testKey);
      const wrongKey = 'wrong-encryption-key-32-characters';
      
      expect(() => {
        CryptoUtils.decrypt(JSON.stringify(encrypted), wrongKey);
      }).toThrow();
    });
  });

  describe('generateKey', () => {
    it('should generate random keys', () => {
      const key1 = CryptoUtils.generateKey();
      const key2 = CryptoUtils.generateKey();
      
      expect(key1).not.toEqual(key2);
      expect(key1.length).toBe(32);
      expect(key2.length).toBe(32);
    });
  });
});