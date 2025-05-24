import { Router } from 'express';
import { getAllWorkOrders, createWorkOrder, getOneWorkOrder, updateWorkOrder, deleteWorkOrder } from '../controllers/workOrderController';

const router = Router();

// Async handler utility to forward errors to Express
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllWorkOrders));
router.post('/', asyncHandler(createWorkOrder));
router.get('/:id', asyncHandler(getOneWorkOrder));
router.put('/:id', asyncHandler(updateWorkOrder));
router.delete('/:id', asyncHandler(deleteWorkOrder));

export default router;
