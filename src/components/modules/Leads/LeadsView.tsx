import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { Lead, LeadStage, LeadSource, PaymentMethod, MembershipPlan, StaffMember } from '../../../types';
import { formatDate } from '../../../utils/formatters';
import {
  Target,
  Plus,
  Kanban,
  Table as TableIcon,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  CheckCircle,
  ArrowRight,
  Clock,
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';

const STAGES: LeadStage[] = [
  'New',
  'Contacted',
  'Trial Scheduled',
  'Trial Completed',
  'Interested',
  'Converted',
  'Lost'
];

export const LeadsView: React.FC = () => {
  const { leads, plans, staff, addLead, updateLeadStage, addLeadNote, convertLeadToMember, setSelectedMemberProfileId } = useGym();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [showAddModal, setShowAddModal] = useState(false);
  const [convertModalLead, setConvertModalLead] = useState<Lead | null>(null);

  const [convertPlanId, setConvertPlanId] = useState(plans[0]?.id || 'plan-monthly');
  const [convertInitialPaid, setConvertInitialPaid] = useState(plans[0]?.price || 1499);
  const [convertMethod, setConvertMethod] = useState<PaymentMethod>('UPI');

  const [formData, setFormData] = useState<{
    fullName: string;
    phone: string;
    email: string;
    leadSource: LeadSource;
    interestedPlanId: string;
    assignedStaffId: string;
    followUpDate: string;
    stage: LeadStage;
    notes: string;
    branchId: 'b1' | 'b2';
  }>({
    fullName: '',
    phone: '',
    email: '',
    leadSource: 'Walk-In',
    interestedPlanId: plans[0]?.id || 'plan-monthly',
    assignedStaffId: staff[0]?.id || 'st-05',
    followUpDate: '2026-10-14',
    stage: 'New',
    notes: 'Walked in asking about weight loss membership options.',
    branchId: 'b1'
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = plans.find((p: MembershipPlan) => p.id === formData.interestedPlanId);
    const assignedStaff = staff.find((s: StaffMember) => s.id === formData.assignedStaffId);

    addLead({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      leadSource: formData.leadSource,
      interestedPlanId: formData.interestedPlanId,
      interestedPlanName: plan?.name,
      assignedStaffId: formData.assignedStaffId,
      assignedStaffName: assignedStaff?.fullName,
      followUpDate: formData.followUpDate,
      stage: formData.stage,
      notes: [formData.notes],
      branchId: formData.branchId
    });

    setShowAddModal(false);
  };

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertModalLead) return;

    try {
      const newMember = convertLeadToMember(
        convertModalLead.id,
        convertPlanId,
        Number(convertInitialPaid),
        convertMethod
      );
      setConvertModalLead(null);
      setSelectedMemberProfileId(newMember.id);
    } catch (err: any) {
      alert(err.message || 'Conversion error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Leads & Enquiries CRM</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {leads.length} prospects
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Convert walk-ins, phone calls, and social media leads into active gym memberships with zero data loss.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded flex items-center gap-1 cursor-pointer font-semibold ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded flex items-center gap-1 cursor-pointer font-semibold ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {STAGES.map((stage: LeadStage) => {
            const stageLeads = leads.filter((l: Lead) => l.stage === stage);

            return (
              <div
                key={stage}
                className="w-72 shrink-0 bg-slate-100/80 rounded-2xl p-3 border border-slate-200/90 flex flex-col max-h-[75vh]"
              >
                <div className="flex items-center justify-between px-2 py-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{stage}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-[10px] font-mono font-bold shadow-2xs">
                      {stageLeads.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {stageLeads.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-300 rounded-xl">
                      No leads in this stage
                    </div>
                  ) : (
                    stageLeads.map((l: Lead) => {
                      const isDueToday = l.followUpDate === '2026-10-14' && l.stage !== 'Converted' && l.stage !== 'Lost';

                      return (
                        <div
                          key={l.id}
                          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs">{l.fullName}</h4>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{l.phone}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {l.leadSource}
                            </span>
                          </div>

                          {l.interestedPlanName && (
                            <div className="text-[11px] text-teal-700 font-medium bg-teal-50/80 px-2 py-1 rounded">
                              Plan: {l.interestedPlanName}
                            </div>
                          )}

                          {isDueToday && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                              <Clock className="w-3 h-3" />
                              <span>Follow-up Due Today!</span>
                            </div>
                          )}

                          {l.notes.length > 0 && (
                            <p className="text-[11px] text-slate-500 italic line-clamp-2">
                              "{l.notes[0]}"
                            </p>
                          )}

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            {l.stage !== 'Converted' && l.stage !== 'Lost' ? (
                              <button
                                onClick={() => {
                                  setConvertModalLead(l);
                                  const p = plans.find((plan: MembershipPlan) => plan.name === l.interestedPlanName) || plans[0];
                                  setConvertPlanId(p.id);
                                  setConvertInitialPaid(p.price);
                                }}
                                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] rounded transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Convert</span>
                              </button>
                            ) : l.stage === 'Converted' ? (
                              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Converted</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">Closed Lost</span>
                            )}

                            <select
                              value={l.stage}
                              onChange={e => updateLeadStage(l.id, e.target.value as LeadStage)}
                              className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium cursor-pointer"
                            >
                              {STAGES.map(s => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Lead Name</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Interested Plan</th>
                  <th className="px-4 py-3">Enquiry Date</th>
                  <th className="px-4 py-3">Follow-Up Date</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l: Lead) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{l.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{l.phone}</div>
                    </td>
                    <td className="px-4 py-3">{l.leadSource}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{l.interestedPlanName || '—'}</td>
                    <td className="px-4 py-3 font-mono">{formatDate(l.enquiryDate)}</td>
                    <td className="px-4 py-3 font-mono">
                      {formatDate(l.followUpDate)}
                      {l.followUpDate === '2026-10-14' && (
                        <span className="ml-1 text-[10px] font-bold text-amber-600">(Due)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={l.stage}
                        onChange={e => updateLeadStage(l.id, e.target.value as LeadStage)}
                        className="p-1 text-xs border border-slate-200 rounded bg-white font-semibold text-slate-800"
                      >
                        {STAGES.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {l.stage !== 'Converted' ? (
                        <button
                          onClick={() => {
                            setConvertModalLead(l);
                            const p = plans.find((plan: MembershipPlan) => plan.name === l.interestedPlanName) || plans[0];
                            setConvertPlanId(p.id);
                            setConvertInitialPaid(p.price);
                          }}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                        >
                          Convert
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-xs">Converted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONVERT LEAD TO MEMBER MODAL */}
      {convertModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleConvertSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Convert Lead to Member</h3>
                <p className="text-[11px] text-slate-500">Enrolls lead into active member directory</p>
              </div>
              <button
                type="button"
                onClick={() => setConvertModalLead(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 space-y-1">
              <p className="font-bold">{convertModalLead.fullName}</p>
              <p className="font-mono text-teal-800">{convertModalLead.phone}</p>
              <p className="text-[11px] text-teal-700">Source: {convertModalLead.leadSource}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Membership Plan</label>
              <select
                value={convertPlanId}
                onChange={e => {
                  setConvertPlanId(e.target.value);
                  const p = plans.find((plan: MembershipPlan) => plan.id === e.target.value);
                  if (p) setConvertInitialPaid(p.price);
                }}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                {plans.map((p: MembershipPlan) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.durationMonths}m) — {p.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Amount Paid (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={convertInitialPaid}
                  onChange={e => setConvertInitialPaid(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={convertMethod}
                  onChange={e => setConvertMethod(e.target.value as PaymentMethod)}
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
                onClick={() => setConvertModalLead(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Complete Onboarding
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleAddSubmit}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Prospective Lead</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Murthy"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9880X XXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lead Source</label>
                <select
                  value={formData.leadSource}
                  onChange={e => setFormData({ ...formData, leadSource: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Walk-In">Walk-In</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Website">Website</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Referral">Referral</option>
                  <option value="Advertisement">Advertisement</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interested Plan</label>
                <select
                  value={formData.interestedPlanId}
                  onChange={e => setFormData({ ...formData, interestedPlanId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {plans.map((p: MembershipPlan) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-Up Date</label>
                <input
                  type="date"
                  required
                  value={formData.followUpDate}
                  onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Branch</label>
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Enquiry Notes</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
                Save Prospect
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
