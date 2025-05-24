import { Router } from 'express';
import { getAllSpareParts, createSparePart, getOneSparePart, updateSparePart, deleteSparePart } from '../controllers/sparePartController';

const router = Router();

// Async handler utility to forward errors to Express
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllSpareParts));
router.post('/', asyncHandler(createSparePart));
router.get('/:id', asyncHandler(getOneSparePart));
router.put('/:id', asyncHandler(updateSparePart));
router.delete('/:id', asyncHandler(deleteSparePart));

export default router;
