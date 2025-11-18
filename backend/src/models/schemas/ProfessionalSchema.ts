// models/schemas/ProfessionalSchema.ts
import { Schema } from 'mongoose';

const WorkingHoursSchema = new Schema({
  dayOfWeek: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 6 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  breakStart: { 
    type: String 
  },
  breakEnd: { 
    type: String 
  }
});

export const ProfessionalSchema = new Schema({
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
  workingHours: [WorkingHoursSchema],
  appointmentDuration: {
    type: Number,
    required: true,
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});