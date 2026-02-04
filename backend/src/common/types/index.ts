import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export type ApplicationStage = 
  | 'applied' 
  | 'oa' 
  | 'tech' 
  | 'hr' 
  | 'offer' 
  | 'rejected';

export type ApplicationStatus = 
  | 'active' 
  | 'completed' 
  | 'archived';

export type JobType = 'full-time' | 'internship' | 'contract';

export type TimelineEventType = 'stage_change' | 'interview' | 'note' | 'reminder';

export type Theme = 'light' | 'dark' | 'system';

export type DefaultView = 'dashboard' | 'pipeline';
