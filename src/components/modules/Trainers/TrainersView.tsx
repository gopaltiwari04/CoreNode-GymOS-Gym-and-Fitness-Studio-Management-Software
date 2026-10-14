import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { StaffMember, StaffRole, TrainerSpecialization, Member, PTSession } from '../../../types';
import { formatINR, formatDate } from '../../../utils/formatters';
import {
  UserCheck,
  Plus,
  Mail,
  Phone,
  Clock,
  Dumbbell,
  Shield,
  Award,
  Calendar,
  X,
  Building,
  CheckCircle2
} from 'lucide-react';

const ALL_SPECIALIZATIONS: TrainerSpecialization[] = [
  'Strength Training',
  'Weight Loss',
  'Muscle Building',
  'Functional Training',
  'Yoga',
  'Cardio',
  'Mobility',
  'General Fitness'
];

export const TrainersView: React.FC = () => {
  const { staff, members, ptSessions, classes, addStaff, updateStaff, currentUserRole } = useGym();

  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [formData, setFormData] = useState<{
    fullName: string;
    phone: string;
    email: string;
    role: StaffRole;
    specializations: TrainerSpecialization[];
    employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
    joiningDate: string;
    assignedBranchId: 'b1' | 'b2';
    workingHours: string;
    monthlySalary: number;
    status: 'Active' | 'On Leave' | 'Inactive';
  }>({
    fullName: '',
    phone: '',
    email: '',
    role: 'Personal Trainer',
    specializations: ['Strength Training'],
    employmentType: 'Full-Time',
    joiningDate: '2026-10-14',
    assignedBranchId: 'b1',
    workingHours: '06:00 AM - 02:00 PM',
    monthlySalary: 35000,
    status: 'Active'
  });

  const filteredStaff = staff.filter((s: StaffMember) => roleFilter === 'All' || s.role === roleFilter);

  const getAssignedMembersCount = (trainerId: string) => {
    return members.filter((m: Member) => m.assignedTrainerId === trainerId && m.status === 'Active').length;
  };

  const getCompletedPTSessionsCount = (trainerId: string) => {
    return ptSessions.filter((pt: PTSession) => pt.trainerId === trainerId && pt.status === 'Completed').length;
  };

  const handleOpenEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setFormData({
      fullName: s.fullName,
      phone: s.phone,
      email: s.email,
      role: s.role,
      specializations: s.specializations,
      employmentType: s.employmentType,
      joiningDate: s.joiningDate,
      assignedBranchId: s.assignedBranchId,
      workingHours: s.workingHours,
      monthlySalary: s.monthlySalary || 35000,
      status: s.status
    });
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
      setEditingStaff(null);
    } else {
      addStaff(formData);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Trainers & Staff Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {staff.length} staff members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage certified personal coaches, group fitness instructors, receptionists, and branch shift assignments.
          </p>
        </div>

        {currentUserRole === 'owner' && (
          <button
            onClick={() => {
              setEditingStaff(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        )}
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200/90 text-xs">
        {['All', 'Personal Trainer', 'Group Fitness Instructor', 'Gym Manager', 'Receptionist'].map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              roleFilter === role ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((s: StaffMember) => {
          const assignedCount = getAssignedMembersCount(s.id);
          const ptCount = getCompletedPTSessionsCount(s.id);
          const isTrainer = s.role === 'Personal Trainer' || s.role === 'Group Fitness Instructor';

          return (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 font-extrabold text-xl flex items-center justify-center shrink-0 border border-teal-200 shadow-2xs">
                    {s.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{s.fullName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {s.status}
                      </span>
                    </div>
                    <p className="text-xs text-teal-700 font-semibold">{s.role}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {s.assignedBranchId === 'b1' ? 'Indiranagar' : 'Koramangala'} • {s.employmentType}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.workingHours}</span>
                  </div>
                </div>

                {s.specializations.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                      Specializations
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {s.specializations.map((spec: TrainerSpecialization, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isTrainer && (
                  <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                    <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-100">
                      <span className="text-[10px] text-teal-800 uppercase font-bold block">Assigned Members</span>
                      <span className="text-base font-extrabold text-teal-950 font-mono">{assignedCount}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">PT Sessions Done</span>
                      <span className="text-base font-extrabold text-slate-800 font-mono">{ptCount}</span>
                    </div>
                  </div>
                )}

                {currentUserRole === 'owner' && s.monthlySalary && (
                  <div className="mt-4 p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3 text-slate-400" />
                      <span>Confidential Salary:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(s.monthlySalary)}/mo</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">Joined: {formatDate(s.joiningDate)}</span>
                {currentUserRole === 'owner' && (
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT STAFF MODAL */}
      {(showAddModal || editingStaff) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveStaff}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col text-xs"
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {editingStaff ? `Edit Staff — ${editingStaff.fullName}` : 'Add Staff Member'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
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
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as StaffRole })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                  >
                    <option value="Personal Trainer">Personal Trainer</option>
                    <option value="Group Fitness Instructor">Group Fitness Instructor</option>
                    <option value="Gym Manager">Gym Manager</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Housekeeping">Housekeeping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                  <select
                    value={formData.assignedBranchId}
                    onChange={e => setFormData({ ...formData, assignedBranchId: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="b1">Indiranagar</option>
                    <option value="b2">Koramangala</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment</label>
                  <select
                    value={formData.employmentType}
                    onChange={e => setFormData({ ...formData, employmentType: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.monthlySalary}
                    onChange={e => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Working Shift Hours</label>
                <input
                  type="text"
                  placeholder="e.g. 06:00 AM - 02:00 PM"
                  value={formData.workingHours}
                  onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Trainer Specializations</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SPECIALIZATIONS.map(spec => {
                    const isChecked = formData.specializations.includes(spec);
                    return (
                      <label key={spec} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData({ ...formData, specializations: [...formData.specializations, spec] });
                            } else {
                              setFormData({ ...formData, specializations: formData.specializations.filter(s => s !== spec) });
                            }
                          }}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-slate-700">{spec}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Save Staff Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
