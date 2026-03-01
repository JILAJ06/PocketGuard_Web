'use client';

import React, { useEffect, useState } from 'react';
import { ReportService } from '@/services/reportService';
import { AuthService } from '@/services/authService';
import { MonthlyExpenseReport } from '@/models/Reports';
// Iconos para el dashboard
import { ChartBarIcon, CurrencyDollarIcon, CreditCardIcon } from '@heroicons/react/24/outline';

export default function ReportesPage() {
  // Estado de sesión
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Estados del formulario de Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Estados de datos del reporte
  const [data, setData] = useState<MonthlyExpenseReport | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Función para manejar el inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    const success = await AuthService.login(username, password);
    
    if (success) {
      setIsAuthorized(true);
      loadReportData(); // Cargar datos inmediatamente al entrar
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

  // --- VISTA 1: INICIO DE SESIÓN (LOGIN) ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              PocketGuard
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Panel de Administración y Reportes
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="username" className="sr-only">Usuario</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Usuario (ej. admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50"
              >
                {isLoggingIn ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- VISTA 2: DASHBOARD DE REPORTES (Solo visible tras login) ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header del Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard de Métricas</h1>
            <p className="text-sm text-gray-500">Verificación de Hipótesis y KPIs</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hola, <strong>{username}</strong></span>
            <button 
              onClick={() => {
                setIsAuthorized(false);
                setUsername('');
                setPassword('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        {loadingData ? (
          <div className="flex justify-center h-64 items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard 
              icon={<CurrencyDollarIcon className="h-8 w-8 text-green-600" />}
              title="Ahorro Promedio" 
              value={`${data?.savingsRate}%`} 
              desc="Incremento vs mes anterior"
              borderColor="border-green-500"
            />
            <DashboardCard 
              icon={<ChartBarIcon className="h-8 w-8 text-blue-600" />}
              title="Gasto Total Detectado" 
              value={`$${data?.totalSpent}`} 
              desc="Suma de gastos hormiga + fijos"
              borderColor="border-blue-500"
            />
            <DashboardCard 
              icon={<CreditCardIcon className="h-8 w-8 text-purple-600" />}
              title="Suscripciones Activas" 
              value={`${data?.activeSubscriptions}`} 
              desc="Servicios recurrentes monitoreados"
              borderColor="border-purple-500"
            />
          </div>
        )}
        
        {/* Sección de Análisis Profundo */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Validación de Hipótesis: "Impuesto de la Pereza"</h3>
            <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
              <span className="mb-2 text-2xl">📊</span>
              <span>Gráfica Comparativa: Gastos Necesarios vs. Fugas</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Esta métrica ayuda a confirmar si la visualización del "Saldo Real" reduce los gastos impulsivos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Retención de Usuarios</h3>
            <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
              <span className="mb-2 text-2xl">📈</span>
              <span>Gráfica de Uso Diario (DAU)</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Seguimiento de la frecuencia de registro de gastos manuales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Tarjeta Reutilizable Mejorado
function DashboardCard({ icon, title, value, desc, borderColor }: any) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${borderColor} flex items-start space-x-4`}>
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{desc}</p>
      </div>
    </div>
  );
}