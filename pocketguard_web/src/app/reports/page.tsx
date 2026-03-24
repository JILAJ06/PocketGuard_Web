"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StrategicReportsData } from '@/models/Reports';
import { AdminService } from '@/services/adminService';
import StrategicReportsDashboard from '@/components/StrategicReportsDashboard';

export default function ReportesPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [dashboardData, setDashboardData] = useState<StrategicReportsData | null>(null);

  useEffect(() => {
    const isAuthorized = sessionStorage.getItem('reportsAuth') === 'true';

    if (!isAuthorized) {
      router.replace('/reports/login');
      return;
    }

    queueMicrotask(() => {
      setEmail(sessionStorage.getItem('reportsEmail') || 'admin');
      setIsAccessChecked(true);
    });
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      if (!isAccessChecked) {
        return;
      }

      setLoadingData(true);
      const data = await AdminService.getDashboard();
      setDashboardData(data);
      setLoadingData(false);
    };

    loadData();
  }, [isAccessChecked]);

  if (!isAccessChecked) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center h-64 items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700" />
        </div>
      </div>
    );
  }

  return (
    <StrategicReportsDashboard
      title="Dashboard de Reportes Estrategicos"
      subtitle="Vista protegida para administracion"
      helperLabel="Ruta autenticada"
      email={email}
      onLogout={() => {
        sessionStorage.removeItem('reportsAuth');
        sessionStorage.removeItem('reportsEmail');
        sessionStorage.removeItem('adminToken');
        router.push('/reports/login');
      }}
      loading={loadingData}
      data={dashboardData}
    />
  );
}
