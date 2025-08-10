import React, { useState, useMemo } from 'react';
import { Package, AlertTriangle, Plus, Edit, Trash2, ShoppingCart, Search, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { InventoryItem, ProcurementList } from '../../types';

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Rice',
    category: 'grains',
    currentStock: 500,
    unit: 'kg',
    minimumStock: 100,
    costPerUnit: 45,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Dal (Toor)',
    category: 'grains',
    currentStock: 80,
    unit: 'kg',
    minimumStock: 50,
    costPerUnit: 120,
    lastUpdated: '2024-01-15'
  },
  {
    id: '3',
    name: 'Onions',
    category: 'vegetables',
    currentStock: 25,
    unit: 'kg',
    minimumStock: 30,
    costPerUnit: 35,
    lastUpdated: '2024-01-14'
  },
  {
    id: '4',
    name: 'Potatoes',
    category: 'vegetables',
    currentStock: 150,
    unit: 'kg',
    minimumStock: 50,
    costPerUnit: 25,
    lastUpdated: '2024-01-14'
  },
  {
    id: '5',
    name: 'Milk',
    category: 'dairy',
    currentStock: 40,
    unit: 'liters',
    minimumStock: 50,
    costPerUnit: 55,
    lastUpdated: '2024-01-15'
  },
  {
    id: '6',
    name: 'Tomatoes',
    category: 'vegetables',
    currentStock: 75,
    unit: 'kg',
    minimumStock: 40,
    costPerUnit: 30,
    lastUpdated: '2024-01-15'
  },
  {
    id: '7',
    name: 'Wheat Flour',
    category: 'grains',
    currentStock: 200,
    unit: 'kg',
    minimumStock: 80,
    costPerUnit: 35,
    lastUpdated: '2024-01-14'
  },
  {
    id: '8',
    name: 'Cooking Oil',
    category: 'other',
    currentStock: 30,
    unit: 'liters',
    minimumStock: 25,
    costPerUnit: 120,
    lastUpdated: '2024-01-13'
  }
];

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pageSizeOptions = [5, 10, 25, 50, 100];
  const categories = ['vegetables', 'grains', 'dairy', 'spices', 'other'];

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minimumStock);
  
  const generateProcurementList = () => {
    const procurementItems = lowStockItems.map(item => ({
      itemId: item.id,
      itemName: item.name,
      requiredQuantity: item.minimumStock * 2 - item.currentStock,
      unit: item.unit,
      estimatedCost: (item.minimumStock * 2 - item.currentStock) * item.costPerUnit
    }));

    const totalCost = procurementItems.reduce((sum, item) => sum + item.estimatedCost, 0);

    const procurementList: ProcurementList = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      items: procurementItems,
      totalCost,
      status: 'pending',
      createdBy: 'Kitchen Manager'
    };

    console.log('Generated Procurement List:', procurementList);
    // In real app, this would save to backend
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vegetables': return 'bg-green-100 text-green-800';
      case 'grains': return 'bg-yellow-100 text-yellow-800';
      case 'dairy': return 'bg-blue-100 text-blue-800';
      case 'spices': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minimumStock) return 'low';
    if (item.currentStock <= item.minimumStock * 1.5) return 'medium';
    return 'good';
  };

  // Filter inventory based on search and filters
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || item.category === filterCategory;
      const stockStatus = getStockStatus(item);
      const matchesStatus = !filterStatus || stockStatus === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventory, searchTerm, filterCategory, filterStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredInventory.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStatus, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Procurement Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{lowStockItems.reduce((sum, item) => 
                  sum + ((item.minimumStock * 2 - item.currentStock) * item.costPerUnit), 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-3 border border-red-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-red-600 font-bold">{item.currentStock} {item.unit}</span>
                </div>
                <p className="text-sm text-gray-600">Min: {item.minimumStock} {item.unit}</p>
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
            {categories.map(category => (
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
                    <svg className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Category
                    <svg className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Current Stock
                    <svg className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Min Stock
                    <svg className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Cost/Unit
                    <svg className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Status
                    <svg className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No inventory items found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stockStatus === 'low' ? 'bg-red-100 text-red-800' :
                          stockStatus === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {stockStatus === 'low' ? 'Low Stock' :
                           stockStatus === 'medium' ? 'Medium' : 'Good'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors duration-150">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
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
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-gray-700">Per page</span>
              
              <div className="hidden sm:block text-sm text-gray-700">
                <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredInventory.length)}</span> of{' '}
                <span className="font-medium">{filteredInventory.length}</span> results
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
    </div>
  );
}