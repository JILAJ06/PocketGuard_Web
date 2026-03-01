'use client';

import React, { useEffect, useState } from 'react';
import { ReportService } from '@/services/reportService';
import { AuthService } from '@/services/authService';
import { MonthlyExpenseReport } from '@/models/Reports';
import { LockClosedIcon } from '@heroicons/react/24/solid';

export default function ReportesPage() {
  // Estado de autenticación local
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Estado de datos
  const [data, setData] = useState<MonthlyExpenseReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para manejar el login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await AuthService.loginDeveloper(passwordInput);
    if (success) {
      setIsAuthorized(true);
      loadReportData(); // Cargar datos solo si se autoriza
    } else {
      setAuthError(true);
    }
  };

  async function loadReportData() {
    setLoading(true);
    const report = await ReportService.getMonthlySummary();
    setData(report);
    setLoading(false);
  }

  // --- VISTA: LOGIN (Si no está autorizado) ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <LockClosedIcon className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Acceso Restringido</h2>
            <p className="text-gray-500 text-sm mt-2">
              Área exclusiva para desarrolladores de PocketGuard. Ingrese clave de acceso.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Clave de Desarrollador
              </label>
              <input
                type="password"
                id="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError(false);
                }}
              />
              {authError && (
                <p className="mt-2 text-sm text-red-600">Clave incorrecta. Intente de nuevo.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition"
            >
              Verificar Credenciales
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VISTA: DASHBOARD (Si está autorizado) ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Panel de Verificación de Hipótesis <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">DEV MODE</span>
          </h1>
          <button 
            onClick={() => setIsAuthorized(false)}
            className="text-sm text-gray-500 hover:text-red-600 underline"
          >
            Cerrar Sesión
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center h-64 items-center text-gray-500">Cargando métricas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard 
              title="Tasa de Ahorro" 
              value={`${data?.savingsRate}%`} 
              desc="vs mes anterior"
              color="text-green-600"
            />
            <DashboardCard 
              title="Gasto Total (Mes)" 
              value={`$${data?.totalSpent}`} 
              desc="Incluyendo gastos hormiga"
              color="text-blue-600"
            />
            <DashboardCard 
              title="Suscripciones Activas" 
              value={`${data?.activeSubscriptions}`} 
              desc="Servicios recurrentes detectados"
              color="text-purple-600"
            />
          </div>
        )}
        
        <div className="mt-8 bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Análisis de Datos Confidenciales</h3>
          <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
            [Gráfica de comparación: Gastos necesarios vs Gastos hormiga]
          </div>
          <p className="mt-4 text-xs text-gray-400 text-center">
            CONFIDENCIAL: Estos datos son exclusivamente para la validación de hipótesis del equipo de desarrollo.
          </p>
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