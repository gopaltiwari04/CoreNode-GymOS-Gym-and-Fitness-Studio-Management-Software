import React, { useState, useMemo, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Search, User, CreditCard, Calendar, Target, X, ArrowRight } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    members,
    plans,
    classes,
    leads,
    setActiveModule,
    setSelectedMemberProfileId
  } = useGym();

  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { members: [], plans: [], classes: [], leads: [] };
    const q = query.toLowerCase().trim();

    return {
      members: members.filter(
        m =>
          m.fullName.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.email.toLowerCase().includes(q)
      ).slice(0, 5),
      plans: plans.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)).slice(0, 3),
      classes: classes.filter(c => c.name.toLowerCase().includes(q) || c.instructorName.toLowerCase().includes(q)).slice(0, 3),
      leads: leads.filter(l => l.fullName.toLowerCase().includes(q) || l.phone.includes(q) || l.id.toLowerCase().includes(q)).slice(0, 3)
    };
  }, [query, members, plans, classes, leads]);

  if (!isGlobalSearchOpen) return null;

  const totalResults = results.members.length + results.plans.length + results.classes.length + results.leads.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search members, plans, classes, leads... (e.g. 'Aarav', 'MEM003', 'Yoga')"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-3 py-1 bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="text-center py-8 text-slate-400 text-xs">
              <p>Type to search across all CoreFit gym records</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono text-[11px]">MEM001</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono text-[11px]">Rajesh Nair</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono text-[11px]">Yoga</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono text-[11px]">Annual Plan</span>
              </div>
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching records found for "{query}"
            </div>
          )}

          {/* Members */}
          {results.members.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Members ({results.members.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.members.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMemberProfileId(m.id);
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-teal-50/70 border border-transparent hover:border-teal-200 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-semibold text-xs flex items-center justify-center">
                        {m.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-teal-900">
                          {m.fullName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="font-mono text-[11px] text-teal-700 font-semibold">{m.id}</span>
                          <span>•</span>
                          <span>{m.planName}</span>
                          <span>•</span>
                          <span>{m.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                        m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        m.status === 'Expiring Soon' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {m.status}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plans */}
          {results.plans.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                <span>Membership Plans ({results.plans.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.plans.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveModule('plans');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50/70 border border-transparent hover:border-indigo-200 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-900">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.durationMonths} month(s) • {p.features.slice(0, 2).join(', ')}</div>
                    </div>
                    <div className="font-mono font-bold text-slate-800 text-sm">{formatINR(p.price)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classes */}
          {results.classes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Fitness Classes ({results.classes.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.classes.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveModule('classes');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50/70 border border-transparent hover:border-amber-200 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-900">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.dayOfWeek} • {c.startTime} • Instructor: {c.instructorName}</div>
                    </div>
                    <span className="text-xs text-slate-600 font-mono">{c.bookedMemberIds.length}/{c.capacity} booked</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {results.leads.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-rose-600" />
                <span>Leads & CRM ({results.leads.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.leads.map(l => (
                  <div
                    key={l.id}
                    onClick={() => {
                      setActiveModule('leads');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-rose-50/70 border border-transparent hover:border-rose-200 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-rose-900">{l.fullName}</div>
                      <div className="text-xs text-slate-500">{l.phone} • Source: {l.leadSource}</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">
                      {l.stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
