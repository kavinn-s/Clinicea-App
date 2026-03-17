import React from 'react';
import { CheckCircle, MapPin, Calendar, Clock, PartyPopper } from 'lucide-react';

const SuccessPage = ({ bookingDetails }) => {
  const { patientName, date, time, bookingId } = bookingDetails || {};
  
  // Format long date: Saturday, 14 March
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="animation-fade-in" style={{ padding: '40px 20px', textAlign: 'center', minHeight: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <CheckCircle size={64} color="#157367" strokeWidth={1} />
      </div>
      
      <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
        You're all set, {patientName || 'Patient'}! <PartyPopper size={24} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </h1>
      <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '40px' }}>Your appointment is confirmed</p>

      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '32px', textAlign: 'left' }}>
          {/* Doctor Info */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Doctor</p>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>Dr. B.Sindhu Raaghavi</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>MBBS, MD - Dermatology, Venereology & Leprosy</p>
          </div>

          <div style={{ height: '1px', backgroundColor: '#f3f4f6', marginBottom: '24px' }}></div>

          {/* Date & Time */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Date & Time</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', fontWeight: '600', fontSize: '16px' }}>
              <Calendar size={18} color="#157367" />
              <span>{formattedDate} at {time}</span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#f3f4f6', marginBottom: '24px' }}></div>

          {/* Location */}
          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Location</p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#111827', fontWeight: '600', fontSize: '16px' }}>
              <MapPin size={18} color="#157367" style={{ marginTop: '2px' }} />
              <span>Velachery Main Road, Chennai</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p style={{ fontSize: '14px', color: '#9ca3af' }}>
          Booking ID: <strong style={{ color: '#4b5563' }}>{bookingId || 'PENDING'}</strong>
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
