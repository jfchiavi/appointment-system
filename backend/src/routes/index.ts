// src/routes/index.ts
import { Router } from 'express';
import provincesRoutes from './provinces.ts';
import branchesRoutes from './branches.ts';
import professionalsRoutes from './professionals.ts';
import appointmentsRoutes from './appointments.ts';

const router = Router();

router.use('/provinces', provincesRoutes);
router.use('/branches', branchesRoutes);
router.use('/professionals', professionalsRoutes);
router.use('/appointments', appointmentsRoutes);

export default router;