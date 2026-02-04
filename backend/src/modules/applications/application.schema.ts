import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  role: z.string().min(1, 'Contact role is required'),
  email: z.string().email().optional(),
  linkedin: z.string().url().optional(),
});

const timelineEventSchema = z.object({
  stage: z.enum(['applied', 'oa', 'tech', 'hr', 'offer', 'rejected']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().datetime().or(z.date()).optional(),
  type: z.enum(['stage_change', 'interview', 'note', 'reminder']),
});

export const createApplicationSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required').max(100),
    companyLogo: z.string().url().optional(),
    role: z.string().min(1, 'Role is required').max(100),
    location: z.string().min(1, 'Location is required'),
    jobType: z.enum(['full-time', 'internship', 'contract']),
    salary: z.string().optional(),
    stage: z.enum(['applied', 'oa', 'tech', 'hr', 'offer', 'rejected']).default('applied'),
    status: z.enum(['active', 'completed', 'archived']).default('active'),
    appliedDate: z.string().datetime().or(z.date()).optional(),
    deadline: z.string().datetime().or(z.date()).optional(),
    nextInterviewDate: z.string().datetime().or(z.date()).optional(),
    source: z.string().min(1, 'Source is required'),
    jobUrl: z.string().url().optional(),
    notes: z.string().max(5000).default(''),
    contacts: z.array(contactSchema).default([]),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    companyName: z.string().min(1).max(100).optional(),
    companyLogo: z.string().url().optional(),
    role: z.string().min(1).max(100).optional(),
    location: z.string().min(1).optional(),
    jobType: z.enum(['full-time', 'internship', 'contract']).optional(),
    salary: z.string().optional(),
    stage: z.enum(['applied', 'oa', 'tech', 'hr', 'offer', 'rejected']).optional(),
    status: z.enum(['active', 'completed', 'archived']).optional(),
    appliedDate: z.string().datetime().or(z.date()).optional(),
    deadline: z.string().datetime().or(z.date()).optional(),
    nextInterviewDate: z.string().datetime().or(z.date()).optional(),
    source: z.string().min(1).optional(),
    jobUrl: z.string().url().optional(),
    notes: z.string().max(5000).optional(),
    contacts: z.array(contactSchema).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Application ID is required'),
  }),
});

export const getApplicationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Application ID is required'),
  }),
});

export const listApplicationsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
    limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
    stage: z.enum(['applied', 'oa', 'tech', 'hr', 'offer', 'rejected']).optional(),
    status: z.enum(['active', 'completed', 'archived']).optional(),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    fromDate: z.string().datetime().or(z.date()).optional(),
    toDate: z.string().datetime().or(z.date()).optional(),
  }),
});

export const updateStageSchema = z.object({
  body: z.object({
    stage: z.enum(['applied', 'oa', 'tech', 'hr', 'offer', 'rejected']),
  }),
  params: z.object({
    id: z.string().min(1, 'Application ID is required'),
  }),
});

export const addTimelineEventSchema = z.object({
  body: timelineEventSchema,
  params: z.object({
    id: z.string().min(1, 'Application ID is required'),
  }),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>['body'];
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>['body'];
export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>['query'];
export type UpdateStageInput = z.infer<typeof updateStageSchema>['body'];
export type AddTimelineEventInput = z.infer<typeof addTimelineEventSchema>['body'];
