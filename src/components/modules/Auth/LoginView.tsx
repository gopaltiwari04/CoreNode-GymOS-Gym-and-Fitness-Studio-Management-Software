import React, { useState } from 'react';
import { useGym } from '../../../context/GymContext';
import { UserRole } from '../../../types';
import {
  Shield,
  UserCheck,
  Dumbbell,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Mail
} from 'lucide-react';

export const LoginView: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { setCurrentUserRole, setActiveModule } = useGym();

  const [email, setEmail] = useState('admin@corefit.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleExplore = (role: UserRole) => {
    setCurrentUserRole(role);
    if (role === 'member') {
      setActiveModule('member-portal');
    } else {
      setActiveModule('overview');
    }
    onLoginSuccess();
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserRole('owner');
    setActiveModule('overview');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-teal-500 selection:text-white">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black text-2xl shadow-xl ring-4 ring-teal-500/20 mb-4">
          CN
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          CoreNode <span className="text-teal-400">GymOS</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
          Run Your Gym. Grow Your Business.
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Commercial Demonstration</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 space-y-6">
          {/* Quick Explore Demo Persona Buttons */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-2">
              Instant 1-Click Persona Access
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleRoleExplore('owner')}
                className="p-3 bg-slate-800 hover:bg-slate-700 hover:border-teal-500/50 border border-slate-700/80 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-teal-300 flex items-center justify-between">
                  <span>Gym Owner</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">All 15 SaaS modules</p>
              </button>

              <button
                onClick={() => handleRoleExplore('receptionist')}
                className="p-3 bg-slate-800 hover:bg-slate-700 hover:border-teal-500/50 border border-slate-700/80 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-teal-300 flex items-center justify-between">
                  <span>Front Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Check-ins & Billing</p>
              </button>

              <button
                onClick={() => handleRoleExplore('trainer')}
                className="p-3 bg-slate-800 hover:bg-slate-700 hover:border-teal-500/50 border border-slate-700/80 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-teal-300 flex items-center justify-between">
                  <span>Trainer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Workout programming</p>
              </button>

              <button
                onClick={() => handleRoleExplore('member')}
                className="p-3 bg-slate-800 hover:bg-slate-700 hover:border-teal-500/50 border border-slate-700/80 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-teal-300 flex items-center justify-between">
                  <span>Member Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Self-service & QR pass</p>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
              Or sign in with demo credentials
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold rounded-lg shadow-lg transition-all cursor-pointer text-xs"
            >
              Sign In to CoreFit Indiranagar
            </button>
          </form>

          {/* Footer details */}
          <div className="text-center pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
            Engineered by <span className="font-semibold text-slate-400">CoreNode Software Solutions</span> • Demo v1.0
          </div>
        </div>
      </div>
    </div>
  );
};
