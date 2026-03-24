import { StrategicReportsApiResponse, StrategicReportsData } from '../models/Reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ReportService = {
  async getMonthlySummary(): Promise<StrategicReportsData | null> {
    try {
      const response = await fetch(`${API_URL}/api/admin/reports/preview`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store' 
      });

      const result = await response.json() as StrategicReportsApiResponse;
      if (!response.ok || !result.success || !result.data) {
        throw new Error('Error fetching reports');
      }
      
      return result.data;
    } catch (error) {
      console.error("Service Error:", error);
      return null;
    }
  }
};