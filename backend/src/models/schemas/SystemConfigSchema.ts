// models/schemas/SystemConfigSchema.ts
import { Schema } from 'mongoose';

export const SystemConfigSchema = new Schema({
  configKey: {
    type: String,
    required: true,
    unique: true
  },
  configValue: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});