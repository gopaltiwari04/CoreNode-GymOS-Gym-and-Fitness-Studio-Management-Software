import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { FitnessClass, Member } from '../../../types';
import {
  CalendarDays,
  Plus,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  UserCheck,
  Calendar
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { classes, members, bookClass, cancelClassBooking, staff } = useGym();

  const [selectedDay, setSelectedDay] = useState<string>('Wednesday');
  const [selectedClassForBooking, setSelectedClassForBooking] = useState<FitnessClass | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [viewRosterClass, setViewRosterClass] = useState<FitnessClass | null>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredClasses = classes.filter((c: FitnessClass) => selectedDay === 'All' || c.dayOfWeek === selectedDay);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForBooking || !selectedMemberId) return;

    const res = bookClass(selectedClassForBooking.id, selectedMemberId);
    alert(res.message);
    if (res.success) {
      setSelectedClassForBooking(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Group Fitness Classes & Schedules</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {classes.length} scheduled sessions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weekly timetable for Yoga, HIIT, Zumba, Spin Cycling, and Pilates with live capacity limits.
          </p>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200/90 text-xs font-semibold">
        {daysOfWeek.map(day => {
          const isSelected = selectedDay === day;
          const count = classes.filter((c: FitnessClass) => c.dayOfWeek === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-600">No classes scheduled on {selectedDay}</p>
          </div>
        ) : (
          filteredClasses.map((c: FitnessClass) => {
            const bookedCount = c.bookedMemberIds.length;
            const isFull = bookedCount >= c.capacity;
            const pct = Math.round((bookedCount / c.capacity) * 100);

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                      {c.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        isFull
                          ? 'bg-rose-100 text-rose-800'
                          : c.status === 'Completed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isFull ? 'Class Full' : c.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">{c.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Coach: <span className="font-semibold text-slate-800">{c.instructorName}</span>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-medium">
                        {c.startTime} – {c.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.studioRoom}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Occupancy</span>
                      <span className="font-mono font-bold text-slate-900">
                        {bookedCount} / {c.capacity} spots ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFull ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-teal-600'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewRosterClass(c)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
                  >
                    View Roster ({bookedCount})
                  </button>

                  <button
                    disabled={isFull || c.status === 'Completed'}
                    onClick={() => setSelectedClassForBooking(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isFull || c.status === 'Completed'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
                    }`}
                  >
                    {isFull ? 'Full' : '+ Book Member'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* BOOK MEMBER MODAL */}
      {selectedClassForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleBookSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Book Member for Class</h3>
              <button
                type="button"
                onClick={() => setSelectedClassForBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 space-y-1">
              <p className="font-bold">{selectedClassForBooking.name}</p>
              <p>
                {selectedClassForBooking.dayOfWeek} • {selectedClassForBooking.startTime} • {selectedClassForBooking.studioRoom}
              </p>
              <p className="text-[11px] text-teal-800">
                Capacity Available: {selectedClassForBooking.capacity - selectedClassForBooking.bookedMemberIds.length} spots
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Member</label>
              <select
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                {members
                  .filter((m: Member) => m.status === 'Active' || m.status === 'Expiring Soon')
                  .map((m: Member) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.planName})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedClassForBooking(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Confirm Reservation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW ROSTER MODAL */}
      {viewRosterClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col text-xs">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">{viewRosterClass.name} — Attendee Roster</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {viewRosterClass.bookedMemberIds.length} members booked ({viewRosterClass.capacity} max)
                </p>
              </div>
              <button
                onClick={() => setViewRosterClass(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto divide-y divide-slate-100">
              {viewRosterClass.bookedMemberIds.length === 0 ? (
                <p className="text-center py-8 text-slate-400">No members have registered yet</p>
              ) : (
                viewRosterClass.bookedMemberIds.map((memId: string) => {
                  const m = members.find((mem: Member) => mem.id === memId);
                  if (!m) return null;
                  return (
                    <div key={m.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                          {m.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{m.fullName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{m.phone} • {m.planName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${m.fullName} from this class?`)) {
                            cancelClassBooking(viewRosterClass.id, m.id);
                            setViewRosterClass({
                              ...viewRosterClass,
                              bookedMemberIds: viewRosterClass.bookedMemberIds.filter((id: string) => id !== m.id)
                            });
                          }
                        }}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        Cancel Spot
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewRosterClass(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
