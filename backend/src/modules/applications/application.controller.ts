import { Response, NextFunction } from 'express';
import { ApplicationService } from './application.service';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { AuthRequest } from '@common/types';

export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  create = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const application = await this.applicationService.createApplication(userId, req.body);
      ApiResponse.created(res, application, 'Application created successfully');
    }
  );

  getById = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const application = await this.applicationService.getApplicationById(id, userId);
      ApiResponse.success(res, application);
    }
  );

  list = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { stage, status, search, fromDate, toDate, page, limit, sortBy, sortOrder } =
        req.query;

      const result = await this.applicationService.listApplications(
        userId,
        {
          stage: stage as any,
          status: status as any,
          search: search as string,
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
        result.applications,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Applications retrieved successfully'
      );
    }
  );

  update = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const application = await this.applicationService.updateApplication(
        id,
        userId,
        req.body
      );
      ApiResponse.success(res, application, 'Application updated successfully');
    }
  );

  delete = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      await this.applicationService.deleteApplication(id, userId);
      ApiResponse.success(res, null, 'Application deleted successfully');
    }
  );

  updateStage = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const { stage } = req.body;
      const application = await this.applicationService.updateStage(id, userId, stage);
      ApiResponse.success(res, application, 'Application stage updated successfully');
    }
  );

  addTimelineEvent = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const application = await this.applicationService.addTimelineEvent(
        id,
        userId,
        req.body
      );
      ApiResponse.success(res, application, 'Timeline event added successfully');
    }
  );

  getUpcomingInterviews = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { limit } = req.query;
      const interviews = await this.applicationService.getUpcomingInterviews(
        userId,
        limit ? Number(limit) : undefined
      );
      ApiResponse.success(res, interviews, 'Upcoming interviews retrieved successfully');
    }
  );

  archive = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const application = await this.applicationService.archiveApplication(id, userId);
      ApiResponse.success(res, application, 'Application archived successfully');
    }
  );

  unarchive = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { id } = req.params;
      const application = await this.applicationService.unarchiveApplication(id, userId);
      ApiResponse.success(res, application, 'Application unarchived successfully');
    }
  );
}
