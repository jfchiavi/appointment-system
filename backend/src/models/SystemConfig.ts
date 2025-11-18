// models/SystemConfig.ts
import { model } from 'mongoose';
import { SystemConfigSchema } from './schemas/SystemConfigSchema.ts';

export const SystemConfig = model('SystemConfig', SystemConfigSchema);