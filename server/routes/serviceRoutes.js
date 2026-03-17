import express from 'express';
import { getServices } from '../controllers/serviceController.js';

const router = express.Router();

// When React asks for /api/services, send it to the controller
router.get('/', getServices);

export default router;