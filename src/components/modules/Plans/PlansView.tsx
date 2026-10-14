import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { MembershipPlan, Member } from '../../../types';
import { formatINR } from '../../../utils/formatters';
import {
  CreditCard,
  Plus,
  Check,
  Edit2,
  Users,
  Award,
  Calendar,
  Flame,
  ShieldCheck,
  X
} from 'lucide-react';

export const PlansView: React.FC = () => {
  const { plans, members, createPlan, updatePlan } = useGym();

  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    durationMonths: 3,
    price: 3999,
    registrationFee: 0,
    description: '',
    featuresText: 'Full Gym Access\nLocker Facility\nShower & Steam Room',
    classAccess: true,
    ptAllowance: 0,
    freezeEligibilityDays: 14,
    isActive: true,
    colorTag: 'teal'
  });

  const getSubscriberCount = (planId: string) => {
    return members.filter((m: Member) => m.planId === planId && (m.status === 'Active' || m.status === 'Expiring Soon')).length;
  };

  const getPlanRevenue = (planId: string) => {
    const plan = plans.find((p: MembershipPlan) => p.id === planId);
    if (!plan) return 0;
    const count = members.filter((m: Member) => m.planId === planId).length;
    return count * plan.price;
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      durationMonths: plan.durationMonths,
      price: plan.price,
      registrationFee: plan.registrationFee,
      description: plan.description,
      featuresText: plan.features.join('\n'),
      classAccess: plan.classAccess,
      ptAllowance: plan.ptAllowance,
      freezeEligibilityDays: plan.freezeEligibilityDays,
      isActive: plan.isActive,
      colorTag: plan.colorTag || 'teal'
    });
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const features = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    if (editingPlan) {
      updatePlan(editingPlan.id, {
        name: formData.name,
        durationMonths: Number(formData.durationMonths),
        price: Number(formData.price),
        registrationFee: Number(formData.registrationFee),
        description: formData.description,
        features,
        classAccess: formData.classAccess,
        ptAllowance: Number(formData.ptAllowance),
        freezeEligibilityDays: Number(formData.freezeEligibilityDays),
        isActive: formData.isActive,
        colorTag: formData.colorTag
      });
      setEditingPlan(null);
    } else {
      createPlan({
        name: formData.name,
        durationMonths: Number(formData.durationMonths),
        price: Number(formData.price),
        registrationFee: Number(formData.registrationFee),
        description: formData.description,
        features,
        classAccess: formData.classAccess,
        ptAllowance: Number(formData.ptAllowance),
        freezeEligibilityDays: Number(formData.freezeEligibilityDays),
        isActive: formData.isActive,
        colorTag: formData.colorTag
      });
      setShowCreateModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Membership Plans</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {plans.length} configured plans
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure flexible pricing, class privileges, personal training allowances, and freeze rules.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPlan(null);
            setFormData({
              name: '',
              durationMonths: 1,
              price: 1999,
              registrationFee: 500,
              description: '',
              featuresText: 'General Gym Access\nLocker Room',
              classAccess: false,
              ptAllowance: 0,
              freezeEligibilityDays: 0,
              isActive: true,
              colorTag: 'teal'
            });
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p: MembershipPlan) => {
          const subscribers = getSubscriberCount(p.id);
          const estRevenue = getPlanRevenue(p.id);

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-2xs relative overflow-hidden transition-all hover:shadow-md ${
                p.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              {p.id === 'plan-annual' && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-xs">
                  Popular Best Value
                </div>
              )}

              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      {formatINR(p.price)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      / {p.durationMonths} {p.durationMonths === 1 ? 'month' : 'months'}
                    </span>
                  </div>
                  {p.registrationFee > 0 ? (
                    <div className="text-[11px] text-slate-400 mt-1">
                      + {formatINR(p.registrationFee)} one-time registration fee
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                      ✓ Zero Registration Fee
                    </div>
                  )}
                </div>

                {/* Key specs badge row */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Classes</span>
                    <span className={`text-xs font-bold ${p.classAccess ? 'text-teal-700' : 'text-slate-400'}`}>
                      {p.classAccess ? 'Included' : 'None'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Free PT</span>
                    <span className="text-xs font-bold text-slate-800">
                      {p.ptAllowance > 0 ? `${p.ptAllowance} sessions` : 'None'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Freeze</span>
                    <span className="text-xs font-bold text-slate-800">
                      {p.freezeEligibilityDays > 0 ? `${p.freezeEligibilityDays} days` : 'No'}
                    </span>
                  </div>
                </div>

                {/* Feature Bullet Points */}
                <div className="space-y-2 mb-6">
                  {p.features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Subscribers & Edit */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>{subscribers} Active Subscribers</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Rev: {formatINR(estRevenue)}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Plan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Feature Matrix & Privilege Comparison</h3>
          <p className="text-xs text-slate-500">Cross-plan entitlement overview for front-desk sales pitch</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Plan Name</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Monthly Equivalent</th>
                <th className="px-4 py-3">Group Classes</th>
                <th className="px-4 py-3">PT Sessions</th>
                <th className="px-4 py-3">Freeze Days</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((p: MembershipPlan) => {
                const perMonth = Math.round(p.price / Math.max(1, p.durationMonths));
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 font-mono">{p.durationMonths} month(s)</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{formatINR(p.price)}</td>
                    <td className="px-4 py-3 font-mono text-teal-700 font-semibold">{formatINR(perMonth)}/mo</td>
                    <td className="px-4 py-3">
                      {p.classAccess ? (
                        <span className="text-emerald-700 font-bold">✓ Unlimited</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {p.ptAllowance > 0 ? `${p.ptAllowance} included` : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {p.freezeEligibilityDays > 0 ? `Up to ${p.freezeEligibilityDays}d` : 'None'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
