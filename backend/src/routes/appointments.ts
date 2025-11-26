// src/routes/appointments.ts
import { Router } from 'express';
import {
  getAvailableSlots,
  createAppointment,
  //processPayment,
  cancelAppointment
} from '../controllers/appointmentController.ts';

const router = Router();

router.get('/availability/:professionalId/:date', getAvailableSlots);
router.post('/', createAppointment);
//router.post('/:appointmentId/payment', processPayment);
router.put('/:appointmentId/cancel', cancelAppointment);

export default router;