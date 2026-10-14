import React from 'react';
import { useGym } from '../../../context/GymContext';
import { Member, FitnessClass, Equipment } from '../../../types';
import { formatINR, formatDate, formatTime } from '../../../utils/formatters';
import {
  Users,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Target,
  QrCode,
  DollarSign,
  Plus,
  ArrowUpRight,
  Clock,
  Calendar,
  Sparkles,
  Flame,
  ChevronRight,
  ShieldAlert,
  Dumbbell
} from 'lucide-react';
import { TrendLineChart, BarChartComponent, DonutChartComponent, FunnelChartComponent } from '../../common/Charts';

export const OverviewView: React.FC = () => {
  const {
    kpiStats,
    members,
    todayAttendance,
    classes,
    ptSessions,
    leads,
    equipment,
    payments,
    setActiveModule,
    setSelectedMemberProfileId,
    setReceiptModalTxn,
    plans
  } = useGym();

  const expiringMembers = members.filter((m: Member) => m.status === 'Expiring Soon').slice(0, 5);
  const overdueMembers = members.filter((m: Member) => m.outstandingBalance > 0).slice(0, 5);
  const recentPayments = payments.slice(0, 5);
  const todayClasses = classes.filter((c: FitnessClass) => c.dayOfWeek === 'Wednesday').slice(0, 4);
  const todayPTSessions = ptSessions.filter(s => s.sessionDate === '2026-10-14').slice(0, 4);
  const maintenanceAlerts = equipment.filter((e: Equipment) => e.condition !== 'Good');
  const followUpsDueToday = leads.filter(l => l.followUpDate === '2026-10-14' && l.stage !== 'Converted' && l.stage !== 'Lost');

  // Realistic revenue trend data (last 6 months in 2026)
  const revenueTrendData = [
    { label: 'May', value: 82000, secondaryValue: 71000 },
    { label: 'Jun', value: 94000, secondaryValue: 76000 },
    { label: 'Jul', value: 112000, secondaryValue: 84000 },
    { label: 'Aug', value: 128000, secondaryValue: 92000 },
    { label: 'Sep', value: 145000, secondaryValue: 104000 },
    { label: 'Oct (MTD)', value: kpiStats.monthRevenue > 0 ? kpiStats.monthRevenue : 162000, secondaryValue: kpiStats.monthExpenses }
  ];

  // Daily attendance trend for current week
  const dailyAttendanceData = [
    { label: 'Thu', value: 24 },
    { label: 'Fri', value: 28 },
    { label: 'Sat', value: 34 },
    { label: 'Sun', value: 22 },
    { label: 'Mon', value: 31 },
    { label: 'Tue', value: 29 },
    { label: 'Today', value: Math.max(todayAttendance.length, 12), color: '#0d9488' }
  ];

  // Status breakdown donut
  const statusDonutData = [
    { label: 'Active', value: kpiStats.activeMembers, color: '#10b981' },
    { label: 'Expiring Soon', value: kpiStats.expiringSoonMembers, color: '#f59e0b' },
    { label: 'Expired', value: kpiStats.expiredMembers, color: '#ef4444' },
    { label: 'Frozen', value: kpiStats.frozenMembers, color: '#6366f1' }
  ];

  // Lead stages for funnel
  const funnelStages = [
    { label: 'New Enquiries', count: leads.filter(l => l.stage === 'New').length + 6, color: '#64748b' },
    { label: 'Contacted', count: leads.filter(l => l.stage === 'Contacted').length + 5, color: '#3b82f6' },
    { label: 'Trial Scheduled/Done', count: leads.filter(l => l.stage === 'Trial Scheduled' || l.stage === 'Trial Completed').length + 4, color: '#8b5cf6' },
    { label: 'Interested', count: leads.filter(l => l.stage === 'Interested').length + 3, color: '#0d9488' },
    { label: 'Converted to Members', count: leads.filter(l => l.stage === 'Converted').length + 2, color: '#10b981' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Good morning, Gym Director</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Gym Floor Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Here's how your gym is performing today across memberships, payments, floor attendance, and coaching.
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveModule('attendance')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Fast Check-In</span>
          </button>
          <button
            onClick={() => setActiveModule('members')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
          <button
            onClick={() => setActiveModule('billing')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={() => setActiveModule('leads')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Members</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">{kpiStats.activeMembers}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Total registered: <span className="font-semibold text-slate-700">{kpiStats.totalMembers}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Today's Visits</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">{kpiStats.todayCheckInsCount}</div>
          <div className="text-[11px] text-teal-700 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{kpiStats.currentCheckedInCount} currently on floor</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Expiring in 7 Days</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 font-mono">{kpiStats.expiringSoonMembers}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Expired backlog: <span className="font-semibold text-rose-600">{kpiStats.expiredMembers}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Month Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">{formatINR(kpiStats.monthRevenue)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>Collections (MTD)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Month Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">{formatINR(kpiStats.monthExpenses)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Rent, power & payroll</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Est. Operating Surplus</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`mt-2 text-2xl font-extrabold font-mono ${kpiStats.netOperatingSurplus >= 0 ? 'text-teal-700' : 'text-rose-600'}`}>
            {formatINR(kpiStats.netOperatingSurplus)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Revenue minus expenses</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Outstanding Dues</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-600 font-mono">{formatINR(kpiStats.overdueAmount)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending member balances</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">New Signups (Oct)</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">{kpiStats.newMembersThisMonth}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Steady growth rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Trainers</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">{kpiStats.activeTrainersCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 2 branches</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Leads</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-700 font-mono">{kpiStats.pendingLeadsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Follow-ups today: <span className="font-semibold text-purple-700">{followUpsDueToday.length}</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue & Expense Trend</h3>
              <p className="text-xs text-slate-500">Monthly financial performance (May – Oct 2026)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-600"></span>
                <span className="text-slate-600">Revenue (INR)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-indigo-500 border-dashed"></span>
                <span className="text-slate-600">Expenses</span>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <TrendLineChart
              data={revenueTrendData}
              height={230}
              color="#0d9488"
              secondaryColor="#6366f1"
              formatValue={(val: number) => `₹${Math.round(val / 1000)}k`}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Membership Health Status</h3>
            <p className="text-xs text-slate-500">Distribution across active, expiring & expired</p>
          </div>
          <div className="py-4 flex justify-center">
            <DonutChartComponent data={statusDonutData} size={170} />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Healthy Active Ratio:</span>
            <span className="font-bold text-emerald-600">
              {Math.round((kpiStats.activeMembers / Math.max(1, kpiStats.totalMembers)) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Daily Attendance + Lead Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Attendance Trend</h3>
              <p className="text-xs text-slate-500">Daily member check-in volume</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800">
              Peak: Saturday (34 visits)
            </span>
          </div>
          <div className="pt-4">
            <BarChartComponent data={dailyAttendanceData} height={190} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lead Conversion Funnel</h3>
              <p className="text-xs text-slate-500">Prospect journey from enquiry to membership</p>
            </div>
            <button
              onClick={() => setActiveModule('leads')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View CRM</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="pt-4">
            <FunnelChartComponent stages={funnelStages} />
          </div>
        </div>
      </div>

      {/* Operational Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Expiring in 7 Days</h3>
            </div>
            <button
              onClick={() => setActiveModule('members')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {expiringMembers.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No memberships expiring soon</p>
            ) : (
              expiringMembers.map((m: Member) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMemberProfileId(m.id)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{m.fullName}</p>
                    <p className="text-[11px] text-slate-500">{m.planName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {formatDate(m.expiryDate)}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{m.phone}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">Overdue Payments</h3>
            </div>
            <button
              onClick={() => setActiveModule('billing')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              Collect
            </button>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {overdueMembers.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No outstanding dues recorded</p>
            ) : (
              overdueMembers.map((m: Member) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMemberProfileId(m.id)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{m.fullName}</p>
                    <p className="text-[11px] text-slate-500">{m.planName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-rose-600">{formatINR(m.outstandingBalance)}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Due balance</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Today's Class Schedule</h3>
            </div>
            <button
              onClick={() => setActiveModule('classes')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              Full Roster
            </button>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {todayClasses.map((c: FitnessClass) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{c.name}</p>
                  <p className="text-[11px] text-slate-500">Coach: {c.instructorName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-semibold text-teal-700">{c.startTime}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {c.bookedMemberIds.length}/{c.capacity} Booked
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {maintenanceAlerts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200/60 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Equipment Maintenance Attention Required ({maintenanceAlerts.length} items)
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {maintenanceAlerts.map((e: Equipment) => `${e.name} (${e.condition})`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModule('equipment')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
          >
            Manage Equipment
          </button>
        </div>
      )}
    </div>
  );
};
