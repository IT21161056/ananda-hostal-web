import React, { useState } from 'react';
import { CreditCard, FileText } from 'lucide-react';
import PaymentTracker from '../components/Finance/PaymentTracker';
import InvoiceGenerator from '../components/Finance/InvoiceGenerator';

export default function Finance() {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments');

  return (
    <div className="">
      <div>
        {/* <h2 className="text-2xl font-bold text-gray-900">Finance</h2>
        <p className="text-gray-600">Track payments, manage invoices, and monitor hostel finances</p> */}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Tracking
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'invoices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Invoice Management
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'payments' ? <PaymentTracker /> : <InvoiceGenerator />}
    </div>
  );
}