// PlaceMate Application Types

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

export interface Application {
  id: string;
  companyName: string;
  companyLogo?: string;
  role: string;
  location: string;
  jobType: 'full-time' | 'internship' | 'contract';
  salary?: string;
  stage: ApplicationStage;
  status: ApplicationStatus;
  appliedDate: Date;
  deadline?: Date;
  nextInterviewDate?: Date;
  source: string;
  jobUrl?: string;
  notes: string;
  timeline: TimelineEvent[];
  contacts: Contact[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEvent {
  id: string;
  applicationId: string;
  stage: ApplicationStage;
  title: string;
  description?: string;
  date: Date;
  type: 'stage_change' | 'interview' | 'note' | 'reminder';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email?: string;
  linkedin?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  college?: string;
  graduationYear?: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  emailReminders: boolean;
  reminderDaysBefore: number;
  theme: 'light' | 'dark' | 'system';
  defaultView: 'dashboard' | 'pipeline';
}

export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  rejections: number;
  responseRate: number;
}

export interface AnalyticsData {
  applicationsByMonth: { month: string; count: number }[];
  stageDistribution: { stage: ApplicationStage; count: number }[];
  conversionRates: { from: ApplicationStage; to: ApplicationStage; rate: number }[];
  topCompanies: { company: string; count: number }[];
  avgTimeToResponse: number;
}

export const STAGE_CONFIG: Record<ApplicationStage, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  order: number;
}> = {
  applied: {
    label: 'Applied',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    icon: 'Send',
    order: 1,
  },
  oa: {
    label: 'Online Assessment',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    icon: 'Code',
    order: 2,
  },
  tech: {
    label: 'Technical Round',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    icon: 'Terminal',
    order: 3,
  },
  hr: {
    label: 'HR Round',
    color: 'text-success',
    bgColor: 'bg-success/10',
    icon: 'Users',
    order: 4,
  },
  offer: {
    label: 'Offer',
    color: 'text-success',
    bgColor: 'bg-success/10',
    icon: 'Trophy',
    order: 5,
  },
  rejected: {
    label: 'Rejected',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    icon: 'XCircle',
    order: 6,
  },
};
