import useGetRequest from "../hooks/useGetRequest";
import usePostRequest from "../hooks/usePostRequest";
import useDeleteRequest from "../hooks/useDeleteRequest";
import usePutRequest from "../hooks/usePutRequest";
import {
  CreateInventoryItem,
  GetAllInventoryItemsPaginated,
  InventoryItem,
  TUseCreateInventoryItem,
} from "./types.ts";

/**
 * Create a new inventory item
 * @usage const { mutate } = useCreateInventoryItem({ onSuccess, onError });
 */
export const useCreateInventoryItem = ({
  onSuccess,
  onError,
}: TUseCreateInventoryItem) =>
  usePostRequest<CreateInventoryItem>(`/inventory`, { onSuccess, onError });

/**
 * Get all inventory items (supports search, filters, pagination)
 * @usage const { data } = useGetAllInventoryItems({ page: 1, limit: 100 });
 */
export const useGetAllInventoryItems = (params?: Record<string, any>) =>
  useGetRequest<GetAllInventoryItemsPaginated>(`/inventory`, params);

/**
 * Get a specific inventory item by ID
 * @usage const { data } = useGetInventoryItemById(id);
 */
export const useGetInventoryItemById = (id: string) =>
  useGetRequest<InventoryItem>(`/inventory/${id}`);

/**
 * Update an inventory item by ID
 * @usage const { mutate } = useUpdateInventoryItem({ id, onSuccess, onError });
 */
export const useUpdateInventoryItem = ({
  id,
  onSuccess,
  onError,
}: TUseCreateInventoryItem & { id: string }) =>
  usePutRequest<CreateInventoryItem>(`/inventory/${id}`, {
    onSuccess,
    onError,
  });

/**
 * Delete an inventory item by ID
 * @usage const { mutate } = useDeleteInventoryItem({ onSuccess, onError });
 * @usage mutate(id) - pass the id when calling mutate
 */
export const useDeleteInventoryItem = ({
  onSuccess,
  onError,
}: TUseCreateInventoryItem) =>
  useDeleteRequest(`/inventory`, { onSuccess, onError });
