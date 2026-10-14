import React, { useState, useMemo } from 'react';
import { useGym } from '../../../context/GymContext';
import { Member, AttendanceRecord } from '../../../types';
import { formatDateTime, formatDate, formatTime, formatINR } from '../../../utils/formatters';
import {
  QrCode,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  LogOut,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Smartphone,
  Cpu,
  X
} from 'lucide-react';
import { BarChartComponent } from '../../common/Charts';

export const AttendanceView: React.FC = () => {
  const {
    filteredMembers,
    todayAttendance,
    activeCheckedInMembers,
    checkInMember,
    checkOutMember,
    setSelectedMemberProfileId,
    settings
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Override modal state
  const [overrideModalMember, setOverrideModalMember] = useState<Member | null>(null);
  const [overrideReason, setOverrideReason] = useState('Authorized complimentary session / renewal in-progress');

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return filteredMembers.filter(
      (m: Member) =>
        m.fullName.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.phone.includes(q)
    ).slice(0, 6);
  }, [filteredMembers, searchQuery]);

  // Hourly peak attendance chart data
  const peakHoursData = [
    { label: '06 AM', value: 8 },
    { label: '07 AM', value: 16, color: '#0d9488' },
    { label: '08 AM', value: 14 },
    { label: '09 AM', value: 7 },
    { label: '11 AM', value: 3 },
    { label: '04 PM', value: 6 },
    { label: '06 PM', value: 19, color: '#0d9488' },
    { label: '07 PM', value: 18, color: '#0d9488' },
    { label: '08 PM', value: 11 }
  ];

  const handlePerformCheckIn = (member: Member) => {
    const res = checkInMember(member.id);
    if (!res.success && res.requiresOverride) {
      setOverrideModalMember(member);
    } else {
      alert(res.message);
      setSearchQuery('');
      setSelectedMember(null);
    }
  };

  const handleExecuteOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideModalMember) return;
    const res = checkInMember(overrideModalMember.id, overrideReason);
    alert(res.message);
    setOverrideModalMember(null);
    setSearchQuery('');
    setSelectedMember(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Front-Desk Rapid Terminal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              Front Desk Access Terminal
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            Rapid Member Check-In & Floor Control
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Search by member name, Member ID (e.g. MEM001), or mobile number for instantaneous check-in.
          </p>

          {/* Big Search Input */}
          <div className="mt-4 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member by Name, ID, or Phone... (e.g. 'Aarav', 'MEM003', '98451')"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Live Search Instant Dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 divide-y divide-slate-100 z-20 relative">
              {searchResults.map((m: Member) => {
                const isCurrentlyCheckedIn = activeCheckedInMembers.some((a: AttendanceRecord) => a.memberId === m.id);
                return (
                  <div
                    key={m.id}
                    className="p-3.5 flex items-center justify-between hover:bg-teal-50/70 transition-colors cursor-pointer"
                    onClick={() => setSelectedMember(m)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold text-sm flex items-center justify-center shrink-0">
                        {m.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span>{m.fullName}</span>
                          <span className="font-mono text-xs text-teal-700 font-semibold">{m.id}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{m.planName}</span>
                          <span>•</span>
                          <span>{m.phone}</span>
                          <span>•</span>
                          <span>Expires: {formatDate(m.expiryDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          m.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'Expiring Soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {m.status}
                      </span>

                      {isCurrentlyCheckedIn ? (
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>On Floor</span>
                        </span>
                      ) : (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePerformCheckIn(m);
                          }}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Check In</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Member Instant Card */}
      {selectedMember && (
        <div className="p-5 bg-white rounded-2xl border-2 border-teal-500 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-scale-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 font-black text-xl flex items-center justify-center shrink-0">
              {selectedMember.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{selectedMember.fullName}</h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                  {selectedMember.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    selectedMember.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedMember.status === 'Expiring Soon'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedMember.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Plan: <span className="font-semibold text-slate-800">{selectedMember.planName}</span> • Expiry:{' '}
                <span className="font-mono font-semibold">{formatDate(selectedMember.expiryDate)}</span> • Balance Due:{' '}
                <span className="font-mono font-bold text-slate-900">{formatINR(selectedMember.outstandingBalance)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMemberProfileId(selectedMember.id)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              View Full Profile
            </button>
            <button
              onClick={() => handlePerformCheckIn(selectedMember)}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Verify & Check In</span>
            </button>
            <button
              onClick={() => setSelectedMember(null)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Attendance Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Today's Total Visits</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{todayAttendance.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">100% recorded check-ins</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Currently On Floor</span>
          <div className="text-2xl font-extrabold text-teal-600 font-mono mt-1">
            {activeCheckedInMembers.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Live floor count</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed Sessions</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            {todayAttendance.filter((a: AttendanceRecord) => a.checkOutTime).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Checked out with duration</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Peak Hour Today</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">06:00 PM</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">19 concurrent visits</div>
        </div>
      </div>

      {/* Peak Hours Chart & Active Checked-In Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gym Floor Peak Hours</h3>
              <p className="text-xs text-slate-500">Hourly visit distribution across workout shifts</p>
            </div>
            <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
              High Traffic: 7-8 AM & 6-8 PM
            </span>
          </div>
          <div className="pt-4">
            <BarChartComponent data={peakHoursData} height={200} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Members Inside Now</h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold font-mono">
                {activeCheckedInMembers.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
              {activeCheckedInMembers.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Floor is currently empty</p>
              ) : (
                activeCheckedInMembers.map((a: AttendanceRecord) => (
                  <div key={a.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{a.memberName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">In at {a.checkInTime.split(' ')[1]}</p>
                    </div>
                    <button
                      onClick={() => checkOutMember(a.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                      title="Record Check-out"
                    >
                      <LogOut className="w-3 h-3 text-slate-500" />
                      <span>Check Out</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Automatic checkout duration calculates upon exit
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Today's Floor Attendance Log</h3>
          <span className="text-xs text-slate-500">Date: 14 Oct 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Check-In Time</th>
                <th className="px-4 py-3">Check-Out Time</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Status at Entry</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayAttendance.map((a: AttendanceRecord) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{a.memberName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {a.memberId}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{a.planName}</td>
                  <td className="px-4 py-3 font-mono font-medium text-slate-800">
                    {a.checkInTime.split(' ')[1]}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">
                    {a.checkOutTime ? a.checkOutTime.split(' ')[1] : <span className="text-emerald-600 font-semibold">— (Inside)</span>}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {a.durationMinutes ? `${a.durationMinutes}m` : 'In Session'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {a.branchId === 'b1' ? 'Indiranagar' : 'Koramangala'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                      {a.statusAtCheckIn}
                    </span>
                    {a.wasOverridden && (
                      <span className="ml-1 text-[10px] font-bold text-amber-700">
                        (Overridden)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!a.checkOutTime ? (
                      <button
                        onClick={() => checkOutMember(a.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold cursor-pointer"
                      >
                        Check Out
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
