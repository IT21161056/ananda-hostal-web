import React from 'react';
import { Calendar, DollarSign, Users } from 'lucide-react';
import { mockMealPlans } from '../../data/mockData';

export default function MealPlanWeek() {
  const totalWeeklyCost = mockMealPlans.reduce((sum, plan) => sum + plan.estimatedCost, 0);
  const averageDailyCost = Math.round(totalWeeklyCost / 7);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Week</p>
              <p className="text-2xl font-bold text-gray-900">Week 3</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekly Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalWeeklyCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average/Day</p>
              <p className="text-2xl font-bold text-gray-900">₹{averageDailyCost}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Meal Plan</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockMealPlans.map((plan) => (
            <div key={plan.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">{plan.day}</h4>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  ₹{plan.estimatedCost}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-orange-600">Breakfast</h5>
                  <p className="text-sm text-gray-700">{plan.breakfast}</p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-blue-600">Lunch</h5>
                  <p className="text-sm text-gray-700">{plan.lunch}</p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-purple-600">Dinner</h5>
                  <p className="text-sm text-gray-700">{plan.dinner}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}