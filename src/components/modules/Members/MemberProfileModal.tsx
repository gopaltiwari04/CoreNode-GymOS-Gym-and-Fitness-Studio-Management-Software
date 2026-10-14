import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { formatINR, formatDate, formatTime, formatDateTime, getDaysRemaining } from '../../../utils/formatters';
import {
  X,
  User,
  CreditCard,
  QrCode,
  Dumbbell,
  Flame,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  PauseCircle,
  PlayCircle,
  Printer,
  ChevronRight,
  Plus
} from 'lucide-react';
import { PaymentMethod } from '../../../types';

export const MemberProfileModal: React.FC = () => {
  const {
    selectedMemberProfileId,
    setSelectedMemberProfileId,
    members,
    plans,
    payments,
    attendance,
    workoutPlans,
    ptSessions,
    classes,
    renewMembership,
    freezeMembership,
    reactivateMembership,
    suspendMembership,
    setReceiptModalTxn,
    recordPayment,
    checkInMember
  } = useGym();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'membership' | 'payments' | 'attendance' | 'workout' | 'pt' | 'classes' | 'notes'
  >('overview');

  // Submodals for direct member actions
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Renewal form state
  const [renewPlanId, setRenewPlanId] = useState('');
  const [renewDiscount, setRenewDiscount] = useState(0);
  const [renewAmountPaid, setRenewAmountPaid] = useState(0);
  const [renewMethod, setRenewMethod] = useState<PaymentMethod>('UPI');

  // Freeze form state
  const [freezeStart, setFreezeStart] = useState('2026-10-15');
  const [freezeEnd, setFreezeEnd] = useState('2026-10-29');
  const [freezeReason, setFreezeReason] = useState('Travel / Work assignment');

  // Payment form state
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('UPI');

  if (!selectedMemberProfileId) return null;

  const member = members.find(m => m.id === selectedMemberProfileId);
  if (!member) return null;

  const memberPayments = payments.filter(p => p.memberId === member.id);
  const memberAttendance = attendance.filter(a => a.memberId === member.id);
  const memberWorkout = workoutPlans.find(wp => wp.memberId === member.id);
  const memberPTSessions = ptSessions.filter(pt => pt.memberId === member.id);
  const memberBookedClasses = classes.filter(c => c.bookedMemberIds.includes(member.id));

  const daysRemaining = getDaysRemaining(member.expiryDate, '2026-10-14');

  const handleOpenRenew = () => {
    setRenewPlanId(member.planId);
    const selectedPlan = plans.find(p => p.id === member.planId) || plans[0];
    setRenewDiscount(0);
    setRenewAmountPaid(selectedPlan.price);
    setShowRenewModal(true);
  };

  const handleExecuteRenew = (e: React.FormEvent) => {
    e.preventDefault();
    renewMembership(member.id, renewPlanId, renewDiscount, renewAmountPaid, renewMethod);
    setShowRenewModal(false);
  };

  const handleExecuteFreeze = (e: React.FormEvent) => {
    e.preventDefault();
    freezeMembership(member.id, freezeStart, freezeEnd, freezeReason);
    setShowFreezeModal(false);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    const txn = recordPayment({
      memberId: member.id,
      description: `Balance Dues Payment — ${member.planName}`,
      planName: member.planName,
      amountDue: member.outstandingBalance,
      amountPaid: payAmount,
      paymentMethod: payMethod
    });
    setShowPaymentModal(false);
    setReceiptModalTxn(txn);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header Card */}
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-teal-500/20 border-2 border-teal-400 text-teal-300 font-extrabold text-xl flex items-center justify-center shadow-inner">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">{member.fullName}</h2>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                  {member.id}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    member.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : member.status === 'Expiring Soon'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : member.status === 'Frozen'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{member.planName}</span>
                <span>•</span>
                <span>{member.branchId === 'b1' ? 'Main Branch Indiranagar' : 'Branch 2 Koramangala'}</span>
                <span>•</span>
                <span>Registered: {formatDate(member.registrationDate)}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                const res = checkInMember(member.id);
                alert(res.message);
              }}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Check In</span>
            </button>
            <button
              onClick={handleOpenRenew}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-slate-700 flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Renew</span>
            </button>
            <button
              onClick={() => setSelectedMemberProfileId(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8-Tab Navigation Bar */}
        <div className="flex items-center px-4 bg-slate-100 border-b border-slate-200 overflow-x-auto gap-1 text-xs font-semibold text-slate-600 shrink-0">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'membership', label: 'Membership', icon: CreditCard },
            { id: 'payments', label: `Payments (${memberPayments.length})`, icon: CreditCard },
            { id: 'attendance', label: `Attendance (${memberAttendance.length})`, icon: QrCode },
            { id: 'workout', label: 'Workout Plan', icon: Dumbbell },
            { id: 'pt', label: `Personal Training (${memberPTSessions.length})`, icon: Flame },
            { id: 'classes', label: `Bookings (${memberBookedClasses.length})`, icon: Calendar },
            { id: 'notes', label: 'Notes & Activity', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-teal-600 text-teal-800 bg-white font-bold'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contact card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{member.address || 'Address not recorded'}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-slate-500">
                      DOB: {formatDate(member.dob)} • Gender: {member.gender || 'Not specified'}
                    </div>
                  </div>
                </div>

                {/* Membership Snapshot */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Membership Snapshot
                  </h4>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Plan:</span>
                      <span className="font-bold text-slate-900">{member.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Valid Until:</span>
                      <span className="font-mono font-semibold">{formatDate(member.expiryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Days Remaining:</span>
                      <span
                        className={`font-mono font-bold ${
                          daysRemaining < 0
                            ? 'text-rose-600'
                            : daysRemaining <= 7
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {daysRemaining < 0 ? `Expired (${Math.abs(daysRemaining)} days ago)` : `${daysRemaining} days`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Coach:</span>
                      <span className="font-semibold text-slate-800">{member.assignedTrainerName || 'None assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Visited:</span>
                      <span className="font-mono">{member.lastVisit ? formatDateTime(member.lastVisit) : 'Never'}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Billing & Dues
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
                      <span className="text-slate-500">Outstanding Due:</span>
                      <span
                        className={`font-mono font-extrabold text-sm ${
                          member.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {formatINR(member.outstandingBalance)}
                      </span>
                    </div>
                    {member.outstandingBalance > 0 ? (
                      <button
                        onClick={() => {
                          setPayAmount(member.outstandingBalance);
                          setShowPaymentModal(true);
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Collect Balance ({formatINR(member.outstandingBalance)})
                      </button>
                    ) : (
                      <div className="p-2 text-center text-emerald-700 bg-emerald-50 rounded border border-emerald-200 font-medium">
                        ✓ All membership dues clear
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact & Medical Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
                    <span>Emergency Contact</span>
                  </h4>
                  {member.emergencyContact ? (
                    <div className="text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">{member.emergencyContact.name} ({member.emergencyContact.relation})</p>
                      <p className="font-mono">{member.emergencyContact.phone}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No emergency contact provided.</p>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Medical & Exercise Notes</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    {member.medicalNotes || 'No reported injuries or medical restrictions.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERSHIP LIFECYCLE */}
          {activeTab === 'membership' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{member.planName}</h3>
                    <p className="text-xs text-slate-500">
                      Duration: {formatDate(member.startDate)} to {formatDate(member.expiryDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenRenew}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Renew Plan</span>
                    </button>
                    {member.status === 'Frozen' ? (
                      <button
                        onClick={() => reactivateMembership(member.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Reactivate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowFreezeModal(true)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                        <span>Freeze</span>
                      </button>
                    )}
                    {member.status !== 'Suspended' && (
                      <button
                        onClick={() => {
                          const reason = prompt('Enter suspension reason:');
                          if (reason) suspendMembership(member.id, reason);
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg transition-colors cursor-pointer border border-rose-200"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>

                {member.status === 'Frozen' && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900">
                    <p className="font-bold flex items-center gap-1.5">
                      <PauseCircle className="w-4 h-4 text-indigo-600" />
                      <span>Membership currently frozen</span>
                    </p>
                    <p className="text-[11px] mt-0.5">
                      Freeze Period: {formatDate(member.freezeStartDate)} to {formatDate(member.freezeEndDate)}
                    </p>
                    <p className="text-[11px] mt-0.5 italic">Reason: {member.freezeReason}</p>
                    <p className="text-[11px] text-indigo-700 font-medium mt-1">
                      Note: The membership expiry date was automatically extended by the freeze duration.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Start Date</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{formatDate(member.startDate)}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Expiry Date</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{formatDate(member.expiryDate)}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Assigned Branch</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {member.branchId === 'b1' ? 'Indiranagar (Main)' : 'Koramangala'}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Referral Source</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{member.referralSource || 'Walk-In'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-900">Payment & Transaction Ledger</h4>
                <button
                  onClick={() => {
                    setPayAmount(member.outstandingBalance > 0 ? member.outstandingBalance : 1499);
                    setShowPaymentModal(true);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Receipt #</th>
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5">Method</th>
                      <th className="px-4 py-2.5 text-right">Amount</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {memberPayments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                          No payment records found
                        </td>
                      </tr>
                    ) : (
                      memberPayments.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono">{formatDate(p.date)}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{p.receiptNumber}</td>
                          <td className="px-4 py-3 font-medium text-slate-800">{p.description}</td>
                          <td className="px-4 py-3">{p.paymentMethod}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                            {formatINR(p.amountPaid)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                p.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'Partially Paid'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setReceiptModalTxn(p)}
                              className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title="Print Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Floor Attendance History</h4>
                  <p className="text-xs text-slate-500">Total Visits: {memberAttendance.length} visits recorded</p>
                </div>
                <button
                  onClick={() => {
                    const res = checkInMember(member.id);
                    alert(res.message);
                  }}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Check In Now
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Date & Time In</th>
                      <th className="px-4 py-2.5">Time Out</th>
                      <th className="px-4 py-2.5">Duration</th>
                      <th className="px-4 py-2.5">Branch</th>
                      <th className="px-4 py-2.5">Status at Check-In</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {memberAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                          No visits logged yet
                        </td>
                      </tr>
                    ) : (
                      memberAttendance.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono">{formatDateTime(a.checkInTime)}</td>
                          <td className="px-4 py-3 font-mono">{a.checkOutTime ? a.checkOutTime.split(' ')[1] : '—'}</td>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {a.durationMinutes ? `${a.durationMinutes} mins` : <span className="text-emerald-600 font-semibold">Active Now</span>}
                          </td>
                          <td className="px-4 py-3">{a.branchId === 'b1' ? 'Indiranagar' : 'Koramangala'}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                              {a.statusAtCheckIn}
                            </span>
                            {a.wasOverridden && (
                              <span className="ml-1.5 text-[10px] text-amber-700 font-bold">(Overridden)</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: WORKOUT PLAN */}
          {activeTab === 'workout' && (
            <div className="space-y-4">
              {memberWorkout ? (
                <div className="space-y-4">
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-teal-950">{memberWorkout.planName}</h4>
                      <p className="text-xs text-teal-800 mt-0.5">
                        Coach: <span className="font-semibold">{memberWorkout.assignedTrainerName}</span> • Goal: {memberWorkout.fitnessGoal} • Level: {memberWorkout.trainingLevel}
                      </p>
                      <p className="text-xs text-teal-700 mt-1 italic">{memberWorkout.instructions}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-200 text-teal-900">
                      {memberWorkout.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {memberWorkout.schedule.map((day, dIdx) => (
                      <div key={dIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <div className="px-4 py-2.5 bg-slate-100 font-bold text-slate-800 text-xs border-b border-slate-200">
                          {day.dayName}
                        </div>
                        <div className="divide-y divide-slate-100">
                          {day.exercises.map(ex => (
                            <div key={ex.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                              <div>
                                <p className="font-semibold text-slate-900">{ex.name}</p>
                                {ex.notes && <p className="text-[11px] text-slate-500 italic mt-0.5">{ex.notes}</p>}
                              </div>
                              <div className="flex items-center gap-4 text-xs font-mono text-slate-700">
                                <span>{ex.sets} sets × {ex.reps}</span>
                                {ex.weightKg && <span className="font-semibold text-teal-700">{ex.weightKg}</span>}
                                {ex.restSeconds && <span className="text-slate-400">{ex.restSeconds}s rest</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  <Dumbbell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">No workout plan assigned yet</p>
                  <p className="text-xs text-slate-400 mt-1">Assign a coach in the overview tab to generate a custom routine.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PERSONAL TRAINING */}
          {activeTab === 'pt' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Personal Training Sessions</h4>
              {memberPTSessions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  <Flame className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">No personal training sessions booked</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Time</th>
                        <th className="px-4 py-2.5">Trainer</th>
                        <th className="px-4 py-2.5">Package Progress</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {memberPTSessions.map(pt => (
                        <tr key={pt.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono">{formatDate(pt.sessionDate)}</td>
                          <td className="px-4 py-3 font-mono">{pt.startTime} - {pt.endTime}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{pt.trainerName}</td>
                          <td className="px-4 py-3 font-mono">
                            {pt.packageUsedSessions} / {pt.packageTotalSessions} sessions used
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                pt.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : pt.status === 'Scheduled'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {pt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CLASS BOOKINGS */}
          {activeTab === 'classes' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Enrolled Group Classes</h4>
              {memberBookedClasses.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">No class bookings for this member</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {memberBookedClasses.map(c => (
                    <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">{c.category}</span>
                          <h5 className="font-bold text-slate-900 text-sm mt-0.5">{c.name}</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          Booked
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Instructor: {c.instructorName}</p>
                      <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                        <span>{c.dayOfWeek} • {c.startTime}</span>
                        <span>{c.studioRoom}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: NOTES & ACTIVITY */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">General Notes</h4>
                <p className="text-slate-700 leading-relaxed">
                  {member.generalNotes || 'No additional staff remarks recorded.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Medical & Restrictive Observations</h4>
                <p className="text-slate-700 leading-relaxed">
                  {member.medicalNotes || 'Cleared for full intensity workouts.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-mono">Member ID: {member.id}</span>
          <button
            onClick={() => setSelectedMemberProfileId(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* SUBMODAL: RENEWAL */}
      {showRenewModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleExecuteRenew}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Renew Membership — {member.fullName}</h3>
              <button onClick={() => setShowRenewModal(false)} type="button" className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Next Plan</label>
                <select
                  value={renewPlanId}
                  onChange={e => {
                    setRenewPlanId(e.target.value);
                    const p = plans.find(plan => plan.id === e.target.value);
                    if (p) setRenewAmountPaid(Math.max(0, p.price - renewDiscount));
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.durationMonths}m) — {formatINR(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={renewDiscount}
                    onChange={e => {
                      const d = Number(e.target.value);
                      setRenewDiscount(d);
                      const p = plans.find(plan => plan.id === renewPlanId);
                      if (p) setRenewAmountPaid(Math.max(0, p.price - d));
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount Paid Today (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={renewAmountPaid}
                    onChange={e => setRenewAmountPaid(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={renewMethod}
                  onChange={e => setRenewMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 text-[11px]">
                <p className="font-semibold">Automatic Expiry Extension</p>
                <p className="mt-0.5">
                  The renewed plan duration will seamlessly attach to the existing expiry date ({formatDate(member.expiryDate)}), preventing date gaps.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRenewModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold cursor-pointer"
              >
                Confirm Renewal & Record Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBMODAL: FREEZE */}
      {showFreezeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleExecuteFreeze}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Freeze Membership — {member.fullName}</h3>
              <button onClick={() => setShowFreezeModal(false)} type="button" className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Freeze Start Date</label>
                  <input
                    type="date"
                    required
                    value={freezeStart}
                    onChange={e => setFreezeStart(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Freeze End Date</label>
                  <input
                    type="date"
                    required
                    value={freezeEnd}
                    onChange={e => setFreezeEnd(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Freezing</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical recovery, Travel, Exam preparation"
                  value={freezeReason}
                  onChange={e => setFreezeReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                <p className="font-semibold">Gym Freeze Policy</p>
                <p className="mt-0.5">
                  Member check-in will be blocked during this period. The expiry date will be pushed back by the exact number of frozen days upon confirmation.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowFreezeModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold cursor-pointer"
              >
                Freeze Membership
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBMODAL: RECORD DUES PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleExecutePayment}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Collect Due Payment — {member.fullName}</h3>
              <button onClick={() => setShowPaymentModal(false)} type="button" className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between">
                <span className="text-slate-500">Current Outstanding:</span>
                <span className="font-mono font-bold text-rose-600 text-sm">{formatINR(member.outstandingBalance)}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Receiving Today (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer"
              >
                Save Payment & Issue Receipt
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
