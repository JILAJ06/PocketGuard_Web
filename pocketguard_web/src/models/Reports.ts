export interface ExpenseDetail {
  category: string;
  amount: number;
  impact: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  status: 'Auditado' | 'En Revisión' | 'Pendiente';
}

export interface ChartData {
  name: string;
  necesarios: number;
  fugas: number;
}

export interface DauData {
  day: string;
  users: number;
}

export interface MonthlyExpenseReport {
  month: string;
  totalSpent: number;
  savingsRate: number;
  activeSubscriptions: number;
  criticalExpenses: ExpenseDetail[];
  expenseChartData: ChartData[];
  retentionData: DauData[];
}

export interface StrategicSummaryCards {
  total_monthly_spend: number;
  average_spend_per_user: number;
  spend_reduction_percentage: number;
  total_money_at_risk_5d: number;
  pilot_users: number;
  monthly_saved_money: number;
  risky_subscriptions: number;
}

export interface StrategicQ5Item {
  cycle_name: string;
  total_subscriptions: number;
  total_gross_amount: number;
  total_spend_percentage: number;
}

export interface StrategicQ4Item {
  category_name: string;
  urgencia_pago: string;
  subscription_count: number;
  total_money_at_risk: number;
}

export interface StrategicQ3Item {
  user_id: string;
  full_name: string | null;
  total_amount: number;
  global_average: number;
  difference: number;
}

export interface StrategicReportsData {
  summary_cards: StrategicSummaryCards;
  charts: {
    spending_concentration_by_cycle: StrategicQ5Item[];
    imminent_risk_by_category: StrategicQ4Item[];
  };
  tables: {
    users_above_average_spend: StrategicQ3Item[];
    urgency_alerts: StrategicQ4Item[];
    cycle_distribution: StrategicQ5Item[];
  };
  raw: {
    q1: {
      total_pilot_users: number;
      total_monthly_cost: number;
      average_spend_per_user: number;
    };
    q2: {
      total_historic_monthly_spend: number;
      monthly_saved_money: number;
      spend_reduction_percentage: number;
    };
    q3: StrategicQ3Item[];
    q4: StrategicQ4Item[];
    q5: StrategicQ5Item[];
  };
  generated_at: string;
}

export interface StrategicReportsApiResponse {
  success: boolean;
  message: string;
  data: StrategicReportsData;
}