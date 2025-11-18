// models/Professional.ts
import { model } from 'mongoose';
import { ProfessionalSchema } from './schemas/ProfessionalSchema.ts';

export const Professional = model('Professional', ProfessionalSchema);