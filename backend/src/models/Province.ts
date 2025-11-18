// models/Province.ts
import { model } from 'mongoose';
import { ProvinceSchema } from './schemas/ProvinceSchema.ts';


export const Province = model('Province', ProvinceSchema);