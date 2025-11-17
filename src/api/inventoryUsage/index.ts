import useGetRequest from "../hooks/useGetRequest";
import usePostRequest from "../hooks/usePostRequest";
import {
  CreateInventoryUsage,
  GetInventoryUsagePaginated,
  AttendanceInfo,
  TUseCreateInventoryUsage,
} from "./types";

/**
 * Record inventory usage for a meal
 * @usage const { mutate } = useRecordInventoryUsage({ onSuccess, onError });
 */
export const useRecordInventoryUsage = ({
  onSuccess,
  onError,
}: TUseCreateInventoryUsage) =>
  usePostRequest<CreateInventoryUsage>(`/inventory-usage`, {
    onSuccess,
    onError,
  });

/**
 * Get inventory usage records
 * @usage const { data } = useGetInventoryUsage({ date: "2024-01-01", mealType: "breakfast" });
 */
export const useGetInventoryUsage = (params?: Record<string, any>) =>
  useGetRequest<GetInventoryUsagePaginated>(`/inventory-usage`, params);

/**
 * Get attendance info for a specific date and meal type
 * @usage const { data } = useGetAttendanceInfo({ date: "2024-01-01", mealType: "breakfast" });
 */
export const useGetAttendanceInfo = (params?: Record<string, any>) =>
  useGetRequest<{ success: boolean; data: AttendanceInfo }>(
    `/inventory-usage/attendance-info`,
    params
  );
