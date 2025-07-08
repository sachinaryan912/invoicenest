// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InvoiceGenerator from './pages/InvoiceGenerator';
import MyInvoices from './pages/MyInvoices';
import UserProfile from './components/UserProfile';
import Payment from './pages/PaymentPage';
import TemplateSelector from './components/TemplateSelector';
import InvoicePreview from './components/InvoicePreview';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomePage/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invoice-generator" element={<InvoiceGenerator />} />
            <Route path="/my-invoices" element={<MyInvoices />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/template-selector" element={<TemplateSelector />} />
            <Route path="/invoice-preview/:invoiceId" element={<InvoicePreview />} />
            <Route path="*" element={<h1 className="text-center text-2xl mt-10">404 - Page Not Found</h1>} />
          </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
