import { ApiError } from "../hooks/types";

export type MealPlan = {
  _id: string;
  day: string; // YYYY-MM-DD
  estimatedCost: number;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAllMealPlansPaginated = {
  count: number;
  data: MealPlan[];
};

export type CreateMealPlan = {
  day: string;
  estimatedCost: number;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
};

export type TUseCreateMealPlan = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};
