import { Router } from 'express';
import { getAllSOPs, getOneSOP, createSOP, updateSOP, deleteSOP } from '../controllers/sopController';

const router = Router();

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllSOPs));
router.post('/', asyncHandler(createSOP));
router.get('/:id', asyncHandler(getOneSOP));
router.put('/:id', asyncHandler(updateSOP));
router.delete('/:id', asyncHandler(deleteSOP));

export default router;
