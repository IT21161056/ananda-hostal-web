export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  course: string;
  year: number;
  hostel: string;
  room: string;
  admissionDate: string;
  monthlyFee: number;
  status: "active" | "inactive";
  bloodGroup?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  profileImage?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "leave";
  notes?: string;
  markedBy: string;
  markedAt: string;
}

export interface MealPlan {
  id: string;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  estimatedCost: number;
  servingSize: number;
  ingredients: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "vegetables" | "grains" | "dairy" | "spices" | "other";
  currentStock: number;
  unit: string;
  minimumStock: number;
  costPerUnit: number;
  lastUpdated: string;
}

export interface ProcurementList {
  id: string;
  date: string;
  items: {
    itemId: string;
    itemName: string;
    requiredQuantity: number;
    unit: string;
    estimatedCost: number;
  }[];
  totalCost: number;
  status: "pending" | "approved" | "purchased";
  createdBy: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
  type: "monthly_fee" | "mess_fee" | "security_deposit" | "other";
  description: string;
  receiptNumber?: string;
  paymentMethod?: "cash" | "card" | "upi" | "bank_transfer";
  processedBy?: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: {
    description: string;
    amount: number;
  }[];
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  pendingPayments: number;
  monthlyRevenue: number;
  hostelOccupancy: Record<string, number>;
  attendanceRate: number;
  overduePayments: number;
  totalRevenue: number;
  monthlyExpenses: number;
}

export interface AttendanceReport {
  studentId: string;
  studentName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
}

export interface FinancialReport {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  monthlyBreakdown: {
    month: string;
    collected: number;
    pending: number;
  }[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  phone: string;
  role: "admin" | "warden" | "accountant" | "kitchen";
  createdAt: string;
  updatedAt: string;
  // accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
