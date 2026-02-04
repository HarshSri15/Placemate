import { Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { AuthRequest } from '@common/types';
import { config } from '@config/env.config';

export class AuthController {
  constructor(private authService: AuthService) {}

  signup = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { user, tokens } = await this.authService.signup(req.body);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, config.cookie.options);

      ApiResponse.created(res, {
        user,
        accessToken: tokens.accessToken,
      }, 'User registered successfully');
    }
  );

  login = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const { user, tokens } = await this.authService.login(req.body);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, config.cookie.options);

      ApiResponse.success(res, {
        user,
        accessToken: tokens.accessToken,
      }, 'Login successful');
    }
  );

  refreshToken = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      const tokens = await this.authService.refreshAccessToken(refreshToken);

      // Set new refresh token in httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, config.cookie.options);

      ApiResponse.success(res, {
        accessToken: tokens.accessToken,
      }, 'Token refreshed successfully');
    }
  );

  logout = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      await this.authService.logout(userId, refreshToken);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      ApiResponse.success(res, null, 'Logout successful');
    }
  );

  logoutAll = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;

      await this.authService.logoutAll(userId);

      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      ApiResponse.success(res, null, 'Logged out from all devices');
    }
  );

  getCurrentUser = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      // User is already attached by auth middleware
      // Just need to fetch full user details
      const userId = req.user!.id;
      
      // This would typically call a service method
      ApiResponse.success(res, {
        id: userId,
        email: req.user!.email,
      }, 'User retrieved successfully');
    }
  );
}
