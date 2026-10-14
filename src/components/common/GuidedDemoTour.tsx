import React from 'react';
import { useGym } from '../../context/GymContext';
import { Sparkles, ArrowRight, ArrowLeft, X, Check, Compass } from 'lucide-react';

interface TourStepInfo {
  step: number;
  module: string;
  title: string;
  subtitle: string;
  description: string;
  actionHint: string;
}

const TOUR_STEPS: TourStepInfo[] = [
  {
    step: 1,
    module: 'overview',
    title: '1. Executive Business Dashboard',
    subtitle: 'Real-time metrics, live floor occupancy, and revenue health',
    description: 'Welcome to CoreNode GymOS! The executive dashboard tracks daily check-ins, active subscriptions, revenue vs expenses, expiring memberships, and pending leads at a glance.',
    actionHint: 'Notice the live check-ins and revenue KPI cards calculated directly from today\'s operations.'
  },
  {
    step: 2,
    module: 'members',
    title: '2. Register & Manage Members',
    subtitle: 'Complete member profiles, plans, and medical records',
    description: 'Manage your complete fitness community. Click "+ Add Member" to register a new member with automatic Member ID generation, duration expiry calculation, and immediate initial payment receipt.',
    actionHint: 'Click on any member (e.g. Aarav Sharma) to open their comprehensive 8-tab member drawer.'
  },
  {
    step: 3,
    module: 'attendance',
    title: '3. Rapid Front-Desk Check-In',
    subtitle: 'Lightning-fast search, duplicate prevention, and status alerts',
    description: 'Built specifically for front-desk speed. Type a member name, ID, or phone to check them in with 1 click. Prevents duplicate check-ins and alerts staff if a membership is expired or frozen.',
    actionHint: 'Try searching "Priya" or "MEM003" and click Check In. Test an expired member to see manual override!'
  },
  {
    step: 4,
    module: 'members',
    title: '4. Membership Renewals & Freezes',
    subtitle: 'Zero lost revenue with automatic lifecycle protection',
    description: 'Never let a member churn unnoticed. Renewals automatically extend expiry dates, allow custom discounts, and generate official payment transactions in one seamless motion.',
    actionHint: 'Filter by "Expiring Soon" or click "Renew" on an expiring member to test the renewal flow.'
  },
  {
    step: 5,
    module: 'billing',
    title: '5. Payments, Dues & Printable Receipts',
    subtitle: 'Complete financial ledger with UPI, Cards, Cash & Refunds',
    description: 'Track every rupee collected, partial dues, and outstanding balances. Generate professional, branded PDF/physical receipts for members with one click.',
    actionHint: 'Click "View Receipt" on any transaction row to inspect and test print the branded receipt.'
  },
  {
    step: 6,
    module: 'workout',
    title: '6. Trainer Programming & Workout Plans',
    subtitle: 'Organized day splits, compound lifts, sets, reps & rest intervals',
    description: 'Empower your personal trainers to craft structured training routines for members. Assign routines, duplicate plans, and allow members to view them on their own phone portal.',
    actionHint: 'Check out Aarav Sharma\'s 4-day Hypertrophy Split with custom weights and sets.'
  },
  {
    step: 7,
    module: 'leads',
    title: '7. Lead CRM & Trial Conversion',
    subtitle: 'Turn walk-ins and Instagram enquiries into paying members',
    description: 'Visual Kanban pipeline tracking prospects from initial enquiry to trial class and conversion. Click "Convert to Member" to seamlessly onboard leads into the member directory without duplicate data entry.',
    actionHint: 'Drag or click "Convert" on interested leads like Karthik Raja or Shalini Murthy.'
  },
  {
    step: 8,
    module: 'reports',
    title: '8. Business Reports & Analytics',
    subtitle: 'Revenue, peak attendance hours, trainer utilization & CSV export',
    description: 'Make informed commercial decisions. Filter financial, membership, class, and attendance reports across branches and date ranges, with instant CSV download.',
    actionHint: 'Review the monthly revenue trend chart and click "Export Report to CSV"!'
  }
];

export const GuidedDemoTour: React.FC = () => {
  const { guidedTourStep, setGuidedTourStep, nextTourStep, prevTourStep, dismissGuidedTour } = useGym();

  if (guidedTourStep === 0) return null;

  const currentStep = TOUR_STEPS.find(s => s.step === guidedTourStep) || TOUR_STEPS[0];

  return (
    <div className="no-print bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white border-b border-teal-500/30 px-4 py-3 shadow-md relative z-40 animate-slide-down">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Step indicator & badge */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold">
            {currentStep.step}/8
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Compass className="w-3 h-3" />
                Guided Sales Tour
              </span>
              <h4 className="text-sm font-bold text-white">{currentStep.title}</h4>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
              {currentStep.description}
            </p>
            <div className="text-[11px] text-teal-300/90 font-medium mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Pro Tip: {currentStep.actionHint}</span>
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          {guidedTourStep > 1 && (
            <button
              onClick={prevTourStep}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors cursor-pointer border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={nextTourStep}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <span>{guidedTourStep === 8 ? 'Finish Tour' : 'Next Step'}</span>
            {guidedTourStep === 8 ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={dismissGuidedTour}
            title="Dismiss Guided Tour"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
