import React, { useState, useMemo } from "react";
import {
  Package,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { ProcurementList } from "../../types";
import {
  useGetAllInventoryItems,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
} from "../../api/inventory";
import { InventoryItem as APIInventoryItem } from "../../api/inventory/types";
import { ApiError } from "../../api/hooks/types";
import { toast } from "react-toastify";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import Button from "../elements/button/Button";

// Helper to convert API inventory item to local format
const convertInventoryItem = (item: APIInventoryItem) => ({
  id: item._id,
  name: item.name,
  category: item.category,
  currentStock: item.currentStock,
  unit: item.unit,
  minimumStock: item.minimumStock,
  costPerUnit: item.costPerUnit,
  lastUpdated: item.lastUpdated || item.updatedAt,
});

type LocalInventoryItem = ReturnType<typeof convertInventoryItem>;

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LocalInventoryItem | null>(
    null
  );

  // Fetch inventory from API
  const {
    data: inventoryResponse,
    isLoading,
    refetch,
  } = useGetAllInventoryItems({
    search: searchTerm || undefined,
    category: filterCategory || undefined,
    status: filterStatus || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const inventory: LocalInventoryItem[] = useMemo(() => {
    return (inventoryResponse?.data || []).map(convertInventoryItem);
  }, [inventoryResponse]);

  const totalItems = inventoryResponse?.total || 0;

  const pageSizeOptions = [5, 10, 25, 50, 100];
  const categories = ["vegetables", "grains", "dairy", "spices", "other"];

  // Create inventory item
  const { mutate: createItem, isPending: creating } = useCreateInventoryItem({
    onSuccess: () => {
      toast.success("Inventory item created successfully");
      setShowAddModal(false);
      refetch();
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to create inventory item"
      );
    },
  });

  // Update inventory item
  const { mutate: updateItem, isPending: updating } = useUpdateInventoryItem({
    id: editingItem?.id || "",
    onSuccess: () => {
      toast.success("Inventory item updated successfully");
      setEditingItem(null);
      refetch();
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update inventory item"
      );
    },
  });

  // Delete inventory item
  const { mutate: deleteItem, isPending: deleting } = useDeleteInventoryItem({
    onSuccess: () => {
      toast.success("Inventory item deleted successfully");
      setEditingItem(null);
      refetch();
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to delete inventory item"
      );
    },
  });

  const lowStockItems = inventory.filter(
    (item) => item.currentStock <= item.minimumStock
  );

  const generateProcurementList = () => {
    const procurementItems = lowStockItems.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      requiredQuantity: item.minimumStock * 2 - item.currentStock,
      unit: item.unit,
      estimatedCost:
        (item.minimumStock * 2 - item.currentStock) * item.costPerUnit,
    }));

    const totalCost = procurementItems.reduce(
      (sum, item) => sum + item.estimatedCost,
      0
    );

    const procurementList: ProcurementList = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      items: procurementItems,
      totalCost,
      status: "pending",
      createdBy: "Kitchen Manager",
    };

    console.log("Generated Procurement List:", procurementList);
    // In real app, this would save to backend
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vegetables":
        return "bg-green-100 text-green-800";
      case "grains":
        return "bg-yellow-100 text-yellow-800";
      case "dairy":
        return "bg-blue-100 text-blue-800";
      case "spices":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (item: LocalInventoryItem) => {
    if (item.currentStock <= item.minimumStock) return "low";
    if (item.currentStock <= item.minimumStock * 1.5) return "medium";
    return "good";
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedInventory = inventory;

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStatus, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleDelete = (item: LocalInventoryItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItem(item.id);
    }
  };

  const handleEdit = (item: LocalInventoryItem) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">Kitchen Inventory</h1>
          <p className="text-sm text-gray-600 mt-1">Manage kitchen inventory and procurement</p> */}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={generateProcurementList}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Generate List
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {lowStockItems.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Procurement Value
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹
                {lowStockItems
                  .reduce(
                    (sum, item) =>
                      sum +
                      (item.minimumStock * 2 - item.currentStock) *
                        item.costPerUnit,
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">
              Low Stock Alert
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-3 border border-red-200"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-red-600 font-bold">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Min: {item.minimumStock} {item.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">All Status</option>
            <option value="low">Low Stock</option>
            <option value="medium">Medium Stock</option>
            <option value="good">Good Stock</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Item Name
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Category
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Current Stock
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Min Stock
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Cost/Unit
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Status
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-lg font-medium">
                        Loading inventory...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        No inventory items found
                      </p>
                      <p className="text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Updated:{" "}
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.currentStock} {item.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item.minimumStock} {item.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{item.costPerUnit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            stockStatus === "low"
                              ? "bg-red-100 text-red-800"
                              : stockStatus === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {stockStatus === "low"
                            ? "Low Stock"
                            : stockStatus === "medium"
                            ? "Medium"
                            : "Good"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors duration-150"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors duration-150"
                            title="Delete"
                            disabled={deleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">Per page</span>

              <div className="hidden sm:block text-sm text-gray-700">
                <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{endIndex}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>First</span>
                  <span>Last</span>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center mx-2">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded">
                      {currentPage}
                    </span>
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <InventoryItemModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={(data) => {
            if (editingItem) {
              updateItem(data);
            } else {
              createItem(data);
            }
          }}
          isPending={creating || updating}
        />
      )}
    </div>
  );
}

// Modal Component for Add/Edit Inventory Item
type InventoryItemModalProps = {
  item: LocalInventoryItem | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    category: "vegetables" | "grains" | "dairy" | "spices" | "other";
    currentStock: number;
    unit: string;
    minimumStock: number;
    costPerUnit: number;
  }) => void;
  isPending: boolean;
};

function InventoryItemModal({
  item,
  onClose,
  onSave,
  isPending,
}: InventoryItemModalProps) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    category: (item?.category || "vegetables") as
      | "vegetables"
      | "grains"
      | "dairy"
      | "spices"
      | "other",
    currentStock: item?.currentStock || 0,
    unit: item?.unit || "kg",
    minimumStock: item?.minimumStock || 0,
    costPerUnit: item?.costPerUnit || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? "Edit Inventory Item" : "Add New Inventory Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Item Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as any })
              }
              options={[
                { value: "vegetables", label: "Vegetables" },
                { value: "grains", label: "Grains" },
                { value: "dairy", label: "Dairy" },
                { value: "spices", label: "Spices" },
                { value: "other", label: "Other" },
              ]}
              required
            />

            <Input
              label="Current Stock"
              type="number"
              value={formData.currentStock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentStock: Number(e.target.value),
                })
              }
              required
              min={0}
            />

            <Input
              label="Unit"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              placeholder="kg, liters, etc."
              required
            />

            <Input
              label="Minimum Stock"
              type="number"
              value={formData.minimumStock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimumStock: Number(e.target.value),
                })
              }
              required
              min={0}
            />

            <Input
              label="Cost Per Unit"
              type="number"
              value={formData.costPerUnit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  costPerUnit: Number(e.target.value),
                })
              }
              required
              min={0}
              step="0.01"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              loading={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {item ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
