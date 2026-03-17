import { fetchCliniceaSlots, bookCliniceaAppointment } from '../services/cliniceaService.js';
import pool from '../config/db.js'; // Importing the DB connection pool
import { sendBookingConfirmation } from '../services/notificationService.js';

export const getSlots = async (req, res) => {
    try {
        const targetDate = req.query.date;

        if (!targetDate) {
            return res.status(400).json({ error: "Please provide a date query parameter (YYYY-MM-DD)" });
        }

        // Call the worker!
        const availableSlots = await fetchCliniceaSlots(targetDate);

        res.json({
            date: targetDate,
            availableSlots: availableSlots
        });

    } catch (error) {
        console.error("Error in getSlots controller:", error);
        res.status(500).json({ error: "Failed to fetch data from Clinicea" });
    }
};

// Check if a patient exists by mobile number
export const lookupPatient = async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json({ error: "Mobile number is required" });
    }

    try {
        // Look for the patient in your local PostgreSQL database
        const query = `SELECT full_name as "fullName", email, TO_CHAR(dob, 'YYYY-MM-DD') as dob FROM patients WHERE mobile = $1`;
        const result = await pool.query(query, [mobile]);

        if (result.rows.length > 0) {
            // Patient found! Send their details back to React to auto-fill the form
            res.json({ exists: true, patient: result.rows[0] });
        } else {
            // New patient
            res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error looking up patient:", error);
        res.status(500).json({ error: "Failed to verify patient" });
    }
};

export const bookAppointment = async (req, res) => {
    const { fullName, email, mobile, dob, concern, serviceName, appointmentDate, startTime } = req.body;
    console.log("📥 Booking request received:", { fullName, mobile, appointmentDate, startTime });

    // 1. Basic Validation
    if (!fullName || !mobile || !serviceName || !appointmentDate || !startTime) {
        console.error("❌ Missing required booking details");
        return res.status(400).json({ error: "Missing required booking details" });
    }

    try {
        // 2. Upsert Patient in PostgreSQL
        console.log("💾 Upserting patient...");
        const patientQuery = `
            INSERT INTO patients (full_name, email, mobile, dob)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (mobile) DO UPDATE 
            SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, dob = EXCLUDED.dob
            RETURNING id;
        `;
        const patientResult = await pool.query(patientQuery, [fullName, email, mobile, dob || null]);
        const patientId = patientResult.rows[0].id;
        console.log("✅ Patient ID:", patientId);

        // 3. Push to Clinicea's Calendar
        console.log("📅 Pushing to Clinicea...");
        const cliniceaApptId = await bookCliniceaAppointment(req.body);
        console.log("✅ Clinicea Appointment ID:", cliniceaApptId);

        // 4. Generate the Custom Booking ID
        const customBookingId = `BOOKING-${Date.now()}`;

        // 5. Save the Appointment locally
        console.log("💾 Saving appointment locally...");
        const appointmentQuery = `
            INSERT INTO appointments (booking_id, patient_id, service_name, appointment_date, start_time, clinicea_appt_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const apptResult = await pool.query(appointmentQuery, [
            customBookingId, patientId, serviceName, appointmentDate, startTime, cliniceaApptId
        ]);
        console.log("✅ Appointment saved locally");

        // 5.5 FIRE THE NOTIFICATIONS!
        try {
            console.log("✉️ Sending confirmation notification...");
            await sendBookingConfirmation(fullName, email, mobile, {
                bookingId: customBookingId,
                service: serviceName,
                date: appointmentDate,
                time: startTime
            });
            console.log("✅ Notification sent");
        } catch (notifErr) {
            console.error("⚠️ Notification failed (but booking is done):", notifErr.message);
        }

        // 6. Send the Triumph Response!
        res.status(201).json({
            message: "Appointment successfully booked!",
            bookingDetails: {
                bookingId: customBookingId,
                patientName: fullName,
                service: serviceName,
                date: appointmentDate,
                time: startTime
            }
        });

    } catch (error) {
        console.error("🔥 Booking transaction failed:", error);
        res.status(500).json({ error: "Failed to confirm appointment. Please try again." });
    }
};