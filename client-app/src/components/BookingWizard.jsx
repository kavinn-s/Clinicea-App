import React, { useState } from 'react';
import DateSelection from './DateSelection';
import Confirmation from './Confirmation';
import Payment from './Payment';
import SuccessPage from './SuccessPage';
import { Check } from 'lucide-react';
import { API_BASE_URL } from '../config';

const BookingWizard = ({ onBackToLanding }) => {
  const [currentStep, setCurrentStep] = useState(2); 
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);
  
  // Confirmation Step State
  const [isConfirmationReady, setIsConfirmationReady] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  
  // Booking Data State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
    } else {
      onBackToLanding();
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    setError(null);
    console.log("Starting booking process with patient data:", patientData);
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: patientData.fullName,
          email: patientData.email,
          mobile: patientData.mobile,
          dob: patientData.dob,
          concern: "Website Booking",
          serviceName: "Consultation Dermatology",
          appointmentDate: selectedDate,
          startTime: selectedTime
        })
      });

      const result = await res.json();
      console.log("Booking result from server:", result);
      if (res.ok) {
        setBookingResult(result.bookingDetails);
        nextStep(); // Go to Success Step
      } else {
        setError(result.error || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = (type) => {
    console.log(`Payment completed: ${type}`);
    handleBooking();
  };

  return (
    <div className="wizard-container">
      {/* Stepper Header */}
      {currentStep < 5 && (
        <div className="stepper">
            <div className="step completed">
                <div className="step-circle check-icon"><Check size={16} /></div>
            </div>
            
            <div className="step-line">
                <div className="step-line-active" style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
            </div>

            <div className={`step ${currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'inactive'}`}>
                <div className="step-circle">
                    {currentStep > 2 ? <Check size={16} className="check-icon" /> : '2'}
                </div>
            </div>

            <div className="step-line">
                <div className="step-line-active" style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
            </div>

            <div className={`step ${currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'inactive'}`}>
                <div className="step-circle">
                    {currentStep > 3 ? <Check size={16} className="check-icon" /> : '3'}
                </div>
            </div>

            <div className="step-line">
                <div className="step-line-active" style={{ width: currentStep >= 4 ? '100%' : '0%' }}></div>
            </div>

            <div className={`step ${currentStep === 4 ? 'active' : 'inactive'}`}>
                <div className="step-circle">4</div>
            </div>
        </div>
      )}

      {/* Dynamic Header */}
      {currentStep < 5 && (
        <div className="wizard-header">
            {currentStep < 4 && (
                <>
                    <h2 className="wizard-title">
                        {currentStep === 2 ? 'Book Your Appointment' : 'Confirm Your Details'}
                    </h2>
                    <p className="wizard-subtitle">
                        {currentStep === 2 ? 'Select date and time' : 'Sign in and complete your profile'}
                    </p>
                </>
            )}
            {error && <div style={{ color: 'red', marginTop: '12px', textAlign: 'center', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '8px' }}>⚠️ {error}</div>}
        </div>
      )}

      {/* Step Components */}
      {currentStep === 2 && (
        <DateSelection 
          onSelectionComplete={setIsSelectionComplete} 
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
        />
      )}
      {currentStep === 3 && (
        <Confirmation 
          selectedDate={selectedDate} 
          selectedTime={selectedTime} 
          onStatusChange={(status) => {
            setIsConfirmationReady(status.isReady);
            setPatientData(status.patientData);
          }}
        />
      )}
      {currentStep === 4 && (
        <Payment 
            patientName={patientData?.fullName}
            onComplete={handlePaymentComplete}
            onBack={prevStep}
        />
      )}
      {currentStep === 5 && (
        <SuccessPage bookingDetails={bookingResult} />
      )}

      {/* Navigation Footer */}
      {currentStep < 4 && (
        <div className="wizard-actions">
            <button className="btn-outline" onClick={prevStep}>
            Back
            </button>
            {currentStep === 2 ? (
            <button 
                className={`btn-primary ${!isSelectionComplete ? 'btn-gray' : ''}`}
                onClick={nextStep} 
                disabled={!isSelectionComplete}
            >
                Continue
            </button>
            ) : (
            <button 
                className={`btn-primary ${!isConfirmationReady ? 'btn-gray' : ''}`} 
                onClick={nextStep}
                disabled={!isConfirmationReady}
            >
                Confirm Booking
            </button>
            )}
        </div>
      )}
      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                Processing payment...
            </div>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;
