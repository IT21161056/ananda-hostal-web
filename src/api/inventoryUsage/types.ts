import { ApiError } from "../hooks/types";
import { InventoryItem } from "../inventory/types";

export type InventoryUsageItem = {
  inventoryItemId: string;
  recordedQuantity: number;
  recordedForStudents: 1 | 10;
  actualQuantityDeducted?: number;
};

export type InventoryUsage = {
  _id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  items: (InventoryUsageItem & {
    inventoryItemId: InventoryItem | string;
  })[];
  attendanceCount: number;
  attendanceSessionId?: string;
  recordedBy: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateInventoryUsage = {
  date: string; // YYYY-MM-DD format
  mealType: "breakfast" | "lunch" | "dinner";
  items: InventoryUsageItem[];
  notes?: string;
};

export type GetInventoryUsagePaginated = {
  total: number;
  page: number;
  pages: number;
  data: InventoryUsage[];
};

export type AttendanceInfo = {
  attendanceCount: number | null;
  attendanceDate: string;
  sessionType: "morning" | "evening";
  sessionId?: string;
  message?: string;
};

export type TUseCreateInventoryUsage = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};
