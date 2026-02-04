import { Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { AuthRequest } from '@common/types';

export class UserController {
  constructor(private userService: UserService) {}

  getProfile = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const user = await this.userService.getUserById(userId);
      ApiResponse.success(res, user, 'Profile retrieved successfully');
    }
  );

  updateProfile = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const user = await this.userService.updateProfile(userId, req.body);
      ApiResponse.success(res, user, 'Profile updated successfully');
    }
  );

  updatePreferences = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const user = await this.userService.updatePreferences(userId, req.body);
      ApiResponse.success(res, user, 'Preferences updated successfully');
    }
  );

  changePassword = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;
      await this.userService.changePassword(userId, currentPassword, newPassword);
      ApiResponse.success(res, null, 'Password changed successfully');
    }
  );

  deleteAccount = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      await this.userService.deleteAccount(userId);
      ApiResponse.success(res, null, 'Account deleted successfully');
    }
  );

  getStats = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const stats = await this.userService.getUserStats(userId);
      ApiResponse.success(res, stats, 'User stats retrieved successfully');
    }
  );
}
