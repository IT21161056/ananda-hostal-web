import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Check,
} from "lucide-react";
import { getWeekNumberInMonth } from "../../utils/date";

type MealPlan = {
  id: number;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  estimatedCost: number;
};

// Mock data - you can replace this with your existing mockMealPlans
const initialMockMealPlans: MealPlan[] = [
  {
    id: 1,
    day: "Monday",
    breakfast: "Poha, Tea, Banana",
    lunch: "Dal, Rice, Sabzi, Roti, Pickle",
    dinner: "Rajma, Rice, Roti, Salad",
    estimatedCost: 200,
  },
  {
    id: 2,
    day: "Tuesday",
    breakfast: "Upma, Coffee, Apple",
    lunch: "Sambhar, Rice, Dry Sabzi, Roti, Papad",
    dinner: "Chole, Rice, Roti, Raita",
    estimatedCost: 180,
  },
  {
    id: 3,
    day: "Wednesday",
    breakfast: "Paratha, Curd, Tea",
    lunch: "Dal Fry, Rice, Mixed Veg, Roti",
    dinner: "Palak Paneer, Rice, Roti, Pickle",
    estimatedCost: 140,
  },
  {
    id: 4,
    day: "Thursday",
    breakfast: "Dosa, Sambhar, Chutney, Tea",
    lunch: "Rajma, Rice, Aloo Gobi, Roti",
    dinner: "Dal Makhani, Rice, Roti, Salad",
    estimatedCost: 135,
  },
  {
    id: 5,
    day: "Friday",
    breakfast: "Bread, Omelette, Tea",
    lunch: "Fish Curry, Rice, Dal, Roti",
    dinner: "Chicken Curry, Rice, Roti, Salad",
    estimatedCost: 180,
  },
  {
    id: 6,
    day: "Saturday",
    breakfast: "Puri, Aloo Sabzi, Tea",
    lunch: "Mutton Curry, Rice, Dal, Roti",
    dinner: "Mixed Dal, Rice, Roti, Pickle",
    estimatedCost: 220,
  },
  {
    id: 7,
    day: "Sunday",
    breakfast: "Idli, Sambhar, Chutney, Coffee",
    lunch: "Biryani, Raita, Pickle",
    dinner: "Chapati, Dal, Vegetables",
    estimatedCost: 160,
  },
];

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

export default function MealPlanWeek() {
  const [mockMealPlans, setMockMealPlans] =
    useState<MealPlan[]>(initialMockMealPlans);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<MealPlan>({
    id: 0,
    day: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    estimatedCost: 0,
  });
  const [currentWeek, setCurrentWeek] = useState<string>("");
  const [isEditingWeek, setIsEditingWeek] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newMeal, setNewMeal] = useState<Omit<MealPlan, "id">>({
    day: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    estimatedCost: 0,
  });

  // Sort meal plans by day order (Monday first, Sunday last)
  const sortedMealPlans = useMemo(() => {
    return [...mockMealPlans].sort((a, b) => {
      return getDayOrder(a.day) - getDayOrder(b.day);
    });
  }, [mockMealPlans]);

  // Calculate Weekly Budget (total cost of all meal plans)
  const weeklyBudget = useMemo(() => {
    return sortedMealPlans.reduce(
      (total, plan) => total + plan.estimatedCost,
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
      (plan) => plan.breakfast.trim() || plan.lunch.trim() || plan.dinner.trim()
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
    setEditingId(plan.id);
    setEditData({ ...plan });
  };

  // Save edited meal plan
  const saveEdit = () => {
    setMockMealPlans(
      mockMealPlans.map((plan) =>
        plan.id === editingId ? { ...editData } : plan
      )
    );
    setEditingId(null);
    setEditData({
      id: 0,
      day: "",
      breakfast: "",
      lunch: "",
      dinner: "",
      estimatedCost: 0,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      id: 0,
      day: "",
      breakfast: "",
      lunch: "",
      dinner: "",
      estimatedCost: 0,
    });
  };

  // Delete meal plan
  const deleteMealPlan = (id: number) => {
    if (window.confirm("Are you sure you want to delete this meal plan?")) {
      setMockMealPlans(mockMealPlans.filter((plan) => plan.id !== id));
    }
  };

  // Set current week on component mount
  useEffect(() => {
    const now = new Date();
    const weekNumber = getWeekNumberInMonth(now);
    const monthName = now.toLocaleString("default", { month: "long" });

    setCurrentWeek(`Week ${weekNumber} of ${monthName}`);
  }, []);

  // Add new meal plan
  const addMealPlan = () => {
    if (newMeal.day && (newMeal.breakfast || newMeal.lunch || newMeal.dinner)) {
      const newPlan: MealPlan = {
        ...newMeal,
        id: Date.now(),
        estimatedCost: newMeal.estimatedCost,
      };
      setMockMealPlans([...mockMealPlans, newPlan]);
      setNewMeal({
        day: "",
        breakfast: "",
        lunch: "",
        dinner: "",
        estimatedCost: 0,
      });
      setShowAddForm(false);
    }
  };

  // Update edit data
  const updateEditData = (field: keyof MealPlan, value: string | number) => {
    setEditData((prev) => ({
      ...prev,
      [field]: field === "estimatedCost" ? Number(value) : value,
    }));
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
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Meal Plan
            </button>
          </div>
        </div>

        {/* Add New Meal Form */}
        {showAddForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Add New Meal Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day
                </label>
                <select
                  value={newMeal.day}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, day: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a day</option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost (₹)
                </label>
                <input
                  type="number"
                  value={newMeal.estimatedCost}
                  onChange={(e) =>
                    setNewMeal({
                      ...newMeal,
                      estimatedCost: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breakfast
                </label>
                <textarea
                  value={newMeal.breakfast}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, breakfast: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Enter breakfast items..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lunch
                </label>
                <textarea
                  value={newMeal.lunch}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, lunch: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Enter lunch items..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dinner
                </label>
                <textarea
                  value={newMeal.dinner}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, dinner: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Enter dinner items..."
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addMealPlan}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Meal Plan
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewMeal({
                    day: "",
                    breakfast: "",
                    lunch: "",
                    dinner: "",
                    estimatedCost: 0,
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {sortedMealPlans.map((plan) => (
            <div key={plan.id} className="p-6">
              {editingId === plan.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <select
                      value={editData.day}
                      onChange={(e) => updateEditData("day", e.target.value)}
                      className="text-lg font-medium text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-1"
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">₹</span>
                      <input
                        type="number"
                        value={editData.estimatedCost}
                        onChange={(e) =>
                          updateEditData("estimatedCost", e.target.value)
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <div className="flex space-x-1">
                        <button
                          onClick={saveEdit}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </button>
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
                      <textarea
                        value={editData.breakfast}
                        onChange={(e) =>
                          updateEditData("breakfast", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-blue-600">Lunch</h5>
                      <textarea
                        value={editData.lunch}
                        onChange={(e) =>
                          updateEditData("lunch", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-purple-600">Dinner</h5>
                      <textarea
                        value={editData.dinner}
                        onChange={(e) =>
                          updateEditData("dinner", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {plan.day}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        ₹{plan.estimatedCost}
                      </span>
                      <button
                        onClick={() => startEditing(plan)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMealPlan(plan.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-orange-600">Breakfast</h5>
                      <p className="text-sm text-gray-700">
                        {plan.breakfast || "No breakfast planned"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-blue-600">Lunch</h5>
                      <p className="text-sm text-gray-700">
                        {plan.lunch || "No lunch planned"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-purple-600">Dinner</h5>
                      <p className="text-sm text-gray-700">
                        {plan.dinner || "No dinner planned"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
