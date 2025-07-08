import React from 'react';
import { useAuth } from '../context/AuthProvider';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';
import dashboardBg from '/assets/image-hero.jpeg'; // use your background image path

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-wrapper" style={{ backgroundImage: `url(${dashboardBg})` }}>
      <div className="dashboard-overlay"></div>

      <div className="dashboard-content">
        <Navbar />

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
                <a href="/invoice-generator">Go to Invoice Generator →</a>
              </div>

              <div className="dashboard-card green">
                <h2>My Invoices</h2>
                <p>View, download, or delete your saved invoices.</p>
                <a href="/my-invoices">View Invoices →</a>
              </div>
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
