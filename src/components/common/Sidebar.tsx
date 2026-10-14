import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  QrCode,
  UserCheck,
  Dumbbell,
  CalendarDays,
  Target,
  BarChart3,
  TrendingDown,
  Wrench,
  Bell,
  Settings,
  Flame,
  Award,
  ChevronRight,
  ShieldAlert,
  X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  roles?: ('owner' | 'receptionist' | 'trainer')[];
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = false, onClose }) => {
  const {
    activeModule,
    setActiveModule,
    currentUserRole,
    kpiStats,
    members,
    leads,
    todayAttendance,
    equipment,
    settings
  } = useGym();

  const expiringCount = kpiStats.expiringSoonMembers;
  const overdueMembersCount = members.filter(m => m.outstandingBalance > 0).length;
  const checkinsTodayCount = todayAttendance.length;
  const activeLeadsCount = leads.filter(l => l.stage !== 'Converted' && l.stage !== 'Lost').length;
  const eqAlertsCount = equipment.filter(e => e.condition !== 'Good').length;

  // Navigation structure grouped logically for Gym SaaS
  const navGroups: NavGroup[] = [
    {
      groupName: 'CORE OPERATIONS',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['owner', 'receptionist'] },
        {
          id: 'attendance',
          label: 'Check-In & Attendance',
          icon: QrCode,
          badge: checkinsTodayCount > 0 ? `${checkinsTodayCount} in` : undefined,
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
          id: 'members',
          label: 'Members',
          icon: Users,
          badge: expiringCount > 0 ? `${expiringCount} due` : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        {
          id: 'billing',
          label: 'Payments & Billing',
          icon: Receipt,
          badge: overdueMembersCount > 0 ? `${overdueMembersCount} dues` : undefined,
          badgeColor: 'bg-rose-100 text-rose-800',
          roles: ['owner', 'receptionist']
        },
        { id: 'plans', label: 'Membership Plans', icon: CreditCard, roles: ['owner', 'receptionist'] }
      ]
    },
    {
      groupName: 'FITNESS & TRAINING',
      items: [
        { id: 'workout', label: 'Workout Plans', icon: Dumbbell },
        { id: 'classes', label: 'Classes & Bookings', icon: CalendarDays },
        { id: 'pt', label: 'Personal Training', icon: Flame },
        { id: 'trainers', label: 'Trainers & Staff', icon: UserCheck, roles: ['owner', 'receptionist'] }
      ]
    },
    {
      groupName: 'SALES & GROWTH',
      items: [
        {
          id: 'leads',
          label: 'Leads & Enquiries',
          icon: Target,
          badge: activeLeadsCount > 0 ? `${activeLeadsCount}` : undefined,
          badgeColor: 'bg-teal-100 text-teal-800',
          roles: ['owner', 'receptionist']
        },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['owner'] }
      ]
    },
    {
      groupName: 'ADMIN & OPERATIONS',
      items: [
        { id: 'expenses', label: 'Expenses', icon: TrendingDown, roles: ['owner'] },
        {
          id: 'equipment',
          label: 'Equipment & Maintenance',
          icon: Wrench,
          badge: eqAlertsCount > 0 ? `${eqAlertsCount} alerts` : undefined,
          badgeColor: 'bg-amber-100 text-amber-800',
          roles: ['owner', 'receptionist']
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          badge: kpiStats.unreadNotificationsCount > 0 ? kpiStats.unreadNotificationsCount : undefined,
          badgeColor: 'bg-rose-500 text-white'
        },
        { id: 'settings', label: 'Settings', icon: Settings, roles: ['owner'] }
      ]
    }
  ];

  // If Member role is selected, show member-specific navigation
  const memberNavItems: NavItem[] = [
    { id: 'member-portal', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'member-plan', label: 'My Membership', icon: Award },
    { id: 'member-attendance', label: 'My Attendance History', icon: QrCode },
    { id: 'member-workout', label: 'My Workout Routine', icon: Dumbbell },
    { id: 'member-classes', label: 'Book Group Classes', icon: CalendarDays },
    { id: 'member-pt', label: 'My Personal Training', icon: Flame },
    { id: 'member-payments', label: 'Payment Receipts', icon: Receipt },
    { id: 'member-profile', label: 'My Profile & Medical', icon: Users }
  ];

  const handleNavClick = (id: string) => {
    setActiveModule(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header inside sidebar */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-sm">
              CN
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-tight leading-tight">CoreNode GymOS</div>
              <div className="text-[10px] text-teal-400 font-medium">Enterprise Fitness Suite</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {currentUserRole === 'member' ? (
            <div className="space-y-1">
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-teal-400">
                MEMBER SELF-SERVICE PORTAL
              </div>
              {memberNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            navGroups.map((group, gIdx) => {
              // Filter items by role
              const visibleItems = group.items.filter(item => {
                if (!item.roles) return true;
                return item.roles.includes(currentUserRole as any);
              });

              if (visibleItems.length === 0) return null;

              return (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.groupName}
                  </div>
                  {visibleItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group ${
                          isActive
                            ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-teal-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                              isActive ? 'bg-slate-900 text-teal-400' : item.badgeColor || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Gym Tenant Profile Card at Bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              CF
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{settings.gymName}</div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Active SaaS Tenant</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
