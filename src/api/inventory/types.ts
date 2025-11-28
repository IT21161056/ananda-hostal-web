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

export type Category =
  | "vegetables"
  | "fruits"
  | "grains"
  | "dairy"
  | "meat_fish"
  | "grocery"
  | "oils"
  | "beverages"
  | "spices"
  | "other";


export type CreateInventoryItem = {
  name: string;
  category: Category;
  currentStock: number;
  unit: string;
  minimumStock: number;
  costPerUnit: number;
};

export type TUseCreateInventoryItem = {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
};
