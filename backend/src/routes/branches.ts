// routes/branches.ts
import { Router } from 'express';
import { 
  getBranchesByProvince, 
  getBranchDetails, 
  createBranch 
} from '../controllers/branchController.ts';

const router = Router();

router.get('/province/:provinceId', getBranchesByProvince);
router.get('/:branchId', getBranchDetails);
router.post('/', createBranch);

export default router;