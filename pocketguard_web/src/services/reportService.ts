import { MonthlyExpenseReport } from '../models/Reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Clase de servicio (Patrón SOA en frontend)
export const ReportService = {
  
  async getMonthlySummary(): Promise<MonthlyExpenseReport> {
    try {
      // En un escenario real, aquí irían headers de autorización
      const response = await fetch(`${API_URL}/reports/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` 
        },
        cache: 'no-store' // Para datos en tiempo real
      });

      if (!response.ok) throw new Error('Error fetching reports');
      
      return await response.json();
    } catch (error) {
      console.error("Service Error:", error);
      // Retornar datos mock en caso de fallo para no romper la UI (opcional)
      return {
        month: 'Febrero 2026',
        totalSpent: 0,
        savingsRate: 0,
        activeSubscriptions: 0
      };
    }
  }
};