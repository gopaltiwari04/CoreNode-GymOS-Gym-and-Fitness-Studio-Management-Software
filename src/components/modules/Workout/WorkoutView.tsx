import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { WorkoutPlan, WorkoutDay, ExerciseItem, Member, StaffMember } from '../../../types';
import { formatDate } from '../../../utils/formatters';
import {
  Dumbbell,
  Plus,
  Trash2,
  Copy,
  Calendar,
  Flame,
  User,
  Clock,
  CheckCircle,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const WorkoutView: React.FC = () => {
  const { workoutPlans, members, staff, createWorkoutPlan, updateWorkoutPlan } = useGym();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(workoutPlans[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const selectedPlan = workoutPlans.find((wp: WorkoutPlan) => wp.id === selectedPlanId) || workoutPlans[0];

  const [builderData, setBuilderData] = useState<{
    planName: string;
    memberId: string;
    assignedTrainerId: string;
    startDate: string;
    endDate: string;
    fitnessGoal: WorkoutPlan['fitnessGoal'];
    trainingLevel: WorkoutPlan['trainingLevel'];
    weeklyFrequency: number;
    instructions: string;
    schedule: WorkoutDay[];
  }>({
    planName: 'Upper & Lower Hypertrophy',
    memberId: members[0]?.id || 'MEM001',
    assignedTrainerId: staff[0]?.id || 'st-01',
    startDate: '2026-10-15',
    endDate: '2026-12-15',
    fitnessGoal: 'Muscle Building',
    trainingLevel: 'Intermediate',
    weeklyFrequency: 4,
    instructions: 'Progressive overload weekly. Stay hydrated and stretch post workout.',
    schedule: [
      {
        dayName: 'Day 1 — Chest & Core',
        exercises: [
          { id: '1', name: 'Barbell Bench Press', sets: 4, reps: '8-10', weightKg: '70 kg', restSeconds: 90, notes: 'Full range of motion' },
          { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weightKg: '24 kg', restSeconds: 60 }
        ]
      },
      {
        dayName: 'Day 2 — Back & Biceps',
        exercises: [
          { id: '3', name: 'Barbell Deadlift', sets: 4, reps: '6-8', weightKg: '100 kg', restSeconds: 120 },
          { id: '4', name: 'Lat Pulldown', sets: 4, reps: '10-12', weightKg: '55 kg', restSeconds: 75 }
        ]
      }
    ]
  });

  const handleDuplicate = (plan: WorkoutPlan) => {
    createWorkoutPlan({
      ...plan,
      planName: `${plan.planName} (Copy)`
    });
  };

  const handleSaveNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m: Member) => m.id === builderData.memberId);
    const trn = staff.find((s: StaffMember) => s.id === builderData.assignedTrainerId);

    createWorkoutPlan({
      planName: builderData.planName,
      memberId: builderData.memberId,
      memberName: mem?.fullName || 'Member',
      assignedTrainerId: builderData.assignedTrainerId,
      assignedTrainerName: trn?.fullName || 'Rajesh Nair',
      startDate: builderData.startDate,
      endDate: builderData.endDate,
      fitnessGoal: builderData.fitnessGoal,
      trainingLevel: builderData.trainingLevel,
      weeklyFrequency: Number(builderData.weeklyFrequency),
      instructions: builderData.instructions,
      status: 'Active',
      schedule: builderData.schedule
    });

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Workout Plans & Programming</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {workoutPlans.length} active programs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build personalized split routines, log weights, set rest periods, and sync directly with member self-service.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workout Plan</span>
        </button>
      </div>

      {/* Main Layout: Left Sidebar of Plans, Right Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Member Plans</h3>

          <div className="space-y-2">
            {workoutPlans.map((wp: WorkoutPlan) => {
              const isSelected = selectedPlan?.id === wp.id;
              return (
                <div
                  key={wp.id}
                  onClick={() => setSelectedPlanId(wp.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{wp.planName}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {wp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-700 font-semibold mt-1">
                    Member: {wp.memberName}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>Coach: {wp.assignedTrainerName}</span>
                    <span className="font-mono">{wp.weeklyFrequency}d / week</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Plan Details & Routine Viewer */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPlan ? (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    {selectedPlan.fitnessGoal} • {selectedPlan.trainingLevel}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{selectedPlan.planName}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned to <span className="font-semibold text-slate-800">{selectedPlan.memberName}</span> by{' '}
                    <span className="font-semibold text-slate-800">{selectedPlan.assignedTrainerName}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicate(selectedPlan)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                  Coach Instructions:
                </span>
                <p className="italic">{selectedPlan.instructions}</p>
                <div className="pt-2 text-[10px] text-slate-400 font-mono">
                  Cycle Window: {formatDate(selectedPlan.startDate)} to {formatDate(selectedPlan.endDate)}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Workout Schedule ({selectedPlan.schedule.length} Training Days)
                </h3>

                {selectedPlan.schedule.map((day: WorkoutDay, dIdx: number) => (
                  <div key={dIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">{day.dayName}</span>
                      <span className="text-[11px] font-mono text-slate-500 font-medium">
                        {day.exercises.length} exercises
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {day.exercises.map((ex: ExerciseItem) => (
                        <div key={ex.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{ex.name}</span>
                            {ex.notes && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">{ex.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-mono text-slate-700 shrink-0">
                            <span className="px-2 py-0.5 bg-slate-100 rounded font-semibold text-slate-800">
                              {ex.sets} sets × {ex.reps}
                            </span>
                            {ex.weightKg && (
                              <span className="font-bold text-teal-700">{ex.weightKg}</span>
                            )}
                            {ex.restSeconds && (
                              <span className="text-slate-400 font-normal">{ex.restSeconds}s rest</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 italic">
                * Note: Trainer-created demonstration programming. Does not constitute medical diagnosis or formal therapy advice.
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
              Select or create a workout routine to preview
            </div>
          )}
        </div>
      </div>

      {/* CREATE WORKOUT PLAN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveNewPlan}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col text-xs"
          >
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Create Member Workout Routine</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={builderData.planName}
                  onChange={e => setBuilderData({ ...builderData, planName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign to Member</label>
                  <select
                    value={builderData.memberId}
                    onChange={e => setBuilderData({ ...builderData, memberId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {members.map((m: Member) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Trainer</label>
                  <select
                    value={builderData.assignedTrainerId}
                    onChange={e => setBuilderData({ ...builderData, assignedTrainerId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {staff.map((s: StaffMember) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fitness Goal</label>
                  <select
                    value={builderData.fitnessGoal}
                    onChange={e => setBuilderData({ ...builderData, fitnessGoal: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="General Fitness">General Fitness</option>
                    <option value="Strength">Strength</option>
                    <option value="Muscle Building">Muscle Building</option>
                    <option value="Weight Management">Weight Management</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Mobility">Mobility</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Training Level</label>
                  <select
                    value={builderData.trainingLevel}
                    onChange={e => setBuilderData({ ...builderData, trainingLevel: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Days / Week</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={builderData.weeklyFrequency}
                    onChange={e => setBuilderData({ ...builderData, weeklyFrequency: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coach Notes & Form Cues</label>
                <textarea
                  rows={2}
                  value={builderData.instructions}
                  onChange={e => setBuilderData({ ...builderData, instructions: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Save Workout Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
