import { AuthService } from '@modules/auth/auth.service';
import { UserRepository } from '@modules/users/user.repository';
import { ConflictError, UnauthorizedError } from '@common/errors/AppError';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    authService = new AuthService(userRepository);
  });

  describe('signup', () => {
    it('should create a new user and return tokens', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await authService.signup(userData);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });

    it('should throw ConflictError if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await authService.signup(userData);

      await expect(authService.signup(userData)).rejects.toThrow(ConflictError);
    });

    it('should hash the password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await authService.signup(userData);
      const user = await userRepository.findByEmailWithPassword(userData.email);

      expect(user!.password).not.toBe(userData.password);
      expect(user!.password.length).toBeGreaterThan(20);
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await authService.signup(userData);

      const result = await authService.login({
        email: userData.email,
        password: userData.password,
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.tokens).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });

    it('should throw UnauthorizedError with invalid email', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError with invalid password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await authService.signup(userData);

      await expect(
        authService.login({
          email: userData.email,
          password: 'wrongpassword',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('refreshAccessToken', () => {
    it('should generate new tokens with valid refresh token', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const { tokens } = await authService.signup(userData);
      const newTokens = await authService.refreshAccessToken(tokens.refreshToken);

      expect(newTokens.accessToken).toBeDefined();
      expect(newTokens.refreshToken).toBeDefined();
      expect(newTokens.accessToken).not.toBe(tokens.accessToken);
    });

    it('should throw UnauthorizedError with invalid refresh token', async () => {
      await expect(
        authService.refreshAccessToken('invalid-token')
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('logout', () => {
    it('should remove refresh token from user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const { user, tokens } = await authService.signup(userData);
      await authService.logout(user.id, tokens.refreshToken);

      const userWithTokens = await userRepository.findByRefreshToken(tokens.refreshToken);
      expect(userWithTokens).toBeNull();
    });
  });
});
