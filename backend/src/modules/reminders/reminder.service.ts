import { ReminderRepository, ReminderFilters } from './reminder.repository';
import { IReminder } from './reminder.model';
import { getPagination, PaginationOptions } from '@common/utils/pagination';
import { BadRequestError } from '@common/errors/AppError';
import { CreateReminderInput, UpdateReminderInput } from './reminder.schema';

export class ReminderService {
  constructor(private reminderRepository: ReminderRepository) {}

  async createReminder(userId: string, data: CreateReminderInput): Promise<IReminder> {
    const reminderDate = new Date(data.reminderDate);

    // Validate that reminder date is in the future
    if (reminderDate < new Date()) {
      throw new BadRequestError('Reminder date must be in the future');
    }

    const reminderData: Partial<IReminder> = {
      ...data,
      userId: userId as any,
      reminderDate,
      applicationId: data.applicationId as any,
    };

    return this.reminderRepository.create(reminderData);
  }

  async getReminderById(id: string, userId: string): Promise<IReminder> {
    return this.reminderRepository.findByIdOrFail(id, userId);
  }

  async listReminders(
    userId: string,
    filters: {
      applicationId?: string;
      type?: 'interview' | 'deadline' | 'follow-up' | 'custom';
      isCompleted?: boolean;
      fromDate?: string | Date;
      toDate?: string | Date;
    },
    paginationOptions: PaginationOptions
  ): Promise<{
    reminders: IReminder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const pagination = getPagination(paginationOptions);

    const reminderFilters: ReminderFilters = {
      userId,
      applicationId: filters.applicationId,
      type: filters.type,
      isCompleted: filters.isCompleted,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
    };

    const { reminders, total } = await this.reminderRepository.findAll(
      reminderFilters,
      pagination
    );

    return {
      reminders,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async updateReminder(
    id: string,
    userId: string,
    updates: UpdateReminderInput
  ): Promise<IReminder> {
    const updateData: Partial<IReminder> = { ...updates };

    if (updates.reminderDate) {
      const reminderDate = new Date(updates.reminderDate);
      
      // Only validate future date if not marking as completed
      if (!updates.isCompleted && reminderDate < new Date()) {
        throw new BadRequestError('Reminder date must be in the future');
      }
      
      updateData.reminderDate = reminderDate;
    }

    if (updates.applicationId) {
      updateData.applicationId = updates.applicationId as any;
    }

    return this.reminderRepository.updateById(id, userId, updateData);
  }

  async deleteReminder(id: string, userId: string): Promise<void> {
    await this.reminderRepository.deleteById(id, userId);
  }

  async markAsCompleted(id: string, userId: string): Promise<IReminder> {
    return this.reminderRepository.markAsCompleted(id, userId);
  }

  async markAsIncomplete(id: string, userId: string): Promise<IReminder> {
    return this.reminderRepository.markAsIncomplete(id, userId);
  }

  async getUpcomingReminders(userId: string, limit: number = 10): Promise<IReminder[]> {
    return this.reminderRepository.getUpcoming(userId, limit);
  }

  async getOverdueReminders(userId: string, limit: number = 10): Promise<IReminder[]> {
    return this.reminderRepository.getOverdue(userId, limit);
  }

  async deleteRemindersByApplication(
    applicationId: string,
    userId: string
  ): Promise<void> {
    await this.reminderRepository.deleteByApplicationId(applicationId, userId);
  }
}
