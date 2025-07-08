import React from 'react';
import { useAuth } from '../context/AuthProvider';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 mb-6">You're logged in as <strong>{user?.email}</strong>.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
              <h2 className="text-lg font-semibold text-blue-700">Create a New Invoice</h2>
              <p className="text-sm text-blue-700">Start generating and customizing your invoices easily.</p>
              <a href="/invoice-generator" className="inline-block mt-2 text-blue-600 hover:underline">Go to Invoice Generator →</a>
            </div>

            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
              <h2 className="text-lg font-semibold text-green-700">My Invoices</h2>
              <p className="text-sm text-green-700">View, download, or delete your saved invoices.</p>
              <a href="/my-invoices" className="inline-block mt-2 text-green-600 hover:underline">View Invoices →</a>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">AryanTech Invoice Generator &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
