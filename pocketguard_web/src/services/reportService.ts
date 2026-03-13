import { MonthlyExpenseReport } from '../models/Reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReportService = {
  async getMonthlySummary(): Promise<MonthlyExpenseReport> {
    try {
      const response = await fetch(`${API_URL}/api/v1/reports/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' 
      });

      if (!response.ok) throw new Error('Error fetching reports');
      
      return await response.json();
    } catch (error) {
      console.error("Service Error:", error);
      return {
        month: '',
        totalSpent: 0,
        savingsRate: 0,
        activeSubscriptions: 0,
        criticalExpenses: [],
        expenseChartData: [],
        retentionData: []
      };
    }
  }
};