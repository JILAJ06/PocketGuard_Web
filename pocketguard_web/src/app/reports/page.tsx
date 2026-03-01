'use client'; // Renderizado del lado del cliente para interactividad

import React, { useEffect, useState } from 'react';
import { ReportService } from '@/services/reportService';
import { MonthlyExpenseReport } from '@/models/Reports';

export default function ReportesPage() {
  const [data, setData] = useState<MonthlyExpenseReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificación de Hipótesis: Visualizar datos para validar el ahorro
  useEffect(() => {
    async function loadData() {
      const report = await ReportService.getMonthlySummary();
      setData(report);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Panel de Verificación de Hipótesis
        </h1>

        {loading ? (
          <p>Cargando métricas...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1: Ahorro generado (Validación de impacto financiero) */}
            <DashboardCard 
              title="Tasa de Ahorro" 
              value={`${data?.savingsRate}%`} 
              desc="vs mes anterior"
              color="text-green-600"
            />
            
            {/* Tarjeta 2: Gastos Totales */}
            <DashboardCard 
              title="Gasto Total (Mes)" 
              value={`$${data?.totalSpent}`} 
              desc="Incluyendo gastos hormiga"
              color="text-blue-600"
            />

            {/* Tarjeta 3: Suscripciones Activas */}
            <DashboardCard 
              title="Suscripciones Activas" 
              value={`${data?.activeSubscriptions}`} 
              desc="Servicios recurrentes detectados"
              color="text-purple-600"
            />
          </div>
        )}
        
        {/* Aquí irían gráficas más complejas para verificar la hipótesis */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Análisis de "Impuesto de la Pereza"</h3>
          <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
            [Gráfica de comparación: Gastos necesarios vs Gastos hormiga]
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, desc, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
      <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </div>
  );
}