import React, { useState } from 'react';
import { UtensilsCrossed, Package } from 'lucide-react';
import MealPlanWeek from '../components/Meals/MealPlanWeek';
import InventoryManagement from '../components/Meals/InventoryManagement';

export default function Meals() {
  const [activeTab, setActiveTab] = useState<'planning' | 'inventory'>('planning');

  return (
    <div className=""> 
      <div>
        {/* <h2 className="text-2xl font-bold text-gray-900">Meal Planning</h2>
        <p className="text-gray-600">Manage weekly meal plans and kitchen inventory</p> */}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('planning')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'planning'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UtensilsCrossed className="h-4 w-4 mr-2" />
            Meal Planning
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="h-4 w-4 mr-2" />
            Inventory Management
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'planning' ? <MealPlanWeek /> : <InventoryManagement />}
    </div>
  );
}