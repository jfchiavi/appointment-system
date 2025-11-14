// src/routes/provinces.ts
import { Router } from 'express';
import { getProvinces, createProvince } from '../controllers/provinceController.ts';

const router = Router();

router.get('/', getProvinces);
router.post('/', createProvince);

export default router;