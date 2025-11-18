// routes/provinces.ts
import { Router } from 'express';
import { 
  getProvinces, 
  createProvince, 
  getProvinceById 
} from '../controllers/provinceController.ts';

const router = Router();

router.get('/', getProvinces);
router.post('/', createProvince);
router.get('/:id', getProvinceById);

export default router;