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

interface ReminderDetail {
  id: number;
  userId: number;
  type: string;
  message: string;
  scheduledAt: string;
  sentAt?: string;
  status: string;
  userEmail?: string;
}

interface UserStats {
  userId: number;
  email: string;
  totalExpenses: number;
  totalIncome: number;
  savingsRate: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    expenses: number;
    income: number;
  }>;
  activeSubscriptions: number;
  lastActivity: string;
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' 
      });

      if (!response.ok) {
        throw new Error('Error fetching dashboard data');
      }
      
      const result = await response.json();
      const backendData = result?.data ?? result;

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
      console.error("AdminService Error (getDashboard):", error);
      return null;
    }
  },

  async getReminderDetails(page: number = 1, limit: number = 50): Promise<{ reminders: ReminderDetail[], total: number, page: number, totalPages: number } | null> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_URL}/api/admin/reminders?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Error fetching reminder details');
      }
      
      return await response.json();
    } catch (error) {
      console.error("AdminService Error (getReminderDetails):", error);
      return null;
    }
  },

  async getUserStats(userId: number): Promise<UserStats | null> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`${API_URL}/api/admin/users/${userId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Error fetching user stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error("AdminService Error (getUserStats):", error);
      return null;
    }
  }
};
