import AuthService from '../../src/services/AuthService';
import { User } from '../../src/models';
import bcrypt from 'bcryptjs';

jest.mock('../../src/models');
jest.mock('bcryptjs');

const mockUser = User as jest.Mocked<typeof User>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        id: 'user-123',
        username: 'testuser',
        passwordHash: 'hashedpassword'
      };

      mockUser.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      mockUser.create.mockResolvedValue(userData as any);

      const result = await AuthService.register('testuser', 'password123');

      expect(result.user.username).toBe('testuser');
      expect(result.token).toBeDefined();
      expect(mockUser.create).toHaveBeenCalledWith({
        username: 'testuser',
        passwordHash: 'hashedpassword'
      });
    });

    it('should throw error if username already exists', async () => {
      mockUser.findOne.mockResolvedValue({ username: 'testuser' } as any);

      await expect(AuthService.register('testuser', 'password123'))
        .rejects.toThrow('Username already exists');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const userData = {
        id: 'user-123',
        username: 'testuser',
        passwordHash: 'hashedpassword'
      };

      mockUser.findOne.mockResolvedValue(userData as any);
      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await AuthService.login('testuser', 'password123');

      expect(result.user.username).toBe('testuser');
      expect(result.token).toBeDefined();
    });

    it('should throw error for invalid credentials', async () => {
      mockUser.findOne.mockResolvedValue(null);

      await expect(AuthService.login('testuser', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = AuthService.generateToken('user-123');
      const decoded = AuthService.verifyToken(token);
      
      expect(decoded.userId).toBe('user-123');
    });

    it('should throw error for invalid token', () => {
      expect(() => AuthService.verifyToken('invalid-token'))
        .toThrow('Invalid token');
    });
  });
});