import express from 'express';
import { getSlots, bookAppointment, lookupPatient } from '../controllers/appointmentController.js';

const router = express.Router();

// When someone hits /api/slots, send them to the getSlots controller
router.get('/slots', getSlots);
router.post('/lookup', lookupPatient);
router.post('/book', bookAppointment);

// OTP Verification via Message Central
router.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;
    try {
        const { sendOTP } = await import('../services/messageCentralService.js');
        const result = await sendOTP(mobile);
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { mobile, otp, verificationId } = req.body;
    try {
        const { verifyOTP } = await import('../services/messageCentralService.js');
        const result = await verifyOTP(mobile, otp, verificationId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;