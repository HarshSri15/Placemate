import { ApplicationRepository, ApplicationFilters } from './application.repository';
import { IApplication } from './application.model';
import { getPagination, PaginationOptions } from '@common/utils/pagination';
import { BadRequestError } from '@common/errors/AppError';
import { ApplicationStage } from '@common/types';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  AddTimelineEventInput,
} from './application.schema';

export class ApplicationService {
  constructor(private applicationRepository: ApplicationRepository) {}

  async createApplication(
    userId: string,
    data: CreateApplicationInput
  ): Promise<IApplication> {
    // Validate dates
    if (data.deadline && new Date(data.deadline) < new Date()) {
      throw new BadRequestError('Deadline cannot be in the past');
    }

    if (data.nextInterviewDate && new Date(data.nextInterviewDate) < new Date()) {
      throw new BadRequestError('Interview date cannot be in the past');
    }

    const applicationData: Partial<IApplication> = {
      ...data,
      userId: userId as any,
      appliedDate: data.appliedDate ? new Date(data.appliedDate) : new Date(),
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      nextInterviewDate: data.nextInterviewDate
        ? new Date(data.nextInterviewDate)
        : undefined,
    };

    return this.applicationRepository.create(applicationData);
  }

  async getApplicationById(id: string, userId: string): Promise<IApplication> {
    return this.applicationRepository.findByIdOrFail(id, userId);
  }

  async listApplications(
    userId: string,
    filters: {
      stage?: ApplicationStage;
      status?: 'active' | 'completed' | 'archived';
      search?: string;
      fromDate?: string | Date;
      toDate?: string | Date;
    },
    paginationOptions: PaginationOptions
  ): Promise<{
    applications: IApplication[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const pagination = getPagination(paginationOptions);

    const applicationFilters: ApplicationFilters = {
      userId,
      stage: filters.stage,
      status: filters.status,
      search: filters.search,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
    };

    const { applications, total } = await this.applicationRepository.findAll(
      applicationFilters,
      pagination
    );

    return {
      applications,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async updateApplication(
    id: string,
    userId: string,
    updates: UpdateApplicationInput
  ): Promise<IApplication> {
    // Validate dates if provided
    if (updates.deadline && new Date(updates.deadline) < new Date()) {
      throw new BadRequestError('Deadline cannot be in the past');
    }

    if (updates.nextInterviewDate && new Date(updates.nextInterviewDate) < new Date()) {
      throw new BadRequestError('Interview date cannot be in the past');
    }

    // Create update data with proper type handling for dates
    const { appliedDate, deadline, nextInterviewDate, ...otherUpdates } = updates;
    const updateData: Partial<IApplication> = { ...otherUpdates };

    if (appliedDate) {
      updateData.appliedDate = new Date(appliedDate);
    }
    if (deadline) {
      updateData.deadline = new Date(deadline);
    }
    if (nextInterviewDate) {
      updateData.nextInterviewDate = new Date(nextInterviewDate);
    }

    return this.applicationRepository.updateById(id, userId, updateData);
  }

  async deleteApplication(id: string, userId: string): Promise<void> {
    await this.applicationRepository.deleteById(id, userId);
  }

  async updateStage(
    id: string,
    userId: string,
    stage: ApplicationStage
  ): Promise<IApplication> {
    return this.applicationRepository.updateStage(id, userId, stage);
  }

  async addTimelineEvent(
    id: string,
    userId: string,
    event: AddTimelineEventInput
  ): Promise<IApplication> {
    const eventData = {
      ...event,
      date: event.date ? new Date(event.date) : new Date(),
    };

    return this.applicationRepository.addTimelineEvent(id, userId, eventData);
  }

  async getUpcomingInterviews(userId: string, limit: number = 10): Promise<IApplication[]> {
    return this.applicationRepository.getUpcomingInterviews(userId, limit);
  }

  async archiveApplication(id: string, userId: string): Promise<IApplication> {
    return this.applicationRepository.updateById(id, userId, { status: 'archived' });
  }

  async unarchiveApplication(id: string, userId: string): Promise<IApplication> {
    return this.applicationRepository.updateById(id, userId, { status: 'active' });
  }
}
