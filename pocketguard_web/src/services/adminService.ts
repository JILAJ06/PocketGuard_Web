import { StrategicReportsApiResponse, StrategicReportsData } from '@/models/Reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ReminderDetail {
  notification_id: string;
  subscription_id: string;
  user_id: string;
  service_name: string;
  amount: number;
  billing_cycle: string;
  sent_at: string;
  next_payment_date: string;
  subscription_deleted_at: string | null;
  action_status: string;
  days_since_notification: number;
  days_until_payment: number;
}

interface ReminderDetailsPayload {
  reminders: ReminderDetail[];
  page: number;
  limit: number;
}

export interface UserPilotStats {
  user_id: string;
  total_reminders_received: number;
  reminders_marked_paid: number;
  reminders_deleted: number;
  reminders_ignored: number;
  active_subscriptions: number;
  canceled_subscriptions: number;
  monthly_subscription_cost: number;
  engagement_score: number;
}

interface UserPilotStatsPayload {
  stats: UserPilotStats;
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const responseText = await response.text();
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    return null;
  }
}

export const AdminService = {
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('adminToken');
    }
    return null;
  },

  async getReportsPreview(): Promise<StrategicReportsData | null> {
    try {
      const response = await fetch(`${API_URL}/api/admin/reports/preview`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      const result = await parseJsonSafe<StrategicReportsApiResponse>(response);
      if (!response.ok || !result?.success || !result.data) {
        return null;
      }

      return result.data;
    } catch (error) {
      console.error('AdminService Error (getReportsPreview):', error);
      return null;
    }
  },

  async getDashboard(): Promise<StrategicReportsData | null> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      });

      const result = await parseJsonSafe<StrategicReportsApiResponse>(response);
      if (!response.ok || !result?.success || !result.data) {
        return null;
      }

      return result.data;
    } catch (error) {
      console.error('AdminService Error (getDashboard):', error);
      return null;
    }
  },

  async getReminderDetails(page: number = 1, limit: number = 50): Promise<ReminderDetailsPayload | null> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_URL}/api/admin/reminders?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      });

      const result = await parseJsonSafe<ApiEnvelope<ReminderDetailsPayload>>(response);
      if (!response.ok || !result?.success || !result.data) {
        return null;
      }

      return result.data;
    } catch (error) {
      console.error('AdminService Error (getReminderDetails):', error);
      return null;
    }
  },

  async getUserStats(userId: string): Promise<UserPilotStats | null> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_URL}/api/admin/users/${userId}/stats`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      });

      const result = await parseJsonSafe<ApiEnvelope<UserPilotStatsPayload>>(response);
      if (!response.ok || !result?.success || !result.data?.stats) {
        return null;
      }

      return result.data.stats;
    } catch (error) {
      console.error('AdminService Error (getUserStats):', error);
      return null;
    }
  }
};
