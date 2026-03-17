import React from 'react';
import { CheckCircle, MapPin, Calendar, PartyPopper } from 'lucide-react';

const SuccessPage = ({ bookingDetails, onReset }) => {
  const { patientName, date, time, bookingId } = bookingDetails || {};
  
  // Format long date: Saturday, 14 March
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  const handleWhatsAppShare = () => {
    const message = `Hello! I've booked an appointment at Dr. Sindhu's Skin Clinic.\n\n📅 Date: ${formattedDate}\n⏰ Time: ${time}\n📍 Location: Velachery Main Road, Chennai\n🆔 Booking ID: ${bookingId}\n\nSee you there!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="animation-fade-in" style={{ 
        padding: '20px', 
        textAlign: 'center', 
        height: 'calc(100vh - 100px)', // Adjust for potential parent headers
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        boxSizing: 'border-box', 
        overflow: 'hidden' 
    }}>
      <div style={{ marginBottom: '16px' }}>
        <CheckCircle size={56} color="#157367" strokeWidth={1.5} />
      </div>
      
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
        You're all set, {patientName || 'Patient'}! <PartyPopper size={24} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </h1>
      <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '24px' }}>Your appointment is confirmed</p>

      <div style={{ 
          maxWidth: '480px', 
          width: '100%', 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          border: '1px solid #e5e7eb', 
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', 
          overflow: 'hidden',
          marginBottom: '24px'
      }}>
        <div style={{ padding: '24px', textAlign: 'left' }}>
          {/* Doctor Info */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Doctor</p>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>Dr. B.Sindhu Raaghavi</h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>MBBS, MD - Dermatology, Venereology & Leprosy</p>
          </div>

          <div style={{ height: '1px', backgroundColor: '#f3f4f6', marginBottom: '16px' }}></div>

          {/* Date & Time */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Date & Time</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', fontWeight: '600', fontSize: '15px' }}>
              <Calendar size={16} color="#157367" />
              <span>{formattedDate} at {time}</span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#f3f4f6', marginBottom: '16px' }}></div>

          {/* Location */}
          <div style={{ marginBottom: '4px' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Location</p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#111827', fontWeight: '600', fontSize: '15px' }}>
              <MapPin size={16} color="#157367" style={{ marginTop: '2px' }} />
              <span>Velachery Main Road, Chennai</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '480px' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>
          Booking ID: <strong style={{ color: '#4b5563' }}>{bookingId || 'PENDING'}</strong>
        </p>
        
        <div style={{ display: 'flex', gap: '16px' }}>
            <button 
                onClick={onReset}
                style={{ flex: 1, padding: '14px 24px', backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
                Book Another
            </button>
            <button 
                onClick={handleWhatsAppShare}
                style={{ flex: 1, padding: '14px 24px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
            >
                Share on WhatsApp
            </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
