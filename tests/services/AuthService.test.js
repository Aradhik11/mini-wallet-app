const AuthService = require('../../src/services/AuthService');
const { User } = require('../../src/models');
const bcrypt = require('bcryptjs');

jest.mock('../../src/models');
jest.mock('bcryptjs');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        username: 'testuser',
        passwordHash: 'hashedpassword'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.create.mockResolvedValue(mockUser);

      const result = await AuthService.register('testuser', 'password123');

      expect(result.user.username).toBe('testuser');
      expect(result.token).toBeDefined();
      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        passwordHash: 'hashedpassword'
      });
    });

    it('should throw error if username already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'testuser' });

      await expect(AuthService.register('testuser', 'password123'))
        .rejects.toThrow('Username already exists');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        username: 'testuser',
        passwordHash: 'hashedpassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await AuthService.login('testuser', 'password123');

      expect(result.user.username).toBe('testuser');
      expect(result.token).toBeDefined();
    });

    it('should throw error for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

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