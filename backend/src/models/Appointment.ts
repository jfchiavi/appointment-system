// models/Appointment.ts
import { model } from 'mongoose';
import { AppointmentSchema } from './schemas/AppointmentSchema.ts';

export const Appointment = model('Appointment', AppointmentSchema);