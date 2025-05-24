import { Router } from 'express';
import { getAllEquipment, createEquipment, getOneEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController';

const router = Router();

// Async handler utility to forward errors to Express
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllEquipment));
router.post('/', asyncHandler(createEquipment));
router.get('/:id', asyncHandler(getOneEquipment));
router.put('/:id', asyncHandler(updateEquipment));
router.delete('/:id', asyncHandler(deleteEquipment));

export default router;
