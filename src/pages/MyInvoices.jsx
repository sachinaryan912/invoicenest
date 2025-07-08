// src/pages/MyInvoices.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../context/AuthProvider';

const MyInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchInvoices = async () => {
        const snapshot = await getDocs(collection(db, 'invoices'));
        const userInvoices = snapshot.docs
          .filter(doc => doc.data().userId === user.uid)
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setInvoices(userInvoices);
      };
      fetchInvoices();
    }
  }, [user]);

  const handleDownload = async (invoiceId) => {
    const url = await getDownloadURL(ref(storage, `invoices/${user.uid}/${invoiceId}.pdf`));
    window.open(url, '_blank');
  };

  const handleDelete = async (invoiceId) => {
    await deleteDoc(doc(db, 'invoices', invoiceId));
    await deleteObject(ref(storage, `invoices/${user.uid}/${invoiceId}.pdf`));
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Invoices</h1>
        {invoices.length === 0 ? (
          <p className="text-gray-600">No invoices found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {invoices.map(invoice => (
              <li key={invoice.id} className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{invoice.clientDetails?.name || 'Unnamed Client'}</h3>
                  <p className="text-sm text-gray-500">{new Date(invoice.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleDownload(invoice.id)}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyInvoices;
