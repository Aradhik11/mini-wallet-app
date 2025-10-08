import crypto from 'crypto';
import { EncryptedData } from '../types';

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

class CryptoUtils {
  static generateKey(): Buffer {
    return crypto.randomBytes(KEY_LENGTH);
  }

  static encrypt(text: string, key: string): EncryptedData {
    const iv = crypto.randomBytes(IV_LENGTH);
    const keyBuffer = crypto.scryptSync(key, 'salt', KEY_LENGTH);
    const cipher = crypto.createCipher(ALGORITHM, keyBuffer);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: ''
    };
  }

  static decrypt(encryptedData: string, key: string): string {
    const { encrypted } = JSON.parse(encryptedData) as EncryptedData;
    
    const keyBuffer = crypto.scryptSync(key, 'salt', KEY_LENGTH);
    const decipher = crypto.createDecipher(ALGORITHM, keyBuffer);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

export default CryptoUtils;