import { ApplicationRepository } from '@modules/applications/application.repository';
import { Application } from '@modules/applications/application.model';
import { ApplicationStage } from '@common/types';
import mongoose from 'mongoose';

export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  rejections: number;
  responseRate: number;
}

export interface StageDistribution {
  stage: ApplicationStage;
  count: number;
  percentage: number;
}

export interface MonthlyApplications {
  month: string;
  count: number;
}

export interface TopCompany {
  company: string;
  count: number;
}

export interface ConversionRate {
  from: ApplicationStage;
  to: ApplicationStage;
  rate: number;
}

export interface AnalyticsData {
  applicationsByMonth: MonthlyApplications[];
  stageDistribution: StageDistribution[];
  conversionRates: ConversionRate[];
  topCompanies: TopCompany[];
  avgTimeToResponse: number;
}

export class AnalyticsService {
  constructor(private applicationRepository: ApplicationRepository) {}

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const stageCounts = await this.applicationRepository.getCountByStage(userId);
    const statusCounts = await this.applicationRepository.getCountByStatus(userId);

    const totalApplications = Object.values(stageCounts).reduce((sum, count) => sum + count, 0);
    const activeApplications = statusCounts.active;
    const offersReceived = stageCounts.offer;
    const rejections = stageCounts.rejected;

    // Get interviews scheduled
    const upcomingInterviews = await this.applicationRepository.getUpcomingInterviews(userId, 100);
    const interviewsScheduled = upcomingInterviews.length;

    // Calculate response rate (applications that moved beyond 'applied')
    const responded = totalApplications - stageCounts.applied;
    const responseRate = totalApplications > 0 
      ? Math.round((responded / totalApplications) * 100) 
      : 0;

    return {
      totalApplications,
      activeApplications,
      interviewsScheduled,
      offersReceived,
      rejections,
      responseRate,
    };
  }

  async getStageDistribution(userId: string): Promise<StageDistribution[]> {
    const stageCounts = await this.applicationRepository.getCountByStage(userId);
    const total = Object.values(stageCounts).reduce((sum, count) => sum + count, 0);

    const distribution: StageDistribution[] = Object.entries(stageCounts).map(
      ([stage, count]) => ({
        stage: stage as ApplicationStage,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      })
    );

    return distribution;
  }

  async getApplicationsByMonth(userId: string, months: number = 6): Promise<MonthlyApplications[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const result = await Application.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          appliedDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedDate' },
            month: { $month: '$appliedDate' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return result.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count,
    }));
  }

  async getTopCompanies(userId: string, limit: number = 10): Promise<TopCompany[]> {
    const result = await Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$companyName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return result.map((item) => ({
      company: item._id,
      count: item.count,
    }));
  }

  async getConversionRates(userId: string): Promise<ConversionRate[]> {
    // This is a simplified version - in production you'd track stage transitions
    const stageCounts = await this.applicationRepository.getCountByStage(userId);
    
    const stages: ApplicationStage[] = ['applied', 'oa', 'tech', 'hr', 'offer'];
    const conversions: ConversionRate[] = [];

    for (let i = 0; i < stages.length - 1; i++) {
      const from = stages[i];
      const to = stages[i + 1];
      const fromCount = stageCounts[from];
      const toCount = stageCounts[to];

      const rate = fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;

      conversions.push({ from, to, rate });
    }

    return conversions;
  }

  async getAverageTimeToResponse(userId: string): Promise<number> {
    const applications = await Application.find({
      userId,
      stage: { $ne: 'applied' },
    });

    if (applications.length === 0) {
      return 0;
    }

    let totalDays = 0;
    let count = 0;

    applications.forEach((app) => {
      // Find the first stage change after 'applied'
      const firstResponse = app.timeline.find(
        (event) => event.stage !== 'applied' && event.type === 'stage_change'
      );

      if (firstResponse) {
        const daysDiff = Math.floor(
          (firstResponse.date.getTime() - app.appliedDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalDays += daysDiff;
        count++;
      }
    });

    return count > 0 ? Math.round(totalDays / count) : 0;
  }

  async getFullAnalytics(userId: string): Promise<AnalyticsData> {
    const [
      applicationsByMonth,
      stageDistribution,
      conversionRates,
      topCompanies,
      avgTimeToResponse,
    ] = await Promise.all([
      this.getApplicationsByMonth(userId),
      this.getStageDistribution(userId),
      this.getConversionRates(userId),
      this.getTopCompanies(userId),
      this.getAverageTimeToResponse(userId),
    ]);

    return {
      applicationsByMonth,
      stageDistribution,
      conversionRates,
      topCompanies,
      avgTimeToResponse,
    };
  }
}
