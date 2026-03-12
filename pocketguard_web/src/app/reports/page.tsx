"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminService } from '@/services/adminService';
import { ChartBarIcon, CurrencyDollarIcon, CreditCardIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ReportesPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const [data, setData] = useState<{
    totalUsers: number;
    activeUsers: number;
    totalTransactions: number;
    totalRevenue: number;
    savingsRate: number;
    activeSubscriptions: number;
    expenseChartData: Array<{ name: string; necesarios: number; fugas: number }>;
    retentionData: Array<{ day: string; users: number }>;
    criticalExpenses: Array<{ category: string; amount: number; impact: string; status: string }>;
  } | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const loadReportData = React.useCallback(async () => {
    setLoadingData(true);
    const dashboardData = await AdminService.getDashboard();
    if (dashboardData) {
      setData(dashboardData);
    } else {
      // Mostrar datos de ejemplo si el dashboard falla
      console.log('⚠️ No se pudieron cargar datos del dashboard, usando datos de ejemplo');
      setData({
        totalUsers: 0,
        activeUsers: 0,
        totalTransactions: 0,
        totalRevenue: 0,
        savingsRate: 0,
        activeSubscriptions: 0,
        expenseChartData: [
          { name: 'Ene', necesarios: 800, fugas: 200 },
          { name: 'Feb', necesarios: 900, fugas: 150 }
        ],
        retentionData: [
          { day: 'Lun', users: 120 },
          { day: 'Mar', users: 145 }
        ],
        criticalExpenses: []
      });
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    console.log('🔍 Verificando autenticación...');
    const isAuthorized = sessionStorage.getItem('reportsAuth') === 'true';
    console.log('🔐 Estado de autenticación:', {
      isAuthorized,
      reportsAuth: sessionStorage.getItem('reportsAuth'),
      hasToken: !!sessionStorage.getItem('adminToken')
    });

    if (!isAuthorized) {
      console.log('❌ No autorizado, redirigiendo a login...');
      router.replace('/reports/login');
      return;
    }

    console.log('✅ Autorizado, cargando dashboard...');
    setEmail(sessionStorage.getItem('reportsEmail') || 'Usuario');
    setIsAccessChecked(true);
    loadReportData();
  }, [router, loadReportData]);

  if (!isAccessChecked) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center h-64 items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  // --- VISTA 2: DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard de Métricas</h1>
            <p className="text-sm text-gray-500">Verificación de Hipótesis y KPIs</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardCard 
                icon={<CurrencyDollarIcon className="h-8 w-8 text-green-600" />}
                title="Potencial de Ahorro" 
                value={`${(data?.savingsRate || 0).toFixed(1)}%`} 
                desc={`Optimización detectada en gastos hormiga`}
                borderColor="border-green-500"
              />
              <DashboardCard 
                icon={<ChartBarIcon className="h-8 w-8 text-blue-600" />}
                title="Ingresos Mensuales" 
                value={`$${(data?.totalRevenue || 0).toLocaleString('es-MX')}`} 
                desc={`Basado en ${data?.activeUsers || 0} usuarios activos`}
                borderColor="border-blue-500"
              />
              <DashboardCard 
                icon={<CreditCardIcon className="h-8 w-8 text-purple-600" />}
                title="Suscripciones Totales" 
                value={`${(data?.activeSubscriptions || 0).toLocaleString('es-MX')}`} 
                desc={`En ${data?.totalUsers || 0} usuarios registrados`}
                borderColor="border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Validación de Hipótesis: &quot;Impuesto de la Pereza&quot;</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.expenseChartData || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip 
                        formatter={(value: number | string | undefined) => value !== undefined ? `$${Number(value).toLocaleString('es-MX')}` : '$0'}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="necesarios" name="Gastos Necesarios" fill="#16a34a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="fugas" name="Fugas / Hormiga" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Retención de Usuarios (DAU)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.retentionData || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value: number | string | undefined) => value !== undefined ? `${Number(value)} usuarios` : '0 usuarios'}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="users" name="Usuarios Activos" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">Desglose de Gastos Críticos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Categoría</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4">Impacto</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {data && data.criticalExpenses && data.criticalExpenses.length > 0 ? (
                      data.criticalExpenses.map((expense: { category: string; amount: number; impact: string; status: string }, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-800">{expense.category}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {expense.category.includes('Usuario') || expense.category.includes('Suscripciones') 
                              ? Number(expense.amount).toLocaleString('es-MX')
                              : `$${Number(expense.amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            }
                          </td>
                          <td className={`px-6 py-4 font-medium ${
                            expense.impact === 'Crítico' ? 'text-red-600' : 
                            expense.impact === 'Alto' ? 'text-orange-500' : 
                            expense.impact === 'Medio' ? 'text-yellow-600' : 'text-blue-500'
                          }`}>{expense.impact}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              expense.status === 'Activo' ? 'bg-green-100 text-green-700' : 
                              expense.status === 'Monitoreado' ? 'bg-blue-100 text-blue-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>{expense.status}</span>
                          </td>
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
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${borderColor} flex items-start space-x-4`}>
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{desc}</p>
      </div>
    </div>
  );
}