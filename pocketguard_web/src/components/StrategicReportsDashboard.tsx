"use client";

import React from 'react';
import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts';
import { StrategicExpenseRiskItem, StrategicReportsData } from '@/models/Reports';

interface StrategicReportsDashboardProps {
  title: string;
  subtitle: string;
  helperLabel?: string;
  email?: string;
  onLogout?: () => void;
  data: StrategicReportsData | null;
  loading: boolean;
}

const numberFormatter = new Intl.NumberFormat('es-MX');

function formatCurrency(value: number): string {
  const num = Number(value || 0);
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNumber(value: number): string {
  return numberFormatter.format(Number(value || 0));
}

function getUrgencyClass(urgency: string): string {
  const level = urgency.toUpperCase();
  if (level === 'CRITICA') {
    return 'bg-red-100 text-red-700';
  }
  if (level === 'ALTA') {
    return 'bg-orange-100 text-orange-700';
  }
  if (level === 'MEDIA') {
    return 'bg-yellow-100 text-yellow-700';
  }
  return 'bg-blue-100 text-blue-700';
}

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  borderClass
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  borderClass: string;
}) {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${borderClass} p-5 shadow-sm border border-gray-100`}>
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-gray-50 p-2.5">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, badge }: { title: string; badge: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{badge}</span>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <div className="h-80">{children}</div>
    </div>
  );
}

function ExpensesRiskWeightChart({ riskData }: { riskData: StrategicExpenseRiskItem[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={riskData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="category_name" />
        <YAxis tickFormatter={(value) => `${value}%`} />
        <RechartsTooltip
          formatter={(value: number | string | undefined) => `${Number(value || 0).toFixed(2)}%`}
          contentStyle={{ backgroundColor: '#ffffff', color: '#111827', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          labelStyle={{ color: '#111827', fontWeight: 700 }}
          itemStyle={{ color: '#111827' }}
        />
        <Legend />
        <Bar name="Peso de riesgo" dataKey="risk_weight_percentage" fill="#a855f7" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function StrategicReportsDashboard({
  title,
  subtitle,
  helperLabel,
  email,
  onLogout,
  data,
  loading
}: StrategicReportsDashboardProps) {
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);
  const summaryCards = data?.summary_cards;

  const subscriptionsSummary = data?.source_breakdown?.subscriptions;
  const expensesSummary = data?.source_breakdown?.expenses;

  const subscriptionsCycle = data?.charts_separated?.subscriptions.spending_concentration_by_cycle
    || data?.charts.spending_concentration_by_cycle
    || [];
  const subscriptionsRisk = data?.charts_separated?.subscriptions.imminent_risk_by_category
    || data?.charts.imminent_risk_by_category
    || [];
  const expensesRisk = data?.charts_separated?.expenses.risk_by_category
    || data?.source_breakdown?.expenses.risk_by_category
    || [];

  const usersTable = data?.tables.users_above_average_spend || [];
  const urgencyTable = data?.tables.urgency_alerts || [];
  const generatedAt = data?.generated_at;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">PocketGuard</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
              <p className="text-gray-500 text-base md:text-lg mt-1">{subtitle}</p>

              {(helperLabel || email) ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {helperLabel ? (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {helperLabel}
                    </span>
                  ) : null}
                  {email ? (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      Sesion: {email}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Como leer este reporte
              </button>
              {onLogout ? (
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Salir
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {isGuideOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsGuideOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Guia de lectura de reportes"
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Guia rapida del reporte</h2>
                  <p className="mt-1 text-sm text-gray-500">Aqui puedes ver rapido si la prueba esta logrando ahorro en suscripciones.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(false)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">1. Resumen global</h3>
                  <p className="mt-1">Es la vista general del piloto. Te ayuda a responder rapido: cuanto se gasta hoy, cuanto gasta cada usuario y cuanto dinero aun se puede evitar.</p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">2. Analitica de suscripciones</h3>
                  <p className="mt-1">Esta es la parte mas importante para la hipotesis. Sirve para comprobar si las alertas estan bajando el gasto en suscripciones de verdad.</p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">3. Grafica de proyeccion de gasto en riesgo</h3>
                  <p className="mt-1">Muestra en que categorias esta el monto estimado que podria cobrarse en los proximos 5 dias. Es una proyeccion basada en el patron de gasto de los ultimos 30 dias, no un cobro bancario confirmado.</p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">4. Alertas preventivas priorizadas</h3>
                  <p className="mt-1">Lista de accion inmediata: que categoria esta en riesgo, cuantas suscripciones hay y cuanto dinero se perderia si no se hace nada.</p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">Que significa cada numero (Resumen global)</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li><strong>Gasto mensual total:</strong> cuanto dinero se esta yendo cada mes. Sirve para dimensionar el problema.</li>
                    <li><strong>Promedio por usuario:</strong> cuanto gasta en promedio cada persona. Sirve para comparar grupos o periodos.</li>
                    <li><strong>Proyeccion de gasto en riesgo (5 dias):</strong> estimado de lo que podria cobrarse pronto segun el comportamiento reciente (ultimos 30 dias).</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">Que significa cada numero (Suscripciones)</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li><strong>Gasto mensual:</strong> cuanto se paga al mes en suscripciones activas.</li>
                    <li><strong>Promedio por usuario:</strong> cuanto paga en suscripciones cada usuario en promedio.</li>
                    <li><strong>Reduccion en suscripciones:</strong> cuanto bajo el gasto frente al periodo base. Es el KPI principal de la hipotesis.</li>
                    <li><strong>Proyeccion de gasto en riesgo (5 dias):</strong> monto estimado que podria cobrarse pronto y que puede reducirse si se actua antes de renovar.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900">Como leer la grafica de prioridad de ahorro</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li><strong>Eje X:</strong> categoria de suscripcion (por ejemplo entretenimiento, productividad, etc.).</li>
                    <li><strong>Eje Y:</strong> dinero en monto de ahorro potencial.</li>
                    <li><strong>Barra mas alta:</strong> categoria donde conviene actuar primero para ahorrar mas.</li>
                    <li><strong>Uso practico:</strong> priorizar cancelaciones o cambios empezando por la barra mas alta.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <h3 className="font-semibold text-blue-900">Como se valida la hipotesis</h3>
                  <p className="mt-1 text-blue-800">Mira el valor de Reduccion en suscripciones. Si es 20% o mas, la hipotesis principal se cumple.</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : !data ? (
          <div className="bg-white rounded-xl border border-red-100 shadow-sm p-8 text-center">
            <p className="text-red-600 font-semibold">No se pudieron cargar los reportes estrategicos.</p>
            <p className="text-gray-500 mt-2">Verifica el backend o el token de admin.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <SectionTitle title="Resumen global" badge="TOTAL" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <SummaryCard
                  icon={<BanknotesIcon className="h-7 w-7 text-emerald-600" />}
                  title="Gasto mensual total"
                  value={formatCurrency(summaryCards?.total_monthly_spend || 0)}
                  subtitle={`${formatNumber(summaryCards?.pilot_users || 0)} usuarios piloto`}
                  borderClass="border-emerald-500"
                />
                <SummaryCard
                  icon={<ChartBarIcon className="h-7 w-7 text-blue-600" />}
                  title="Promedio por usuario"
                  value={formatCurrency(summaryCards?.average_spend_per_user || 0)}
                  subtitle="Suscripciones + gastos"
                  borderClass="border-blue-500"
                />
                <SummaryCard
                  icon={<ExclamationTriangleIcon className="h-7 w-7 text-red-600" />}
                  title="Proyeccion de gasto en riesgo (5 dias)"
                  value={formatCurrency(summaryCards?.total_money_at_risk_5d || 0)}
                  subtitle={`${formatNumber(summaryCards?.risky_subscriptions || 0)} items estimados (patron 30 dias)`}
                  borderClass="border-red-500"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <SectionTitle title="Analitica de suscripciones" badge="SUSCRIPCIONES" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <SummaryCard
                  icon={<BanknotesIcon className="h-7 w-7 text-emerald-600" />}
                  title="Gasto mensual"
                  value={formatCurrency(subscriptionsSummary?.total_monthly_spend || 0)}
                  subtitle={`${formatNumber(subscriptionsSummary?.pilot_users || 0)} usuarios piloto`}
                  borderClass="border-emerald-500"
                />
                <SummaryCard
                  icon={<ChartBarIcon className="h-7 w-7 text-blue-600" />}
                  title="Promedio por usuario"
                  value={formatCurrency(subscriptionsSummary?.average_spend_per_user || 0)}
                  subtitle="Promedio en suscripciones"
                  borderClass="border-blue-500"
                />
                <SummaryCard
                  icon={<UserGroupIcon className="h-7 w-7 text-indigo-600" />}
                  title="Reduccion en suscripciones"
                  value={`${Number(subscriptionsSummary?.spend_reduction_percentage || 0).toFixed(2)}%`}
                  subtitle={`Ahorro mensual: ${formatCurrency(subscriptionsSummary?.monthly_saved_money || 0)}`}
                  borderClass="border-indigo-500"
                />
                <SummaryCard
                  icon={<ExclamationTriangleIcon className="h-7 w-7 text-red-600" />}
                  title="Proyeccion de gasto en riesgo (5 dias)"
                  value={formatCurrency(subscriptionsSummary?.total_money_at_risk_5d || 0)}
                  subtitle={`${formatNumber(subscriptionsSummary?.risky_subscriptions || 0)} suscripciones estimadas ALTA/CRITICA`}
                  borderClass="border-red-500"
                />
              </div>

              <div className="space-y-6">
                <ChartCard title="Prioridad por gasto en riesgo (suscripciones)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subscriptionsRisk}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category_name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip
                        formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                        contentStyle={{ backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        labelStyle={{ color: '#f8fafc', fontWeight: 700 }}
                      />
                      <Legend />
                      <Bar name="Monto proyectado en riesgo" dataKey="total_money_at_risk" fill="#ef4444" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>



            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Alertas preventivas priorizadas</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Categoria</th>
                        <th className="px-6 py-4">Urgencia</th>
                        <th className="px-6 py-4">Suscripciones</th>
                        <th className="px-6 py-4">Riesgo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {urgencyTable.length > 0 ? (
                        urgencyTable.map((item, idx) => (
                          <tr key={`${item.category_name}-${idx}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{item.category_name}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyClass(item.urgencia_pago)}`}>
                                {item.urgencia_pago}
                              </span>
                            </td>
                            <td className="px-6 py-4">{formatNumber(item.subscription_count)}</td>
                            <td className="px-6 py-4 font-semibold text-red-600">{formatCurrency(item.total_money_at_risk)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                            Sin alertas por mostrar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {generatedAt ? (
              <p className="text-xs text-gray-500 text-right">
                Generado: {new Date(generatedAt).toLocaleString('es-MX')}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
