import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { formatDate } from '../../../utils/formatters';
import {
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Wrench,
  CreditCard,
  Target,
  ArrowRight
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveModule } = useGym();

  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  const filteredNotifs = notifications.filter(n => (filter === 'All' ? true : !n.isRead));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notification & Alert Centre</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {notifications.filter(n => !n.isRead).length} unread
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time alerts for impending membership expiries, overdue dues, lead follow-ups, and equipment servicing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            filter === 'All' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('Unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            filter === 'Unread' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Unread ({notifications.filter(n => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-600">No notifications to display</p>
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.linkModule) setActiveModule(n.linkModule);
              }}
              className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                !n.isRead ? 'bg-teal-50/40' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type.includes('Expiring') || n.type.includes('Due')
                      ? 'bg-amber-100 text-amber-800'
                      : n.type.includes('Maintenance')
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">{n.message}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-2">
                    <span>{formatDate(n.date)}</span>
                    <span>•</span>
                    <span>{n.time}</span>
                  </div>
                </div>
              </div>

              {n.linkModule && (
                <div className="flex items-center gap-1 text-xs text-teal-700 font-semibold shrink-0 hover:underline">
                  <span>Take Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
