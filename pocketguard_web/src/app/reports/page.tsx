"use client";

import React, { useState } from 'react';
import { ReportService } from '@/services/reportService';
import { AuthService } from '@/services/authService';
import { MonthlyExpenseReport } from '@/models/Reports';
import { ChartBarIcon, CurrencyDollarIcon, CreditCardIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ReportesPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Cambiado a email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [data, setData] = useState<MonthlyExpenseReport | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    const success = await AuthService.login(email, password);
    
    if (success) {
      setIsAuthorized(true);
      loadReportData();
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      setIsLoggingIn(false);
    }
  };

  async function loadReportData() {
    setLoadingData(true);
    const report = await ReportService.getMonthlySummary();
    setData(report);
    setLoadingData(false);
  }

  // --- VISTA 1: INICIO DE SESIÓN ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">PocketGuard</h2>
            <p className="mt-2 text-sm text-gray-600">Panel de Administración y Reportes</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50"
            >
              {isLoggingIn ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>
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
                setIsAuthorized(false);
                setEmail('');
                setPassword('');
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