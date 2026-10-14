import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { formatINR, formatDate, formatDateTime, getDaysRemaining } from '../../../utils/formatters';
import {
  Award,
  QrCode,
  Dumbbell,
  CalendarDays,
  Flame,
  Receipt,
  User,
  Clock,
  Printer,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Phone
} from 'lucide-react';

export const MemberPortalView: React.FC = () => {
  const {
    currentMemberId,
    members,
    workoutPlans,
    attendance,
    classes,
    ptSessions,
    payments,
    bookClass,
    cancelClassBooking,
    setReceiptModalTxn,
    activeModule
  } = useGym();

  const member = members.find(m => m.id === currentMemberId) || members[0];
  const workout = workoutPlans.find(wp => wp.memberId === member.id);
  const myAttendance = attendance.filter(a => a.memberId === member.id);
  const myPTSessions = ptSessions.filter(pt => pt.memberId === member.id);
  const myPayments = payments.filter(p => p.memberId === member.id);
  const myBookedClasses = classes.filter(c => c.bookedMemberIds.includes(member.id));

  const daysRemaining = getDaysRemaining(member.expiryDate, '2026-10-14');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Member Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border-2 border-teal-400 text-teal-300 font-black text-2xl flex items-center justify-center shadow-inner">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Member Portal
                </span>
                <span className="font-mono text-xs font-semibold text-slate-300">{member.id}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1">
                Welcome back, {member.fullName}
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{member.planName}</span>
                <span>•</span>
                <span>{member.branchId === 'b1' ? 'Indiranagar' : 'Koramangala'}</span>
              </p>
            </div>
          </div>

          {/* Digital QR Access Pass preview */}
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center gap-3 self-stretch md:self-auto">
            <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
              <QrCode className="w-10 h-10 text-slate-900" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Digital Pass Active</span>
              <span className="text-[10px] text-teal-300 font-mono block">Show at turnstile scanner</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Tap to expand pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Status KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Plan Status</span>
          <div className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>{member.status}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Valid to {formatDate(member.expiryDate)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Remaining Days</span>
          <div className="text-lg font-extrabold font-mono text-teal-700 mt-1">
            {daysRemaining} Days
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">No expiry gap</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Check-Ins</span>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-1">
            {myAttendance.length} Visits
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Consistent lifter</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned Coach</span>
          <div className="text-lg font-extrabold text-slate-900 mt-1 truncate">
            {member.assignedTrainerName || 'None'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Senior Strength Coach</div>
        </div>
      </div>

      {/* Main Member View: Workout Plan + Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout routine (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">My Assigned Workout Routine</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                {workout ? workout.fitnessGoal : 'General Routine'}
              </span>
            </div>

            {workout ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                  Coach instructions: "{workout.instructions}"
                </p>

                <div className="space-y-3">
                  {workout.schedule.map((day, dIdx) => (
                    <div key={dIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <div className="px-4 py-2.5 bg-slate-100 text-xs font-bold text-slate-800 flex justify-between">
                        <span>{day.dayName}</span>
                        <span className="text-[11px] font-mono text-slate-500 font-normal">
                          {day.exercises.length} movements
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {day.exercises.map(ex => (
                          <div key={ex.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                            <div>
                              <p className="font-bold text-slate-900">{ex.name}</p>
                              {ex.notes && <p className="text-[11px] text-slate-500 mt-0.5">{ex.notes}</p>}
                            </div>
                            <div className="flex items-center gap-3 font-mono">
                              <span className="font-semibold text-slate-800">{ex.sets} × {ex.reps}</span>
                              {ex.weightKg && <span className="font-bold text-teal-700">{ex.weightKg}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No workout routine assigned yet</p>
            )}
          </div>
        </div>

        {/* Right column: Booked Group Classes & Payment Receipts */}
        <div className="space-y-6">
          {/* Booked Classes */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">My Group Classes</h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">
                {myBookedClasses.length} booked
              </span>
            </div>

            <div className="space-y-2.5">
              {myBookedClasses.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No classes currently reserved</p>
              ) : (
                myBookedClasses.map(c => (
                  <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="text-[10px] font-bold text-teal-700">{c.startTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{c.dayOfWeek} • {c.studioRoom}</p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => cancelClassBooking(c.id, member.id)}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment Receipts */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Payment Receipts</h3>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {myPayments.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No receipts recorded</p>
              ) : (
                myPayments.map(p => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{p.description}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{formatDate(p.date)} • {p.paymentMethod}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{formatINR(p.amountPaid)}</span>
                      <button
                        onClick={() => setReceiptModalTxn(p)}
                        className="p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                        title="View Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
