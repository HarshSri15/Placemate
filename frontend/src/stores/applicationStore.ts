import { Application, DashboardStats, AnalyticsData } from '@/types/application';
import { create } from 'zustand';
import { api } from '@/services/api';

interface ApplicationState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchApplications: () => Promise<void>;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => Promise<void>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  updateStage: (id: string, stage: Application['stage']) => Promise<void>;
  getDashboardStats: () => Promise<DashboardStats>;
  getAnalyticsData: () => Promise<AnalyticsData>;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  isLoading: false,
  error: null,

  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const applications = await api.getApplications();
      set({ applications, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to fetch applications:', error);
    }
  },

  addApplication: async (applicationData) => {
    set({ isLoading: true, error: null });
    try {
      const newApplication = await api.createApplication(applicationData);
      set((state) => ({
        applications: [newApplication, ...state.applications],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to add application:', error);
      throw error;
    }
  },

  updateApplication: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedApplication = await api.updateApplication(id, updates);
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? updatedApplication : app
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to update application:', error);
      throw error;
    }
  },

  deleteApplication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteApplication(id);
      set((state) => ({
        applications: state.applications.filter((app) => app.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to delete application:', error);
      throw error;
    }
  },

  updateStage: async (id, stage) => {
    set({ isLoading: true, error: null });
    try {
      const updatedApplication = await api.updateApplicationStage(id, stage);
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? updatedApplication : app
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to update stage:', error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      return await api.getDashboardStats();
    } catch (error: any) {
      console.error('Failed to get dashboard stats:', error);
      return {
        totalApplications: 0,
        activeApplications: 0,
        interviewsScheduled: 0,
        offersReceived: 0,
        rejections: 0,
        responseRate: 0,
      };
    }
  },

  getAnalyticsData: async () => {
    try {
      return await api.getFullAnalytics();
    } catch (error: any) {
      console.error('Failed to get analytics data:', error);
      return {
        applicationsByMonth: [],
        stageDistribution: [],
        conversionRates: [],
        topCompanies: [],
        avgTimeToResponse: 0,
      };
    }
  },
}));
