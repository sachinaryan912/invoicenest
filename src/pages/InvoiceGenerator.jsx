// src/pages/InvoiceGenerator.jsx
import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthProvider';

const InvoiceGenerator = () => {
  const { user } = useAuth();
  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'description' ? value : parseFloat(value);
    setItems(updatedItems);
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = async () => {
    if (!clientName || items.length === 0) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'invoices'), {
        userId: user.uid,
        clientDetails: { name: clientName },
        items,
        total,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setClientName('');
      setItems([{ description: '', quantity: 1, price: 0 }]);
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Invoice</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Client Name</label>
          <input
            type="text"
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Description"
                className="col-span-1 px-3 py-2 border rounded"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                className="col-span-1 px-3 py-2 border rounded"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                className="col-span-1 px-3 py-2 border rounded"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Item
          </button>
          <p className="text-lg font-semibold">Total: ₹{total.toFixed(2)}</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Invoice'}
        </button>

        {success && (
          <p className="mt-4 text-green-600 font-medium">Invoice saved successfully!</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceGenerator;