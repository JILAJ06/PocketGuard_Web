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