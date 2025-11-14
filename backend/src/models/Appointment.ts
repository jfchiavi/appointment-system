// src/models/Appointment.ts
import { Schema, model, Document, Types } from 'mongoose';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IAppointment extends Document {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  professionalId: Types.ObjectId;
  branchId: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  notes?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  professionalId: {
    type: Schema.Types.ObjectId,
    ref: 'Professional',
    required: true
  },
  branchId: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  stripePaymentIntentId: {
    type: String
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
appointmentSchema.index({ professionalId: 1, date: 1 });
appointmentSchema.index({ clientEmail: 1 });
appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ createdAt: 1 });

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);