import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'react-toastify';
import invoicedBg from '/assets/hero-image2.jpeg';
import '../styles/invoice.css'; // Ensure you have this CSS file for styling

const InvoiceGenerator = ({ invoiceToEdit }) => {
  const { user } = useAuth();
const [showEditModal, setShowEditModal] = useState(false);
const [invoiceNumber, setInvoiceNumber] = useState(''); // will be fetched
  const [items, setItems] = useState([{ projectName: '', quantity: 1, price: 0 }]);
  const [clientName, setClientName] = useState('');
  const [logo, setLogo] = useState(null);
  const [clientSignature, setClientSignature] = useState(null);
  const [tax, setTax] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [invoiceDate, setInvoiceDate] = useState(today); // today = new Date().toISOString().split('T')[0]

  const currencySymbol = currency === 'INR' ? '₹' : '$';
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

   const draftInvoices  =()=> {
  toast.success('Draft saved successfully!');
}

  // Convert file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) setLogo(await toBase64(file));
  };

  const handleSignatureChange = async (e) => {
    const file = e.target.files[0];
    if (file) setClientSignature(await toBase64(file));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'projectName' ? value : parseFloat(value);
    setItems(updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
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
        clientSignature,
      };

      if (editingInvoiceId) {
        await updateDoc(doc(db, 'invoices', editingInvoiceId), invoiceData);
      } else {
        await addDoc(collection(db, 'invoices'), invoiceData);
      }

      setSuccess(true);
      setEditingInvoiceId(null);
      setClientName('');
      setItems([{ projectName: '', quantity: 1, price: 0 }]);
      setTax(0);
      setLogo(null);
      setClientSignature(null);
      setCurrency('INR');
      setInvoiceNumber('');
      toast.success('Invoice saved successfully!');
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

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
      setItems(invoiceToEdit.items || []);
      setLogo(invoiceToEdit.logo || null);
      setTax(invoiceToEdit.tax || 0);
      setCurrency(invoiceToEdit.currency || 'INR');
      setInvoiceNumber(invoiceToEdit.invoiceNumber || '');
      setClientSignature(invoiceToEdit.clientSignature || null);
    }
  }, [invoiceToEdit]);

  return (
      <div className="invoice-wrapper" style={{ backgroundImage: `url(${invoicedBg})` , padding: '20px', marginTop: '20px'}}>
          <div className="invoice-overlay"></div>
    
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">{editingInvoiceId ? 'Edit Invoice' : 'Create Invoice'}</h1>
      {/* Logo & Invoice Info */}
      <div className="invoice-content">
        <div className="grid grid-cols-4 gap-4">
  <div className="col-span-3  text-white p-4 rounded">
    {/* Left (2/3 width) */}
     <div className="grid grid-cols-2 gap-6 mb-6">

        <div>
          <label className="block mb-2">Upload Logo</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} className='border border-gray-500 rounded-2xl' />
          {logo && <img src={logo} className="mt-2 h-16 w-auto border border-gray-500 rounded shadow" alt="logo" />}
        </div>
        <div>
<div className="relative bg-gray-800 text-white p-6 rounded-lg mb-4" style={{ padding: '20px' }}>
  {/* Edit Button - top-right */}
  <h1 className='text-2xl font-semibold'>Invoice Details</h1>
  <button
    onClick={() => setShowEditModal(true)}
    className="absolute top-1 right-1 invoice-btn secondary px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
  >
    ✏️ Edit Invoice Info
  </button>

  {/* Grid Content */}
  <div className="grid grid-cols-2 gap-4" style={{ marginTop: '50px' }}>
    <p>
      <span className="font-semibold text-gray-300"> Invoice Date:</span> {invoiceDate}
    </p>
    <p>
      <span className="font-semibold text-gray-300"> Due Date:</span> {invoiceDate}
    </p>
    <p>
      <span className="font-semibold text-gray-300">Invoice #:</span> {invoiceNumber}
    </p>
  </div>
</div>


{showEditModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white text-black p-6 rounded shadow-lg w-full max-w-md relative">
      
      {/* Close Button */}
      <button
        onClick={() => setShowEditModal(false)}
        className="absolute top-2 right-2 text-xl text-gray-600 hover:text-black"
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold mb-4">Edit Invoice Info</h2>

      <div className="mb-4">
        <label className="block mb-2">Invoice Date</label>
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Invoice Number</label>
        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="text-right">
        <button
          onClick={() => setShowEditModal(false)}
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


        </div>
        </div>
      

      
<div className="grid grid-cols-2 font-bold  gap-10 pb-2 mb-2 justify-center items-center" style={{marginTop: '20px'}}>
      {/* Client Info */}
      <div className="mb-6">
        <label className="block mb-2">Client Name</label>
        <input
          type="text"
          value={clientName}
          placeholder='Enter Client Name'
          onChange={(e) => setClientName(e.target.value)}
          className="w-full border border-gray-500 p-2 rounded-2xl"
        />
      </div>
         {/* Project Button */}
          <div>
      <div className="mb-4 text-right">
        <button onClick={() => setShowModal(true)} className="invoice-btn secondary">
          ➕ Create Project
        </button>
       </div>
       <h1>Project Summery</h1>
{items.length > 0 ? (
  items.map((item, index) => (
    <div
      key={index}
      className="mb-3 bg-gray-800 text-white rounded-2xl  shadow-sm hover:shadow-md transition duration-300"
   style={{padding:'15px'}} >
      <p className="mb-1">
        <span className="font-semibold text-gray-300">Project:</span> {item.projectName}
      </p>
      <p>
        <span className="font-semibold text-gray-300">Quantity:</span> {item.quantity}
      </p>
    </div>
  ))
) : (
  <div className="text-center text-gray-400 italic p-4 border border-dashed border-gray-500 rounded-lg">
    No project items added yet.
  </div>
)}

</div>

     
</div>

      {/* Modal for Project Details */}
     {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/100">
    <div className="bg-gray-700 text-white p-6 rounded shadow-lg w-full max-w-4xl relative " style={{ padding: '20px' }}>
      {/* ❌ Close button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-black"
      >
        &times;
      </button>

      <h2 className="text-xl font-bold mb-4">Add Project Details</h2>

      <div className="grid grid-cols-5 font-bold border-b pb-2 mb-2">
        <div>Project</div>
        <div>Qty</div>
        <div>Price</div>
        <div>Total</div>
        <div>Action</div>
      </div>

      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 items-center mb-2">
          <input
            className="border p-1 rounded"
            value={item.projectName}
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
          <div>{currencySymbol}{(item.price * item.quantity).toFixed(2)}</div>
          <button
            onClick={() => removeItem(index)}
            className="text-red-500"
          >
            🗑
          </button>
        </div>
      ))}

      <button
        onClick={() => setItems([...items, { projectName: '', quantity: 1, price: 0 }])}
        className="invoice-btn secondary mt-4"
      >
        ➕ Add More
      </button>

      <div className="text-center   " style={{ margin: '20px 0' }}>
        <button
          onClick={() => setShowModal(false)}
          className="invoice-btn"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}


<div className="grid grid-cols-2 font-bold  pb-2 mb-2" style={{marginTop: '20px'}}>

      <div className="mb-6">
        <label className="block mb-2">Upload Client Signature</label>
        <input type="file" accept="image/*" onChange={handleSignatureChange} className='border border-gray-500 rounded-2xl' />
        {clientSignature && <img src={clientSignature} className="mt-2 h-16 w-auto border rounded" alt="signature" />}
      </div>

      {/* Summary Section */}
      <div className="bg-gray-900 p-4 rounded text-white mb-6" style={{padding: '20px'}}>
        <h2 className="text-xl font-bold mb-2">Invoice Summary</h2>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{currencySymbol}{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-b">
          <span>
            Tax <span className="text-yellow-400 ml-1">⚖</span>
          </span>
          <span>{currencySymbol}{taxAmount.toFixed(2)} ({tax}%)</span>
        </div>
        <div className="flex justify-between font-bold text-green-400">
          <span>Total</span>
          <span>{currencySymbol}{total.toFixed(2)}</span>
        </div>
      </div>
</div>
      {/* Signature Upload */}

  </div>
  <div className="col-span-1  text-white p-4 rounded">
    {/* Right (1/3 width) */}
    {/* Currency & Tax */}
      <div className="grid grid-cols-1  gap-6 mb-6">
        <div>
          <label className="block mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border bg-black text-white padding-design rounded"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Tax (%)</label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>
  </div>
</div>
      
   

      {/* Submit Button */}
      <div className="flex justify-center gap-12 my-4" style={{ marginTop: '20px' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="invoice-btn primary px-6 py-2 bg-green-600 text-white rounded"
        >
          {loading ? 'Saving...' : editingInvoiceId ? 'Update Invoice' : 'Save Invoice'}
        </button>
        <button
          onClick={draftInvoices}
          disabled={loading}
          className="invoice-btn secondary px-6 py-2 bg-yellow-500 text-white rounded"
        >
          {loading ? 'Saving...' : editingInvoiceId ? 'Update Invoice' : 'Draft Invoice'}
        </button>
      </div>

      {/* {success && <p className="mt-4 text-green-400">Invoice saved successfully!</p>} */}
      </div>
    </div>
  );
};

export default InvoiceGenerator;
