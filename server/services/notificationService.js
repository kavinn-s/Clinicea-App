import { Resend } from 'resend';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// 1. Setup Resend (API-based Email - Guaranteed to work on Railway/Render)
const resend = new Resend(process.env.RESEND_API_KEY);

console.log("🛠️ Initializing Resend Service:", process.env.RESEND_API_KEY ? "FOUND" : "NOT FOUND");

export const sendBookingConfirmation = async (patientName, email, mobile, bookingDetails) => {
    try {
        // Send Email via Resend API
        if (email && process.env.RESEND_API_KEY) {
            const { data, error } = await resend.emails.send({
                from: "Clinicea Booking <onboarding@resend.dev>", // Note: For custom domains, you'd verify them in Resend
                to: [email],
                subject: `Appointment Confirmed: Dr. Sindhu's Skin Clinic`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">You're all set, ${patientName}! 🎉</h2>
                        <p>Your appointment has been confirmed at Dr. Sindhu's Skin Clinic.</p>
                        
                        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Service:</strong> ${bookingDetails.service}</p>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${bookingDetails.date}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${bookingDetails.time}</p>
                            <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                        </div>

                        <p>📍 <strong>Location:</strong> Velachery Main Road, Chennai</p>
                        <p style="color: #6b7280; font-size: 0.9em; margin-top: 20px;">
                            <em>Please arrive 15 minutes early and bring a valid ID.</em>
                        </p>
                    </div>
                `
            });

            if (error) {
                console.error("❌ Resend Error Details:", error);
            } else {
                console.log(`📧 Resend Email sent successfully! ID: ${data?.id}`);
            }
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