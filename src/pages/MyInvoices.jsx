import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../context/AuthProvider';
import html2pdf from 'html2pdf.js';
import InvoiceGenerator from './InvoiceGenerator';
import { toast } from 'react-toastify';
import '../styles/InvoiceGenerator.css'; // Import your CSS styles
import invoicedBg from '/assets/hero-image2.jpeg';

const MyInvoices = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
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
        console.log('Fetched Invoices:', userInvoices);
      };
      fetchInvoices();
    }
  }, [user]);

  const handleDownload = async (invoiceId) => {
    try {
      const url = await getDownloadURL(ref(storage, `invoices/${user.uid}/${invoiceId}.pdf`));
      window.open(url, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (invoiceId) => {
    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
      // await deleteObject(ref(storage, `invoices/${user.uid}/${invoiceId}.pdf`));
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
      toast('Invoice deleted successfully', {
  style: {
    background: '#ff4d4f',
    color: '#fff',
  },
  icon: '🗑️',
});
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleGeneratePDF = (invoice) => {
    const element = document.getElementById(`invoice-${invoice.id}`);
    element.style.display = 'block';

    const opt = {
      margin: 0.5,
      filename: `Invoice-${invoice.invoiceNumber || invoice.clientDetails?.name || 'Client'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = 'none';
    });
  };

  return (
    <div className="invoice-wrapper" style={{ backgroundImage: `url(${invoicedBg})` }}>
      <div className="invoice-overlay"></div>
      <div className="invoice-content">
        <h1 className="text-3xl font-bold mb-6 text-white-800">My Invoices</h1>

        {invoices.length === 0 ? (
          <p className="text-gray-600">No invoices found.</p>
        ) : (
          <ul className="space-y-6">
            {invoices.map(invoice => (
              <li key={invoice.id} className="p-4 border rounded-md shadow-sm text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {invoice.logo && (
                      <img
                        src={invoice.logo}
                        alt="Logo"
                        className="h-12 w-12 object-contain border rounded"
                      />
                    )}
                    <div>
                      <p className="text-sm ">Invoice No: <strong>{invoice.invoiceNumber || 'N/A'}</strong></p>
                      <h2 className="text-lg font-semibold ">
                        {invoice.items.length > 0
                          ? invoice.items.map((item) => item.projectName).join(', ')
                          : "None"}
                      </h2>
                      <p className="text-sm ">
                        Date: {invoice.createdAt?.seconds ? new Date(invoice.createdAt.seconds * 1000).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2 invoice-buttons">
                    {/* <button
                      onClick={() => handleDownload(invoice.id)}
                      className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Download
                    </button> */}
                    <button
                      onClick={() => handleGeneratePDF(invoice)}
                      className="invoice-btn"
                    >
                      Generate PDF
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="invoice-btn secondary"
                    >
                      Delete
                    </button>
                    {/* <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="px-4 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      ✏️ Edit
                    </button> */}
                  </div>
                </div>

                {/* Hidden printable PDF template */}
                <div
                  id={`invoice-${invoice.id}`}
                  style={{
                    display: 'none',
                    width: '800px',
                    backgroundColor: '#ffffff',
                    padding: '40px',
                    color: '#000',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {invoice.logo && (
                      <img src={invoice.logo} alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
                    )}
                    <div style={{ textAlign: 'right' }}>
                      <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>INVOICE</h2>
                      <p><strong>Invoice No:</strong> {invoice.invoiceNumber || 'N/A'}</p>
                      <p><strong>Date:</strong> {invoice.createdAt?.seconds ? new Date(invoice.createdAt.seconds * 1000).toLocaleDateString() : ''}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: '30px' }}>
                    <p><strong>Bill To:</strong></p>
                    <p>{invoice.clientDetails?.name}</p>
                    {invoice.clientDetails?.email && <p>{invoice.clientDetails.email}</p>}
                  </div>

                  <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={thStyle}>Project Name</th>
                        <th style={thStyle}>Qty</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items?.map((item, index) => (
                        <tr key={index}>
                          <td style={tdStyle}>{item.projectName}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{item.quantity}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>
                            {invoice.currency === 'USD' ? '$' : '₹'}{item.price.toFixed(2)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>
                            {invoice.currency === 'USD' ? '$' : '₹'}{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: '30px', textAlign: 'right' }}>
                    <p>Subtotal: {invoice.currency === 'USD' ? '$' : '₹'}{invoice.subtotal?.toFixed(2)}</p>
                    <p>Tax ({invoice.tax || 0}%): {invoice.currency === 'USD' ? '$' : '₹'}{((invoice.subtotal || 0) * (invoice.tax || 0) / 100).toFixed(2)}</p>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      Total: {invoice.currency === 'USD' ? '$' : '₹'}{invoice.total?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

const thStyle = {
  border: '1px solid #d1d5db',
  padding: '8px',
  fontSize: '14px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #d1d5db',
  padding: '8px',
  fontSize: '14px',
};

export default MyInvoices;
