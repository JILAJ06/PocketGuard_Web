"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReportService } from '@/services/reportService';
import { MonthlyExpenseReport } from '@/models/Reports';
import { ChartBarIcon, CurrencyDollarIcon, CreditCardIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ReportesPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const [data, setData] = useState<MonthlyExpenseReport | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const isAuthorized = sessionStorage.getItem('reportsAuth') === 'true';

    if (!isAuthorized) {
      router.replace('/reports/login');
      return;
    }

    setEmail(sessionStorage.getItem('reportsEmail') || 'Usuario');
    setIsAccessChecked(true);
    loadReportData();
  }, [router]);

  async function loadReportData() {
    setLoadingData(true);
    const report = await ReportService.getMonthlySummary();
    setData(report);
    setLoadingData(false);
  }

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
            <p className="text-sm text-gray-500">Verificación de Hipótesis y KPIs {data?.month ? `(${data.month})` : ''}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hola, <strong>{email}</strong></span>
            <button 
              onClick={() => {
                sessionStorage.removeItem('reportsAuth');
                sessionStorage.removeItem('reportsEmail');
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
                title="Ahorro Promedio" 
                value={`${data?.savingsRate || 0}%`} 
                desc="Incremento vs mes anterior"
                borderColor="border-green-500"
              />
              <DashboardCard 
                icon={<ChartBarIcon className="h-8 w-8 text-blue-600" />}
                title="Gasto Total Detectado" 
                value={`$${data?.totalSpent || 0}`} 
                desc="Suma de gastos hormiga + fijos"
                borderColor="border-blue-500"
              />
              <DashboardCard 
                icon={<CreditCardIcon className="h-8 w-8 text-purple-600" />}
                title="Suscripciones Activas" 
                value={`${data?.activeSubscriptions || 0}`} 
                desc="Servicios recurrentes monitoreados"
                borderColor="border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Validación de Hipótesis: "Impuesto de la Pereza"</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.expenseChartData || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
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
                      <RechartsTooltip />
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
                      <th className="px-6 py-4">Monto</th>
                      <th className="px-6 py-4">Impacto</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {data?.criticalExpenses?.map((expense, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{expense.category}</td>
                        <td className="px-6 py-4">${expense.amount.toFixed(2)}</td>
                        <td className={`px-6 py-4 font-medium ${
                          expense.impact === 'Crítico' ? 'text-red-500' : 
                          expense.impact === 'Alto' ? 'text-orange-500' : 'text-yellow-500'
                        }`}>{expense.impact}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            expense.status === 'Auditado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{expense.status}</span>
                        </td>
                      </tr>
                    ))}
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

function DashboardCard({ icon, title, value, desc, borderColor }: any) {
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