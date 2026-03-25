"use client";

import React, { useEffect, useState } from 'react';
import StrategicReportsDashboard from '../../../components/StrategicReportsDashboard';
import { AdminService } from '@/services/adminService';
import { StrategicReportsData } from '@/models/Reports';

export default function ReportsPreviewPage() {
  const [loadingData, setLoadingData] = useState(true);
  const [previewData, setPreviewData] = useState<StrategicReportsData | null>(null);

  useEffect(() => {
    const loadPreviewData = async () => {
      setLoadingData(true);
      const data = await AdminService.getReportsPreview();
      setPreviewData(data);
      setLoadingData(false);
    };

    loadPreviewData();
  }, []);

  return (
    <StrategicReportsDashboard
      title="Dashboard de Reportes Estrategicos (Preview)"
      subtitle="Vista de demostracion sin login con la estructura nueva de queries"
      helperLabel="Ruta sin autenticacion para revision visual"
      loading={loadingData}
      data={previewData}
    />
  );
}
