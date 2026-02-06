import { Application, User, DashboardStats, AnalyticsData, ApplicationStage } from '@/types/application';

const API_BASE = 'http://localhost:5000/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data.data;
  }

  // ============================================
  // AUTH ENDPOINTS
  // ============================================

  async signup(userData: { 
    email: string; 
    password: string; 
    name: string;
    college?: string;
    graduationYear?: number;
  }): Promise<{ user: User; accessToken: string }> {
    const response = await this.request<{ user: User; accessToken: string }>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    localStorage.setItem('accessToken', response.accessToken);
    return response;
  }

  async login(credentials: { 
    email: string; 
    password: string;
  }): Promise<{ user: User; accessToken: string }> {
    const response = await this.request<{ user: User; accessToken: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    localStorage.setItem('accessToken', response.accessToken);
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    localStorage.removeItem('accessToken');
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await this.request<{ accessToken: string }>(
      '/auth/refresh',
      { method: 'POST' }
    );
    localStorage.setItem('accessToken', response.accessToken);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // ============================================
  // APPLICATION ENDPOINTS
  // ============================================

  async getApplications(params?: {
    page?: number;
    limit?: number;
    stage?: ApplicationStage;
    status?: 'active' | 'completed' | 'archived';
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Application[]> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<Application[]>(`/applications${query ? '?' + query : ''}`);
  }

  async getApplication(id: string): Promise<Application> {
    return this.request<Application>(`/applications/${id}`);
  }

  async createApplication(data: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<Application> {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    return this.request<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteApplication(id: string): Promise<void> {
    return this.request<void>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  async updateApplicationStage(id: string, stage: ApplicationStage): Promise<Application> {
    return this.request<Application>(`/applications/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    });
  }

  async addTimelineEvent(id: string, event: {
    title: string;
    description?: string;
    stage?: ApplicationStage;
    type: 'stage_change' | 'interview' | 'note' | 'reminder';
    date?: Date;
  }): Promise<Application> {
    return this.request<Application>(`/applications/${id}/timeline`, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async archiveApplication(id: string): Promise<Application> {
    return this.request<Application>(`/applications/${id}/archive`, {
      method: 'PATCH',
    });
  }

  async unarchiveApplication(id: string): Promise<Application> {
    return this.request<Application>(`/applications/${id}/unarchive`, {
      method: 'PATCH',
    });
  }

  async getUpcomingInterviews(limit?: number): Promise<Application[]> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<Application[]>(`/applications/upcoming-interviews${query}`);
  }

  // ============================================
  // ANALYTICS ENDPOINTS
  // ============================================

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/analytics/dashboard');
  }

  async getFullAnalytics(): Promise<AnalyticsData> {
    return this.request<AnalyticsData>('/analytics/full');
  }

  async getStageDistribution(): Promise<{ stage: ApplicationStage; count: number; percentage: number }[]> {
    return this.request<{ stage: ApplicationStage; count: number; percentage: number }[]>('/analytics/stage-distribution');
  }

  async getApplicationsByMonth(months?: number): Promise<{ month: string; count: number }[]> {
    const query = months ? `?months=${months}` : '';
    return this.request<{ month: string; count: number }[]>(`/analytics/applications-by-month${query}`);
  }

  async getTopCompanies(limit?: number): Promise<{ company: string; count: number }[]> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<{ company: string; count: number }[]>(`/analytics/top-companies${query}`);
  }

  async getConversionRates(): Promise<{ from: ApplicationStage; to: ApplicationStage; rate: number }[]> {
    return this.request<{ from: ApplicationStage; to: ApplicationStage; rate: number }[]>('/analytics/conversion-rates');
  }

  // ============================================
  // REMINDER ENDPOINTS
  // ============================================

  async getReminders(params?: {
    page?: number;
    limit?: number;
    type?: 'interview' | 'deadline' | 'follow-up' | 'custom';
    isCompleted?: boolean;
    applicationId?: string;
  }): Promise<any[]> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/reminders${query ? '?' + query : ''}`);
  }

  async createReminder(data: {
    title: string;
    description?: string;
    reminderDate: Date | string;
    type: 'interview' | 'deadline' | 'follow-up' | 'custom';
    applicationId?: string;
  }): Promise<any> {
    return this.request<any>('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReminder(id: string, updates: any): Promise<any> {
    return this.request<any>(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteReminder(id: string): Promise<void> {
    return this.request<void>(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  async markReminderComplete(id: string): Promise<any> {
    return this.request<any>(`/reminders/${id}/complete`, {
      method: 'PATCH',
    });
  }

  async markReminderIncomplete(id: string): Promise<any> {
    return this.request<any>(`/reminders/${id}/incomplete`, {
      method: 'PATCH',
    });
  }

  async getUpcomingReminders(limit?: number): Promise<any[]> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<any[]>(`/reminders/upcoming${query}`);
  }

  async getOverdueReminders(limit?: number): Promise<any[]> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<any[]>(`/reminders/overdue${query}`);
  }

  // ============================================
  // USER ENDPOINTS
  // ============================================

  async getUserProfile(): Promise<User> {
    return this.request<User>('/users/profile');
  }

  async updateUserProfile(updates: {
    name?: string;
    avatar?: string;
    college?: string;
    graduationYear?: number;
  }): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async updateUserPreferences(preferences: {
    emailReminders?: boolean;
    reminderDaysBefore?: number;
    theme?: 'light' | 'dark' | 'system';
    defaultView?: 'dashboard' | 'pipeline';
  }): Promise<User> {
    return this.request<User>('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    return this.request<void>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(): Promise<void> {
    await this.request<void>('/users/account', {
      method: 'DELETE',
    });
    localStorage.removeItem('accessToken');
  }

  async getUserStats(): Promise<{
    totalApplications: number;
    activeApplications: number;
    completedApplications: number;
    memberSince: Date;
  }> {
    return this.request<{
      totalApplications: number;
      activeApplications: number;
      completedApplications: number;
      memberSince: Date;
    }>('/users/stats');
  }
}

export const api = new ApiClient();
