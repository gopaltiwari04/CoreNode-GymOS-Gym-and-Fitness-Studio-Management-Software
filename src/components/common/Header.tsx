import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { UserRole, BranchId } from '../../types';
import {
  Search,
  Bell,
  Building2,
  Sparkles,
  RotateCcw,
  UserCheck,
  Check,
  Menu,
  ChevronDown,
  Shield,
  Activity,
  Layers
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const Header: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const {
    currentUserRole,
    setCurrentUserRole,
    selectedBranchId,
    setSelectedBranchId,
    branches,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    activeModule,
    setActiveModule,
    setIsGlobalSearchOpen,
    startGuidedTour,
    resetDemoData,
    kpiStats
  } = useGym();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const unreadCount = kpiStats.unreadNotificationsCount;

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string; desc: string }> = {
    owner: {
      title: 'Gym Owner / Admin',
      badge: 'Full Access',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      desc: 'All 15 modules, financials, staff salaries & settings'
    },
    receptionist: {
      title: 'Front Desk / Receptionist',
      badge: 'Front Desk',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Member check-in, renewals, billing & class bookings'
    },
    trainer: {
      title: 'Trainer (Rajesh Nair)',
      badge: 'Trainer Mode',
      color: 'bg-teal-100 text-teal-800 border-teal-200',
      desc: 'Assigned workout plans, personal training & attendance'
    },
    member: {
      title: 'Member (Aarav Sharma)',
      badge: 'Self-Service',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Personal membership, workout routines & bookings'
    }
  };

  return (
    <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-teal-500/30">
              <span className="text-teal-400">C</span>N
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-slate-900 tracking-tight text-base">CoreNode</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                  GymOS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium tracking-wide">
                Run Your Gym. Grow Your Business.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search + Branch selector */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-lg mx-4">
          {/* Branch Selector */}
          <div className="relative">
            <select
              value={selectedBranchId}
              onChange={e => setSelectedBranchId(e.target.value as BranchId)}
              className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold py-2 pl-8 pr-7 rounded-lg border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Branches (2)</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name.split('—')[0].trim()}
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quick Search Bar */}
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="flex-1 flex items-center justify-between px-3 py-2 bg-slate-100/80 hover:bg-slate-100 text-slate-400 text-xs rounded-lg border border-slate-200/80 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search members, plans, classes...</span>
            </div>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 text-slate-500 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guided Tour Trigger Button */}
          <button
            onClick={startGuidedTour}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guided Demo</span>
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkModule) {
                            setActiveModule(n.linkModule);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-teal-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveModule('notifications');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                roleLabels[currentUserRole].color
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{roleLabels[currentUserRole].title.split(' ')[0]}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-white/60">
                {roleLabels[currentUserRole].badge}
              </span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Simulated Role
                  </p>
                  <p className="text-[11px] text-slate-500">Test the platform as different gym personas</p>
                </div>

                <div className="p-1 space-y-1">
                  {(Object.keys(roleLabels) as UserRole[]).map(roleKey => {
                    const r = roleLabels[roleKey];
                    const isSelected = currentUserRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          setCurrentUserRole(roleKey);
                          setIsRoleMenuOpen(false);
                          if (roleKey === 'member') {
                            setActiveModule('member-portal');
                          } else if (activeModule === 'member-portal') {
                            setActiveModule('overview');
                          }
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors cursor-pointer flex items-start justify-between ${
                          isSelected ? 'bg-slate-100 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900">{r.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-normal mt-0.5">{r.desc}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                <div className="px-3 pt-2 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (confirm('Reset all demo data back to original default state?')) {
                        resetDemoData();
                        setIsRoleMenuOpen(false);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
