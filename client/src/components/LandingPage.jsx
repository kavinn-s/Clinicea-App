import React from 'react';
import { Star } from 'lucide-react';

const LandingPage = ({ onStartBooking }) => {
  return (
    <div className="landing-container fade-in">
      <div className="profile-image-container">
        <img src="/doctor.jpeg" alt="Dr. B.Sindhu Raaghavi" />
      </div>
      
      <h1 className="doctor-name">Dr. B.Sindhu Raaghavi, MD</h1>
      <p className="doctor-title">MBBS, MD - Dermatology, Venereology & Leprosy</p>
      
      <div className="doctor-stats">
        <span>12 Years Experience</span>
        <div className="stat-divider"></div>
        <div className="stars">
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
        </div>
        <span>4.9 (595 reviews)</span>
      </div>

      <button className="btn-primary book-btn-large" onClick={onStartBooking}>
        Book an Appointment — Free
      </button>
    </div>
  );
};

export default LandingPage;
