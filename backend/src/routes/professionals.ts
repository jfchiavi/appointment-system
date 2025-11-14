// src/routes/professionals.ts
import { Router } from 'express';
import { getProfessionalsByBranch, getProfessionalDetails } from '../controllers/professionalController.ts';

const router = Router();

router.get('/branch/:branchId', getProfessionalsByBranch);
router.get('/:professionalId', getProfessionalDetails);

export default router;