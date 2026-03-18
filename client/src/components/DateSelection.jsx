import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sun, Sunset, Moon } from 'lucide-react';
import { API_BASE_URL } from '../config';

const DateSelection = ({ onSelectionComplete, onDateChange, onTimeChange, selectedDate, selectedTime }) => {
  const [availableSlots, setAvailableSlots] = useState({ morning: [], afternoon: [], evening: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const slotsRef = useRef(null);

  // Get Today's date in IST (since clinician is in Chennai)
  const todayDate = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const today = todayDate.getDate();
  const currentMonthIdx = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();

  // Calculate dynamic days in month
  const daysInMonthCount = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);
  
  // Calculate start day for the current month grid
  const monthStart = new Date(currentYear, currentMonthIdx, 1);
  const startDay = monthStart.getDay(); // 0 (Sun) to 6 (Sat)
  
  const monthName = todayDate.toLocaleString('default', { month: 'long' });

  // Core helper to determine if a specific day is a Sunday
  const isSunday = (day) => (startDay + day - 1) % 7 === 0;

  const handleDateClick = async (day) => {
    // Disable past dates and Sundays (100% accurate calculation)
    if (day < today || isSunday(day)) return;
    
    // Create actual YYYY-MM-DD string
    const monthStr = String(currentMonthIdx + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const targetDate = `${currentYear}-${monthStr}-${dayStr}`;
    
    onDateChange(targetDate);
    onTimeChange(null);
    setLoading(true);
    setError(null);

    // Improved Auto-scroll for mobile
    setTimeout(() => {
      if (slotsRef.current) {
        slotsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/slots?date=${targetDate}`);
      if (!response.ok) throw new Error('Failed to fetch slots');
      const data = await response.json();
      
      if (data.availableSlots) {
        setAvailableSlots(data.availableSlots);
      } else {
        // Fallback
        setAvailableSlots({
          morning: [{ time: '09:00', available: true }, { time: '10:00', available: true }],
          afternoon: [{ time: '13:00', available: true }, { time: '14:30', available: true }],
          evening: [{ time: '16:00', available: true }, { time: '17:30', available: true }]
        });
      }

      // Scroll again once slots are actually visible
      setTimeout(() => {
        if (slotsRef.current) {
          slotsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);

    } catch (err) {
      console.error(err);
      setError("Failed to load slots from server");
      // Fallback
      setAvailableSlots({
          morning: [{ time: '09:00', available: true }, { time: '10:00', available: true }],
          afternoon: [{ time: '13:00', available: true }, { time: '14:30', available: true }],
          evening: [{ time: '16:00', available: true }, { time: '17:30', available: true }]
        });
    } finally {
      setLoading(false);
    }
  };

  const isPast = (day) => day < today;

  React.useEffect(() => {
    if (selectedDate && selectedTime) {
      onSelectionComplete(true);
    } else {
      onSelectionComplete(false);
    }
  }, [selectedDate, selectedTime, onSelectionComplete]);

  return (
    <div className="wizard-content">
      {/* Calendar Panel */}
      <div className="panel panel-left calendar-panel">
        <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px' }}>{monthName} {currentYear}</h3>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>{day}</div>
          ))}

          {/* Empty cells for start day alignment */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {daysInMonth.map((day) => {
            const isDisabled = isSunday(day) || isPast(day);
            const monthStr = String(currentMonthIdx + 1).padStart(2, '0');
            const targetDateStr = `${currentYear}-${monthStr}-${String(day).padStart(2, '0')}`;
            const isSelected = selectedDate === targetDateStr;
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                style={{
                  height: '40px',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: isSelected ? '600' : '400',
                  backgroundColor: isSelected ? '#157367' : (isDisabled ? '#f1f5f9' : 'transparent'),
                  color: isSelected ? 'white' : (isDisabled ? '#cbd5e1' : '#1F2937'),
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  border: isSelected ? '1px solid #157367' : '1px solid transparent',
                }}
                disabled={isDisabled}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>
          Closed on Sundays
        </div>
      </div>

      {/* Slots Panel */}
      <div className="panel panel-right slots-panel" ref={slotsRef} style={{ backgroundColor: selectedDate ? 'white' : '#fafafa', display: 'flex', flexDirection: 'column' }}>
        {!selectedDate ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            Select a date to see available slots
          </div>
        ) : loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            Loading available slots...
          </div>
        ) : (
          <div className="slots-container animation-fade-in">
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
              {error ? <span style={{color: 'red'}}>{error} (Showing fallbacks)</span> : "Live availability"}
            </div>
            
            {/* Morning */}
            {availableSlots.morning && availableSlots.morning.length > 0 && (
              <div className="slot-section" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
                    <Sun size={16} color="#f59e0b" /> Morning
                  </div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{availableSlots.morning.filter(s => s.available).length} available</span>
                </div>
                <div className="slots-grid">
                  {availableSlots.morning.map((slot, idx) => {
                    const isBooked = !slot.available;
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={idx}
                        onClick={() => !isBooked && onTimeChange(slot.time)}
                        disabled={isBooked}
                        style={{
                          padding: '10px 0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: isSelected ? '2px solid #157367' : '1px solid #e2e8f0',
                          backgroundColor: isBooked ? '#f1f5f9' : (isSelected ? '#f0fdfa' : 'white'),
                          color: isBooked ? '#cbd5e1' : '#1F2937',
                          cursor: isBooked ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {availableSlots.afternoon && availableSlots.afternoon.length > 0 && (
              <div className="slot-section" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
                    <Sunset size={16} color="#f59e0b" /> Afternoon
                  </div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{availableSlots.afternoon.filter(s => s.available).length} available</span>
                </div>
                <div className="slots-grid">
                  {availableSlots.afternoon.map((slot, idx) => {
                    const isBooked = !slot.available;
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={idx}
                        onClick={() => !isBooked && onTimeChange(slot.time)}
                        disabled={isBooked}
                        style={{
                          padding: '10px 0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: isSelected ? '2px solid #157367' : '1px solid #e2e8f0',
                          backgroundColor: isBooked ? '#f1f5f9' : (isSelected ? '#f0fdfa' : 'white'),
                          color: isBooked ? '#cbd5e1' : '#1F2937',
                          cursor: isBooked ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Evening */}
            {availableSlots.evening && availableSlots.evening.length > 0 && (
              <div className="slot-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
                    <Moon size={16} color="#f59e0b" /> Evening
                  </div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{availableSlots.evening.filter(s => s.available).length} available</span>
                </div>
                <div className="slots-grid">
                  {availableSlots.evening.map((slot, idx) => {
                    const isBooked = !slot.available;
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={idx}
                        onClick={() => !isBooked && onTimeChange(slot.time)}
                        disabled={isBooked}
                        style={{
                          padding: '10px 0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: isSelected ? '2px solid #157367' : '1px solid #e2e8f0',
                          backgroundColor: isBooked ? '#f1f5f9' : (isSelected ? '#f0fdfa' : 'white'),
                          color: isBooked ? '#cbd5e1' : '#1F2937',
                          cursor: isBooked ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default DateSelection;