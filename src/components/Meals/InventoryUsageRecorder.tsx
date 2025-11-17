import React, { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Plus,
  X,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  useRecordInventoryUsage,
  useGetAttendanceInfo,
} from "../../api/inventoryUsage";
import { useGetAllInventoryItems } from "../../api/inventory";
import { InventoryItem } from "../../api/inventory/types";
import { InventoryUsageItem } from "../../api/inventoryUsage/types";
import { ApiError } from "../../api/hooks/types";
import { toast } from "react-toastify";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import Button from "../elements/button/Button";
import Textarea from "../elements/textarea/Textarea";

export default function InventoryUsageRecorder() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">(
    "breakfast"
  );
  const [items, setItems] = useState<InventoryUsageItem[]>([]);
  const [notes, setNotes] = useState("");

  // Fetch inventory items
  const { data: inventoryResponse } = useGetAllInventoryItems({ limit: 1000 });
  const inventoryItems = inventoryResponse?.data || [];

  // Get attendance info
  const {
    data: attendanceInfoResponse,
    isLoading: loadingAttendance,
    refetch: refetchAttendance,
  } = useGetAttendanceInfo({
    date,
    mealType,
  });

  const attendanceInfo = attendanceInfoResponse?.data;

  // Refetch attendance when date or mealType changes
  useEffect(() => {
    refetchAttendance();
  }, [date, mealType, refetchAttendance]);

  // Record usage
  const { mutate: recordUsage, isPending: recording } = useRecordInventoryUsage(
    {
      onSuccess: () => {
        toast.success("Inventory usage recorded and deducted successfully");
        setItems([]);
        setNotes("");
      },
      onError: (error: ApiError) => {
        toast.error(
          error.response?.data?.message || "Failed to record inventory usage"
        );
      },
    }
  );

  const addItem = () => {
    setItems([
      ...items,
      {
        inventoryItemId: "",
        recordedQuantity: 0,
        recordedForStudents: 10,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof InventoryUsageItem,
    value: string | number
  ) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (items.length === 0) {
      toast.error("Please add at least one inventory item");
      return;
    }

    const invalidItems = items.filter(
      (item) =>
        !item.inventoryItemId ||
        item.recordedQuantity <= 0 ||
        !item.recordedForStudents
    );

    if (invalidItems.length > 0) {
      toast.error("Please fill in all fields for all items");
      return;
    }

    if (!attendanceInfo?.attendanceCount) {
      toast.error(
        `Attendance not found. Please ensure ${
          attendanceInfo?.sessionType
        } attendance is recorded for ${
          attendanceInfo?.attendanceDate || "the required date"
        }.`
      );
      return;
    }

    recordUsage({
      date,
      mealType,
      items,
      notes: notes || undefined,
    });
  };

  // Calculate estimated actual usage for display
  const calculateEstimatedUsage = (item: InventoryUsageItem) => {
    if (!attendanceInfo?.attendanceCount || !item.recordedQuantity) return 0;
    return (
      (attendanceInfo.attendanceCount / item.recordedForStudents) *
      item.recordedQuantity
    );
  };

  const getMealTypeLabel = (type: string) => {
    switch (type) {
      case "breakfast":
        return "Breakfast";
      case "lunch":
        return "Lunch";
      case "dinner":
        return "Dinner";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Record Inventory Usage
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Record inventory used for meals. The system will calculate actual
              usage based on attendance.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Meal Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) =>
                  setMealType(
                    e.target.value as "breakfast" | "lunch" | "dinner"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>

          {/* Attendance Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Attendance Information
                </h3>
                {loadingAttendance ? (
                  <p className="text-sm text-blue-700">Loading attendance...</p>
                ) : attendanceInfo?.attendanceCount !== null &&
                  attendanceInfo?.attendanceCount !== undefined ? (
                  <div className="space-y-1">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">
                        {attendanceInfo.attendanceCount} students
                      </span>{" "}
                      attended the{" "}
                      <span className="font-medium">
                        {attendanceInfo.sessionType}
                      </span>{" "}
                      session on{" "}
                      <span className="font-medium">
                        {new Date(
                          attendanceInfo.attendanceDate
                        ).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-xs text-blue-600">
                      {mealType === "breakfast" || mealType === "lunch"
                        ? "Morning meals use previous day's evening attendance"
                        : "Dinner uses current day's evening attendance"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-red-700 font-medium">
                      Attendance not found
                    </p>
                    <p className="text-xs text-red-600">
                      {attendanceInfo?.message ||
                        `Please record ${
                          attendanceInfo?.sessionType || "evening"
                        } attendance for ${
                          attendanceInfo?.attendanceDate || "the required date"
                        } first.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Inventory Items Used
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  No items added yet. Click "Add Item" to start recording usage.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => {
                  const selectedInventoryItem = inventoryItems.find(
                    (inv: InventoryItem) => inv._id === item.inventoryItemId
                  );
                  const estimatedUsage = calculateEstimatedUsage(item);

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Item {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Inventory Item
                          </label>
                          <select
                            value={item.inventoryItemId}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "inventoryItemId",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select item...</option>
                            {inventoryItems.map((inv: InventoryItem) => (
                              <option key={inv._id} value={inv._id}>
                                {inv.name} ({inv.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity Used
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.recordedQuantity || ""}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "recordedQuantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            required
                          />
                          {selectedInventoryItem && (
                            <p className="text-xs text-gray-500 mt-1">
                              Unit: {selectedInventoryItem.unit}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Recorded For
                          </label>
                          <select
                            value={item.recordedForStudents}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "recordedForStudents",
                                parseInt(e.target.value) as 1 | 10
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value={1}>1 student</option>
                            <option value={10}>10 students</option>
                          </select>
                        </div>
                      </div>

                      {/* Estimated Actual Usage */}
                      {attendanceInfo?.attendanceCount &&
                        item.recordedQuantity > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded p-2">
                            <div className="flex items-center text-xs">
                              <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                              <span className="text-green-800">
                                <span className="font-medium">
                                  Estimated actual usage:
                                </span>{" "}
                                {estimatedUsage.toFixed(2)}{" "}
                                {selectedInventoryItem?.unit || "units"} (for{" "}
                                {attendanceInfo.attendanceCount} students)
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Textarea
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this usage..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => {
                setItems([]);
                setNotes("");
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              disabled={recording}
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={
                recording ||
                items.length === 0 ||
                !attendanceInfo?.attendanceCount
              }
              loading={recording}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Record Usage & Deduct Inventory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
