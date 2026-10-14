import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  BranchId,
  Branch,
  MembershipStatus,
  MembershipPlan,
  Member,
  StaffMember,
  FitnessClass,
  Lead,
  PaymentTransaction,
  AttendanceRecord,
  PTSession,
  WorkoutPlan,
  Expense,
  Equipment,
  AppNotification,
  AuditLog,
  BusinessSettings,
  PaymentMethod,
  LeadStage,
  PTSessionStatus
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_PLANS,
  INITIAL_STAFF,
  INITIAL_MEMBERS,
  INITIAL_CLASSES,
  INITIAL_LEADS,
  INITIAL_PAYMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_PT_SESSIONS,
  INITIAL_WORKOUT_PLANS,
  INITIAL_EXPENSES,
  INITIAL_EQUIPMENT,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS
} from '../data/initialData';
import { addMonthsToDate, addDaysToDate, getDaysRemaining } from '../utils/formatters';

const STORAGE_KEY = 'corenode_gymos_state_v1';

interface GymContextType {
  // Navigation & Role
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  selectedBranchId: BranchId;
  setSelectedBranchId: (branchId: BranchId) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  currentMemberId: string;
  setCurrentMemberId: (id: string) => void;

  // Guided Demo Tour
  guidedTourStep: number; // 0 = off, 1..8
  setGuidedTourStep: (step: number) => void;
  startGuidedTour: () => void;
  dismissGuidedTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;

  // Search Modal & Receipt Modal
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  receiptModalTxn: PaymentTransaction | null;
  setReceiptModalTxn: (txn: PaymentTransaction | null) => void;
  selectedMemberProfileId: string | null;
  setSelectedMemberProfileId: (id: string | null) => void;

  // Entities
  branches: Branch[];
  plans: MembershipPlan[];
  members: Member[];
  staff: StaffMember[];
  classes: FitnessClass[];
  leads: Lead[];
  payments: PaymentTransaction[];
  attendance: AttendanceRecord[];
  ptSessions: PTSession[];
  workoutPlans: WorkoutPlan[];
  expenses: Expense[];
  equipment: Equipment[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  settings: BusinessSettings;

  // Actions
  registerMember: (data: Omit<Member, 'id' | 'status' | 'lastVisit' | 'outstandingBalance'> & { initialAmountPaid: number; paymentMethod: PaymentMethod }) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  renewMembership: (memberId: string, planId: string, discount: number, amountPaid: number, paymentMethod: PaymentMethod, notes?: string) => void;
  freezeMembership: (memberId: string, startDate: string, endDate: string, reason: string) => void;
  reactivateMembership: (memberId: string) => void;
  suspendMembership: (memberId: string, reason: string) => void;
  
  recordPayment: (data: {
    memberId: string;
    description: string;
    planName: string;
    amountDue: number;
    amountPaid: number;
    paymentMethod: PaymentMethod;
  }) => PaymentTransaction;
  refundPayment: (txnId: string, reason: string) => void;

  checkInMember: (memberId: string, overrideReason?: string) => { success: boolean; message: string; requiresOverride?: boolean };
  checkOutMember: (attendanceId: string) => void;

  createPlan: (plan: Omit<MembershipPlan, 'id'>) => void;
  updatePlan: (id: string, updates: Partial<MembershipPlan>) => void;

  addStaff: (member: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;

  createWorkoutPlan: (plan: Omit<WorkoutPlan, 'id'>) => void;
  updateWorkoutPlan: (id: string, updates: Partial<WorkoutPlan>) => void;

  bookClass: (classId: string, memberId: string) => { success: boolean; message: string };
  cancelClassBooking: (classId: string, memberId: string) => void;

  schedulePTSession: (session: Omit<PTSession, 'id'>) => { success: boolean; message: string };
  updatePTSessionStatus: (id: string, status: PTSessionStatus) => void;

  addLead: (lead: Omit<Lead, 'id' | 'enquiryDate'>) => void;
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
  addLeadNote: (leadId: string, note: string) => void;
  convertLeadToMember: (leadId: string, planId: string, initialAmountPaid: number, paymentMethod: PaymentMethod) => Member;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  logEquipmentMaintenance: (equipmentId: string, log: { technician: string; workDone: string; cost: number; nextDate: string }) => void;
  updateEquipmentCondition: (equipmentId: string, condition: Equipment['condition']) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  resetDemoData: () => void;

  // Filtered lists & Computed KPI stats
  filteredMembers: Member[];
  todayAttendance: AttendanceRecord[];
  activeCheckedInMembers: AttendanceRecord[];
  kpiStats: {
    totalMembers: number;
    activeMembers: number;
    expiringSoonMembers: number;
    expiredMembers: number;
    frozenMembers: number;
    newMembersThisMonth: number;
    todayCheckInsCount: number;
    currentCheckedInCount: number;
    monthRevenue: number;
    monthExpenses: number;
    netOperatingSurplus: number;
    overdueAmount: number;
    activeTrainersCount: number;
    pendingLeadsCount: number;
    unreadNotificationsCount: number;
  };
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Role states
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('owner');
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>('all');
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [currentMemberId, setCurrentMemberId] = useState<string>('MEM001');

  // Interactive Guided Tour
  const [guidedTourStep, setGuidedTourStep] = useState<number>(0);

  // Modals & Drawers
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [receiptModalTxn, setReceiptModalTxn] = useState<PaymentTransaction | null>(null);
  const [selectedMemberProfileId, setSelectedMemberProfileId] = useState<string | null>(null);

  // Entities - Initialize from localStorage if present
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });
  const [classes, setClasses] = useState<FitnessClass[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });
  const [ptSessions, setPtSessions] = useState<PTSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ptSessions`);
    return saved ? JSON.parse(saved) : INITIAL_PT_SESSIONS;
  });
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_workoutPlans`);
    return saved ? JSON.parse(saved) : INITIAL_WORKOUT_PLANS;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_equipment`);
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auditLogs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(plans));
    localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
    localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
    localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
    localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
    localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
    localStorage.setItem(`${STORAGE_KEY}_ptSessions`, JSON.stringify(ptSessions));
    localStorage.setItem(`${STORAGE_KEY}_workoutPlans`, JSON.stringify(workoutPlans));
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${STORAGE_KEY}_equipment`, JSON.stringify(equipment));
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [plans, members, staff, classes, leads, payments, attendance, ptSessions, workoutPlans, expenses, equipment, notifications, auditLogs, settings]);

  // Recalculate member statuses based on dates (relative to current demo date 2026-10-14)
  useEffect(() => {
    const todayStr = '2026-10-14';
    setMembers(prev =>
      prev.map(m => {
        // If Frozen or Suspended, preserve status
        if (m.status === 'Frozen' || m.status === 'Suspended') return m;
        const daysLeft = getDaysRemaining(m.expiryDate, todayStr);
        let newStatus: MembershipStatus = m.status;
        if (daysLeft < 0) {
          newStatus = 'Expired';
        } else if (daysLeft <= (settings.expiryReminderDays || 7)) {
          newStatus = 'Expiring Soon';
        } else {
          newStatus = 'Active';
        }
        if (newStatus !== m.status) {
          return { ...m, status: newStatus };
        }
        return m;
      })
    );
  }, [settings.expiryReminderDays]);

  // Guided Tour Control
  const startGuidedTour = () => {
    setGuidedTourStep(1);
    setActiveModule('overview');
  };
  const dismissGuidedTour = () => setGuidedTourStep(0);
  const nextTourStep = () => {
    const next = guidedTourStep + 1;
    if (next > 8) {
      setGuidedTourStep(0);
    } else {
      setGuidedTourStep(next);
      // Automatically switch to corresponding module for the demo step
      const stepModuleMap: Record<number, string> = {
        1: 'overview',
        2: 'members',
        3: 'attendance',
        4: 'members',
        5: 'billing',
        6: 'workout',
        7: 'leads',
        8: 'reports'
      };
      if (stepModuleMap[next]) {
        setActiveModule(stepModuleMap[next]);
      }
    }
  };
  const prevTourStep = () => {
    if (guidedTourStep > 1) {
      const prev = guidedTourStep - 1;
      setGuidedTourStep(prev);
      const stepModuleMap: Record<number, string> = {
        1: 'overview',
        2: 'members',
        3: 'attendance',
        4: 'members',
        5: 'billing',
        6: 'workout',
        7: 'leads',
        8: 'reports'
      };
      if (stepModuleMap[prev]) {
        setActiveModule(stepModuleMap[prev]);
      }
    }
  };

  // Helper audit logger
  const logAudit = (action: string, module: string, details: string, branchId?: 'b1' | 'b2') => {
    const roleName = currentUserRole === 'owner' ? 'Gym Owner' : currentUserRole === 'receptionist' ? 'Pooja Rao (Manager)' : currentUserRole === 'trainer' ? 'Rajesh Nair (Trainer)' : 'Member';
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: `2026-10-14 ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
      action,
      module,
      performedBy: roleName,
      details,
      branchId
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Actions implementation

  const registerMember = (data: Omit<Member, 'id' | 'status' | 'lastVisit' | 'outstandingBalance'> & { initialAmountPaid: number; paymentMethod: PaymentMethod }): Member => {
    // Generate sequential ID
    const nextNum = members.length + 1;
    const newId = `MEM${String(nextNum).padStart(3, '0')}`;
    const selectedPlan = plans.find(p => p.id === data.planId) || plans[0];

    const totalDue = selectedPlan.price + (selectedPlan.registrationFee || 0);
    const balance = Math.max(0, totalDue - data.initialAmountPaid);

    // Calculate expiry date
    const calculatedExpiry = addMonthsToDate(data.startDate, selectedPlan.durationMonths);
    const daysLeft = getDaysRemaining(calculatedExpiry, '2026-10-14');
    const initialStatus: MembershipStatus = daysLeft < 0 ? 'Expired' : daysLeft <= 7 ? 'Expiring Soon' : 'Active';

    const newMember: Member = {
      ...data,
      id: newId,
      planName: selectedPlan.name,
      expiryDate: calculatedExpiry,
      status: initialStatus,
      outstandingBalance: balance,
      assignedTrainerName: staff.find(s => s.id === data.assignedTrainerId)?.fullName
    };

    setMembers(prev => [newMember, ...prev]);

    // Record initial transaction
    if (data.initialAmountPaid > 0 || totalDue > 0) {
      const receiptNo = `${settings.receiptPrefix}${Math.floor(1000 + Math.random() * 9000)}`;
      const txn: PaymentTransaction = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        memberId: newId,
        memberName: newMember.fullName,
        date: '2026-10-14',
        description: `New Registration — ${selectedPlan.name}`,
        planName: selectedPlan.name,
        amountDue: totalDue,
        amountPaid: data.initialAmountPaid,
        paymentMethod: data.paymentMethod,
        status: data.initialAmountPaid >= totalDue ? 'Paid' : data.initialAmountPaid > 0 ? 'Partially Paid' : 'Pending',
        recordedBy: currentUserRole === 'owner' ? 'Admin' : 'Pooja Rao',
        branchId: newMember.branchId,
        receiptNumber: receiptNo
      };
      setPayments(prev => [txn, ...prev]);
    }

    logAudit('Member Registered', 'Members', `Registered ${newMember.fullName} (${newId}) under plan ${selectedPlan.name}`, newMember.branchId);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'Booking Confirmation',
        title: 'New Member Registered',
        message: `${newMember.fullName} joined under ${selectedPlan.name} at ${newMember.branchId === 'b1' ? 'Main Branch' : 'Branch 2'}.`,
        date: '2026-10-14',
        time: '12:00 PM',
        isRead: false,
        linkModule: 'members',
        entityId: newId
      },
      ...prev
    ]);

    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          if (updates.assignedTrainerId) {
            updated.assignedTrainerName = staff.find(s => s.id === updates.assignedTrainerId)?.fullName;
          }
          return updated;
        }
        return m;
      })
    );
    logAudit('Member Updated', 'Members', `Updated profile of member ${id}`);
  };

  const renewMembership = (
    memberId: string,
    planId: string,
    discount: number,
    amountPaid: number,
    paymentMethod: PaymentMethod,
    notes?: string
  ) => {
    const member = members.find(m => m.id === memberId);
    const plan = plans.find(p => p.id === planId);
    if (!member || !plan) return;

    // Date logic: if current membership is not expired, start renewal from expiryDate; else start today
    const isCurrentlyExpired = getDaysRemaining(member.expiryDate, '2026-10-14') < 0;
    const renewalStartDate = isCurrentlyExpired ? '2026-10-14' : member.expiryDate;
    const newExpiryDate = addMonthsToDate(renewalStartDate, plan.durationMonths);

    const priceAfterDiscount = Math.max(0, plan.price - (discount || 0));
    const newBalance = Math.max(0, member.outstandingBalance + (priceAfterDiscount - amountPaid));

    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            planId: plan.id,
            planName: plan.name,
            startDate: renewalStartDate,
            expiryDate: newExpiryDate,
            status: 'Active',
            outstandingBalance: newBalance
          };
        }
        return m;
      })
    );

    // Record payment transaction
    const receiptNo = `${settings.receiptPrefix}${Math.floor(1000 + Math.random() * 9000)}`;
    const txn: PaymentTransaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      memberId: member.id,
      memberName: member.fullName,
      date: '2026-10-14',
      description: `Membership Renewal — ${plan.name}`,
      planName: plan.name,
      amountDue: priceAfterDiscount,
      amountPaid: amountPaid,
      paymentMethod: paymentMethod,
      status: amountPaid >= priceAfterDiscount ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Pending',
      recordedBy: currentUserRole === 'owner' ? 'Admin' : 'Pooja Rao',
      branchId: member.branchId,
      receiptNumber: receiptNo
    };
    setPayments(prev => [txn, ...prev]);

    logAudit(
      'Membership Renewed',
      'Members',
      `Renewed ${member.fullName} (${member.id}) under ${plan.name} until ${newExpiryDate}. Amount Paid: ₹${amountPaid}`,
      member.branchId
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'Membership Renewal Completed',
        title: 'Membership Renewed Successfully',
        message: `${member.fullName} renewed their ${plan.name} until ${newExpiryDate}.`,
        date: '2026-10-14',
        time: '12:00 PM',
        isRead: false,
        linkModule: 'members',
        entityId: member.id
      },
      ...prev
    ]);
  };

  const freezeMembership = (memberId: string, startDate: string, endDate: string, reason: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    // Calculate duration of freeze in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const freezeDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    // Policy: Expiry date is extended by the number of frozen days
    const adjustedExpiryDate = addDaysToDate(member.expiryDate, freezeDays);

    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            status: 'Frozen',
            freezeStartDate: startDate,
            freezeEndDate: endDate,
            freezeReason: reason,
            expiryDate: adjustedExpiryDate
          };
        }
        return m;
      })
    );

    logAudit(
      'Membership Frozen',
      'Members',
      `Froze membership for ${member.fullName} from ${startDate} to ${endDate} (${freezeDays} days). Expiry extended to ${adjustedExpiryDate}. Reason: ${reason}`,
      member.branchId
    );
  };

  const reactivateMembership = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const daysLeft = getDaysRemaining(member.expiryDate, '2026-10-14');
    const newStatus: MembershipStatus = daysLeft < 0 ? 'Expired' : daysLeft <= 7 ? 'Expiring Soon' : 'Active';

    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            status: newStatus,
            freezeStartDate: undefined,
            freezeEndDate: undefined,
            freezeReason: undefined
          };
        }
        return m;
      })
    );

    logAudit('Membership Reactivated', 'Members', `Reactivated membership for ${member.fullName} (${member.id})`, member.branchId);
  };

  const suspendMembership = (memberId: string, reason: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            status: 'Suspended',
            generalNotes: `[Suspended on 2026-10-14: ${reason}] ${m.generalNotes || ''}`
          };
        }
        return m;
      })
    );

    logAudit('Membership Suspended', 'Members', `Suspended membership for ${member.fullName} (${member.id}). Reason: ${reason}`, member.branchId);
  };

  const recordPayment = (data: {
    memberId: string;
    description: string;
    planName: string;
    amountDue: number;
    amountPaid: number;
    paymentMethod: PaymentMethod;
  }): PaymentTransaction => {
    const member = members.find(m => m.id === data.memberId);
    const branchId = member?.branchId || 'b1';
    const receiptNo = `${settings.receiptPrefix}${Math.floor(1000 + Math.random() * 9000)}`;

    const txn: PaymentTransaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      memberId: data.memberId,
      memberName: member?.fullName || 'Walk-In Customer',
      date: '2026-10-14',
      description: data.description,
      planName: data.planName,
      amountDue: data.amountDue,
      amountPaid: data.amountPaid,
      paymentMethod: data.paymentMethod,
      status: data.amountPaid >= data.amountDue ? 'Paid' : data.amountPaid > 0 ? 'Partially Paid' : 'Pending',
      recordedBy: currentUserRole === 'owner' ? 'Admin' : 'Pooja Rao',
      branchId,
      receiptNumber: receiptNo
    };

    setPayments(prev => [txn, ...prev]);

    // Update member balance
    if (member) {
      const remainingBalance = Math.max(0, member.outstandingBalance - data.amountPaid);
      setMembers(prev =>
        prev.map(m => (m.id === member.id ? { ...m, outstandingBalance: remainingBalance } : m))
      );
    }

    logAudit('Payment Recorded', 'Billing', `Recorded payment of ₹${data.amountPaid} via ${data.paymentMethod} for ${member?.fullName} (Receipt: ${receiptNo})`, branchId);

    return txn;
  };

  const refundPayment = (txnId: string, reason: string) => {
    const txn = payments.find(p => p.id === txnId);
    if (!txn || txn.status === 'Refunded') return;

    setPayments(prev =>
      prev.map(p => {
        if (p.id === txnId) {
          return {
            ...p,
            status: 'Refunded',
            refundedAmount: p.amountPaid,
            refundReason: reason,
            refundDate: '2026-10-14'
          };
        }
        return p;
      })
    );

    // Reinstate member balance
    setMembers(prev =>
      prev.map(m => (m.id === txn.memberId ? { ...m, outstandingBalance: m.outstandingBalance + txn.amountPaid } : m))
    );

    logAudit('Payment Refunded', 'Billing', `Simulated refund of ₹${txn.amountPaid} for transaction ${txn.id} (${txn.memberName}). Reason: ${reason}`, txn.branchId);
  };

  const checkInMember = (memberId: string, overrideReason?: string): { success: boolean; message: string; requiresOverride?: boolean } => {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      return { success: false, message: 'Member not found.' };
    }

    const todayStr = '2026-10-14';

    // Duplicate check-in rule: check if already checked in today without checking out
    const activeVisit = attendance.find(
      a => a.memberId === memberId && a.checkInTime.startsWith(todayStr) && !a.checkOutTime
    );

    if (activeVisit && settings.preventDuplicateCheckin) {
      return {
        success: false,
        message: `${member.fullName} is already checked in since ${activeVisit.checkInTime.split(' ')[1]}. Check out first to re-enter.`
      };
    }

    // Invalid membership status rules
    const isInvalid = member.status === 'Expired' || member.status === 'Frozen' || member.status === 'Suspended' || member.status === 'Inactive';

    if (isInvalid && !overrideReason) {
      return {
        success: false,
        requiresOverride: true,
        message: `Check-in blocked! Membership status is ${member.status}. Authorized staff override with reason required.`
      };
    }

    const currentTime = '10:45';
    const nowTimeStr = `${todayStr} ${currentTime}`;

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now().toString().slice(-6)}`,
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.phone,
      planName: member.planName,
      checkInTime: nowTimeStr,
      branchId: member.branchId,
      statusAtCheckIn: member.status,
      wasOverridden: Boolean(overrideReason),
      overrideReason: overrideReason || undefined,
      recordedBy: currentUserRole === 'owner' ? 'Admin' : 'Pooja Rao'
    };

    setAttendance(prev => [newRecord, ...prev]);

    // Update member's lastVisit
    setMembers(prev =>
      prev.map(m => (m.id === memberId ? { ...m, lastVisit: nowTimeStr } : m))
    );

    const auditDetail = overrideReason
      ? `Manual Override Check-In for ${member.fullName} (${member.id}, Status: ${member.status}). Reason: ${overrideReason}`
      : `Checked in ${member.fullName} (${member.id}) at ${member.branchId === 'b1' ? 'Main Branch' : 'Branch 2'}`;

    logAudit('Member Check-In', 'Attendance', auditDetail, member.branchId);

    return {
      success: true,
      message: `Checked in ${member.fullName} successfully! Welcome to CoreFit.`
    };
  };

  const checkOutMember = (attendanceId: string) => {
    const todayStr = '2026-10-14';
    const currentTime = '12:15';
    const checkOutStr = `${todayStr} ${currentTime}`;

    setAttendance(prev =>
      prev.map(a => {
        if (a.id === attendanceId) {
          // Calculate duration in minutes if possible
          const [inHour, inMin] = a.checkInTime.split(' ')[1].split(':').map(Number);
          const [outHour, outMin] = currentTime.split(':').map(Number);
          const duration = Math.max(15, (outHour * 60 + outMin) - (inHour * 60 + inMin));
          return {
            ...a,
            checkOutTime: checkOutStr,
            durationMinutes: duration
          };
        }
        return a;
      })
    );

    logAudit('Member Check-Out', 'Attendance', `Recorded check-out for attendance record ${attendanceId}`);
  };

  const createPlan = (planData: Omit<MembershipPlan, 'id'>) => {
    const newId = `plan-${Date.now().toString().slice(-5)}`;
    const newPlan: MembershipPlan = { ...planData, id: newId };
    setPlans(prev => [...prev, newPlan]);
    logAudit('Plan Created', 'Membership Plans', `Created membership plan ${newPlan.name} (₹${newPlan.price})`);
  };

  const updatePlan = (id: string, updates: Partial<MembershipPlan>) => {
    setPlans(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    logAudit('Plan Updated', 'Membership Plans', `Updated plan ${id}`);
  };

  const addStaff = (staffData: Omit<StaffMember, 'id'>) => {
    const newId = `st-${Date.now().toString().slice(-4)}`;
    const newStaff: StaffMember = { ...staffData, id: newId };
    setStaff(prev => [...prev, newStaff]);
    logAudit('Staff Added', 'Staff', `Added staff member ${newStaff.fullName} as ${newStaff.role}`, newStaff.assignedBranchId);
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logAudit('Staff Updated', 'Staff', `Updated staff record for ${id}`);
  };

  const createWorkoutPlan = (planData: Omit<WorkoutPlan, 'id'>) => {
    const newId = `WP-${Date.now().toString().slice(-5)}`;
    const newPlan: WorkoutPlan = { ...planData, id: newId };
    setWorkoutPlans(prev => [newPlan, ...prev]);
    logAudit('Workout Plan Created', 'Workouts', `Created workout plan "${newPlan.planName}" for ${newPlan.memberName}`);
  };

  const updateWorkoutPlan = (id: string, updates: Partial<WorkoutPlan>) => {
    setWorkoutPlans(prev => prev.map(wp => (wp.id === id ? { ...wp, ...updates } : wp)));
    logAudit('Workout Plan Updated', 'Workouts', `Updated workout plan ${id}`);
  };

  const bookClass = (classId: string, memberId: string): { success: boolean; message: string } => {
    const cls = classes.find(c => c.id === classId);
    const member = members.find(m => m.id === memberId);

    if (!cls || !member) return { success: false, message: 'Class or Member not found.' };

    if (cls.bookedMemberIds.includes(memberId)) {
      return { success: false, message: `${member.fullName} is already booked for this class!` };
    }

    if (cls.bookedMemberIds.length >= cls.capacity) {
      return { success: false, message: `Class is at full capacity (${cls.capacity}/${cls.capacity}). Waitlist available.` };
    }

    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, bookedMemberIds: [...c.bookedMemberIds, memberId] } : c))
    );

    logAudit('Class Booking', 'Classes', `Booked ${member.fullName} for ${cls.name} (${cls.startTime})`, cls.branchId);

    return { success: true, message: `Successfully booked ${member.fullName} for ${cls.name}!` };
  };

  const cancelClassBooking = (classId: string, memberId: string) => {
    const cls = classes.find(c => c.id === classId);
    const member = members.find(m => m.id === memberId);
    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, bookedMemberIds: c.bookedMemberIds.filter(id => id !== memberId) } : c))
    );
    logAudit('Class Booking Cancelled', 'Classes', `Cancelled booking of ${member?.fullName} for ${cls?.name}`);
  };

  const schedulePTSession = (sessionData: Omit<PTSession, 'id'>): { success: boolean; message: string } => {
    // Check trainer conflict
    const conflict = ptSessions.find(
      s =>
        s.trainerId === sessionData.trainerId &&
        s.sessionDate === sessionData.sessionDate &&
        s.startTime === sessionData.startTime &&
        s.status === 'Scheduled'
    );

    if (conflict) {
      return {
        success: false,
        message: `Trainer ${sessionData.trainerName} is already booked on ${sessionData.sessionDate} at ${sessionData.startTime}!`
      };
    }

    const newId = `PT-${Date.now().toString().slice(-4)}`;
    const newSession: PTSession = { ...sessionData, id: newId };
    setPtSessions(prev => [newSession, ...prev]);

    logAudit('PT Session Scheduled', 'Personal Training', `Scheduled PT session with ${newSession.trainerName} for ${newSession.memberName} on ${newSession.sessionDate}`, newSession.branchId);

    return { success: true, message: `Personal training session booked successfully!` };
  };

  const updatePTSessionStatus = (id: string, status: PTSessionStatus) => {
    setPtSessions(prev =>
      prev.map(s => {
        if (s.id === id) {
          // If moving to Completed, increment packageUsedSessions if not already counted
          let used = s.packageUsedSessions;
          if (status === 'Completed' && s.status !== 'Completed') {
            used = Math.min(s.packageTotalSessions, used + 1);
          } else if (s.status === 'Completed' && status !== 'Completed') {
            used = Math.max(0, used - 1);
          }
          return { ...s, status, packageUsedSessions: used };
        }
        return s;
      })
    );
    logAudit('PT Session Status Changed', 'Personal Training', `Updated session ${id} status to ${status}`);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'enquiryDate'>) => {
    const newId = `LD-${Math.floor(100 + Math.random() * 900)}`;
    const newLead: Lead = {
      ...leadData,
      id: newId,
      enquiryDate: '2026-10-14'
    };
    setLeads(prev => [newLead, ...prev]);
    logAudit('Lead Created', 'Leads CRM', `Added prospective lead ${newLead.fullName} (${newLead.leadSource})`, newLead.branchId);
  };

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, stage } : l)));
    logAudit('Lead Stage Updated', 'Leads CRM', `Moved lead ${leadId} to ${stage}`);
  };

  const addLeadNote = (leadId: string, note: string) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, notes: [`[2026-10-14] ${note}`, ...l.notes] } : l))
    );
  };

  const convertLeadToMember = (
    leadId: string,
    planId: string,
    initialAmountPaid: number,
    paymentMethod: PaymentMethod
  ): Member => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const createdMember = registerMember({
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email || `${lead.fullName.toLowerCase().replace(/\s+/g, '.')}@example.in`,
      registrationDate: '2026-10-14',
      branchId: lead.branchId,
      planId,
      planName: plans.find(p => p.id === planId)?.name || 'Monthly Membership',
      startDate: '2026-10-14',
      expiryDate: addMonthsToDate('2026-10-14', 1),
      initialAmountPaid,
      paymentMethod,
      leadId: lead.id,
      referralSource: lead.leadSource
    });

    // Mark lead converted
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, stage: 'Converted', convertedMemberId: createdMember.id } : l))
    );

    logAudit('Lead Converted to Member', 'Leads CRM', `Successfully converted lead ${lead.fullName} to member ${createdMember.id}`, lead.branchId);

    return createdMember;
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newId = `EXP-${Math.floor(500 + Math.random() * 500)}`;
    const newExpense: Expense = { ...expenseData, id: newId };
    setExpenses(prev => [newExpense, ...prev]);
    logAudit('Expense Recorded', 'Expenses', `Recorded expense of ₹${newExpense.amount} for ${newExpense.category} (${newExpense.vendor})`, newExpense.branchId);
  };

  const deleteExpense = (id: string) => {
    const exp = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAudit('Expense Deleted', 'Expenses', `Deleted expense ${id} (₹${exp?.amount} - ${exp?.category})`);
  };

  const logEquipmentMaintenance = (equipmentId: string, log: { technician: string; workDone: string; cost: number; nextDate: string }) => {
    const newLogId = `ml-${Date.now().toString().slice(-4)}`;
    setEquipment(prev =>
      prev.map(eq => {
        if (eq.id === equipmentId) {
          return {
            ...eq,
            condition: 'Good',
            lastMaintenanceDate: '2026-10-14',
            nextMaintenanceDate: log.nextDate,
            maintenanceLogs: [
              {
                id: newLogId,
                date: '2026-10-14',
                technician: log.technician,
                workDone: log.workDone,
                cost: log.cost
              },
              ...eq.maintenanceLogs
            ]
          };
        }
        return eq;
      })
    );

    // If there was a maintenance cost, log an expense
    if (log.cost > 0) {
      addExpense({
        date: '2026-10-14',
        category: 'Maintenance',
        description: `Maintenance servicing for ${equipment.find(e => e.id === equipmentId)?.name}`,
        amount: log.cost,
        paymentMethod: 'UPI',
        vendor: log.technician,
        branchId: equipment.find(e => e.id === equipmentId)?.branchId || 'b1',
        recordedBy: currentUserRole === 'owner' ? 'Admin' : 'Pooja Rao'
      });
    }

    logAudit('Equipment Maintenance Logged', 'Equipment', `Recorded maintenance for ${equipmentId} by ${log.technician}`);
  };

  const updateEquipmentCondition = (equipmentId: string, condition: Equipment['condition']) => {
    setEquipment(prev => prev.map(eq => (eq.id === equipmentId ? { ...eq, condition } : eq)));
    logAudit('Equipment Condition Updated', 'Equipment', `Updated condition of ${equipmentId} to ${condition}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAudit('Settings Updated', 'Settings', 'Updated business and operational settings');
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_plans`);
    localStorage.removeItem(`${STORAGE_KEY}_members`);
    localStorage.removeItem(`${STORAGE_KEY}_staff`);
    localStorage.removeItem(`${STORAGE_KEY}_classes`);
    localStorage.removeItem(`${STORAGE_KEY}_leads`);
    localStorage.removeItem(`${STORAGE_KEY}_payments`);
    localStorage.removeItem(`${STORAGE_KEY}_attendance`);
    localStorage.removeItem(`${STORAGE_KEY}_ptSessions`);
    localStorage.removeItem(`${STORAGE_KEY}_workoutPlans`);
    localStorage.removeItem(`${STORAGE_KEY}_expenses`);
    localStorage.removeItem(`${STORAGE_KEY}_equipment`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${STORAGE_KEY}_auditLogs`);
    localStorage.removeItem(`${STORAGE_KEY}_settings`);

    setPlans(INITIAL_PLANS);
    setMembers(INITIAL_MEMBERS);
    setStaff(INITIAL_STAFF);
    setClasses(INITIAL_CLASSES);
    setLeads(INITIAL_LEADS);
    setPayments(INITIAL_PAYMENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setPtSessions(INITIAL_PT_SESSIONS);
    setWorkoutPlans(INITIAL_WORKOUT_PLANS);
    setExpenses(INITIAL_EXPENSES);
    setEquipment(INITIAL_EQUIPMENT);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_SETTINGS);
    setSelectedBranchId('all');
    setActiveModule('overview');
    setGuidedTourStep(0);
  };

  // Filtered lists & Computed KPI stats
  const filteredMembers = useMemo(() => {
    if (selectedBranchId === 'all') return members;
    return members.filter(m => m.branchId === selectedBranchId);
  }, [members, selectedBranchId]);

  const todayAttendance = useMemo(() => {
    const today = '2026-10-14';
    return attendance.filter(a => {
      const isToday = a.checkInTime.startsWith(today);
      if (selectedBranchId === 'all') return isToday;
      return isToday && a.branchId === selectedBranchId;
    });
  }, [attendance, selectedBranchId]);

  const activeCheckedInMembers = useMemo(() => {
    return todayAttendance.filter(a => !a.checkOutTime);
  }, [todayAttendance]);

  const kpiStats = useMemo(() => {
    const branchMembers = selectedBranchId === 'all' ? members : members.filter(m => m.branchId === selectedBranchId);
    const branchPayments = selectedBranchId === 'all' ? payments : payments.filter(p => p.branchId === selectedBranchId);
    const branchExpenses = selectedBranchId === 'all' ? expenses : expenses.filter(e => e.branchId === selectedBranchId);

    // Active members
    const active = branchMembers.filter(m => m.status === 'Active').length;
    const expiringSoon = branchMembers.filter(m => m.status === 'Expiring Soon').length;
    const expired = branchMembers.filter(m => m.status === 'Expired').length;
    const frozen = branchMembers.filter(m => m.status === 'Frozen').length;

    // New this month (2026-10)
    const newThisMonth = branchMembers.filter(m => m.registrationDate.startsWith('2026-10')).length;

    // Financials for current month (2026-10)
    // Revenue collected = total amountPaid minus refundedAmount on paid transactions
    const monthPayments = branchPayments.filter(p => p.date.startsWith('2026-10'));
    const monthRevenue = monthPayments.reduce((acc, p) => {
      const netPaid = p.amountPaid - (p.refundedAmount || 0);
      return acc + (netPaid > 0 ? netPaid : 0);
    }, 0);

    const currentMonthExpenses = branchExpenses.filter(e => e.date.startsWith('2026-10')).reduce((acc, e) => acc + e.amount, 0);

    const netOperatingSurplus = monthRevenue - currentMonthExpenses;

    const overdueAmount = branchMembers.reduce((acc, m) => acc + (m.outstandingBalance || 0), 0);

    const activeTrainers = staff.filter(s => s.role === 'Personal Trainer' || s.role === 'Group Fitness Instructor').length;
    const pendingLeads = leads.filter(l => l.stage !== 'Converted' && l.stage !== 'Lost').length;
    const unreadNotifications = notifications.filter(n => !n.isRead).length;

    return {
      totalMembers: branchMembers.length,
      activeMembers: active,
      expiringSoonMembers: expiringSoon,
      expiredMembers: expired,
      frozenMembers: frozen,
      newMembersThisMonth: newThisMonth,
      todayCheckInsCount: todayAttendance.length,
      currentCheckedInCount: activeCheckedInMembers.length,
      monthRevenue,
      monthExpenses: currentMonthExpenses,
      netOperatingSurplus,
      overdueAmount,
      activeTrainersCount: activeTrainers,
      pendingLeadsCount: pendingLeads,
      unreadNotificationsCount: unreadNotifications
    };
  }, [members, payments, expenses, staff, leads, notifications, todayAttendance, activeCheckedInMembers, selectedBranchId]);

  return (
    <GymContext.Provider
      value={{
        currentUserRole,
        setCurrentUserRole,
        selectedBranchId,
        setSelectedBranchId,
        activeModule,
        setActiveModule,
        currentMemberId,
        setCurrentMemberId,
        guidedTourStep,
        setGuidedTourStep,
        startGuidedTour,
        dismissGuidedTour,
        nextTourStep,
        prevTourStep,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        receiptModalTxn,
        setReceiptModalTxn,
        selectedMemberProfileId,
        setSelectedMemberProfileId,
        branches,
        plans,
        members,
        staff,
        classes,
        leads,
        payments,
        attendance,
        ptSessions,
        workoutPlans,
        expenses,
        equipment,
        notifications,
        auditLogs,
        settings,
        registerMember,
        updateMember,
        renewMembership,
        freezeMembership,
        reactivateMembership,
        suspendMembership,
        recordPayment,
        refundPayment,
        checkInMember,
        checkOutMember,
        createPlan,
        updatePlan,
        addStaff,
        updateStaff,
        createWorkoutPlan,
        updateWorkoutPlan,
        bookClass,
        cancelClassBooking,
        schedulePTSession,
        updatePTSessionStatus,
        addLead,
        updateLeadStage,
        addLeadNote,
        convertLeadToMember,
        addExpense,
        deleteExpense,
        logEquipmentMaintenance,
        updateEquipmentCondition,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        resetDemoData,
        filteredMembers,
        todayAttendance,
        activeCheckedInMembers,
        kpiStats
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
