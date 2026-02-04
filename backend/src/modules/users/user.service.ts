import { UserRepository } from './user.repository';
import { IUser, IUserPreferences } from './user.model';
import { NotFoundError, BadRequestError } from '@common/errors/AppError';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateProfile(
    userId: string,
    updates: {
      name?: string;
      avatar?: string;
      college?: string;
      graduationYear?: number;
    }
  ): Promise<IUser> {
    // Validate graduation year if provided
    if (updates.graduationYear) {
      const currentYear = new Date().getFullYear();
      if (updates.graduationYear < 1900 || updates.graduationYear > currentYear + 10) {
        throw new BadRequestError('Invalid graduation year');
      }
    }

    return this.userRepository.updateById(userId, updates);
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<IUserPreferences>
  ): Promise<IUser> {
    // Validate reminderDaysBefore if provided
    if (preferences.reminderDaysBefore !== undefined) {
      if (preferences.reminderDaysBefore < 0 || preferences.reminderDaysBefore > 30) {
        throw new BadRequestError('Reminder days must be between 0 and 30');
      }
    }

    return this.userRepository.updatePreferences(userId, preferences);
  }

  async deleteAccount(userId: string): Promise<void> {
    // This should also delete all user's applications and reminders
    // For now, just delete the user
    await this.userRepository.deleteById(userId);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user with password
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // For password verification, we need to fetch it explicitly
    const userWithPassword = await this.userRepository.findByEmailWithPassword(user.email);
    if (!userWithPassword) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isPasswordValid = await userWithPassword.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new BadRequestError('New password must be at least 6 characters');
    }

    // Update password
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    // Clear all refresh tokens for security
    await this.userRepository.clearRefreshTokens(userId);
  }

  async getUserStats(userId: string): Promise<{
    totalApplications: number;
    activeApplications: number;
    completedApplications: number;
    memberSince: Date;
  }> {
    const user = await this.getUserById(userId);
    
    // This would typically query the applications collection
    // For now, returning basic user info
    return {
      totalApplications: 0,
      activeApplications: 0,
      completedApplications: 0,
      memberSince: user.createdAt,
    };
  }
}
