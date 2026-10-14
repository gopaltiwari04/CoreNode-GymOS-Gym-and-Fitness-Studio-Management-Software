import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { PTSession, PTSessionStatus, Member, StaffMember } from '../../../types';
import { formatINR, formatDate, formatTime } from '../../../utils/formatters';
import {
  Flame,
  Plus,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';

export const PersonalTrainingView: React.FC = () => {
  const { ptSessions, members, staff, schedulePTSession, updatePTSessionStatus } = useGym();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [formData, setFormData] = useState<{
    memberId: string;
    trainerId: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    packageTotalSessions: number;
    packageUsedSessions: number;
    pricePerSession: number;
    branchId: 'b1' | 'b2';
    notes: string;
  }>({
    memberId: members[0]?.id || 'MEM001',
    trainerId: staff.find((s: StaffMember) => s.role === 'Personal Trainer')?.id || 'st-01',
    sessionDate: '2026-10-15',
    startTime: '08:00 AM',
    endTime: '09:00 AM',
    durationMinutes: 60,
    packageTotalSessions: 12,
    packageUsedSessions: 0,
    pricePerSession: 450,
    branchId: 'b1',
    notes: 'Hypertrophic chest & triceps technique'
  });

  const filteredSessions = ptSessions.filter((s: PTSession) => statusFilter === 'All' || s.status === statusFilter);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m: Member) => m.id === formData.memberId);
    const trn = staff.find((s: StaffMember) => s.id === formData.trainerId);

    const res = schedulePTSession({
      memberId: formData.memberId,
      memberName: mem?.fullName || 'Member',
      trainerId: formData.trainerId,
      trainerName: trn?.fullName || 'Trainer',
      sessionDate: formData.sessionDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      durationMinutes: Number(formData.durationMinutes),
      packageTotalSessions: Number(formData.packageTotalSessions),
      packageUsedSessions: Number(formData.packageUsedSessions),
      pricePerSession: Number(formData.pricePerSession),
      paymentStatus: 'Paid',
      status: 'Scheduled',
      branchId: formData.branchId,
      notes: formData.notes
    });

    alert(res.message);
    if (res.success) {
      setShowScheduleModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Personal Training (1-on-1 Coaching)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {ptSessions.length} total sessions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track private training packages, session completions, remaining balances, and coach calendars.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book PT Session</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200/90 text-xs font-semibold">
        {['All', 'Scheduled', 'Completed', 'Cancelled', 'No-Show'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === st ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Trainer</th>
                <th className="px-4 py-3">Date & Shift</th>
                <th className="px-4 py-3">Package Balance</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <Flame className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No personal training sessions found</p>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((s: PTSession) => {
                  const remaining = Math.max(0, s.packageTotalSessions - s.packageUsedSessions);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{s.memberName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {s.memberId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{s.trainerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{formatINR(s.pricePerSession)}/session</div>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-slate-900">{formatDate(s.sessionDate)}</div>
                        <div className="text-[11px] text-teal-700">{s.startTime} – {s.endTime}</div>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-slate-900">{remaining} remaining</span>
                        <div className="text-[10px] text-slate-400">
                          {s.packageUsedSessions} of {s.packageTotalSessions} completed
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {s.branchId === 'b1' ? 'Indiranagar' : 'Koramangala'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.status === 'Scheduled'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => updatePTSessionStatus(s.id, 'Completed')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] cursor-pointer"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => updatePTSessionStatus(s.id, 'Cancelled')}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-rose-600 font-semibold rounded text-[11px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {s.status === 'Completed' && (
                            <span className="text-[11px] text-emerald-700 font-semibold">Done</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE PT MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleScheduleSubmit}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Book Personal Training Session</h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Member</label>
                <select
                  value={formData.memberId}
                  onChange={e => setFormData({ ...formData, memberId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {members.map((m: Member) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Coach</label>
                <select
                  value={formData.trainerId}
                  onChange={e => setFormData({ ...formData, trainerId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {staff
                    .filter((s: StaffMember) => s.role === 'Personal Trainer' || s.role === 'Group Fitness Instructor')
                    .map((s: StaffMember) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.role})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.sessionDate}
                  onChange={e => setFormData({ ...formData, sessionDate: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                <input
                  type="text"
                  placeholder="08:00 AM"
                  required
                  value={formData.startTime}
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                <input
                  type="text"
                  placeholder="09:00 AM"
                  required
                  value={formData.endTime}
                  onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Package Sessions</label>
                <input
                  type="number"
                  min="1"
                  value={formData.packageTotalSessions}
                  onChange={e => setFormData({ ...formData, packageTotalSessions: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                <select
                  value={formData.branchId}
                  onChange={e => setFormData({ ...formData, branchId: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="b1">Indiranagar (Main)</option>
                  <option value="b2">Koramangala</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Schedule PT Session
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
