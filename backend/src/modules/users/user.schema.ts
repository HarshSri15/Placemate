import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    avatar: z.string().url().optional(),
    college: z.string().max(100).optional(),
    graduationYear: z.number().int().min(1900).max(2100).optional(),
  }),
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    emailReminders: z.boolean().optional(),
    reminderDaysBefore: z.number().int().min(0).max(30).optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    defaultView: z.enum(['dashboard', 'pipeline']).optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
