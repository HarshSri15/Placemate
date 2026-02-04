import { Application, DashboardStats, AnalyticsData } from '@/types/application';
import { mockApplications, mockDashboardStats, mockAnalyticsData } from '@/data/mockData';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApplicationState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  updateStage: (id: string, stage: Application['stage']) => void;
  getDashboardStats: () => DashboardStats;
  getAnalyticsData: () => AnalyticsData;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: mockApplications,
      isLoading: false,
      error: null,

      addApplication: (applicationData) => {
        const newApplication: Application = {
          ...applicationData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          timeline: [
            {
              id: crypto.randomUUID(),
              applicationId: crypto.randomUUID(),
              stage: applicationData.stage,
              title: 'Application Created',
              date: new Date(),
              type: 'stage_change',
            },
          ],
        };
        
        set((state) => ({
          applications: [newApplication, ...state.applications],
        }));
      },

      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, ...updates, updatedAt: new Date() }
              : app
          ),
        }));
      },

      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        }));
      },

      updateStage: (id, stage) => {
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== id) return app;
            
            const newTimelineEvent = {
              id: crypto.randomUUID(),
              applicationId: id,
              stage,
              title: `Moved to ${stage.charAt(0).toUpperCase() + stage.slice(1)}`,
              date: new Date(),
              type: 'stage_change' as const,
            };
            
            return {
              ...app,
              stage,
              status: stage === 'offer' || stage === 'rejected' ? 'completed' : 'active',
              timeline: [...app.timeline, newTimelineEvent],
              updatedAt: new Date(),
            };
          }),
        }));
      },

      getDashboardStats: () => {
        const apps = get().applications;
        const active = apps.filter((a) => a.status === 'active');
        const offers = apps.filter((a) => a.stage === 'offer');
        const rejected = apps.filter((a) => a.stage === 'rejected');
        const withInterviews = apps.filter((a) => a.nextInterviewDate);
        const responded = apps.filter((a) => a.stage !== 'applied');

        return {
          totalApplications: apps.length,
          activeApplications: active.length,
          interviewsScheduled: withInterviews.length,
          offersReceived: offers.length,
          rejections: rejected.length,
          responseRate: apps.length > 0 ? Math.round((responded.length / apps.length) * 100) : 0,
        };
      },

      getAnalyticsData: () => mockAnalyticsData,
    }),
    {
      name: 'placemate-applications',
    }
  )
);
