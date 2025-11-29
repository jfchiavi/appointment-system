// src/routes/appointments.ts
import { Router } from 'express';
import {
  getAvailableSlots,
  createAppointment,
  cancelAppointment,
  getAppointmentDetails
} from '../controllers/appointmentController.ts';

const router = Router();

router.get('/availability/:professionalId/:date', getAvailableSlots);
router.post('/', createAppointment);
router.put('/:appointmentId/cancel', cancelAppointment);
router.get('/:appointmentId', getAppointmentDetails);

export default router;