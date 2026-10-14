import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { Equipment, EquipmentCategory, EquipmentCondition } from '../../../types';
import { formatINR, formatDate } from '../../../utils/formatters';
import {
  Wrench,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldAlert,
  Calendar,
  X
} from 'lucide-react';

export const EquipmentView: React.FC = () => {
  const { equipment, logEquipmentMaintenance, updateEquipmentCondition } = useGym();

  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [logModalEquipment, setLogModalEquipment] = useState<Equipment | null>(null);

  // Log form state
  const [techName, setTechName] = useState('FitPro Service Engineer');
  const [workDone, setWorkDone] = useState('Belt lubrication and safety check');
  const [serviceCost, setServiceCost] = useState(2500);
  const [nextDate, setNextDate] = useState('2026-12-15');

  const filteredEquipment = equipment.filter(e => conditionFilter === 'All' || e.condition === conditionFilter);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logModalEquipment) return;

    logEquipmentMaintenance(logModalEquipment.id, {
      technician: techName,
      workDone,
      cost: Number(serviceCost),
      nextDate
    });

    setLogModalEquipment(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Equipment Register & Maintenance</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {equipment.length} assets tracked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Commercial treadmills, squat racks, dual cable pulleys, spin bikes, and preventive servicing schedules.
          </p>
        </div>
      </div>

      {/* Condition Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200/90 text-xs font-semibold">
        {['All', 'Good', 'Needs Attention', 'Under Maintenance', 'Out of Service'].map(c => {
          const count = c === 'All' ? equipment.length : equipment.filter(e => e.condition === c).length;
          return (
            <button
              key={c}
              onClick={() => setConditionFilter(c)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                conditionFilter === c ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{c}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  conditionFilter === c ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map(eq => {
          const isOverdue = new Date(eq.nextMaintenanceDate) < new Date('2026-10-14');

          return (
            <div
              key={eq.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {eq.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      eq.condition === 'Good'
                        ? 'bg-emerald-100 text-emerald-800'
                        : eq.condition === 'Needs Attention'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {eq.condition}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{eq.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Model: {eq.brandModel}</p>

                {/* Dates & Servicing */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Last Servicing:</span>
                    <span className="font-mono">{formatDate(eq.lastMaintenanceDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Next Due:</span>
                    <span className={`font-mono font-bold ${isOverdue ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                      {formatDate(eq.nextMaintenanceDate)} {isOverdue ? '(OVERDUE)' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Branch:</span>
                    <span>{eq.branchId === 'b1' ? 'Indiranagar' : 'Koramangala'}</span>
                  </div>
                </div>

                {eq.notes && (
                  <div className="mt-3 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 italic">
                    "{eq.notes}"
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <select
                  value={eq.condition}
                  onChange={e => updateEquipmentCondition(eq.id, e.target.value as EquipmentCondition)}
                  className="text-[11px] bg-slate-50 border border-slate-200 rounded p-1 text-slate-700 font-semibold cursor-pointer"
                >
                  <option value="Good">Good</option>
                  <option value="Needs Attention">Needs Attention</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>

                <button
                  onClick={() => setLogModalEquipment(eq)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Wrench className="w-3 h-3" />
                  <span>Log Service</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOG SERVICE MODAL */}
      {logModalEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleLogSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Log Equipment Maintenance</h3>
              <button type="button" onClick={() => setLogModalEquipment(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 space-y-1">
              <p className="font-bold">{logModalEquipment.name}</p>
              <p className="text-[11px] text-teal-700 font-mono">ID: {logModalEquipment.id}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Technician / Vendor</label>
              <input
                type="text"
                required
                value={techName}
                onChange={e => setTechName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Completed</label>
              <textarea
                rows={2}
                required
                value={workDone}
                onChange={e => setWorkDone(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={serviceCost}
                  onChange={e => setServiceCost(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Service Date</label>
                <input
                  type="date"
                  required
                  value={nextDate}
                  onChange={e => setNextDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLogModalEquipment(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Complete & Restore Condition
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
