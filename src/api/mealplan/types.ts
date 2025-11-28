import { ApiError } from "../hooks/types";
import { InventoryItem } from "../inventory/types";

export type MealPlanInventoryItem = {
  inventoryItemId: string | InventoryItem;
  quantity: number;
  forStudents?: number; // Number of students this quantity is for (default: 10)
};

export type MealPlan = {
  _id: string;
  day: string; // Monday, Tuesday, etc.
  estimatedCost: number;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  breakfastInventory?: MealPlanInventoryItem[];
  lunchInventory?: MealPlanInventoryItem[];
  dinnerInventory?: MealPlanInventoryItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAllMealPlansPaginated = {
  total: number;
  data: MealPlan[];
};

export type CreateMealPlan = {
  day: string;
  estimatedCost: number;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  breakfastInventory?: MealPlanInventoryItem[];
  lunchInventory?: MealPlanInventoryItem[];
  dinnerInventory?: MealPlanInventoryItem[];
};

export type TUseCreateMealPlan = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};
