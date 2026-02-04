import { Reminder, IReminder } from './reminder.model';
import { NotFoundError } from '@common/errors/AppError';
import { PaginationResult } from '@common/utils/pagination';
import mongoose from 'mongoose';

export interface ReminderFilters {
  userId: string;
  applicationId?: string;
  type?: 'interview' | 'deadline' | 'follow-up' | 'custom';
  isCompleted?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export class ReminderRepository {
  async create(reminderData: Partial<IReminder>): Promise<IReminder> {
    const reminder = new Reminder(reminderData);
    return reminder.save();
  }

  async findById(id: string, userId: string): Promise<IReminder | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Reminder.findOne({ _id: id, userId }).populate('applicationId');
  }

  async findByIdOrFail(id: string, userId: string): Promise<IReminder> {
    const reminder = await this.findById(id, userId);
    if (!reminder) {
      throw new NotFoundError('Reminder not found');
    }
    return reminder;
  }

  async findAll(
    filters: ReminderFilters,
    pagination: PaginationResult
  ): Promise<{ reminders: IReminder[]; total: number }> {
    const query: any = { userId: filters.userId };

    if (filters.applicationId) {
      query.applicationId = filters.applicationId;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.isCompleted !== undefined) {
      query.isCompleted = filters.isCompleted;
    }

    if (filters.fromDate || filters.toDate) {
      query.reminderDate = {};
      if (filters.fromDate) {
        query.reminderDate.$gte = filters.fromDate;
      }
      if (filters.toDate) {
        query.reminderDate.$lte = filters.toDate;
      }
    }

    const [reminders, total] = await Promise.all([
      Reminder.find(query)
        .populate('applicationId')
        .sort(pagination.sort)
        .skip(pagination.skip)
        .limit(pagination.limit),
      Reminder.countDocuments(query),
    ]);

    return { reminders, total };
  }

  async updateById(
    id: string,
    userId: string,
    updates: Partial<IReminder>
  ): Promise<IReminder> {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('applicationId');

    if (!reminder) {
      throw new NotFoundError('Reminder not found');
    }

    return reminder;
  }

  async deleteById(id: string, userId: string): Promise<void> {
    const result = await Reminder.findOneAndDelete({ _id: id, userId });
    if (!result) {
      throw new NotFoundError('Reminder not found');
    }
  }

  async markAsCompleted(id: string, userId: string): Promise<IReminder> {
    return this.updateById(id, userId, {
      isCompleted: true,
      completedAt: new Date(),
    });
  }

  async markAsIncomplete(id: string, userId: string): Promise<IReminder> {
    return this.updateById(id, userId, {
      isCompleted: false,
      completedAt: undefined,
    });
  }

  async getUpcoming(userId: string, limit: number = 10): Promise<IReminder[]> {
    return Reminder.find({
      userId,
      isCompleted: false,
      reminderDate: { $gte: new Date() },
    })
      .populate('applicationId')
      .sort({ reminderDate: 1 })
      .limit(limit);
  }

  async getOverdue(userId: string, limit: number = 10): Promise<IReminder[]> {
    return Reminder.find({
      userId,
      isCompleted: false,
      reminderDate: { $lt: new Date() },
    })
      .populate('applicationId')
      .sort({ reminderDate: -1 })
      .limit(limit);
  }

  async deleteByApplicationId(applicationId: string, userId: string): Promise<void> {
    await Reminder.deleteMany({ applicationId, userId });
  }
}
