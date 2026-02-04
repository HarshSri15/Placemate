import { Application, IApplication } from './application.model';
import { NotFoundError } from '@common/errors/AppError';
import { PaginationResult } from '@common/utils/pagination';
import { ApplicationStage, ApplicationStatus } from '@common/types';
import mongoose from 'mongoose';

export interface ApplicationFilters {
  userId: string;
  stage?: ApplicationStage;
  status?: ApplicationStatus;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}

export class ApplicationRepository {
  async create(applicationData: Partial<IApplication>): Promise<IApplication> {
    const application = new Application(applicationData);
    return application.save();
  }

  async findById(id: string, userId: string): Promise<IApplication | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Application.findOne({ _id: id, userId });
  }

  async findByIdOrFail(id: string, userId: string): Promise<IApplication> {
    const application = await this.findById(id, userId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }
    return application;
  }

  async findAll(
    filters: ApplicationFilters,
    pagination: PaginationResult
  ): Promise<{ applications: IApplication[]; total: number }> {
    const query: any = { userId: filters.userId };

    // Apply filters
    if (filters.stage) {
      query.stage = filters.stage;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$or = [
        { companyName: { $regex: filters.search, $options: 'i' } },
        { role: { $regex: filters.search, $options: 'i' } },
        { location: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.fromDate || filters.toDate) {
      query.appliedDate = {};
      if (filters.fromDate) {
        query.appliedDate.$gte = filters.fromDate;
      }
      if (filters.toDate) {
        query.appliedDate.$lte = filters.toDate;
      }
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort(pagination.sort)
        .skip(pagination.skip)
        .limit(pagination.limit),
      Application.countDocuments(query),
    ]);

    return { applications, total };
  }

  async updateById(
    id: string,
    userId: string,
    updates: Partial<IApplication>
  ): Promise<IApplication> {
    const application = await Application.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    return application;
  }

  async deleteById(id: string, userId: string): Promise<void> {
    const result = await Application.findOneAndDelete({ _id: id, userId });
    if (!result) {
      throw new NotFoundError('Application not found');
    }
  }

  async updateStage(
    id: string,
    userId: string,
    stage: ApplicationStage
  ): Promise<IApplication> {
    const application = await this.findByIdOrFail(id, userId);

    // Update stage
    application.stage = stage;

    // Update status based on stage
    if (stage === 'offer' || stage === 'rejected') {
      application.status = 'completed';
    }

    // Add timeline event
    application.timeline.push({
      stage,
      title: `Moved to ${this.getStageLabel(stage)}`,
      date: new Date(),
      type: 'stage_change',
    });

    return application.save();
  }

  async addTimelineEvent(
    id: string,
    userId: string,
    event: Partial<IApplication['timeline'][0]>
  ): Promise<IApplication> {
    const application = await this.findByIdOrFail(id, userId);

    application.timeline.push({
      stage: event.stage || application.stage,
      title: event.title!,
      description: event.description,
      date: event.date || new Date(),
      type: event.type || 'note',
    });

    return application.save();
  }

  async getCountByStage(userId: string): Promise<Record<ApplicationStage, number>> {
    const result = await Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]);

    const counts: Record<string, number> = {};
    result.forEach((item) => {
      counts[item._id] = item.count;
    });

    return {
      applied: counts.applied || 0,
      oa: counts.oa || 0,
      tech: counts.tech || 0,
      hr: counts.hr || 0,
      offer: counts.offer || 0,
      rejected: counts.rejected || 0,
    };
  }

  async getCountByStatus(userId: string): Promise<Record<ApplicationStatus, number>> {
    const result = await Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const counts: Record<string, number> = {};
    result.forEach((item) => {
      counts[item._id] = item.count;
    });

    return {
      active: counts.active || 0,
      completed: counts.completed || 0,
      archived: counts.archived || 0,
    };
  }

  async getUpcomingInterviews(
    userId: string,
    limit: number = 10
  ): Promise<IApplication[]> {
    return Application.find({
      userId,
      nextInterviewDate: { $gte: new Date() },
    })
      .sort({ nextInterviewDate: 1 })
      .limit(limit);
  }

  private getStageLabel(stage: ApplicationStage): string {
    const labels: Record<ApplicationStage, string> = {
      applied: 'Applied',
      oa: 'Online Assessment',
      tech: 'Technical Round',
      hr: 'HR Round',
      offer: 'Offer',
      rejected: 'Rejected',
    };
    return labels[stage];
  }
}
