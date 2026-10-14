import React, { useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GuidedDemoTour } from './components/common/GuidedDemoTour';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ReceiptModal } from './components/common/ReceiptModal';

import { OverviewView } from './components/modules/Overview/OverviewView';
import { MembersView } from './components/modules/Members/MembersView';
import { PlansView } from './components/modules/Plans/PlansView';
import { BillingView } from './components/modules/Billing/BillingView';
import { AttendanceView } from './components/modules/Attendance/AttendanceView';
import { TrainersView } from './components/modules/Trainers/TrainersView';
import { WorkoutView } from './components/modules/Workout/WorkoutView';
import { ClassesView } from './components/modules/Classes/ClassesView';
import { PersonalTrainingView } from './components/modules/PersonalTraining/PersonalTrainingView';
import { LeadsView } from './components/modules/Leads/LeadsView';
import { ReportsView } from './components/modules/Reports/ReportsView';
import { ExpensesView } from './components/modules/Expenses/ExpensesView';
import { EquipmentView } from './components/modules/Equipment/EquipmentView';
import { NotificationsView } from './components/modules/Notifications/NotificationsView';
import { SettingsView } from './components/modules/Settings/SettingsView';
import { MemberPortalView } from './components/modules/MemberPortal/MemberPortalView';
import { LoginView } from './components/modules/Auth/LoginView';

const MainAppLayout: React.FC = () => {
  const { activeModule, currentUserRole } = useGym();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const renderActiveModule = () => {
    if (currentUserRole === 'member' || activeModule.startsWith('member-')) {
      return <MemberPortalView />;
    }

    switch (activeModule) {
      case 'overview':
        return <OverviewView />;
      case 'members':
        return <MembersView />;
      case 'plans':
        return <PlansView />;
      case 'billing':
        return <BillingView />;
      case 'attendance':
        return <AttendanceView />;
      case 'trainers':
        return <TrainersView />;
      case 'workout':
        return <WorkoutView />;
      case 'classes':
        return <ClassesView />;
      case 'pt':
        return <PersonalTrainingView />;
      case 'leads':
        return <LeadsView />;
      case 'reports':
        return <ReportsView />;
      case 'expenses':
        return <ExpensesView />;
      case 'equipment':
        return <EquipmentView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Guided Demo Tour Banner */}
      <GuidedDemoTour />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Sidebar */}
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header Bar */}
          <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

          {/* Module Content */}
          <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            {renderActiveModule()}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      <ReceiptModal />
    </div>
  );
};

export function App() {
  return (
    <GymProvider>
      <MainAppLayout />
    </GymProvider>
  );
}

export default App;
