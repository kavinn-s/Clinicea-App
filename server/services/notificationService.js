import { google } from 'googleapis';
import { Resend } from 'resend';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Gmail API Configuration
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.GMAIL_USER;

// Fallback: Resend Configuration
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Google OAuth2 Client
const oAuth2Client = (CLIENT_ID && CLIENT_SECRET) ? new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
) : null;

if (oAuth2Client && REFRESH_TOKEN) {
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
}

const gmail = oAuth2Client ? google.gmail({ version: 'v1', auth: oAuth2Client }) : null;

console.log("🛠️ Notification Service Status:");
console.log("- Gmail API:", gmail ? "READY ✅" : "NOT CONFIGURED ❌");
console.log("- Resend API:", resend ? "READY ✅" : "NOT CONFIGURED ❌");

export const sendBookingConfirmation = async (patientName, email, mobile, bookingDetails) => {
    try {
        const { service, date, time, bookingId } = bookingDetails;

        // 1. Try sending via Gmail API (Free & Professional)
        if (email && gmail && GMAIL_USER) {
            try {
                const subject = `Appointment Confirmed: Dr. Sindhu's Skin Clinic`;
                const body = `
Dear ${patientName},

Your appointment at Dr. Sindhu's Skin Clinic has been confirmed.

Details:
- Service: ${service}
- Date: ${date}
- Time: ${time}
- Booking ID: ${bookingId}
- Location: Velachery Main Road, Chennai

We look forward to seeing you. Please arrive 15 minutes early.

Regards,
Dr. Sindhu's Skin Clinic
                `;

                const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
                const messageParts = [
                    `From: "Dr. Sindhu's Skin Clinic" <${GMAIL_USER}>`,
                    `To: ${email}`,
                    'Content-Type: text/plain; charset=utf-8',
                    'MIME-Version: 1.0',
                    `Subject: ${utf8Subject}`,
                    '',
                    body,
                ];
                const message = messageParts.join('\n');

                const encodedMessage = Buffer.from(message)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');

                await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: { raw: encodedMessage },
                });

                console.log(`✅ Email sent via Gmail API to ${email}`);
                return { success: true, method: 'gmail' };
            } catch (gmailError) {
                console.error('❌ Gmail API Error:', gmailError.message);
                // Fall through to Resend if Gmail fails
            }
        }

        // 2. Fallback to Resend API (if Gmail fails or isn't configured)
        if (email && resend) {
            try {
                const { data, error } = await resend.emails.send({
                    from: "Dr. Sindhu's Skin Clinic <onboarding@resend.dev>",
                    to: [email],
                    subject: `Appointment Confirmed: Dr. Sindhu's Skin Clinic`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #157367;">Appointment Confirmed! 🎉</h2>
                            <p>Hi ${patientName}, your appointment is scheduled at Dr. Sindhu's Skin Clinic.</p>
                            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p><strong>Service:</strong> ${service}</p>
                                <p><strong>Date:</strong> ${date}</p>
                                <p><strong>Time:</strong> ${time}</p>
                            </div>
                            <p>📍 Location: Velachery, Chennai</p>
                        </div>
                    `
                });

                if (!error) {
                    console.log(`📧 Fallback email sent via Resend to ${email}`);
                    return { success: true, method: 'resend' };
                }
            } catch (resendError) {
                console.error('❌ Resend Error:', resendError.message);
            }
        }

        // 3. Optional: SMS via Twilio
        if (mobile && process.env.TWILIO_ACCOUNT_SID) {
            try {
                const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
                await client.messages.create({
                    body: `Hi ${patientName}, your clinic appt is confirmed for ${date} at ${time}. ID: ${bookingId}.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: mobile
                });
                console.log(`📱 SMS sent to ${mobile}`);
            } catch (smsError) {
                console.error('❌ SMS Error:', smsError.message);
            }
        }

    } catch (error) {
        console.error("Critical Notification Error:", error.message);
    }
};