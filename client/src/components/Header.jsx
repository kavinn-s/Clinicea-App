import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <a href="/" className="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#157367" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="#157367" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12L21 7" stroke="#157367" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12L3 7" stroke="#157367" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        DR. SINDHU'S
        <span style={{ fontSize: '12px', fontWeight: '400', letterSpacing: '1px', opacity: 0.7, marginLeft: '-4px' }}>SKIN CLINIC</span>
      </a>

      <div className="header-right">
        <div className="location-badge">
          <MapPin size={16} color="#157367" />
          Velachery, Chennai
        </div>
        <button className="book-btn-small">
          <Phone size={14} />
          Book: +91 98765 43210
        </button>
      </div>
    </header>
  );
};

export default Header;
