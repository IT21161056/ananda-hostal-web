import useGetRequest from "../hooks/useGetRequest";
import usePostRequest from "../hooks/usePostRequest";
import useDeleteRequest from "../hooks/useDeleteRequest";
import usePutRequest from "../hooks/usePutRequest";
import {
  CreateMealPlan,
  GetAllMealPlansPaginated,
  MealPlan,
  TUseCreateMealPlan,
} from "./types";

/**
 * Create a new meal plan
 * @usage const { mutate } = useCreateMealPlan({ onSuccess, onError });
 */

export const useCreateMealPlan = ({ onSuccess, onError }: TUseCreateMealPlan) =>
  usePostRequest<CreateMealPlan>(`/mealplan`, { onSuccess, onError });

/**
 * Get all meal plans (supports search, filters, pagination)
 * @usage const { data } = useGetAllMealPlans({ page: 1, limit: 10 });
 */
export const useGetAllMealPlans = (params?: Record<string, any>) =>
  useGetRequest<GetAllMealPlansPaginated>(`/mealplan`, params);

/**
 * Get a specific meal plan by ID
 * @usage const { data } = useGetMealPlanById(id);
 */
export const useGetMealPlanById = (id: string) =>
  useGetRequest<MealPlan>(`/mealplan/${id}`);

/**
 * Update a meal plan by ID
 * @usage const { mutate } = useUpdateMealPlan({ id, onSuccess, onError });
 */
export const useUpdateMealPlan = ({
  id,
  onSuccess,
  onError,
}: TUseCreateMealPlan & { id: string }) =>
  usePutRequest<CreateMealPlan>(`/mealplan/${id}`, {
    onSuccess,
    onError,
  });

/**
 * Delete a meal plan by ID
 * @usage const { mutate } = useDeleteMealPlan({ id, onSuccess, onError });
 */
export const useDeleteMealPlan = ({
  id,
  onSuccess,
  onError,
}: TUseCreateMealPlan & { id: string }) =>
  useDeleteRequest(`/mealplan/${id}`, { onSuccess, onError });
