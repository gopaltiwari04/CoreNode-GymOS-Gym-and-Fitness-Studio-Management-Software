import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import {
  Settings,
  Building2,
  Shield,
  CreditCard,
  QrCode,
  CheckCircle,
  Smartphone,
  Cpu,
  Save,
  RotateCcw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetDemoData, branches } = useGym();

  const [formData, setFormData] = useState({
    gymName: settings.gymName,
    businessAddress: settings.businessAddress,
    phone: settings.phone,
    email: settings.email,
    gstin: settings.gstin,
    invoicePrefix: settings.invoicePrefix,
    receiptPrefix: settings.receiptPrefix,
    expiryReminderDays: settings.expiryReminderDays,
    freezePolicyDaysMax: settings.freezePolicyDaysMax,
    gracePeriodDays: settings.gracePeriodDays,
    allowManualCheckinOverride: settings.allowManualCheckinOverride,
    preventDuplicateCheckin: settings.preventDuplicateCheckin
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      gymName: formData.gymName,
      businessAddress: formData.businessAddress,
      phone: formData.phone,
      email: formData.email,
      gstin: formData.gstin,
      invoicePrefix: formData.invoicePrefix,
      receiptPrefix: formData.receiptPrefix,
      expiryReminderDays: Number(formData.expiryReminderDays),
      freezePolicyDaysMax: Number(formData.freezePolicyDaysMax),
      gracePeriodDays: Number(formData.gracePeriodDays),
      allowManualCheckinOverride: formData.allowManualCheckinOverride,
      preventDuplicateCheckin: formData.preventDuplicateCheckin
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Business Settings & Operational Rules</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              CoreFit Fitness Studio
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure tenant profile, GST compliance, membership lifecycle warning periods, and hardware access rules.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all demo data back to default initial state?')) {
              resetDemoData();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Store</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Settings saved and operational policies updated successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Profile */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Business Entity & Location Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gym Commercial Name</label>
              <input
                type="text"
                required
                value={formData.gymName}
                onChange={e => setFormData({ ...formData, gymName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official GSTIN (Goods & Services Tax)</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Support Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Registered Main Address</label>
            <input
              type="text"
              value={formData.businessAddress}
              onChange={e => setFormData({ ...formData, businessAddress: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Section 2: Membership Lifecycle Rules */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Membership Lifecycle Policies</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expiry Reminder Warning (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.expiryReminderDays}
                onChange={e => setFormData({ ...formData, expiryReminderDays: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Members with fewer days are marked "Expiring Soon"
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Freeze Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="90"
                value={formData.freezePolicyDaysMax}
                onChange={e => setFormData({ ...formData, freezePolicyDaysMax: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Maximum allowed per calendar year</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Grace Period (Days)</label>
              <input
                type="number"
                min="0"
                max="14"
                value={formData.gracePeriodDays}
                onChange={e => setFormData({ ...formData, gracePeriodDays: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Post-expiry grace before suspension</span>
            </div>
          </div>
        </div>

        {/* Section 3: Billing & Receipt Prefixes */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Billing, Receipts & Invoicing</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Receipt Number Prefix</label>
              <input
                type="text"
                value={formData.receiptPrefix}
                onChange={e => setFormData({ ...formData, receiptPrefix: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">e.g. RCP-2026-1049</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={e => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Attendance Rules */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <QrCode className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">Access Control & Attendance Policies</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.preventDuplicateCheckin}
                onChange={e => setFormData({ ...formData, preventDuplicateCheckin: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <div>
                <span className="font-bold text-slate-900 block">Prevent Duplicate Active Check-Ins</span>
                <span className="text-[11px] text-slate-500">
                  Blocks multiple check-ins on the same day unless the member checks out first.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowManualCheckinOverride}
                onChange={e => setFormData({ ...formData, allowManualCheckinOverride: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <div>
                <span className="font-bold text-slate-900 block">Allow Authorized Staff Check-In Overrides</span>
                <span className="text-[11px] text-slate-500">
                  Allows front-desk staff to override blocked entries (expired/frozen) with a mandatory recorded reason.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Business Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
