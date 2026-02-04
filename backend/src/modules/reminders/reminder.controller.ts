import { Response, NextFunction } from 'express';
import { ReminderService } from './reminder.service';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { AuthRequest } from '@common/types';

export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  create = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const reminder = await this.reminderService.createReminder(userId, req.body);
      ApiResponse.created(res, reminder, 'Reminder created successfully');
    }
  );

  getById = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const reminder = await this.reminderService.getReminderById(id, userId);
      ApiResponse.success(res, reminder);
    }
  );

  list = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const {
        applicationId,
        type,
        isCompleted,
        fromDate,
        toDate,
        page,
        limit,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await this.reminderService.listReminders(
        userId,
        {
          applicationId: applicationId as string,
          type: type as any,
          isCompleted: isCompleted === 'true' ? true : isCompleted === 'false' ? false : undefined,
          fromDate: fromDate as string,
          toDate: toDate as string,
        },
        {
          page: page ? Number(page) : undefined,
          limit: limit ? Number(limit) : undefined,
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc',
        }
      );

      ApiResponse.paginated(
        res,
        result.reminders,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Reminders retrieved successfully'
      );
    }
  );

  update = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const reminder = await this.reminderService.updateReminder(id, userId, req.body);
      ApiResponse.success(res, reminder, 'Reminder updated successfully');
    }
  );

  delete = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      await this.reminderService.deleteReminder(id, userId);
      ApiResponse.success(res, null, 'Reminder deleted successfully');
    }
  );

  markAsCompleted = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const reminder = await this.reminderService.markAsCompleted(id, userId);
      ApiResponse.success(res, reminder, 'Reminder marked as completed');
    }
  );

  markAsIncomplete = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const reminder = await this.reminderService.markAsIncomplete(id, userId);
      ApiResponse.success(res, reminder, 'Reminder marked as incomplete');
    }
  );

  getUpcoming = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { limit } = req.query;
      const reminders = await this.reminderService.getUpcomingReminders(
        userId,
        limit ? Number(limit) : undefined
      );
      ApiResponse.success(res, reminders, 'Upcoming reminders retrieved successfully');
    }
  );

  getOverdue = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { limit } = req.query;
      const reminders = await this.reminderService.getOverdueReminders(
        userId,
        limit ? Number(limit) : undefined
      );
      ApiResponse.success(res, reminders, 'Overdue reminders retrieved successfully');
    }
  );
}
