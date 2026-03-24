"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminService, ReportsDashboardData } from '@/services/adminService';
import {
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const FALLBACK_DATA: ReportsDashboardData = {
  projectedSpendVsUsers: {
    totalPilotUsers: 0,
    totalMonthlyCost: 0,
    averageSpendPerUser: 0
  },
  lazinessTaxReduction: {
    totalHistoricalMonthlyCost: 0,
    monthlySavedMoney: 0,
    spendReductionPercentage: 0
  },
  potentialSavingsUsers: [],
  imminentRiskByCategory: [],
  spendingConcentrationByCycle: []
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

export default function ReportesPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const [data, setData] = useState<ReportsDashboardData>(FALLBACK_DATA);
  const [loadingData, setLoadingData] = useState(true);

  const loadReportData = React.useCallback(async () => {
    setLoadingData(true);
    const dashboardData = await AdminService.getDashboard();
    if (dashboardData) {
      setData(dashboardData);
    } else {
      setData(FALLBACK_DATA);
    }
    setLoadingData(false);
  }, []);

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
      const dashboardData = await AdminService.getDashboard();
      if (dashboardData) {
        setData(dashboardData);
      } else {
        setData(FALLBACK_DATA);
      }
      setLoadingData(false);
    };

    loadData();
  }, [isAccessChecked]);

  const totalAtRisk = data.imminentRiskByCategory.reduce((acc, row) => acc + row.totalMoneyAtRisk, 0);
  const highAndCriticalSubscriptions = data.imminentRiskByCategory.reduce((acc, row) => acc + row.subscriptionCount, 0);
  const riskChartData = useMemo(() => {
    const grouped = new Map<string, { categoryName: string; totalMoneyAtRisk: number }>();

    data.imminentRiskByCategory.forEach((item) => {
      const normalizedCategory = item.categoryName?.trim() ? item.categoryName : 'Otros';
      const current = grouped.get(normalizedCategory);
      if (current) {
        current.totalMoneyAtRisk += item.totalMoneyAtRisk;
      } else {
        grouped.set(normalizedCategory, {
          categoryName: normalizedCategory,
          totalMoneyAtRisk: item.totalMoneyAtRisk
        });
      }
    });

    if (!grouped.has('Otros')) {
      grouped.set('Otros', {
        categoryName: 'Otros',
        totalMoneyAtRisk: 0
      });
    }

    return Array.from(grouped.values()).sort((a, b) => b.totalMoneyAtRisk - a.totalMoneyAtRisk);
  }, [data.imminentRiskByCategory]);

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">PocketGuard - Dashboard de Reportes Estratégicos</h1>
            <p className="text-sm text-gray-500">Visualización de hipótesis: gasto hormiga, reducción y riesgo inminente</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hola, <strong>{email}</strong></span>
            <button 
              onClick={() => {
                sessionStorage.removeItem('reportsAuth');
                sessionStorage.removeItem('reportsEmail');
                sessionStorage.removeItem('adminToken');
                router.push('/reports/login');
              }}
              className="flex items-center text-sm text-gray-600 hover:text-red-600 transition"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              Salir
            </button>
          </div>
        </div>

        {loadingData ? (
          <div className="flex justify-center h-64 items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <>
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
                desc=""
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

            <div className="grid grid-cols-1 gap-8 mb-8">
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
                    <BarChart data={riskChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="categoryName" interval={0} tickMargin={8} />
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
                    {data.potentialSavingsUsers.length > 0 ? (
                      data.potentialSavingsUsers.map((user, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-800">{user.fullName}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(user.totalAmount)}</td>
                          <td className="px-6 py-4 text-gray-700">{formatCurrency(user.groupAverage)}</td>
                          <td className="px-6 py-4 text-red-600 font-semibold">{formatCurrency(user.totalAmount - user.groupAverage)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No hay datos disponibles
                        </td>
                      </tr>
                    )}
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
                      {data.imminentRiskByCategory.length > 0 ? (
                        data.imminentRiskByCategory.map((risk, idx) => (
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No hay alertas de riesgo inminente
                          </td>
                        </tr>
                      )}
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
                      {data.spendingConcentrationByCycle.length > 0 ? (
                        data.spendingConcentrationByCycle.map((cycle, idx) => (
                          <tr key={`${cycle.cycleName}-${idx}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-800">{cycle.cycleName}</td>
                            <td className="px-6 py-4 text-gray-700">{cycle.totalSubscriptions.toLocaleString('es-MX')}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(cycle.totalGrossAmount)}</td>
                            <td className="px-6 py-4 text-blue-700 font-semibold">{cycle.totalExpensePercentage.toFixed(2)}%</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            No hay datos por ciclo de facturación
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
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
