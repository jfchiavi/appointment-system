// src/models/Professional.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IWorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface IProfessional extends Document {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  branchId: Types.ObjectId;
  workingHours: IWorkingHours[];
  appointmentDuration: number; // en minutos
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const workingHoursSchema = new Schema<IWorkingHours>({
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  breakStart: { type: String },
  breakEnd: { type: String }
});

const professionalSchema = new Schema<IProfessional>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  branchId: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  workingHours: [workingHoursSchema],
  appointmentDuration: {
    type: Number,
    required: true,
    default: 30 // 30 minutos por defecto
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

professionalSchema.index({ branchId: 1, isActive: 1 });

export const Professional = model<IProfessional>('Professional', professionalSchema);