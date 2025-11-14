// src/models/Province.ts
import { Schema, model, Document } from 'mongoose';

export interface IProvince extends Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const provinceSchema = new Schema<IProvince>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Province = model<IProvince>('Province', provinceSchema);