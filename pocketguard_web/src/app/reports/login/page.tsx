"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/authService';

export default function ReportsLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    const result = await AuthService.adminLogin(email, password);
    
    console.log('🎯 Resultado del login:', result);

    if (result.success && result.token) {
      console.log('✅ Login exitoso, guardando datos...');
      sessionStorage.setItem('reportsAuth', 'true');
      sessionStorage.setItem('reportsEmail', email);
      sessionStorage.setItem('adminToken', result.token);
      
      console.log('📦 SessionStorage guardado:', {
        reportsAuth: sessionStorage.getItem('reportsAuth'),
        reportsEmail: sessionStorage.getItem('reportsEmail'),
        hasToken: !!sessionStorage.getItem('adminToken')
      });
      
      console.log('🚀 Redirigiendo a /reports...');
      router.push('/reports');
      return;
    }

    // Mostrar el error específico del servidor
    console.log('❌ Login fallido:', result.error);
    setError(result.error || 'Credenciales incorrectas. Intenta de nuevo.');
    setIsLoggingIn(false);
  };

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
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500"
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