import { MonthlyExpenseReport } from '../models/Reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReportService = {
  async getMonthlySummary(): Promise<MonthlyExpenseReport> {
    try {
      const response = await fetch(`${API_URL}/v1/reports/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        cache: 'no-store' 
      });

      if (!response.ok) throw new Error('Error fetching reports');
      
      return await response.json();
    } catch (error) {
      console.error("Service Error:", error);
      // Retorno vacío por defecto para evitar que la UI falle si la API no responde
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