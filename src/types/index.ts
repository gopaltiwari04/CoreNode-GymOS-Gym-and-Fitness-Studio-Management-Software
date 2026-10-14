export type UserRole = 'owner' | 'receptionist' | 'trainer' | 'member';

export type BranchId = 'b1' | 'b2' | 'all';

export interface Branch {
  id: 'b1' | 'b2';
  name: string;
  address: string;
  phone: string;
  isMain: boolean;
}

export type MembershipStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Frozen' | 'Suspended' | 'Inactive';

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  registrationFee: number;
  description: string;
  features: string[];
  maxVisits?: number; // undefined = unlimited
  classAccess: boolean;
  ptAllowance: number; // sessions included
  freezeEligibilityDays: number;
  isActive: boolean;
  colorTag?: string;
}

export interface Member {
  id: string; // e.g. MEM001
  fullName: string;
  phone: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  registrationDate: string; // YYYY-MM-DD
  branchId: 'b1' | 'b2';
  avatarUrl?: string;

  // Membership Details
  planId: string;
  planName: string;
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: MembershipStatus;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  outstandingBalance: number;
  lastVisit?: string; // ISO string or YYYY-MM-DD HH:mm

  // Freeze info if frozen
  freezeStartDate?: string;
  freezeEndDate?: string;
  freezeReason?: string;

  // Notes & Medical
  medicalNotes?: string;
  generalNotes?: string;
  referralSource?: string;
  leadId?: string; // if converted from lead
}

export interface RenewalRecord {
  id: string;
  memberId: string;
  memberName: string;
  previousPlanId: string;
  newPlanId: string;
  newPlanName: string;
  renewalDate: string; // YYYY-MM-DD
  newStartDate: string;
  newExpiryDate: string;
  amountCharged: number;
  discount: number;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  recordedBy: string;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Debit Card' | 'Credit Card' | 'Bank Transfer' | 'Other';
export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue' | 'Refunded';

export interface PaymentTransaction {
  id: string; // TXN-xxxx
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  time?: string;
  description: string;
  planName: string;
  amountDue: number;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  recordedBy: string;
  branchId: 'b1' | 'b2';
  receiptNumber: string;
  refundedAmount?: number;
  refundReason?: string;
  refundDate?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  planName: string;
  checkInTime: string; // ISO or YYYY-MM-DD HH:mm
  checkOutTime?: string;
  durationMinutes?: number;
  branchId: 'b1' | 'b2';
  statusAtCheckIn: MembershipStatus;
  wasOverridden?: boolean;
  overrideReason?: string;
  recordedBy: string;
}

export type StaffRole = 'Gym Manager' | 'Receptionist' | 'Personal Trainer' | 'Group Fitness Instructor' | 'Housekeeping' | 'Other';
export type TrainerSpecialization =
  | 'Strength Training'
  | 'Weight Loss'
  | 'Muscle Building'
  | 'Functional Training'
  | 'Yoga'
  | 'Cardio'
  | 'Mobility'
  | 'General Fitness';

export interface StaffMember {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: StaffRole;
  specializations: TrainerSpecialization[];
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
  joiningDate: string;
  assignedBranchId: 'b1' | 'b2';
  workingHours: string;
  monthlySalary?: number; // restricted from trainer/receptionist roles
  status: 'Active' | 'On Leave' | 'Inactive';
  avatarUrl?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g. "10-12"
  weightKg?: string; // e.g. "45 kg" or "Bodyweight"
  restSeconds?: number;
  notes?: string;
}

export interface WorkoutDay {
  dayName: string; // e.g. "Day 1 - Chest & Triceps"
  exercises: ExerciseItem[];
}

export interface WorkoutPlan {
  id: string;
  planName: string;
  memberId: string;
  memberName: string;
  assignedTrainerId: string;
  assignedTrainerName: string;
  startDate: string;
  endDate: string;
  fitnessGoal: 'General Fitness' | 'Strength' | 'Muscle Building' | 'Weight Management' | 'Endurance' | 'Mobility';
  trainingLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  weeklyFrequency: number;
  instructions: string;
  status: 'Active' | 'Completed' | 'Draft';
  schedule: WorkoutDay[];
}

export interface FitnessClass {
  id: string;
  name: string;
  category: 'Yoga' | 'Zumba' | 'HIIT' | 'Spin Cycling' | 'Strength Circuit' | 'Functional Fitness' | 'Pilates';
  instructorId: string;
  instructorName: string;
  branchId: 'b1' | 'b2';
  dayOfWeek: string; // Monday, Tuesday...
  startTime: string; // e.g. "07:00 AM"
  endTime: string; // e.g. "08:00 AM"
  capacity: number;
  studioRoom: string;
  eligiblePlans: string[]; // plan names or 'All'
  status: 'Active' | 'Cancelled' | 'Completed';
  bookedMemberIds: string[]; // member IDs booked
}

export type PTSessionStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';

export interface PTSession {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  packageTotalSessions: number;
  packageUsedSessions: number;
  pricePerSession: number;
  paymentStatus: 'Paid' | 'Pending';
  status: PTSessionStatus;
  branchId: 'b1' | 'b2';
  notes?: string;
}

export type LeadSource = 'Walk-In' | 'Website' | 'Phone Call' | 'WhatsApp' | 'Instagram' | 'Facebook' | 'Referral' | 'Advertisement' | 'Other';
export type LeadStage = 'New' | 'Contacted' | 'Trial Scheduled' | 'Trial Completed' | 'Interested' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  interestedPlanId?: string;
  interestedPlanName?: string;
  leadSource: LeadSource;
  assignedStaffId?: string;
  assignedStaffName?: string;
  enquiryDate: string;
  followUpDate: string;
  stage: LeadStage;
  notes: string[];
  branchId: 'b1' | 'b2';
  convertedMemberId?: string;
}

export type ExpenseCategory =
  | 'Rent'
  | 'Electricity'
  | 'Water'
  | 'Equipment'
  | 'Maintenance'
  | 'Staff Salaries'
  | 'Marketing'
  | 'Software Subscriptions'
  | 'Cleaning Supplies'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  vendor: string;
  branchId: 'b1' | 'b2';
  recordedBy: string;
}

export type EquipmentCategory = 'Cardio' | 'Strength' | 'Free Weights' | 'Functional Training' | 'Yoga and Mobility' | 'Other';
export type EquipmentCondition = 'Good' | 'Needs Attention' | 'Under Maintenance' | 'Out of Service';

export interface MaintenanceLog {
  id: string;
  date: string;
  technician: string;
  workDone: string;
  cost: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  brandModel: string;
  purchaseDate: string;
  purchaseCost: number;
  branchId: 'b1' | 'b2';
  condition: EquipmentCondition;
  maintenanceFrequencyDays: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  assignedVendor?: string;
  notes?: string;
  maintenanceLogs: MaintenanceLog[];
}

export type NotificationType =
  | 'Membership Expiring Soon'
  | 'Membership Expired'
  | 'Payment Due'
  | 'Payment Overdue'
  | 'New Lead'
  | 'Follow-Up Due'
  | 'Upcoming Class'
  | 'Personal Training Session'
  | 'Equipment Maintenance Due'
  | 'Booking Confirmation'
  | 'Membership Renewal Completed';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  time: string;
  isRead: boolean;
  linkModule?: string;
  entityId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  performedBy: string;
  details: string;
  branchId?: 'b1' | 'b2';
}

export interface BusinessSettings {
  gymName: string;
  tagline: string;
  businessAddress: string;
  phone: string;
  email: string;
  gstin: string;
  businessType: string;
  timezone: string;
  currency: string;
  invoicePrefix: string;
  receiptPrefix: string;
  expiryReminderDays: number;
  freezePolicyDaysMax: number;
  gracePeriodDays: number;
  allowManualCheckinOverride: boolean;
  preventDuplicateCheckin: boolean;
}
