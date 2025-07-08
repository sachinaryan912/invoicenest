// src/components/InvoicePreview.jsx
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useParams } from 'react-router-dom';

const InvoicePreview = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;
      try {
        const invoiceRef = doc(db, 'invoices', invoiceId);
        const invoiceSnap = await getDoc(invoiceRef);
        if (invoiceSnap.exists()) {
          const invoiceData = invoiceSnap.data();
          setInvoice(invoiceData);

          const templateRef = doc(db, 'templates', invoiceData.templateUsed);
          const templateSnap = await getDoc(templateRef);
          if (templateSnap.exists()) {
            setTemplate(templateSnap.data());
          }
        }
      } catch (error) {
        console.error('Error loading invoice preview:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <p className="text-center mt-10">Loading preview...</p>;
  if (!invoice || !template) return <p className="text-center text-red-500">Invoice or template not found.</p>;

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto border p-6 rounded shadow bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-6">Invoice Preview</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: template.htmlCode }} />
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Client: {invoice.clientDetails?.name}</h3>
          <p className="text-sm text-gray-600 mb-4">Total: ₹{invoice.total.toFixed(2)}</p>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {invoice.items.map((item, idx) => (
              <li key={idx}>{item.description} — {item.quantity} × ₹{item.price}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
