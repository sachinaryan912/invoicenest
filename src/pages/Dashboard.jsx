import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import dashboardBg from '/assets/image-hero.jpeg';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config'; // adjust path if needed
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentInvoices, setRecentInvoices] = useState([]);


  useEffect(() => {
    const fetchRecentInvoices = async () => {
      if (!user?.uid) return;
      const q = query(
        collection(db, 'invoices'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const snapshot = await getDocs(q);
      const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentInvoices(invoices);
    };

    fetchRecentInvoices();
  }, [user]);

  return (
    <div className="dashboard-wrapper" style={{ backgroundImage: `url(${dashboardBg})` }}>
      <div className="dashboard-overlay"></div>
      <div className="dashboard-content">
        <div className="dashboard-container">
          <div className="dashboard-box">
            <h1 className="dashboard-title">Welcome Back!</h1>
            <p className="dashboard-subtitle">
              You're logged in as <strong>{user?.email}</strong>.
            </p>

            <div className="dashboard-grid">
              <div className="dashboard-card orange">
                <h2>Create a New Invoice</h2>
                <p>Start generating and customizing your invoices easily.</p>
                <Link to="/invoice-generator">Go to Invoice Generator →</Link>
              </div>
              <div className="dashboard-card green">
                <h2>My Invoices</h2>
                <p>View, download, or delete your saved invoices.</p>
                <Link to="/my-invoices">View Invoices →</Link>
              </div>
            </div>

            {/* --- Plan Info Section --- */}
            <div className="plan-info">
              <h3>Plan Information</h3>
              <p><strong>Plan:</strong> Free Tier</p>
              <p><strong>Invoices Allowed:</strong> 10/month</p>
              <p><strong>Upgrade:</strong> Coming soon!</p>
            </div>

            {/* --- Recent Invoices Section --- */}
            <div className="recent-invoices">
              <h3>Recent Invoices</h3>
              {recentInvoices.length === 0 ? (
                <p>No recent invoices found.</p>
              ) : (
                <ul>
                  {recentInvoices.map(invoice => (
                    <li key={invoice.id}>
                      <strong>{invoice.clientName || 'Unnamed Client'}</strong> — ₹{invoice.total || 0}
                      <span className="date">{new Date(invoice.createdAt?.toDate()).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="dashboard-footer">
              AryanTech Invoice Generator &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
