import { ApiError } from "../hooks/types";

export type InventoryItem = {
  _id: string;
  name: string;
  category: "vegetables" | "grains" | "dairy" | "spices" | "other";
  currentStock: number;
  unit: string;
  minimumStock: number;
  costPerUnit: number;
  lastUpdated: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAllInventoryItemsPaginated = {
  total: number;
  data: InventoryItem[];
};

export type CreateInventoryItem = {
  name: string;
  category: "vegetables" | "grains" | "dairy" | "spices" | "other";
  currentStock: number;
  unit: string;
  minimumStock: number;
  costPerUnit: number;
};

export type TUseCreateInventoryItem = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};
