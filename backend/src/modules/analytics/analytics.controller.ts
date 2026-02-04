import { Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { AuthRequest } from '@common/types';

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  getDashboardStats = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const stats = await this.analyticsService.getDashboardStats(userId);
      ApiResponse.success(res, stats, 'Dashboard stats retrieved successfully');
    }
  );

  getStageDistribution = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const distribution = await this.analyticsService.getStageDistribution(userId);
      ApiResponse.success(res, distribution, 'Stage distribution retrieved successfully');
    }
  );

  getApplicationsByMonth = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { months } = req.query;
      const data = await this.analyticsService.getApplicationsByMonth(
        userId,
        months ? Number(months) : undefined
      );
      ApiResponse.success(res, data, 'Monthly applications retrieved successfully');
    }
  );

  getTopCompanies = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const { limit } = req.query;
      const companies = await this.analyticsService.getTopCompanies(
        userId,
        limit ? Number(limit) : undefined
      );
      ApiResponse.success(res, companies, 'Top companies retrieved successfully');
    }
  );

  getConversionRates = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const rates = await this.analyticsService.getConversionRates(userId);
      ApiResponse.success(res, rates, 'Conversion rates retrieved successfully');
    }
  );

  getFullAnalytics = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user!.id;
      const analytics = await this.analyticsService.getFullAnalytics(userId);
      ApiResponse.success(res, analytics, 'Analytics data retrieved successfully');
    }
  );
}
