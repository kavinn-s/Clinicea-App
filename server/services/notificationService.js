import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import dns from 'dns';

// CRITICAL: Force Node to use IPv4 first. Render often fails with Gmail over IPv6.
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

dotenv.config();

// 1. Setup Email (Combined "Super" Fix for Render IPv6/Timeout)
console.log("🛠️ Initializing Email Service for user:", process.env.EMAIL_USER ? "FOUND" : "NOT FOUND");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS (Port 587)
    connectionTimeout: 30000, 
    greetingTimeout: 30000,
    socketTimeout: 30000,
    // THE COMBO: Custom lookup + family: 4 + tls: { family: 4 }
    lookup: (hostname, options, callback) => {
        console.log(`🔍 Forced IPv4 search for: ${hostname}`);
        dns.lookup(hostname, { family: 4 }, (err, address, family) => {
            console.log(`📍 Resolved ${hostname} to ${address}`);
            callback(err, address, family);
        });
    },
    tls: {
       family: 4, // Another place Gmail/Render sometimes look!
       minVersion: 'TLSv1.2'
    },
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendBookingConfirmation = async (patientName, email, mobile, bookingDetails) => {
    try {
        // Send Email if they provided one
        if (email) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Appointment Confirmed: Dr. Sindhu's Skin Clinic`,
                html: `
                    <h2>You're all set, ${patientName}! 🎉</h2>
                    <p>Your appointment has been confirmed.</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
                        <p><strong>Service:</strong> ${bookingDetails.service}</p>
                        <p><strong>Date:</strong> ${bookingDetails.date}</p>
                        <p><strong>Time:</strong> ${bookingDetails.time}</p>
                        <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                    </div>
                    <p>📍 <strong>Location:</strong> Velachery Main Road, Chennai</p>
                    <p><em>Please arrive 15 minutes early and bring a valid ID and any medical reports.</em></p>
                `
            };
            await transporter.sendMail(mailOptions);
            console.log(`📧 Email confirmation sent to ${email}`);
        }

        // Send SMS via Twilio (If credentials are in .env)
        if (mobile && process.env.TWILIO_ACCOUNT_SID) {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                body: `Hi ${patientName}, your appt at Dr. Sindhu's Skin Clinic is confirmed for ${bookingDetails.date} at ${bookingDetails.time}. Booking ID: ${bookingDetails.bookingId}. Please arrive 15 mins early.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: mobile
            });
            console.log(`📱 SMS confirmation sent to ${mobile}`);
        }

    } catch (error) {
        // We log the error, but we DO NOT throw it. 
        // If the email fails, we don't want to tell the patient their booking failed!
        console.error("Notification failed (but booking succeeded):", error.message);
    }
};