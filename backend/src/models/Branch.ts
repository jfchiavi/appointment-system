// models/Branch.ts
import { model } from 'mongoose';
import { BranchSchema } from './schemas/BranchSchema.ts';

export const Branch = model('Branch', BranchSchema);