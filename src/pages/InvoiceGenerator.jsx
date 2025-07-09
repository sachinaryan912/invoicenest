import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, doc, updateDoc, getDocs, serverTimestamp, orderBy, query, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthProvider';
import '../styles/InvoiceGenerator.css'; // Import your CSS styles
import invoicedBg from '/assets/hero-image2.jpeg';
import { toast } from 'react-toastify';


const InvoiceGenerator = ({ invoiceToEdit }) => {
const { user } = useAuth();
const [showModal, setShowModal] = useState(false);
const [items, setItems] = useState([{ projectName: '', quantity: 1, price: 0 }]);
const [clientSignature, setClientSignature] = useState(null);
 const [signatureFile, setSignatureFile] = useState(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  // const [clientName, setClientName] = useState('');
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

 const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const handleLogoChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const base64 = await toBase64(file);
    setLogo(base64); // Store in state
  }
};

const handleSignatureChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const base64 = await toBase64(file);
    setClientSignature(base64);
  }
};



// const uploadFile = async (file, path) => {
//   const filePath = `${path}/${file.name}`;
//   const fileRef = ref(storage, filePath);
//   await uploadBytes(fileRef, file);
//   return filePath; // 🔁 Return only the storage path
// };






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
      // setClientName(invoiceToEdit.clientDetails?.name || '');
      setSignatureFile(invoiceToEdit.clientSignature || '');
      setClientSignature(invoiceToEdit.clientSignature || '');
      setItems(invoiceToEdit.items || []);
      setLogo(invoiceToEdit.logo || '');
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

  


const handleSubmit = async () => {
  if (items.length === 0) {
    toast.error('Please enter at least one project item.');
    return;
  }

  try {
    setLoading(true);

    const invoiceData = {
      userId: user.uid,
      items,
      currency,
      logo: logo || '',
      clientSignature: clientSignature || '',
      subtotal,
      tax,
      total,
      createdAt: serverTimestamp(),
      invoiceNumber,
    };

    if (editingInvoiceId) {
      await updateDoc(doc(db, 'invoices', editingInvoiceId), invoiceData);
      toast.success('Invoice updated successfully!');
    } else {
      await addDoc(collection(db, 'invoices'), invoiceData);
      toast.success('Invoice saved successfully!');
    }

    // Reset state
    setEditingInvoiceId(null);
    setItems([{ projectName: '', quantity: 1, price: 0 }]);
    setTax(0);
    setLogo(null);
    setClientSignature(null);
    setCurrency('INR');
    setInvoiceNumber('');
  } catch (error) {
    console.error('Error saving invoice:', error);
    toast.error('Failed to save invoice. Please try again.');
  } finally {
    setLoading(false);
  }
};





  return (
     <div className="invoice-wrapper" style={{ backgroundImage: `url(${invoicedBg})` }}>
      <div className="invoice-overlay"></div>
       <div className="invoice-content">
        <h1 className="text-4xl font-bold mb-6  text-yellow-600" style={{padding: '20px',}}>
          {editingInvoiceId ? 'Edit Invoice' : 'Create Invoice'}
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium ">Upload Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="mt-2" />
            {logo && <img src={logo} alt="Logo" className="mt-2 h-16 w-auto border rounded" />}
          </div>
          <div>
            <label className="block text-sm font-medium ">Date</label>
            <input
              type="text"
              className="mt-2 block w-full px-4 py-2 border rounded "
              value={currentDate}
              placeholder='YYYY-MM-DD'
              readOnly
            />
            <label className="block  text-sm font-medium  mt-4">Invoice Number</label>
            <input
              type="text"
              className="mt-1 block  w-full px-4 py-2 border rounded "
              placeholder='Invoice Number'
              value={invoiceNumber}
              readOnly
            />
          </div>
        </div>

       


        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium ">Currency</label>
            <select
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-black"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium ">Tax (%)</label>
            <input
              type="number"
              className="mt-1 block w-full px-4 py-2 border rounded-md"
              value={tax}
              placeholder='Enter tax percentage'
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-[#1a1a1a] model-form rounded-2xl w-full max-w-4xl p-8 relative shadow-2xl border border-gray-700">
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
      >
        ✖
      </button>

      <h2 className="text-2xl font-bold text-white mb-6">Add Project Details</h2>

      <div className="border border-gray-600 rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 bg-gray-800 text-gray-300 font-semibold py-3 px-4">
          <div>Project Name</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Total</div>
          <div>Action</div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 items-center px-4 py-3 border-t border-gray-700 gap-2 bg-[#222]">
            <input
              className="bg-black text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={item.projectName || ''}
              onChange={(e) => handleItemChange(index, 'projectName', e.target.value)}
              placeholder="Project Name"
            />
            <input
              type="number"
              className="bg-black text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              placeholder="Qty"
            />
            <input
              type="number"
              className="bg-black text-white border border-gray-600 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              placeholder="Price"
            />
            <div className="text-right pr-2 text-white">
              {currencySymbol}{(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 text-lg hover:text-red-700"
              title="Remove item"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setItems([...items, { projectName: '', quantity: 1, price: 0 }])}
          className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          ➕ Add Another
        </button>
        <div className="text-right text-white">
          <p>Subtotal: {currencySymbol}{subtotal.toFixed(2)}</p>
          <p>Tax ({tax}%): {currencySymbol}{taxAmount.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: {currencySymbol}{total.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={() => setShowModal(false)}
        className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Save & Close
      </button>
    </div>
  </div>
)}


<div className="mt-6">
  <h3 className="text-lg font-semibold mb-4 ">Project Summary</h3>
  {items.length === 0 ? (
    <p className="text-gray-500">No projects added yet.</p>
  ) : (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center border border-gray-600  px-3 rounded shadow-sm"
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
    onChange={handleSignatureChange}
   
  />
 {clientSignature && (
  <img src={clientSignature} alt="Client Signature" className="mt-2 h-16 w-auto border rounded" />
  // <p className="mt-2 text-green-700 text-sm">Saved file name: {clientSignature}</p>
)}
</div>
  <div className="w-full max-w-xs bg-[#1f1f1f] p-4 padding-design rounded-lg shadow-lg text-sm border border-gray-700 text-white">
  <div className="flex justify-between mb-2">
    <span className="text-gray-400">Subtotal</span>
    <span className="font-medium text-white">{currencySymbol}{subtotal.toFixed(2)}</span>
  </div>
  <div className="flex justify-between mb-2">
    <span className="text-gray-400">Tax ({tax}%)</span>
    <span className="font-medium text-white">{currencySymbol}{taxAmount.toFixed(2)}</span>
  </div>
  <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
    <span className="text-gray-200 font-semibold">Total</span>
    <span className="font-bold text-lg text-green-400">{currencySymbol}{total.toFixed(2)}</span>
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
          <p className="mt-4 text-white font-medium">Invoice {editingInvoiceId ? 'updated' : 'saved'} successfully!</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceGenerator;
