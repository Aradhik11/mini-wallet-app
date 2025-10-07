import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import logger from '../utils/logger';
import { AuthPayload } from '../types';

class AuthService {
  async register(username: string, password: string): Promise<AuthPayload> {
    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        username,
        passwordHash
      });

      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          username: user.username
        },
        token
      };
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<AuthPayload> {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          username: user.username
        },
        token
      };
    } catch (error) {
      logger.error('Error logging in user:', error);
      throw error;
    }
  }

  generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  verifyToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new AuthService();