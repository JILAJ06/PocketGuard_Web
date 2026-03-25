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

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat('es-MX');

function formatCurrency(value: number): string {
  return currencyFormatter.format(Number(value || 0));
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
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
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
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
            <p className="text-gray-500 text-lg mt-1">{subtitle}</p>
          </div>

          <div className="flex items-center gap-4">
            {helperLabel ? <span className="text-sm text-gray-500">{helperLabel}</span> : null}
            {email ? <span className="text-sm text-gray-700">Sesion: <strong>{email}</strong></span> : null}
            {onLogout ? (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Salir
              </button>
            ) : null}
          </div>
        </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
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
                  icon={<UserGroupIcon className="h-7 w-7 text-indigo-600" />}
                  title="Reduccion de gasto"
                  value={`${Number(summaryCards?.spend_reduction_percentage || 0).toFixed(2)}%`}
                  subtitle={`Ahorro mensual: ${formatCurrency(summaryCards?.monthly_saved_money || 0)}`}
                  borderClass="border-indigo-500"
                />
                <SummaryCard
                  icon={<ExclamationTriangleIcon className="h-7 w-7 text-red-600" />}
                  title="Dinero en riesgo (5 dias)"
                  value={formatCurrency(summaryCards?.total_money_at_risk_5d || 0)}
                  subtitle={`${formatNumber(summaryCards?.risky_subscriptions || 0)} items en riesgo`}
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
                  title="Reduccion de gasto"
                  value={`${Number(subscriptionsSummary?.spend_reduction_percentage || 0).toFixed(2)}%`}
                  subtitle={`Ahorro mensual: ${formatCurrency(subscriptionsSummary?.monthly_saved_money || 0)}`}
                  borderClass="border-indigo-500"
                />
                <SummaryCard
                  icon={<ExclamationTriangleIcon className="h-7 w-7 text-red-600" />}
                  title="Dinero en riesgo (5 dias)"
                  value={formatCurrency(subscriptionsSummary?.total_money_at_risk_5d || 0)}
                  subtitle={`${formatNumber(subscriptionsSummary?.risky_subscriptions || 0)} suscripciones ALTA/CRITICA`}
                  borderClass="border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="Concentracion del gasto por ciclo (suscripciones)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subscriptionsCycle}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="cycle_name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip
                        formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar name="Monto bruto mensualizado" dataKey="total_gross_amount" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Riesgo inminente por categoria (suscripciones)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subscriptionsRisk}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category_name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip
                        formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar name="Dinero en riesgo" dataKey="total_money_at_risk" fill="#ef4444" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <SectionTitle title="Analitica de gastos" badge="GASTOS" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <SummaryCard
                  icon={<BanknotesIcon className="h-7 w-7 text-emerald-600" />}
                  title="Gasto mensual"
                  value={formatCurrency(expensesSummary?.total_monthly_spend || 0)}
                  subtitle={`${formatNumber(expensesSummary?.active_users || 0)} usuarios activos`}
                  borderClass="border-emerald-500"
                />
                <SummaryCard
                  icon={<ChartBarIcon className="h-7 w-7 text-blue-600" />}
                  title="Promedio por usuario"
                  value={formatCurrency(expensesSummary?.average_spend_per_user || 0)}
                  subtitle="Promedio en gastos"
                  borderClass="border-blue-500"
                />
                <SummaryCard
                  icon={<UserGroupIcon className="h-7 w-7 text-indigo-600" />}
                  title="Categorias en riesgo"
                  value={formatNumber(expensesRisk.length)}
                  subtitle="Categorias con riesgo en 5 dias"
                  borderClass="border-indigo-500"
                />
                <SummaryCard
                  icon={<ExclamationTriangleIcon className="h-7 w-7 text-red-600" />}
                  title="Dinero en riesgo (5 dias)"
                  value={formatCurrency(expensesSummary?.total_money_at_risk_5d || 0)}
                  subtitle="Riesgo proveniente de gastos"
                  borderClass="border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="Monto mensual por categoria (gastos)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesRisk}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category_name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip
                        formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar name="Monto mensual" dataKey="monthly_total_amount" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Riesgo a 5 dias por categoria (gastos)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesRisk}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category_name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip
                        formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar name="Riesgo a 5 dias" dataKey="risk_amount_5d" fill="#f97316" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Peso de riesgo por categoria (gastos)</h3>
                <div className="h-80">
                  <ExpensesRiskWeightChart riskData={expensesRisk} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900">Q3: Usuarios por encima del promedio de gasto</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Usuario</th>
                      <th className="px-6 py-4">Monto total</th>
                      <th className="px-6 py-4">Promedio global</th>
                      <th className="px-6 py-4">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {usersTable.length > 0 ? (
                      usersTable.map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{user.full_name || 'Sin nombre'}</td>
                          <td className="px-6 py-4">{formatCurrency(user.total_amount)}</td>
                          <td className="px-6 py-4">{formatCurrency(user.global_average)}</td>
                          <td className="px-6 py-4 font-semibold text-blue-700">{formatCurrency(user.difference)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                          No hay usuarios en este corte.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Alertas de urgencia</h3>
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

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Distribucion por ciclo</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Ciclo</th>
                        <th className="px-6 py-4">Suscripciones</th>
                        <th className="px-6 py-4">Monto bruto</th>
                        <th className="px-6 py-4">Participacion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {(data.tables.cycle_distribution || []).length > 0 ? (
                        data.tables.cycle_distribution.map((item, idx) => (
                          <tr key={`${item.cycle_name}-${idx}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{item.cycle_name}</td>
                            <td className="px-6 py-4">{formatNumber(item.total_subscriptions)}</td>
                            <td className="px-6 py-4">{formatCurrency(item.total_gross_amount)}</td>
                            <td className="px-6 py-4 text-blue-700 font-semibold">{item.total_spend_percentage.toFixed(2)}%</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                            Sin datos de distribucion.
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
