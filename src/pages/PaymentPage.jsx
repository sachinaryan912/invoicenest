// src/pages/Payment.jsx
import React from 'react';

const Payment = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Upgrade to Premium</h2>

        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold mb-2">Premium Plan - ₹499</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Unlimited invoice templates</li>
            <li>PDF export & download</li>
            <li>Priority email support</li>
            <li>Access to all premium features</li>
          </ul>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="flex space-x-4">
            <input
              type="text"
              className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="MM/YY"
            />
            <input
              type="text"
              className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="CVC"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200"
          >
            Pay ₹499 & Upgrade
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Secured payment powered by <span className="font-semibold text-indigo-600">Stripe</span>
        </p>
      </div>
    </div>
  );
};

export default Payment;
