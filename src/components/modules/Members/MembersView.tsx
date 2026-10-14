import React, { useState, useMemo } from 'react';
import { useGym } from '../../../context/GymContext';
import { MembershipStatus, PaymentMethod } from '../../../types';
import { formatINR, formatDate, exportToCSV } from '../../../utils/formatters';
import {
  Users,
  Search,
  Plus,
  Download,
  Filter,
  CreditCard,
  QrCode,
  RotateCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  PauseCircle,
  X,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';
import { MemberProfileModal } from './MemberProfileModal';

export const MembersView: React.FC = () => {
  const {
    filteredMembers,
    plans,
    staff,
    registerMember,
    checkInMember,
    setSelectedMemberProfileId,
    setReceiptModalTxn
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | MembershipStatus>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Member form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '1995-05-15',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: 'Spouse',
    planId: plans[0]?.id || 'plan-monthly',
    startDate: '2026-10-14',
    branchId: 'b1' as 'b1' | 'b2',
    assignedTrainerId: '',
    initialAmountPaid: plans[0]?.price || 1499,
    paymentMethod: 'UPI' as PaymentMethod,
    medicalNotes: '',
    referralSource: 'Walk-In'
  });

  const [formError, setFormError] = useState('');

  // Filtered members calculation
  const displayedMembers = useMemo(() => {
    return filteredMembers.filter(m => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchesPlan = planFilter === 'All' || m.planId === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [filteredMembers, searchQuery, statusFilter, planFilter]);

  const handleExportCSV = () => {
    const headers = [
      'Member ID',
      'Full Name',
      'Phone',
      'Email',
      'Plan',
      'Start Date',
      'Expiry Date',
      'Status',
      'Assigned Trainer',
      'Outstanding Due (INR)',
      'Branch',
      'Last Visit'
    ];
    const rows = displayedMembers.map(m => [
      m.id,
      m.fullName,
      m.phone,
      m.email,
      m.planName,
      m.startDate,
      m.expiryDate,
      m.status,
      m.assignedTrainerName || 'None',
      m.outstandingBalance,
      m.branchId === 'b1' ? 'Indiranagar' : 'Koramangala',
      m.lastVisit || 'Never'
    ]);
    exportToCSV('CoreFit_Members_Directory', headers, rows);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim()) {
      setFormError('Member name is required.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setFormError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    try {
      const newMember = registerMember({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@example.in`,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        emergencyContact: formData.emergencyName
          ? {
              name: formData.emergencyName,
              phone: formData.emergencyPhone,
              relation: formData.emergencyRelation
            }
          : undefined,
        registrationDate: '2026-10-14',
        branchId: formData.branchId,
        planId: formData.planId,
        planName: plans.find(p => p.id === formData.planId)?.name || 'Monthly Membership',
        startDate: formData.startDate,
        expiryDate: '', // calculated in context
        assignedTrainerId: formData.assignedTrainerId || undefined,
        initialAmountPaid: Number(formData.initialAmountPaid),
        paymentMethod: formData.paymentMethod,
        medicalNotes: formData.medicalNotes,
        referralSource: formData.referralSource
      });

      setShowAddModal(false);
      setSelectedMemberProfileId(newMember.id);
    } catch (err: any) {
      setFormError(err.message || 'Failed to register member.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Member Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {displayedMembers.length} {displayedMembers.length === 1 ? 'member' : 'members'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, enroll new members, renew plans, and monitor attendance records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Member</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {(['All', 'Active', 'Expiring Soon', 'Expired', 'Frozen', 'Suspended'] as const).map(tab => {
            const isSelected = statusFilter === tab;
            const count =
              tab === 'All'
                ? filteredMembers.length
                : filteredMembers.filter(m => m.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Plan Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID (MEM001), phone, or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <select
              value={planFilter}
              onChange={e => setPlanFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Membership Plans</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Members Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Valid Until</th>
                <th className="px-4 py-3">Coach</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Balance Due</th>
                <th className="px-4 py-3">Last Visit</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-600 text-sm">No members match your criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                displayedMembers.map(m => (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMemberProfileId(m.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Member Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {m.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {m.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                            <span className="text-teal-700 font-semibold">{m.id}</span>
                            <span>•</span>
                            <span>{m.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <div>{m.planName}</div>
                      <div className="text-[10px] text-slate-400">
                        {m.branchId === 'b1' ? 'Indiranagar' : 'Koramangala'}
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="px-4 py-3 font-mono text-slate-600">
                      <div>{formatDate(m.expiryDate)}</div>
                      <div className="text-[10px] text-slate-400">Started {formatDate(m.startDate)}</div>
                    </td>

                    {/* Assigned Trainer */}
                    <td className="px-4 py-3 text-slate-700">
                      {m.assignedTrainerName ? (
                        <span className="font-semibold text-slate-800">{m.assignedTrainerName}</span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'Expiring Soon'
                            ? 'bg-amber-100 text-amber-800'
                            : m.status === 'Frozen'
                            ? 'bg-indigo-100 text-indigo-800'
                            : m.status === 'Suspended'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    {/* Outstanding Balance */}
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      {m.outstandingBalance > 0 ? (
                        <span className="text-rose-600">{formatINR(m.outstandingBalance)}</span>
                      ) : (
                        <span className="text-slate-400 font-normal">₹0</span>
                      )}
                    </td>

                    {/* Last Visit */}
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {m.lastVisit ? m.lastVisit.split(' ')[0] : 'Never'}
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const res = checkInMember(m.id);
                            alert(res.message);
                          }}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Fast Check In"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedMemberProfileId(m.id)}
                          className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-semibold rounded text-[11px] transition-colors cursor-pointer"
                        >
                          Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Drawer Modal */}
      <MemberProfileModal />

      {/* REGISTER MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleAddSubmit}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">Register New Gym Member</h3>
                <p className="text-xs text-slate-400 mt-0.5">Generates automated Member ID and initial transaction</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-medium">
                  {formError}
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-teal-800">
                  1. Member Profile & Identity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Varun Sengupta"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="member@example.in"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="Street, Area, City"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Membership details */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-teal-800">
                  2. Membership Plan & Coaching
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                    <select
                      value={formData.branchId}
                      onChange={e => setFormData({ ...formData, branchId: e.target.value as any })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="b1">Main Branch — Indiranagar</option>
                      <option value="b2">Branch 2 — Koramangala</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Membership Plan</label>
                    <select
                      value={formData.planId}
                      onChange={e => {
                        const pid = e.target.value;
                        const p = plans.find(plan => plan.id === pid);
                        setFormData({
                          ...formData,
                          planId: pid,
                          initialAmountPaid: p ? p.price + p.registrationFee : 1499
                        });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                    >
                      {plans.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.durationMonths}m) — {formatINR(p.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assign Trainer (Optional)</label>
                    <select
                      value={formData.assignedTrainerId}
                      onChange={e => setFormData({ ...formData, assignedTrainerId: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">No Trainer Assigned</option>
                      {staff
                        .filter(s => s.role === 'Personal Trainer' || s.role === 'Group Fitness Instructor')
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {s.fullName} ({s.specializations.slice(0, 2).join(', ')})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Referral Source</label>
                    <select
                      value={formData.referralSource}
                      onChange={e => setFormData({ ...formData, referralSource: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Walk-In">Walk-In</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Website">Website</option>
                      <option value="Friend Referral">Friend Referral</option>
                      <option value="Corporate Tie-up">Corporate Tie-up</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Initial Fee & Billing */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-teal-800">
                  3. Initial Payment Collection
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Amount Paid Today (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.initialAmountPaid}
                      onChange={e => setFormData({ ...formData, initialAmountPaid: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
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
              </div>

              {/* Medical notes */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block font-semibold text-slate-700 mb-1">Medical Observations & Health Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Asthmatic, high blood pressure, prior knee ACL surgery..."
                  value={formData.medicalNotes}
                  onChange={e => setFormData({ ...formData, medicalNotes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
