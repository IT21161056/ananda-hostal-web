import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { getWeekNumberInMonth } from "../../utils/date";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useCreateMealPlan,
  useGetAllMealPlans,
  useUpdateMealPlan,
} from "../../api/mealplan";
import { useGetAllInventoryItems } from "../../api/inventory";
import { MealPlanInventoryItem, MealPlan } from "../../api/mealplan/types";
import { InventoryItem } from "../../api/inventory/types";
import Select from "../elements/select/Select";
import Input from "../elements/input/Input";
import Textarea from "../elements/textarea/Textarea";
import Button from "../elements/button/Button";
import { toast } from "react-toastify";

const mealPlanSchema = yup.object().shape({
  day: yup.string().required("Please select a day"),
  breakfast: yup.string().required("Breakfast is required"),
  lunch: yup.string().required("Lunch is required"),
  dinner: yup.string().required("Dinner is required"),
  estimatedCost: yup
    .number()
    .typeError("Estimated cost must be a valid number")
    .integer("Estimated cost must be a whole number")
    .min(0, "Estimated cost cannot be negative")
    .required("Estimated cost is required")
    .test(
      "is-number",
      "Estimated cost must be a valid number",
      (value) => value !== undefined && value !== null && !isNaN(value)
    ),
});

type MealPlanForm = yup.InferType<typeof mealPlanSchema>;

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Helper function to get day order for sorting
const getDayOrder = (day: string): number => {
  return DAYS_OF_WEEK.indexOf(day);
};

// Helper function to convert array of foods to string
const foodsToString = (foods: string[]): string => {
  return foods?.join(", ") || "";
};

// Helper function to convert string to array of foods
const stringToFoods = (foodString: string): string[] => {
  return foodString
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item);
};

export default function MealPlanWeek() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MealPlanForm>({
    resolver: yupResolver(mealPlanSchema),
    defaultValues: {
      day: "",
      breakfast: "",
      lunch: "",
      dinner: "",
      estimatedCost: 0,
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<
    Partial<MealPlan> & {
      breakfastStr: string;
      lunchStr: string;
      dinnerStr: string;
    }
  >({
    _id: "",
    day: "",
    breakfastStr: "",
    lunchStr: "",
    dinnerStr: "",
    estimatedCost: 0,
  });
  const [currentWeek, setCurrentWeek] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Inventory state for form
  const [breakfastInventory, setBreakfastInventory] = useState<
    MealPlanInventoryItem[]
  >([]);
  const [lunchInventory, setLunchInventory] = useState<MealPlanInventoryItem[]>(
    []
  );
  const [dinnerInventory, setDinnerInventory] = useState<
    MealPlanInventoryItem[]
  >([]);

  // Inventory state for edit mode
  const [editBreakfastInventory, setEditBreakfastInventory] = useState<
    MealPlanInventoryItem[]
  >([]);
  const [editLunchInventory, setEditLunchInventory] = useState<
    MealPlanInventoryItem[]
  >([]);
  const [editDinnerInventory, setEditDinnerInventory] = useState<
    MealPlanInventoryItem[]
  >([]);

  // Fetch inventory items
  const { data: inventoryResponse } = useGetAllInventoryItems({ limit: 1000 });
  const inventoryItems = inventoryResponse?.data || [];

  // Api calls
  const {
    data: mealPlansResponse,
    isLoading: fetchingMealPlans,
    refetch: refetchMealPlans,
  } = useGetAllMealPlans();
  const mealPlans = mealPlansResponse?.data || [];

  // Add new meal plan
  const { mutate: createMealPlan, isPending: creatingMealPlan } =
    useCreateMealPlan({
      onSuccess() {
        reset({
          day: "",
          breakfast: "",
          lunch: "",
          dinner: "",
          estimatedCost: 0,
        });
        setShowAddForm(false);
      },
      onError(error) {
        toast.error(error.response?.data.message);
      },
    });

  // Update meal plan
  const { mutate: updateMealPlan, isPending: updatingMealPlan } =
    useUpdateMealPlan({
      id: editingId!,
      onSuccess() {
        refetchMealPlans();
        toast.success("Meal plan updated successfully");
        setEditingId(null);
        setEditData({
          _id: "",
          day: "",
          breakfastStr: "",
          lunchStr: "",
          dinnerStr: "",
          estimatedCost: 0,
        });
      },
      onError(error) {
        toast.error(error.response?.data.message);
      },
    });

  // Sort meal plans by day order (Monday first, Sunday last)
  const sortedMealPlans = useMemo(() => {
    return [...mealPlans].sort((a, b) => {
      return getDayOrder(a.day) - getDayOrder(b.day);
    });
  }, [mealPlans]);

  // Calculate Weekly Budget (total cost of all meal plans)
  const weeklyBudget = useMemo(() => {
    return sortedMealPlans.reduce(
      (total, plan) => total + (plan.estimatedCost || 0),
      0
    );
  }, [sortedMealPlans]);

  // Calculate Average per Day (weekly budget divided by 7 days)
  const averagePerDay = useMemo(() => {
    return Math.round(weeklyBudget / 7);
  }, [weeklyBudget]);

  // Calculate actual days with planned meals (for more accurate average if needed)
  const daysWithPlannedMeals = useMemo(() => {
    return sortedMealPlans.filter(
      (plan) =>
        plan.breakfast?.length > 0 ||
        plan.lunch?.length > 0 ||
        plan.dinner?.length > 0
    ).length;
  }, [sortedMealPlans]);

  // Alternative: Average per planned day (if you want to exclude empty days)
  const averagePerPlannedDay = useMemo(() => {
    return daysWithPlannedMeals > 0
      ? Math.round(weeklyBudget / daysWithPlannedMeals)
      : 0;
  }, [weeklyBudget, daysWithPlannedMeals]);

  // Start editing a meal plan
  const startEditing = (plan: MealPlan) => {
    setEditingId(plan._id);
    setEditData({
      ...plan,
      breakfastStr: foodsToString(plan.breakfast),
      lunchStr: foodsToString(plan.lunch),
      dinnerStr: foodsToString(plan.dinner),
    });
    // Set inventory items for editing
    setEditBreakfastInventory(
      plan.breakfastInventory?.map((item: MealPlanInventoryItem) => ({
        inventoryItemId:
          typeof item.inventoryItemId === "string"
            ? item.inventoryItemId
            : (item.inventoryItemId as InventoryItem)._id,
        quantity: item.quantity,
      })) || []
    );
    setEditLunchInventory(
      plan.lunchInventory?.map((item: MealPlanInventoryItem) => ({
        inventoryItemId:
          typeof item.inventoryItemId === "string"
            ? item.inventoryItemId
            : (item.inventoryItemId as InventoryItem)._id,
        quantity: item.quantity,
      })) || []
    );
    setEditDinnerInventory(
      plan.dinnerInventory?.map((item: MealPlanInventoryItem) => ({
        inventoryItemId:
          typeof item.inventoryItemId === "string"
            ? item.inventoryItemId
            : (item.inventoryItemId as InventoryItem)._id,
        quantity: item.quantity,
      })) || []
    );
  };

  // Save edited meal plan
  const saveEdit = () => {
    updateMealPlan({
      day: editData.day!,
      estimatedCost: editData.estimatedCost!,
      breakfast: stringToFoods(editData.breakfastStr),
      lunch: stringToFoods(editData.lunchStr),
      dinner: stringToFoods(editData.dinnerStr),
      breakfastInventory: editBreakfastInventory,
      lunchInventory: editLunchInventory,
      dinnerInventory: editDinnerInventory,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      _id: "",
      day: "",
      breakfastStr: "",
      lunchStr: "",
      dinnerStr: "",
      estimatedCost: 0,
    });
    setEditBreakfastInventory([]);
    setEditLunchInventory([]);
    setEditDinnerInventory([]);
  };

  // Set current week on component mount
  useEffect(() => {
    const now = new Date();
    const weekNumber = getWeekNumberInMonth(now);
    const monthName = now.toLocaleString("default", { month: "long" });

    setCurrentWeek(`Week ${weekNumber} of ${monthName}`);
  }, []);

  // Update edit data
  const updateEditData = (field: string, value: string | number) => {
    setEditData((prev) => ({
      ...prev,
      [field]: field === "estimatedCost" ? Number(value) : value,
    }));
  };

  const onSubmit = (formData: MealPlanForm) => {
    // Handle form submission
    if (
      formData.day &&
      (formData.breakfast || formData.lunch || formData.dinner)
    ) {
      const payload = {
        ...formData,
        breakfast: stringToFoods(formData.breakfast),
        lunch: stringToFoods(formData.lunch),
        dinner: stringToFoods(formData.dinner),
        breakfastInventory: breakfastInventory,
        lunchInventory: lunchInventory,
        dinnerInventory: dinnerInventory,
      };

      createMealPlan(payload);
      // Reset inventory state
      setBreakfastInventory([]);
      setLunchInventory([]);
      setDinnerInventory([]);
    }
  };

  // Helper functions to manage inventory items
  const addInventoryItem = (
    mealType: "breakfast" | "lunch" | "dinner",
    isEdit: boolean = false
  ) => {
    const itemId = "";
    const quantity = 0;
    const newItem: MealPlanInventoryItem = {
      inventoryItemId: itemId,
      quantity,
    };

    if (isEdit) {
      if (mealType === "breakfast") {
        setEditBreakfastInventory([...editBreakfastInventory, newItem]);
      } else if (mealType === "lunch") {
        setEditLunchInventory([...editLunchInventory, newItem]);
      } else {
        setEditDinnerInventory([...editDinnerInventory, newItem]);
      }
    } else {
      if (mealType === "breakfast") {
        setBreakfastInventory([...breakfastInventory, newItem]);
      } else if (mealType === "lunch") {
        setLunchInventory([...lunchInventory, newItem]);
      } else {
        setDinnerInventory([...dinnerInventory, newItem]);
      }
    }
  };

  const removeInventoryItem = (
    mealType: "breakfast" | "lunch" | "dinner",
    index: number,
    isEdit: boolean = false
  ) => {
    if (isEdit) {
      if (mealType === "breakfast") {
        setEditBreakfastInventory(
          editBreakfastInventory.filter((_, i) => i !== index)
        );
      } else if (mealType === "lunch") {
        setEditLunchInventory(editLunchInventory.filter((_, i) => i !== index));
      } else {
        setEditDinnerInventory(
          editDinnerInventory.filter((_, i) => i !== index)
        );
      }
    } else {
      if (mealType === "breakfast") {
        setBreakfastInventory(breakfastInventory.filter((_, i) => i !== index));
      } else if (mealType === "lunch") {
        setLunchInventory(lunchInventory.filter((_, i) => i !== index));
      } else {
        setDinnerInventory(dinnerInventory.filter((_, i) => i !== index));
      }
    }
  };

  const updateInventoryItem = (
    mealType: "breakfast" | "lunch" | "dinner",
    index: number,
    field: "inventoryItemId" | "quantity",
    value: string | number,
    isEdit: boolean = false
  ) => {
    if (isEdit) {
      if (mealType === "breakfast") {
        const updated = [...editBreakfastInventory];
        updated[index] = { ...updated[index], [field]: value };
        setEditBreakfastInventory(updated);
      } else if (mealType === "lunch") {
        const updated = [...editLunchInventory];
        updated[index] = { ...updated[index], [field]: value };
        setEditLunchInventory(updated);
      } else {
        const updated = [...editDinnerInventory];
        updated[index] = { ...updated[index], [field]: value };
        setEditDinnerInventory(updated);
      }
    } else {
      if (mealType === "breakfast") {
        const updated = [...breakfastInventory];
        updated[index] = { ...updated[index], [field]: value };
        setBreakfastInventory(updated);
      } else if (mealType === "lunch") {
        const updated = [...lunchInventory];
        updated[index] = { ...updated[index], [field]: value };
        setLunchInventory(updated);
      } else {
        const updated = [...dinnerInventory];
        updated[index] = { ...updated[index], [field]: value };
        setDinnerInventory(updated);
      }
    }
  };

  // Helper to get inventory item name
  const getInventoryItemName = (itemId: string): string => {
    const item = inventoryItems.find((i: InventoryItem) => i._id === itemId);
    return item ? item.name : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />

              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Current Week
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {currentWeek}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekly Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {weeklyBudget.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {daysWithPlannedMeals} of 7 days planned
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average/Day</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {averagePerDay}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {daysWithPlannedMeals > 0 &&
                  `Rs ${averagePerPlannedDay} per planned day`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Weekly Meal Plan
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Total: Rs {weeklyBudget.toLocaleString()} • Avg: Rs{" "}
              {averagePerDay}/day
            </span>
            {!showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Meal Plan
              </button>
            )}
          </div>
        </div>

        {fetchingMealPlans && (
          <div className="h-[150px] bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-700">
                Loading meal plans...
              </p>
            </div>
          </div>
        )}

        {/* Add New Meal Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 bg-gray-50 border-b border-gray-200"
          >
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Add New Meal Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Controller
                name="day"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Day"
                    {...field}
                    options={DAYS_OF_WEEK.map((day) => ({
                      value: day,
                      label: day,
                    }))}
                    onChange={field.onChange}
                    error={errors.day?.message}
                  />
                )}
              />

              <Controller
                name="estimatedCost"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Estimated Cost"
                    type="number"
                    {...field}
                    onChange={field.onChange}
                    error={errors.estimatedCost?.message}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Controller
                name="breakfast"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="Breakfast"
                    aria-label="Breakfast"
                    {...field}
                    onChange={field.onChange}
                    error={errors.breakfast?.message}
                    placeholder="Enter breakfast items (comma separated)..."
                  />
                )}
              />

              <Controller
                name="lunch"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="Lunch"
                    aria-label="Lunch"
                    {...field}
                    onChange={field.onChange}
                    error={errors.lunch?.message}
                    placeholder="Enter lunch items (comma separated)..."
                  />
                )}
              />

              <Controller
                name="dinner"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="Dinner"
                    aria-label="Dinner"
                    {...field}
                    onChange={field.onChange}
                    error={errors.dinner?.message}
                    placeholder="Enter dinner items (comma separated)..."
                  />
                )}
              />
            </div>

            {/* Inventory Selection for Add Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <InventorySelection
                label="Breakfast Inventory"
                items={breakfastInventory}
                inventoryItems={inventoryItems}
                onAdd={() => addInventoryItem("breakfast")}
                onRemove={(index) => removeInventoryItem("breakfast", index)}
                onUpdate={(index, field, value) =>
                  updateInventoryItem("breakfast", index, field, value)
                }
              />
              <InventorySelection
                label="Lunch Inventory"
                items={lunchInventory}
                inventoryItems={inventoryItems}
                onAdd={() => addInventoryItem("lunch")}
                onRemove={(index) => removeInventoryItem("lunch", index)}
                onUpdate={(index, field, value) =>
                  updateInventoryItem("lunch", index, field, value)
                }
              />
              <InventorySelection
                label="Dinner Inventory"
                items={dinnerInventory}
                inventoryItems={inventoryItems}
                onAdd={() => addInventoryItem("dinner")}
                onRemove={(index) => removeInventoryItem("dinner", index)}
                onUpdate={(index, field, value) =>
                  updateInventoryItem("dinner", index, field, value)
                }
              />
            </div>

            <div className="flex space-x-3">
              <Button
                disabled={creatingMealPlan}
                loading={creatingMealPlan}
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Meal Plan
              </Button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  reset();
                  setBreakfastInventory([]);
                  setLunchInventory([]);
                  setDinnerInventory([]);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-gray-200">
          {sortedMealPlans.map((plan) => (
            <div key={plan._id} className="relative">
              {editingId === plan._id ? (
                // Edit Mode
                <div className="space-y-4 relative p-6">
                  {updatingMealPlan && (
                    <div className="absolute bg-gray-50/60 w-full h-full top-0 left-0 z-20 cursor-wait"></div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <select
                      value={editData.day}
                      onChange={(e) => updateEditData("day", e.target.value)}
                      className="text-lg outline-none font-medium text-gray-900 bg-white border  rounded-lg px-3 pr-3 py-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rs</span>
                      <input
                        type="number"
                        value={editData.estimatedCost}
                        onChange={(e) =>
                          updateEditData("estimatedCost", e.target.value)
                        }
                        className="w-20 px-2 outline-none py-1 border rounded text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <div className="flex space-x-1 items-center">
                        {updatingMealPlan ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                        ) : (
                          <button
                            onClick={saveEdit}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-orange-600">Breakfast</h5>
                      <Textarea
                        value={editData.breakfastStr}
                        onChange={(e) =>
                          updateEditData("breakfastStr", e.target.value)
                        }
                        placeholder="Enter breakfast items (comma separated)..."
                      />
                      <InventorySelection
                        label="Inventory"
                        items={editBreakfastInventory}
                        inventoryItems={inventoryItems}
                        onAdd={() => addInventoryItem("breakfast", true)}
                        onRemove={(index) =>
                          removeInventoryItem("breakfast", index, true)
                        }
                        onUpdate={(index, field, value) =>
                          updateInventoryItem(
                            "breakfast",
                            index,
                            field,
                            value,
                            true
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-blue-600">Lunch</h5>
                      <Textarea
                        value={editData.lunchStr}
                        onChange={(e) =>
                          updateEditData("lunchStr", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter lunch items (comma separated)..."
                      />
                      <InventorySelection
                        label="Inventory"
                        items={editLunchInventory}
                        inventoryItems={inventoryItems}
                        onAdd={() => addInventoryItem("lunch", true)}
                        onRemove={(index) =>
                          removeInventoryItem("lunch", index, true)
                        }
                        onUpdate={(index, field, value) =>
                          updateInventoryItem(
                            "lunch",
                            index,
                            field,
                            value,
                            true
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-purple-600">Dinner</h5>
                      <Textarea
                        value={editData.dinnerStr}
                        onChange={(e) =>
                          updateEditData("dinnerStr", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter dinner items (comma separated)..."
                      />
                      <InventorySelection
                        label="Inventory"
                        items={editDinnerInventory}
                        inventoryItems={inventoryItems}
                        onAdd={() => addInventoryItem("dinner", true)}
                        onRemove={(index) =>
                          removeInventoryItem("dinner", index, true)
                        }
                        onUpdate={(index, field, value) =>
                          updateInventoryItem(
                            "dinner",
                            index,
                            field,
                            value,
                            true
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {plan.day}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                        Rs {plan.estimatedCost}
                      </span>
                      <button
                        onClick={() => startEditing(plan)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {/* <button
                        onClick={() => deleteMealPlan(plan._id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-orange-600">Breakfast</h5>
                      <p className="text-sm text-gray-700">
                        {plan.breakfast?.length > 0
                          ? plan.breakfast.join(", ")
                          : "No breakfast planned"}
                      </p>
                      {plan.breakfastInventory &&
                        plan.breakfastInventory.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-gray-600">
                              Inventory Items:
                            </p>
                            {plan.breakfastInventory.map((item, idx) => {
                              const itemId =
                                typeof item.inventoryItemId === "string"
                                  ? item.inventoryItemId
                                  : item.inventoryItemId._id;
                              const itemName =
                                typeof item.inventoryItemId === "string"
                                  ? getInventoryItemName(itemId)
                                  : item.inventoryItemId.name;
                              const inventoryItem = inventoryItems.find(
                                (i: InventoryItem) => i._id === itemId
                              );
                              return (
                                <p key={idx} className="text-xs text-gray-600">
                                  • {itemName}: {item.quantity}{" "}
                                  {inventoryItem?.unit || ""}
                                </p>
                              );
                            })}
                          </div>
                        )}
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-blue-600">Lunch</h5>
                      <p className="text-sm text-gray-700">
                        {plan.lunch?.length > 0
                          ? plan.lunch.join(", ")
                          : "No lunch planned"}
                      </p>
                      {plan.lunchInventory &&
                        plan.lunchInventory.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-gray-600">
                              Inventory Items:
                            </p>
                            {plan.lunchInventory.map((item, idx) => {
                              const itemId =
                                typeof item.inventoryItemId === "string"
                                  ? item.inventoryItemId
                                  : item.inventoryItemId._id;
                              const itemName =
                                typeof item.inventoryItemId === "string"
                                  ? getInventoryItemName(itemId)
                                  : item.inventoryItemId.name;
                              const inventoryItem = inventoryItems.find(
                                (i: InventoryItem) => i._id === itemId
                              );
                              return (
                                <p key={idx} className="text-xs text-gray-600">
                                  • {itemName}: {item.quantity}{" "}
                                  {inventoryItem?.unit || ""}
                                </p>
                              );
                            })}
                          </div>
                        )}
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-purple-600">Dinner</h5>
                      <p className="text-sm text-gray-700">
                        {plan.dinner?.length > 0
                          ? plan.dinner.join(", ")
                          : "No dinner planned"}
                      </p>
                      {plan.dinnerInventory &&
                        plan.dinnerInventory.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-gray-600">
                              Inventory Items:
                            </p>
                            {plan.dinnerInventory.map((item, idx) => {
                              const itemId =
                                typeof item.inventoryItemId === "string"
                                  ? item.inventoryItemId
                                  : item.inventoryItemId._id;
                              const itemName =
                                typeof item.inventoryItemId === "string"
                                  ? getInventoryItemName(itemId)
                                  : item.inventoryItemId.name;
                              const inventoryItem = inventoryItems.find(
                                (i: InventoryItem) => i._id === itemId
                              );
                              return (
                                <p key={idx} className="text-xs text-gray-600">
                                  • {itemName}: {item.quantity}{" "}
                                  {inventoryItem?.unit || ""}
                                </p>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inventory Selection Component
type InventorySelectionProps = {
  label: string;
  items: MealPlanInventoryItem[];
  inventoryItems: InventoryItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    field: "inventoryItemId" | "quantity",
    value: string | number
  ) => void;
};

function InventorySelection({
  label,
  items,
  inventoryItems,
  onAdd,
  onRemove,
  onUpdate,
}: InventorySelectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Item
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => {
          const itemId =
            typeof item.inventoryItemId === "string"
              ? item.inventoryItemId
              : item.inventoryItemId._id;
          const selectedItem = inventoryItems.find(
            (i: InventoryItem) => i._id === itemId
          );
          return (
            <div key={index} className="flex gap-2 items-center">
              <select
                value={
                  typeof item.inventoryItemId === "string"
                    ? item.inventoryItemId
                    : item.inventoryItemId._id
                }
                onChange={(e) =>
                  onUpdate(index, "inventoryItemId", e.target.value)
                }
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select item...</option>
                {inventoryItems.map((invItem) => (
                  <option key={invItem._id} value={invItem._id}>
                    {invItem.name} ({invItem.unit})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  onUpdate(index, "quantity", Number(e.target.value))
                }
                placeholder="Qty"
                min={0}
                step="0.01"
                className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {selectedItem && (
                <span className="text-xs text-gray-500">
                  {selectedItem.unit}
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xs text-gray-500 italic">
            No inventory items selected
          </p>
        )}
      </div>
    </div>
  );
}
