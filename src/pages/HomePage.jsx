import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import invoiceImg from '/assets/hero-image2.jpeg';

const HomePage = () => {
  return (
    <div className="home-hero-wrapper" style={{ backgroundImage: `url(${invoiceImg})` }}>
      <div className="home-overlay">
        <div className="home-content">
          <p className="home-tagline">📄 Easy. Secure. Professional.</p>

          <h1 className="home-title">
            Simplify Invoicing with <span>INVOICENEST</span>
          </h1>

          <p className="home-subtitle">
            Create, preview, and send beautiful invoices in seconds.
            Empower your business with automation and ease.
          </p>

          <ul className="home-features">
            <li> Instant invoice preview & PDF download</li>
            <li> Save drafts and manage client data</li>
            <li> Sync across devices, powered by cloud</li>
          </ul>

          <div className="home-buttons">
            <Link to="/register" className="home-btn">Get Started</Link>
            <Link to="/login" className="home-btn secondary">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
