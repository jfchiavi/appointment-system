// models/schemas/AppointmentSchema.ts
import { Schema } from 'mongoose';

export const AppointmentSchema = new Schema({
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
    default: 'confirmed'
  },
  // serviceId: { //TODO: relacionar con servicio
  //   type: Schema.Types.ObjectId,
  //   ref: 'Service',
  //   required: true
  // },
  amount: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});