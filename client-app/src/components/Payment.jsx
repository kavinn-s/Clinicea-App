import React from 'react';
import { Check, ShieldCheck, ChevronLeft } from 'lucide-react';

const Payment = ({ onComplete, onBack, patientName }) => {
    return (
        <div className="animation-fade-in" style={{ padding: '0 10px', maxWidth: '1100px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '12px',
                    fontFamily: "'Times New Roman', Times, serif"
                }}>Complete Payment</h1>
                <p style={{ color: '#4b5563', fontSize: '18px', margin: 0 }}>
                    Choose your payment option to confirm your appointment
                </p>
            </div>

            {/* Banner */}
            <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '12px',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px'
            }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <p style={{ color: '#92400e', fontSize: '15px', fontWeight: '500', margin: 0 }}>
                    <strong>Development Mode:</strong> Payment will be simulated (no actual charge)
                </p>
            </div>

            {/* Error placeholder (handled by parent wizard) */}

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '40px' }}>
                {/* Option 1: Booking Fee */}
                <div
                    className="payment-card"
                    onClick={() => onComplete('PARTIAL')}
                    style={{
                        flex: 1,
                        minWidth: '400px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '24px',
                        padding: '40px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ backgroundColor: '#f0fdfa', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#157367', fontSize: '24px', fontWeight: 'bold' }}>₹</span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>Pay Booking Fee</h3>
                            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>Pay remaining at clinic</p>
                        </div>
                    </div>

                    <div style={{ fontSize: '56px', fontWeight: '700', color: '#157367', marginBottom: '32px' }}>₹ 50</div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#374151' }}>
                            <Check size={20} color="#157167" /> Confirm your appointment instantly
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#374151' }}>
                            <Check size={20} color="#157167" /> Pay ₹1150 at the clinic
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#374151' }}>
                            <Check size={20} color="#157167" /> Flexible payment option
                        </li>
                    </ul>
                </div>

                {/* Option 2: Full Amount */}
                <div
                    className="payment-card"
                    onClick={() => onComplete('FULL')}
                    style={{
                        flex: 1,
                        minWidth: '400px',
                        border: '3px solid #157367',
                        borderRadius: '24px',
                        padding: '40px',
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#157367',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '8px 20px',
                        borderRadius: '100px',
                        textTransform: 'uppercase'
                    }}>
                        Recommended
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ backgroundColor: '#157367', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>₹</span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>Pay Full Amount</h3>
                            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>Complete payment now</p>
                        </div>
                    </div>

                    <div style={{ fontSize: '56px', fontWeight: '700', color: '#157367', marginBottom: '32px' }}>₹ 1200</div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#374151' }}>
                            <Check size={20} color="#157167" /> No payment at clinic
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#374151' }}>
                            <Check size={20} color="#157167" /> Hassle-free check-in
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#374151' }}>
                            <Check size={20} color="#157167" /> Secure online payment
                        </li>
                    </ul>
                </div>
            </div>

            {/* Footer info Bar */}
            <div style={{
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '40px'
            }}>
                <ShieldCheck size={18} color="#6b7280" />
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Development Mode: Payments are simulated • Configure Razorpay keys in .env for live payments
                </p>
            </div>

            {/* Long Back Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        padding: '16px 24px',
                        borderRadius: '100px',
                        width: '100%',
                        maxWidth: '400px',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f8fafc'}
                >
                    <ChevronLeft size={22} /> Back to appointment details
                </button>
            </div>
        </div>
    );
};

export default Payment;
