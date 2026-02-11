import jwt from 'jsonwebtoken';
import { UserRepository } from '@modules/users/user.repository';
import { IUser } from '@modules/users/user.model';
import { config } from '@config/env.config';
import {
  UnauthorizedError,
  ConflictError,
  BadRequestError,
} from '@common/errors/AppError';
import { SignupInput, LoginInput } from './auth.schema';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: IUser;
  tokens: TokenPair;
}

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  private generateAccessToken(userId: string, email: string): string {
    return jwt.sign(
      { id: userId, email },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn } as any
    );
  }

  private generateRefreshToken(userId: string, email: string): string {
    return jwt.sign(
      { id: userId, email },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn } as any
    );
  }

  private generateTokenPair(userId: string, email: string): TokenPair {
    return {
      accessToken: this.generateAccessToken(userId, email),
      refreshToken: this.generateRefreshToken(userId, email),
    };
  }

  async signup(data: SignupInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: data.password,
      name: data.name,
      college: data.college,
      graduationYear: data.graduationYear,
    });

    // Generate tokens
    const tokens = this.generateTokenPair(user._id.toString(), user.email);

    // Store refresh token
    await this.userRepository.addRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    // Find user with password
    const user = await this.userRepository.findByEmailWithPassword(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokenPair(user._id.toString(), user.email);

    // Store refresh token
    await this.userRepository.addRefreshToken(user._id.toString(), tokens.refreshToken);

    // Remove password from response
    user.password = undefined as any;

    return {
      user,
      tokens,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        id: string;
        email: string;
      };

      // Check if token exists in database
      const user = await this.userRepository.findByRefreshToken(refreshToken);
      if (!user) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Generate new token pair
      const tokens = this.generateTokenPair(decoded.id, decoded.email);

      // Remove old refresh token and add new one
      await this.userRepository.removeRefreshToken(user._id.toString(), refreshToken);
      await this.userRepository.addRefreshToken(user._id.toString(), tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Remove specific refresh token
      await this.userRepository.removeRefreshToken(userId, refreshToken);
    } else {
      // Clear all refresh tokens (logout from all devices)
      await this.userRepository.clearRefreshTokens(userId);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.userRepository.clearRefreshTokens(userId);
  }

  async verifyToken(token: string): Promise<{ id: string; email: string }> {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as {
        id: string;
        email: string;
      };
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      throw new UnauthorizedError('Invalid token');
    }
  }
}
