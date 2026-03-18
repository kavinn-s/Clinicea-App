import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../config';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const Confirmation = ({ selectedDate, selectedTime, onStatusChange }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [patientData, setPatientData] = useState({ fullName: '', email: '', dob: '' });
  
  const [step, setStep] = useState('CHOICE'); // CHOICE, OTP, DETAILS
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Reset verification if mobile changes
  React.useEffect(() => {
    setIsVerified(false);
  }, [mobile]);

  // Notify parent when data changes or verification completes
  React.useEffect(() => {
    const isReady = !!(patientData.fullName && patientData.email && mobile && patientData.dob && isVerified);
    onStatusChange({
        isReady,
        patientData: { ...patientData, mobile }
    });
  }, [patientData, mobile, isVerified]);

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setPatientData({
        ...patientData,
        fullName: decoded.name || '',
        email: decoded.email || ''
      });
      setIsGoogleLinked(true);
      setStep('DETAILS'); // Go to details to enter DOB and Mobile
    } catch (err) {
      setError("Failed to process Google Login");
    }
  };

  const handleSendOtp = async (targetMobile) => {
    const mobileToVerify = targetMobile || mobile;
    if (mobileToVerify.length < 10) return setError('Enter a valid 10-digit mobile number');
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobileToVerify })
      });
      const data = await res.json();
      if (data.success) {
        setVerificationId(data.verificationId);
        setMobile(mobileToVerify);
        setStep('OTP');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Connection error. Is server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return setError('Enter the 4-6 digit OTP');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, verificationId })
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
        if (!isGoogleLinked) {
            // Standard flow: check for existing patient details
            const lookupRes = await fetch(`${API_BASE_URL}/appointments/lookup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile })
            });
            const lookupData = await lookupRes.json();
            if (lookupData.exists) {
                setPatientData(lookupData.patient);
            }
            setStep('DETAILS');
        } else {
            // Google flow: OTP verified, we already have details
            setStep('DETAILS');
            setError(null);
        }
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <div className="wizard-content" style={{ justifyContent: 'center' }}>
      <div className="panel" style={{ flex: 'none', width: '100%', maxWidth: '600px', padding: '32px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '24px' }}>
            Confirm your appointment for {selectedDate} at {selectedTime}
        </h4>
        
        {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        {step === 'CHOICE' && (
            <div className="animation-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>Sign in to confirm your appointment</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin 
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google Login Failed")}
                            useOneTap
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>or</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                </div>

                <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937' }}>Mobile Number</label>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, display: 'flex', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '12px 16px', color: '#64748b', fontSize: '14px' }}>+91</div>
                            <input 
                                type="text" 
                                placeholder="10-digit number" 
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                style={{ flex: 1, border: 'none', padding: '12px', outline: 'none', fontSize: '14px' }}
                            />
                        </div>
                        <button 
                            onClick={() => handleSendOtp()}
                            disabled={loading}
                            style={{
                                backgroundColor: '#157367', color: 'white', border: 'none', borderRadius: '8px',
                                padding: '0 24px', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                            }}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {step === 'OTP' && (
            <div className="animation-fade-in">
                <div style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937' }}>Enter the OTP sent to {mobile}</label>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                        type="text" 
                        placeholder="4-digit code" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                    <button 
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        style={{
                            backgroundColor: '#157367', color: 'white', border: 'none', borderRadius: '8px',
                            padding: '0 24px', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </div>
                <button 
                    onClick={() => setStep('CHOICE')}
                    style={{ background: 'none', border: 'none', color: '#157367', fontSize: '12px', marginTop: '12px', cursor: 'pointer' }}
                >
                    Change mobile number
                </button>
            </div>
        )}

        {step === 'DETAILS' && (
            <div className="animation-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '8px', color: '#065f46', fontSize: '14px', marginBottom: '8px' }}>
                    ✅ {isVerified ? "Mobile number verified!" : "Signed in with Google!"}
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937' }}>Full Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter your name" 
                        value={patientData.fullName}
                        readOnly={isGoogleLinked}
                        onChange={e => setPatientData({...patientData, fullName: e.target.value})}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', marginTop: '4px', backgroundColor: isGoogleLinked ? '#f9fafb' : 'white' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937' }}>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="email@example.com" 
                        value={patientData.email}
                        readOnly={isGoogleLinked}
                        onChange={e => setPatientData({...patientData, email: e.target.value})}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', marginTop: '4px', backgroundColor: isGoogleLinked ? '#f9fafb' : 'white' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937' }}>Date of Birth</label>
                    <input 
                        type="date" 
                        value={patientData.dob}
                        onChange={e => setPatientData({...patientData, dob: e.target.value})}
                        style={{ 
                            padding: '12px', 
                            borderRadius: '8px', 
                            border: '1px solid #cbd5e1', 
                            fontSize: '14px', 
                            width: '100%', 
                            marginTop: '4px',
                            minHeight: '48px', // Better for mobile touch
                            backgroundColor: 'white'
                        }}
                    />
                </div>

                {isGoogleLinked && !verificationId && (
                    <div style={{ marginTop: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937' }}>Mobile Number (Verification Required)</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                            <div style={{ flex: 1, display: 'flex', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                                <div style={{ backgroundColor: '#f3f4f6', padding: '12px 16px', color: '#64748b', fontSize: '14px' }}>+91</div>
                                <input 
                                    type="text" 
                                    placeholder="10-digit number" 
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    style={{ flex: 1, border: 'none', padding: '12px', outline: 'none', fontSize: '14px' }}
                                />
                            </div>
                            <button 
                                onClick={() => handleSendOtp()}
                                disabled={loading}
                                style={{
                                    backgroundColor: '#157367', color: 'white', border: 'none', borderRadius: '8px',
                                    padding: '0 24px', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                                }}
                            >
                                {loading ? 'Sending...' : 'Verify Mobile'}
                            </button>
                        </div>
                    </div>
                )}
                
                {isGoogleLinked && !verificationId && <p style={{ fontSize: '11px', color: '#ef4444', textAlign: 'center' }}>* Verify mobile number to enable booking</p>}
            </div>
        )}
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default Confirmation;
