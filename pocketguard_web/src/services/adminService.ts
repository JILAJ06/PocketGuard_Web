import { StrategicReportsApiResponse, StrategicReportsData } from '@/models/Reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProjectedSpendVsUsers {
  totalPilotUsers: number;
  totalMonthlyCost: number;
  averageSpendPerUser: number;
}

interface LazinessTaxReduction {
  totalHistoricalMonthlyCost: number;
  monthlySavedMoney: number;
  spendReductionPercentage: number;
}

interface PotentialSavingsUser {
  fullName: string;
  totalAmount: number;
  groupAverage: number;
}

interface ImminentRiskByCategory {
  categoryName: string;
  paymentUrgency: string;
  subscriptionCount: number;
  totalMoneyAtRisk: number;
}

interface SpendingConcentrationByCycle {
  cycleName: string;
  totalSubscriptions: number;
  totalGrossAmount: number;
  totalExpensePercentage: number;
}

export interface ReportsDashboardData {
  projectedSpendVsUsers: ProjectedSpendVsUsers;
  lazinessTaxReduction: LazinessTaxReduction;
  potentialSavingsUsers: PotentialSavingsUser[];
  imminentRiskByCategory: ImminentRiskByCategory[];
  spendingConcentrationByCycle: SpendingConcentrationByCycle[];
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

  async getDashboard(): Promise<ReportsDashboardData | null> {
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

      if (!response.ok) {
        throw new Error('Error fetching dashboard data');
      }
      
      const result = await response.json();

      // Validate backend payload shape to avoid treating error envelopes as data
      if (result && typeof result === 'object') {
        // If the backend uses a { success, message, data } envelope and indicates failure
        if ('success' in result && (result as any).success !== true) {
          const message =
            typeof (result as any).message === 'string'
              ? (result as any).message
              : 'Dashboard API returned an unsuccessful response';
          throw new Error(message);
        }
      }

      const backendData =
        result && typeof result === 'object' && 'data' in (result as any)
          ? (() => {
              const data = (result as any).data;
              if (data === null || data === undefined) {
                throw new Error('Dashboard API returned no data');
              }
              return data;
            })()
          : result;
      const asNumber = (value: unknown): number => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
      };

      const asArray = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];

      const candidateObject = (...keys: string[]) => {
        for (const key of keys) {
          const value = backendData?.[key];
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            return value;
          }
        }
        return null;
      };

      const candidateArray = <T>(...keys: string[]): T[] => {
        for (const key of keys) {
          const value = backendData?.[key];
          if (Array.isArray(value)) {
            return value as T[];
          }
        }
        return [];
      };

      const query1 = candidateObject('query1', 'q1', 'projectedSpendVsUsers', 'pilotGeneralStats', 'generalStats') ?? {};
      const query2 = candidateObject('query2', 'q2', 'lazinessTaxReduction', 'spendReduction', 'normalizedSpending') ?? {};
      const query3 = candidateArray<Record<string, unknown>>('query3', 'q3', 'potentialSavingsUsers', 'highSpenders');
      const query4 = candidateArray<Record<string, unknown>>('query4', 'q4', 'imminentRiskByCategory', 'riskByUrgency');
      const query5 = candidateArray<Record<string, unknown>>('query5', 'q5', 'spendingConcentrationByCycle', 'subscriptionMetricsByCycle');

      const projectedSpendVsUsers: ProjectedSpendVsUsers = {
        totalPilotUsers: asNumber(query1.total_pilot_users ?? query1.totalPilotUsers ?? query1.total_users),
        totalMonthlyCost: asNumber(query1.total_monthly_cost ?? query1.totalMonthlyCost ?? query1.total_monthly_spend),
        averageSpendPerUser: asNumber(query1.average_spend_per_user ?? query1.averageSpendPerUser ?? query1.avg_subscription_cost)
      };

      const lazinessTaxReduction: LazinessTaxReduction = {
        totalHistoricalMonthlyCost: asNumber(query2.total_gasto_historico_mensualizado ?? query2.totalHistoricalMonthlyCost),
        monthlySavedMoney: asNumber(query2.dinero_mensual_ahorrado ?? query2.monthlySavedMoney),
        spendReductionPercentage: asNumber(query2.porcentaje_reduccion_gasto ?? query2.spendReductionPercentage)
      };

      const potentialSavingsUsers: PotentialSavingsUser[] = asArray<Record<string, unknown>>(query3).map((item) => ({
        fullName: String(item.full_name ?? item.fullName ?? 'Usuario sin nombre'),
        totalAmount: asNumber(item.monto_total ?? item.total_amount ?? item.totalAmount),
        groupAverage: asNumber(item.promedio_grupal ?? item.group_average ?? item.groupAverage)
      }));

      const imminentRiskByCategory: ImminentRiskByCategory[] = asArray<Record<string, unknown>>(query4).map((item) => ({
        categoryName: String(item.category_name ?? item.categoryName ?? 'Sin categoría'),
        paymentUrgency: String(item.urgencia_pago ?? item.payment_urgency ?? item.paymentUrgency ?? 'ALTA'),
        subscriptionCount: asNumber(item.cantidad_suscripciones ?? item.subscription_count ?? item.subscriptionCount),
        totalMoneyAtRisk: asNumber(item.total_dinero_en_riesgo ?? item.total_money_at_risk ?? item.totalMoneyAtRisk)
      }));

      const spendingConcentrationByCycle: SpendingConcentrationByCycle[] = asArray<Record<string, unknown>>(query5).map((item) => ({
        cycleName: String(item.cycle_name ?? item.cycleName ?? 'Sin ciclo'),
        totalSubscriptions: asNumber(item.total_subscriptions ?? item.totalSubscriptions),
        totalGrossAmount: asNumber(item.total_gross_amount ?? item.totalGrossAmount),
        totalExpensePercentage: asNumber(item.porcentaje_del_gasto_total ?? item.total_expense_percentage ?? item.totalExpensePercentage)
      }));

      return {
        projectedSpendVsUsers,
        lazinessTaxReduction,
        potentialSavingsUsers,
        imminentRiskByCategory,
        spendingConcentrationByCycle
      };
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
