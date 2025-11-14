// src/models/Branch.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IBusinessHours {
  dayOfWeek: number; // 0: Domingo, 1: Lunes, etc.
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
  isClosed: boolean;
}

export interface IBranch extends Document {
  name: string;
  provinceId: Types.ObjectId;
  address: string;
  phone: string;
  email: string;
  businessHours: IBusinessHours[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const businessHoursSchema = new Schema<IBusinessHours>({
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  isClosed: { type: Boolean, default: false }
});

const branchSchema = new Schema<IBranch>({
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
  businessHours: [businessHoursSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

branchSchema.index({ provinceId: 1, name: 1 });

export const Branch = model<IBranch>('Branch', branchSchema);