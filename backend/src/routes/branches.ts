// src/routes/branches.ts
import { Router } from 'express';
import { getBranchesByProvince, getBranchDetails } from '../controllers/branchController.ts';

const router = Router();

router.get('/province/:provinceId', getBranchesByProvince);
router.get('/:branchId', getBranchDetails);

export default router;