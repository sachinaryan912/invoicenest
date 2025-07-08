import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, doc, updateDoc, getDocs, serverTimestamp, orderBy, query, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthProvider';

const InvoiceGenerator = ({ invoiceToEdit }) => {
  const { user } = useAuth();
const [showModal, setShowModal] = useState(false);
const [items, setItems] = useState([{ projectName: '', quantity: 1, price: 0 }]);
const [clientSignature, setClientSignature] = useState(null);
 const [signatureFile, setSignatureFile] = useState(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [tax, setTax] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const currencySymbol = currency === 'INR' ? '₹' : '$';
  const currentDate = new Date().toISOString().split('T')[0];

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      const q = query(collection(db, 'invoices'), orderBy('invoiceNumber', 'desc'), limit(1));
      const snapshot = await getDocs(q);
      const last = snapshot.docs[0]?.data()?.invoiceNumber || 1000;
      setInvoiceNumber(last + 1);
    };
    if (!editingInvoiceId) fetchInvoiceNumber();
  }, [editingInvoiceId]);

  useEffect(() => {
    if (invoiceToEdit) {
      setEditingInvoiceId(invoiceToEdit.id);
      setClientName(invoiceToEdit.clientDetails?.name || '');
      setSignatureFile(invoiceToEdit.clientSignature || null);
      setClientSignature(invoiceToEdit.clientSignature ? URL.createObjectURL(invoiceToEdit.clientSignature) : null);
      setItems(invoiceToEdit.items || []);
      setLogo(invoiceToEdit.logo || null);
      setTax(invoiceToEdit.tax || 0);
      setCurrency(invoiceToEdit.currency || 'INR');
      setInvoiceNumber(invoiceToEdit.invoiceNumber || '');
    }
  }, [invoiceToEdit]);

  

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'projectName' ? value : parseFloat(value);
    setItems(updated);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!clientName || items.length === 0) return;

    try {
      setLoading(true);

      const invoiceData = {
        userId: user.uid,
        clientDetails: { name: clientName },
        items,
        currency,
        logo,
        subtotal,
        tax,
        total,
        createdAt: serverTimestamp(),
        invoiceNumber,
      };

      if (editingInvoiceId) {
        await updateDoc(doc(db, 'invoices', editingInvoiceId), invoiceData);
      } else {
        await addDoc(collection(db, 'invoices'), invoiceData);
      }

      // Reset form
      setSuccess(true);
      setEditingInvoiceId(null);
      setClientName('');
      setItems([{ projectName: '', quantity: 1, price: 0 }]);
      setTax(0);
      setLogo(null);
      setCurrency('INR');
      setInvoiceNumber('');
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-4 my-2">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {editingInvoiceId ? 'Edit Invoice' : 'Create Invoice'}
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="mt-2" />
            {logo && <img src={logo} alt="Logo" className="mt-3 w-24 h-24 object-contain" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="text"
              className="mt-2 block w-full px-4 py-2 border rounded bg-gray-100"
              value={currentDate}
              readOnly
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">Invoice Number</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border rounded bg-gray-100"
              value={invoiceNumber}
              readOnly
            />
          </div>
        </div>

       


        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              className="mt-1 block w-full px-4 py-2 border rounded-md"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax (%)</label>
            <input
              type="number"
              className="mt-1 block w-full px-4 py-2 border rounded-md"
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value))}
            />
          </div>
        </div>
<div className="flex justify-end mb-6">
  <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
  >
    ➕ Create Project
  </button>
</div>

{/* Tailwind Modal */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative shadow-lg">
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
      >
        ✖
      </button>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Project Details</h2>

      <div className="border rounded">
        <div className="grid grid-cols-5 bg-gray-100 text-gray-700 font-semibold py-2 px-3">
          <div>Project Name</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Total</div>
          <div>Action</div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 items-center px-3 py-2 border-t gap-2">
            <input
              className="border p-1 rounded"
              value={item.projectName || ''}
              onChange={(e) => handleItemChange(index, 'projectName', e.target.value)}
            />
            <input
              type="number"
              className="border p-1 rounded"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
            />
            <input
              type="number"
              className="border p-1 rounded"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
            />
            <div className="text-right pr-2">
              {currencySymbol}{(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              onClick={() => removeItem(index)}
              className="text-red-600 text-sm"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setItems([...items, { projectName: '', quantity: 1, price: 0 }])}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Add Another
        </button>
        <div className="text-right">
          <p>Subtotal: {currencySymbol}{subtotal.toFixed(2)}</p>
          <p>Tax ({tax}%): {currencySymbol}{taxAmount.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: {currencySymbol}{total.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={() => setShowModal(false)}
        className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save & Close
      </button>
    </div>
  </div>
)}

<div className="mt-6">
  <h3 className="text-lg font-semibold mb-4 text-gray-700">Project Summary</h3>
  {items.length === 0 ? (
    <p className="text-gray-500">No projects added yet.</p>
  ) : (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center border p-3 rounded shadow-sm bg-white"
        >
          <div>
            <p className="font-medium text-gray-800">{item.projectName}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity} | Price: {currencySymbol}{item.price}</p>
          </div>
          <div className="font-semibold text-green-700">
            {currencySymbol}{(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

       

      <div className="flex justify-between items-center mt-6">
         <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Upload Client Signature</label>
  <input
    type="file"
    accept="image/*"
    placeholder="Upload client signature"
    className="mt-1 block w-full px-4 py-2 border rounded-md"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setSignatureFile(file);
        setClientSignature(URL.createObjectURL(file));
      }
    }}
  />
  {clientSignature && (
    <img src={clientSignature} alt="Client Signature" className="mt-3 w-32 h-16 object-contain border" />
  )}
</div>
  <div className="w-full max-w-xs bg-gray-50 p-4 rounded shadow text-sm border">
    <div className="flex justify-between mb-2">
      <span className="text-gray-600">Subtotal</span>
      <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span className="text-gray-600">Tax ({tax}%)</span>
      <span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span>
    </div>
    <div className="flex justify-between border-t pt-2 mt-2">
      <span className="text-gray-800 font-semibold">Total</span>
      <span className="font-bold text-lg text-green-700">{currencySymbol}{total.toFixed(2)}</span>
    </div>
  </div>
</div>


        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : editingInvoiceId ? 'Update Invoice' : 'Save Invoice'}
        </button>

        {success && (
          <p className="mt-4 text-green-600 font-medium">Invoice {editingInvoiceId ? 'updated' : 'saved'} successfully!</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceGenerator;
