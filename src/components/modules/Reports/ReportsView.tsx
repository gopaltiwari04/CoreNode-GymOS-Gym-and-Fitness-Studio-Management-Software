import React, { useState, useMemo } from 'react';
import { useGym } from '../../../context/GymContext';
import { MembershipPlan, Member, PTSession, Lead } from '../../../types';
import { formatINR, formatDate, exportToCSV } from '../../../utils/formatters';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  Printer,
  TrendingUp,
  Users,
  CreditCard,
  QrCode,
  Flame,
  Target
} from 'lucide-react';
import { TrendLineChart, BarChartComponent, DonutChartComponent } from '../../common/Charts';

export const ReportsView: React.FC = () => {
  const { members, payments, expenses, attendance, ptSessions, leads, kpiStats, plans } = useGym();

  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'year'>('30d');
  const [reportTab, setReportTab] = useState<'financial' | 'members' | 'attendance' | 'coaching'>('financial');

  const financialTrend = [
    { label: 'May', value: 82000, secondaryValue: 71000 },
    { label: 'Jun', value: 94000, secondaryValue: 76000 },
    { label: 'Jul', value: 112000, secondaryValue: 84000 },
    { label: 'Aug', value: 128000, secondaryValue: 92000 },
    { label: 'Sep', value: 145000, secondaryValue: 104000 },
    { label: 'Oct', value: kpiStats.monthRevenue, secondaryValue: kpiStats.monthExpenses }
  ];

  const planDistribution = useMemo(() => {
    return plans.map((p: MembershipPlan, idx: number) => {
      const colors = ['#0d9488', '#3b82f6', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];
      const count = members.filter((m: Member) => m.planId === p.id).length;
      return {
        label: p.name,
        value: count,
        color: colors[idx % colors.length]
      };
    });
  }, [plans, members]);

  const dayWiseAttendance = [
    { label: 'Mon', value: 31 },
    { label: 'Tue', value: 29 },
    { label: 'Wed', value: 33 },
    { label: 'Thu', value: 24 },
    { label: 'Fri', value: 28 },
    { label: 'Sat', value: 36, color: '#0d9488' },
    { label: 'Sun', value: 22 }
  ];

  const handleExportReportCSV = () => {
    if (reportTab === 'financial') {
      const headers = ['Month', 'Revenue (INR)', 'Expenses (INR)', 'Operating Surplus (INR)'];
      const rows = financialTrend.map(f => [
        f.label,
        f.value,
        f.secondaryValue || 0,
        f.value - (f.secondaryValue || 0)
      ]);
      exportToCSV('CoreFit_Financial_Performance_Report', headers, rows);
    } else {
      const headers = ['Plan Name', 'Subscribers', 'Plan Fee', 'Estimated Gross Revenue (INR)'];
      const rows = plans.map((p: MembershipPlan) => {
        const count = members.filter((m: Member) => m.planId === p.id).length;
        return [p.name, count, p.price, count * p.price];
      });
      exportToCSV('CoreFit_Membership_Report', headers, rows);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Business Reports & Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              Q4 2026 Executive Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data-backed metrics on cash flow, member retention, facility utilization, and staff performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value as any)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="30d">Last 30 Days (Oct 2026)</option>
            <option value="90d">Last 90 Days (Q3/Q4)</option>
            <option value="year">Current Financial Year (FY26)</option>
          </select>

          <button
            onClick={handleExportReportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report CSV</span>
          </button>
        </div>
      </div>

      {/* Report Categories Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200/90 text-xs font-semibold">
        {[
          { id: 'financial', label: 'Financial & Cash Flow', icon: CreditCard },
          { id: 'members', label: 'Membership & Retention', icon: Users },
          { id: 'attendance', label: 'Attendance & Peak Hours', icon: QrCode },
          { id: 'coaching', label: 'Trainers & PT Revenue', icon: Flame }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = reportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSelected ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: FINANCIAL */}
      {reportTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gross Collections (MTD)</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{formatINR(kpiStats.monthRevenue)}</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Calculated from verified receipts</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Operating Expenses</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{formatINR(kpiStats.monthExpenses)}</div>
              <p className="text-xs text-slate-500 mt-1">Rent, electricity, staff salaries</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Net Operating Surplus</span>
              <div className="text-2xl font-extrabold text-teal-700 font-mono mt-1">{formatINR(kpiStats.netOperatingSurplus)}</div>
              <p className="text-xs text-teal-600 font-semibold mt-1">Estimated Demo Management Surplus</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Monthly Cash Collection & Expense Evolution</h3>
            <p className="text-xs text-slate-500 mb-4">Values in INR (₹) over the past 6 operating months</p>
            <TrendLineChart
              data={financialTrend}
              height={260}
              color="#0d9488"
              secondaryColor="#6366f1"
              formatValue={(v: number) => `₹${Math.round(v / 1000)}k`}
            />
          </div>
        </div>
      )}

      {/* TAB CONTENT: MEMBERS */}
      {reportTab === 'members' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Subscribers by Membership Tier</h3>
            <p className="text-xs text-slate-500 mb-4">Breakdown across Annual, Quarterly, and Monthly packages</p>
            <div className="flex justify-center py-4">
              <DonutChartComponent data={planDistribution} size={180} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Retention & Churn Metrics</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                <span className="text-slate-600 font-medium">Active Member Retention Rate:</span>
                <span className="font-bold text-emerald-600 font-mono text-sm">88.4%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                <span className="text-slate-600 font-medium">Monthly Churn Rate:</span>
                <span className="font-bold text-rose-600 font-mono text-sm">3.6%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                <span className="text-slate-600 font-medium">Average Membership Lifespan:</span>
                <span className="font-bold text-slate-800 font-mono text-sm">7.4 months</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                <span className="text-slate-600 font-medium">Lead-to-Member Conversion Rate:</span>
                <span className="font-bold text-teal-700 font-mono text-sm">
                  {Math.round((leads.filter((l: Lead) => l.stage === 'Converted').length / Math.max(1, leads.length)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ATTENDANCE */}
      {reportTab === 'attendance' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Average Daily Visit Volume (Day of Week)</h3>
          <p className="text-xs text-slate-500">Helps optimize trainer shift scheduling and housekeeping rounds</p>
          <BarChartComponent data={dayWiseAttendance} height={240} />
        </div>
      )}

      {/* TAB CONTENT: COACHING */}
      {reportTab === 'coaching' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Personal Trainer Session Performance</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Trainer Name</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3">Assigned Members</th>
                  <th className="px-4 py-3">Completed Sessions</th>
                  <th className="px-4 py-3 text-right">Est. PT Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ptSessions.slice(0, 5).map((pt: PTSession, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{pt.trainerName}</td>
                    <td className="px-4 py-3 text-slate-600">Strength & Functional</td>
                    <td className="px-4 py-3 font-mono font-semibold text-teal-700">6 members</td>
                    <td className="px-4 py-3 font-mono">{pt.packageUsedSessions} sessions</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {formatINR(pt.packageUsedSessions * pt.pricePerSession)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
