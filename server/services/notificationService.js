import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// 1. Setup Email (using Gmail for now)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // You will need an "App Password" from your Google Account
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