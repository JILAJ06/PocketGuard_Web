"use client";

import React, { useMemo } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReportsDashboardData } from '@/services/adminService';

const PREVIEW_DATA: ReportsDashboardData = {
  projectedSpendVsUsers: {
    totalPilotUsers: 128,
    totalMonthlyCost: 189450.8,
    averageSpendPerUser: 1480.08
  },
  lazinessTaxReduction: {
    totalHistoricalMonthlyCost: 251030.95,
    monthlySavedMoney: 67320.44,
    spendReductionPercentage: 26.82
  },
  potentialSavingsUsers: [
    { fullName: 'Ana Torres', totalAmount: 5420.5, groupAverage: 3180.25 },
    { fullName: 'Miguel Ramirez', totalAmount: 4890.0, groupAverage: 3180.25 },
    { fullName: 'Laura Hernandez', totalAmount: 4512.35, groupAverage: 3180.25 },
    { fullName: 'Carlos Mendez', totalAmount: 4220.99, groupAverage: 3180.25 }
  ],
  imminentRiskByCategory: [
    { categoryName: 'Streaming', paymentUrgency: 'CRITICA', subscriptionCount: 39, totalMoneyAtRisk: 21440.6 },
    { categoryName: 'Software', paymentUrgency: 'ALTA', subscriptionCount: 21, totalMoneyAtRisk: 18220.0 },
    { categoryName: 'Retail', paymentUrgency: 'CRITICA', subscriptionCount: 15, totalMoneyAtRisk: 11400.5 },
    { categoryName: 'Fitness', paymentUrgency: 'ALTA', subscriptionCount: 18, totalMoneyAtRisk: 9820.4 }
  ],
  spendingConcentrationByCycle: [
    { cycleName: 'Mensual', totalSubscriptions: 86, totalGrossAmount: 104230.1, totalExpensePercentage: 55.02 },
    { cycleName: 'Anual', totalSubscriptions: 17, totalGrossAmount: 46340.5, totalExpensePercentage: 24.46 },
    { cycleName: 'Semanal', totalSubscriptions: 24, totalGrossAmount: 28010.2, totalExpensePercentage: 14.78 },
    { cycleName: 'Diario', totalSubscriptions: 12, totalGrossAmount: 10870.0, totalExpensePercentage: 5.74 }
  ]
};

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function formatCurrencyCompact(value: number | string): string {
  const numericValue = Number(value) || 0;
  return `$${numericValue.toLocaleString('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

export default function ReportesPreviewPage() {
  // In production, do not expose the unauthenticated preview dashboard UI.
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500 text-sm">
          Esta vista de previsualización no está disponible en producción.
        </div>
      </div>
    );
  }
  const data = PREVIEW_DATA;

  const totalAtRisk = useMemo(
    () => data.imminentRiskByCategory.reduce((acc, row) => acc + row.totalMoneyAtRisk, 0),
    [data]
  );
  const highAndCriticalSubscriptions = useMemo(
    () => data.imminentRiskByCategory.reduce((acc, row) => acc + row.subscriptionCount, 0),
    [data]
  );
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard de Reportes Estratégicos (Preview)</h1>
            <p className="text-sm text-gray-500">Vista de demostración sin login con la estructura nueva de queries</p>
          </div>
          <div className="mt-4 md:mt-0 text-xs md:text-sm text-gray-500">
            Ruta sin autenticación para revisión visual
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<CurrencyDollarIcon className="h-8 w-8 text-green-600" />}
            title="Gasto Mensual Total"
            value={formatCurrency(data.projectedSpendVsUsers.totalMonthlyCost)}
            desc={`${data.projectedSpendVsUsers.totalPilotUsers.toLocaleString('es-MX')} usuarios piloto`}
            borderColor="border-green-500"
          />
          <DashboardCard
            icon={<ChartBarIcon className="h-8 w-8 text-blue-600" />}
            title="Promedio por Usuario"
            value={formatCurrency(data.projectedSpendVsUsers.averageSpendPerUser)}
            desc="Magnitud del gasto hormiga por usuario"
            borderColor="border-blue-500"
          />
          <DashboardCard
            icon={<UserGroupIcon className="h-8 w-8 text-indigo-600" />}
            title="Reducción de Gasto"
            value={`${data.lazinessTaxReduction.spendReductionPercentage.toFixed(2)}%`}
            desc={`Ahorro mensual: ${formatCurrency(data.lazinessTaxReduction.monthlySavedMoney)}`}
            borderColor="border-indigo-500"
          />
          <DashboardCard
            icon={<ExclamationTriangleIcon className="h-8 w-8 text-red-600" />}
            title="Dinero en Riesgo (5 días)"
            value={formatCurrency(totalAtRisk)}
            desc={`${highAndCriticalSubscriptions.toLocaleString('es-MX')} suscripciones ALTA/CRÍTICA`}
            borderColor="border-red-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Concentración del gasto por ciclo</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={260}>
                <BarChart data={data.spendingConcentrationByCycle}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="cycleName" />
                  <YAxis tickFormatter={formatCurrencyCompact} />
                  <RechartsTooltip
                    formatter={(value: number | string | undefined) => value !== undefined ? formatCurrency(Number(value)) : '$0.00'}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 700 }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                  <Bar dataKey="totalGrossAmount" name="Monto bruto mensualizado" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Riesgo inminente por categoría</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={260}>
                <BarChart data={data.imminentRiskByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="categoryName" />
                  <YAxis tickFormatter={formatCurrencyCompact} />
                  <RechartsTooltip
                    formatter={(value: number | string | undefined) => value !== undefined ? formatCurrency(Number(value)) : '$0.00'}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 700 }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                  <Bar dataKey="totalMoneyAtRisk" name="Dinero en riesgo" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Usuarios por encima del promedio de gasto</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Gasto total</th>
                  <th className="px-6 py-4">Promedio global</th>
                  <th className="px-6 py-4">Diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {data.potentialSavingsUsers.map((user) => (
                  <tr
                    key={`${user.fullName}-${user.totalAmount}-${user.groupAverage}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{user.fullName}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(user.totalAmount)}</td>
                    <td className="px-6 py-4 text-gray-700">{formatCurrency(user.groupAverage)}</td>
                    <td className="px-6 py-4 text-red-600 font-semibold">{formatCurrency(user.totalAmount - user.groupAverage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Alertas de urgencia de pago</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Urgencia</th>
                    <th className="px-6 py-4">Suscripciones</th>
                    <th className="px-6 py-4">Dinero en riesgo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {data.imminentRiskByCategory.map((risk, idx: number) => (
                    <tr key={`${risk.categoryName}-${risk.paymentUrgency}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{risk.categoryName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          risk.paymentUrgency.toUpperCase().includes('CR')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>{risk.paymentUrgency}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{risk.subscriptionCount.toLocaleString('es-MX')}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(risk.totalMoneyAtRisk)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Distribución del gasto por ciclo</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Ciclo</th>
                    <th className="px-6 py-4">Suscripciones</th>
                    <th className="px-6 py-4">Monto bruto</th>
                    <th className="px-6 py-4">% del gasto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {data.spendingConcentrationByCycle.map((cycle, idx: number) => (
                    <tr key={`${cycle.cycleName}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{cycle.cycleName}</td>
                      <td className="px-6 py-4 text-gray-700">{cycle.totalSubscriptions.toLocaleString('es-MX')}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(cycle.totalGrossAmount)}</td>
                      <td className="px-6 py-4 text-blue-700 font-semibold">{cycle.totalExpensePercentage.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value, desc, borderColor }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  desc: string;
  borderColor: string;
}) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${borderColor} flex items-start space-x-4 min-w-0 overflow-hidden`}>
      <div className="p-3 bg-gray-50 rounded-lg shrink-0">{icon}</div>
      <div className="min-w-0 w-full">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide truncate">{title}</h3>
        <p className="text-2xl xl:text-[2rem] font-bold text-gray-900 mt-1 leading-tight break-words">{value}</p>
        <p className="text-xs text-gray-400 mt-1 break-words">{desc}</p>
      </div>
    </div>
  );
}
