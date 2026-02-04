import { z } from 'zod';

export const createReminderSchema = z.object({
  body: z.object({
    applicationId: z.string().optional(),
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(1000).optional(),
    reminderDate: z.string().datetime().or(z.date()),
    type: z.enum(['interview', 'deadline', 'follow-up', 'custom']).default('custom'),
  }),
});

export const updateReminderSchema = z.object({
  body: z.object({
    applicationId: z.string().optional(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    reminderDate: z.string().datetime().or(z.date()).optional(),
    type: z.enum(['interview', 'deadline', 'follow-up', 'custom']).optional(),
    isCompleted: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Reminder ID is required'),
  }),
});

export const getReminderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Reminder ID is required'),
  }),
});

export const listRemindersSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
    limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
    applicationId: z.string().optional(),
    type: z.enum(['interview', 'deadline', 'follow-up', 'custom']).optional(),
    isCompleted: z.string().transform((val) => val === 'true').optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    fromDate: z.string().datetime().or(z.date()).optional(),
    toDate: z.string().datetime().or(z.date()).optional(),
  }),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>['body'];
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>['body'];
export type ListRemindersQuery = z.infer<typeof listRemindersSchema>['query'];
