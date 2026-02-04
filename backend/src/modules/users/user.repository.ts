import { User, IUser } from './user.model';
import { NotFoundError } from '@common/errors/AppError';
import mongoose from 'mongoose';

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return User.findById(id);
  }

  async findByIdOrFail(id: string): Promise<IUser> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async updateById(id: string, updates: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  async deleteById(id: string): Promise<void> {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundError('User not found');
    }
  }

  async addRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $push: { refreshTokens: refreshToken },
    });
  }

  async removeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken },
    });
  }

  async clearRefreshTokens(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<IUser | null> {
    return User.findOne({ refreshTokens: refreshToken }).select('+refreshTokens');
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<IUser['preferences']>
  ): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  async exists(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email.toLowerCase() });
    return !!user;
  }
}
