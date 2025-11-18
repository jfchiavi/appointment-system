// models/schemas/BranchSchema.ts
import { Schema } from 'mongoose';

const BusinessHoursSchema = new Schema({
  dayOfWeek: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 6 
  },
  openTime: { 
    type: String, 
    required: true 
  },
  closeTime: { 
    type: String, 
    required: true 
  },
  isClosed: { 
    type: Boolean, 
    default: false 
  }
});

export const BranchSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  provinceId: {
    type: Schema.Types.ObjectId,
    ref: 'Province',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  businessHours: [BusinessHoursSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});